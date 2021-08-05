const BaseController = require('../baseController')
const ShopModel = require('../../mongodb/model/shop/shopModel')
const AdminModel = require('../../mongodb/model/admin/adminModel')
const tf = require('time-formater')

class ShopController extends BaseController{
    constructor() {
        super();
        this.getList = this.getList.bind(this)
        this.save = this.save.bind(this)
        this.getShopInfo = this.getShopInfo.bind(this)
    }

    async getShopInfo(ctx, next){
        const req = ctx.request;
        const { id } = req.query
        if(!id){
            ctx.body = {
                success: false,
                msg: '缺少参数：id'
            }
            return
        }
        const s = await ShopModel.findOne({ id })
        if(s){
            ctx.body = {
                success: true,
                info: s
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
        const {name, current = 1, pageSize = 20, shop_category_id } = req.query
        const offset = pageSize * (current - 1)
        let filter = {};
        if(name) filter.name = { $regex: new RegExp(name, 'i')} // 模糊查询
        if(shop_category_id) filter.shop_category_id = Number(shop_category_id)
        const list = await ShopModel.aggregate([
            // { $match : { $or: [filter] } },
            { $match : filter },
            { $sort : { modify_time : -1 } },
            { $skip : Number(offset) },
            { $limit : Number(pageSize) },
            {
                $lookup: {
                    from: 'shopCategories',
                    localField: 'shop_category_id',
                    foreignField: 'id',
                    as: 'category',
                }
            },
            {
                $lookup: {
                    from: 'admins',
                    localField: 'admin_id',
                    foreignField: 'id',
                    as: 'admin',
                }
            },
            // {
            //     $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$admin", 0 ] }, "$$ROOT" ] } } // 将 admin 属性合并作为 shop 的根属性返回
            // },
            { $project : { _id : 0 , __v : 0, category: { _id : 0 , __v : 0 }, admin: { _id : 0 , __v : 0, password: 0, roles: 0 } } }, // 屏蔽输出的category字段，需要在 $lookup 后面
        ])
        const count = await ShopModel.countDocuments(filter)
        ctx.body = {
            list: list,
            amount: count,
        }
    }

    async save(ctx, next){
        const req = ctx.request
        const { id, name, contract, shop_category_id, desc, slogan, opening_start, opening_end, avatar, business_license, service_permission, deliver_fee, deliver_fee_start_amount, provinceCode, cityCode, countyCode, townCode, tailAddress } = req.body
        try{
            if(!name) throw new Error('店名不能为空')
            if(!contract) throw new Error('联系电话不能为空')
            if(!shop_category_id) throw new Error('店铺分类不能为空')
            if(!desc) throw new Error('店铺简介不能为空')
            // if(!opening_start) throw new Error('营业开始时间不能为空')
            // if(!opening_end) throw new Error('营业结束时间不能为空')
            if(!avatar) throw new Error('店铺头像不能为空')
            if(!business_license) throw new Error('营业执照不能为空')
            if(!service_permission) throw new Error('行业服务许可证不能为空')
            if(!provinceCode) throw new Error('省份不能为空')
            if(!cityCode) throw new Error('城市不能为空')
            if(!countyCode) throw new Error('地区不能为空')
            // if(!townCode) throw new Error('街道不能为空')
            if(!tailAddress) throw new Error('详细地址不能为空')
        }catch(e){
            ctx.body = {
                success: false,
                msg: e.message
            }
            return false
        }

        // 修改
        if(id){
            const d = {
                ...req.body,
                modify_time: tf().format('YYYY-MM-DD HH:mm:ss')
            }
            await ShopModel.findOneAndUpdate({id}, {$set: d});
            ctx.body = {
                success: true,
                msg: '保存成功'
            };
            return true
        }

        // 新增
        let item_id;
        try{
            item_id = await this.createId(this.idType.SHOP_ID)
        }catch(e){
            console.log('获取店铺id失败')
            ctx.body = {
                success: false,
                msg: '获取数据失败'
            }
            return
        }
        const t = tf().format('YYYY-MM-DD HH:mm:ss')
        let data = {
            ...req.body,
            id: item_id,
            admin_id: ctx.session.admin_id,
            create_time: t,
            modify_time: t,
        };
        await AdminModel.findOneAndUpdate({id: ctx.session.admin_id}, {$set: {shop_id: item_id}})
        const model = new ShopModel(data)
        model.save().then(r => {

        }).catch(e => {
            console.log('-----------------', e)
        })
        ctx.body = {
            success: true,
            msg: '保存成功',
            id: item_id
        }
    }
}

module.exports = new ShopController()
