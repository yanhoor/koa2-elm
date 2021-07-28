const BaseController = require('../baseController')
const GoodsModel = require('../../mongodb/model/goods/goodsModel')
const GoodsCategoryModel = require('../../mongodb/model/goods/goodsCategoryModel')
const AdminModel = require('../../mongodb/model/admin/adminModel')
const SkuController = require('./skuController')
const tf = require('time-formater')

class GoodsController extends BaseController{
    constructor() {
        super();
        this.saveSkuInfo = this.saveSkuInfo.bind(this)
        this.save = this.save.bind(this)
        this.getList = this.getList.bind(this)
        this.detail = this.detail.bind(this)
    }

    async detail(ctx, next){
        const req = ctx.request;
        const { id } = req.query
        if(!id){
            ctx.body = {
                success: false,
                msg: '缺少参数：id'
            }
            return
        }
        const s = await GoodsModel.findOne({ id })
        const cateIds = await GoodsCategoryModel.find({ id: {$in: s.category_idss } })
        if(s){
            ctx.body = {
                success: true,
                info: s,
                cateIds
            }
        }else{
            ctx.body = {
                success: false,
                info: null
            }
        }
    }

    async getList(ctx, next){
        const req = ctx.request;
        const {name, current = 1, pageSize = 20, category_ids } = req.query
        const offset = pageSize * (current - 1)
        const admin = await AdminModel.findOne({ id: ctx.session.admin_id })
        let filter = {};
        if(name) filter.name = name
        if(admin.type == 2) {
            filter.shop_id = admin.shop_id
        }
        if(category_ids) filter.category_ids = Number(category_ids)
        const list = await GoodsModel.aggregate([
            { $match : filter },
            { $limit : Number(pageSize) },
            { $skip : Number(offset) },
            {
                $lookup: {
                    from: 'goodsCategories',
                    localField: 'category_ids',
                    foreignField: 'id',
                    as: 'category',
                }
            },
            {
                $lookup: {
                    from: 'goodsLabels',
                    localField: 'label_ids',
                    foreignField: 'id',
                    as: 'labelList',
                }
            },
            // {
            //     $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$admin", 0 ] }, "$$ROOT" ] } } // 将 admin 属性合并作为 shop 的根属性返回
            // },
            { $project : { _id : 0 , __v : 0, category: { _id : 0 , __v : 0 }, labelList: { _id : 0 , __v : 0 }} }, // 屏蔽输出的category字段，需要在 $lookup 后面
            { $sort : { modify_time : -1 } }
        ])
        const count = await GoodsModel.countDocuments(filter)
        ctx.body = {
            list: list,
            amount: count,
        }
    }

    async save(ctx, next){
        const req = ctx.request
        let postData = req.body
        const { name, id, category_ids, pic_list, desc, sku_list } = postData
        try{
            if(!name) throw new Error('名称不能为空')
            if(!category_ids) throw new Error('分类id不能为空')
            if(!pic_list) throw new Error('商品图不能为空')
            if(!desc) throw new Error('商品描述不能为空')
            if(!sku_list) throw new Error('商品规格不能为空')
        }catch(e){
            ctx.body = {
                success: false,
                msg: e.message
            }
            return false
        }

        // 保存sku信息
        // const sku_id_list = await this.saveSkuInfo(sku_list)

        // 修改
        if(id){
            const d = {
                ...postData,
                shop_id: ctx.session.admin_id,
                modify_time: tf().format('YYYY-MM-DD HH:mm:ss')
            }
            await GoodsModel.findOneAndUpdate({id}, {$set: d});
            ctx.body = {
                success: true,
                msg: '保存成功',
            };
            return true;
        }

        // 新增
        let item_id
        try{
            item_id = await this.createId(this.idType.GOODS_ID)
        }catch(e){
            console.log('获取商品id失败')
            ctx.body = {
                success: false,
                msg: '获取数据失败'
            }
            return
        }
        const t = tf().format('YYYY-MM-DD HH:mm:ss')
        const admin = await AdminModel.findOne({ id: ctx.session.admin_id })
        let data = {
            ...postData,
            shop_id: admin.shop_id,
            id: item_id,
            create_time: t,
            modify_time: t,
        };
        const model = new GoodsModel(data);
        model.save().then(r => {

        }).catch(e => {
            console.log('-----------------', e);
        })
        ctx.body = {
            success: true,
            msg: '保存成功',
            data: data
        };
    }

    async saveSkuInfo(sku_list = []){
        let sku_ids = []
        for(let skuInfo of sku_list){
            const id = await SkuController.save(skuInfo)
            sku_ids.push(id)
        }
        return sku_ids
    }
}

module.exports = new GoodsController()
