const BaseController = require('../baseController')
const ShopCategoryModel = require('../../mongodb/model/shop/shopCategoryModel')
const tf = require('time-formater')

class ShopCategoryController extends BaseController{
    constructor() {
        super()
        this.detail = this.detail.bind(this)
        this.getList = this.getList.bind(this)
        this.mobileList = this.mobileList.bind(this)
        this.save = this.save.bind(this)
    }

    async detail(ctx, next){
        const req = ctx.request
        const { id } = req.query
        if(!id){
            ctx.body = {
                success: false,
                msg: '缺少必需参数：id'
            }
            return
        }

        const item = await ShopCategoryModel.findOne({id}, {'_id': 0, '__v': 0})

        ctx.body = {
            success: true,
            data: item
        }
    }

    async getList(ctx, next){
        const req = ctx.request;
        const {name, current = 1, pageSize = 20 } = req.query
        const offset = pageSize * (current - 1)
        let filter = {}
        if(name) filter.name = { $regex: new RegExp(name, 'i')} // 模糊查询
        const list = await ShopCategoryModel.find(filter, {'_id': 0, '__v': 0}).limit(Number(pageSize)).skip(Number(offset)).sort({modify_time: -1})
        const count = await ShopCategoryModel.countDocuments(filter)
        ctx.body = {
            list,
            success: true,
            amount: count,
        }
    }

    async mobileList(ctx, next){
        const list = await ShopCategoryModel.find({}, {'_id': 0, '__v': 0}).sort({modify_time: -1})
        ctx.body = {
            list,
            success: true,
        }
    }

    async save(ctx, next){
        const req = ctx.request;
        const { id, name } = req.body
        try{
            if(!name) throw new Error('名字不能为空')
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
            await ShopCategoryModel.findOneAndUpdate({id}, {$set: d});
            ctx.body = {
                success: true,
                msg: '保存成功'
            };
            return true;
        }

        // 新增
        let cate_id;
        try{
            cate_id = await this.createId(this.idType.SHOP_CATEGORY_ID)
        }catch(e){
            console.log('获取店铺分类id失败', e.message)
            ctx.body = {
                success: false,
                msg: '获取数据失败'
            }
            return
        }
        const d = await ShopCategoryModel.findOne({name})
        if(d){
            ctx.body = {
                success: false,
                msg: '分类名称不能重复'
            }
            return
        }
        const t = tf().format('YYYY-MM-DD HH:mm:ss')
        let data = {
            ...req.body,
            id: cate_id,
            create_time: t,
            modify_time: t,
        };
        const model = new ShopCategoryModel(data);
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

module.exports = new ShopCategoryController()
