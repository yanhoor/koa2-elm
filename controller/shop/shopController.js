const BaseController = require('../baseController')
const ShopModel = require('../../mongodb/model/shop/shopModel')
const shopCategoryModel = require('../../mongodb/model/shop/shopCategoryModel')
const tf = require('time-formater')

class ShopController extends BaseController{
    constructor() {
        super();
        this.getList = this.getList.bind(this)
        this.save = this.save.bind(this)
    }

    async getList(ctx, next){
        const req = ctx.request;
        const {name, current = 1, pageSize = 20 } = req.query
        const offset = pageSize * (current - 1)
        let filter = {};
        if(name) filter.name = name
        const list = await ShopModel.aggregate([
            { $match : filter },
            { $limit : Number(pageSize) },
            { $skip : Number(offset) },
            { $project : { _id : 0 , __v : 0 } },
            {
                $lookup: {
                    from: 'shopCategories',
                    localField: 'shop_category_id',
                    foreignField: 'id',
                    as: 'category',
                    // pipeline: [{ $project : { _id : 0 , __v : 0 } }]
                }
            }
        ])
        const count = await ShopModel.countDocuments(filter)
        ctx.body = {
            list: list,
            amount: count,
        }
    }

    async save(ctx, next){
        const req = ctx.request;
        console.log(req.body)
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
            return true;
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
        let data = {
            ...req.body,
            id: item_id,
            create_time: tf().format('YYYY-MM-DD HH:mm:ss')
        };
        const model = new ShopModel(data);
        model.save().then(r => {

        }).catch(e => {
            console.log('-----------------', e);
        })
        ctx.body = {
            success: true,
            msg: '保存成功'
        };
    }
}

module.exports = new ShopController()
