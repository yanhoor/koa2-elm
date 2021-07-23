const BaseController = require('../baseController')
const FoodCategoryModel = require('../../mongodb/model/shop/foodCategoryModel')
const tf = require('time-formater')

class FoodCategoryController extends BaseController{
    constructor() {
        super();
        this.saveNode = this.saveNode.bind(this)
        this.getChildrenNodeList = this.getChildrenNodeList.bind(this)
    }

    async saveNode(ctx, next){
        const req = ctx.request
        const { parent_id = 0, level = 0, name, shop_id, id } = req.body
        try{
            if(!name) throw new Error('名称不能为空')
            if(!shop_id) throw new Error('店铺id不能为空')
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
            await FoodCategoryModel.findOneAndUpdate({id}, {$set: d});
            ctx.body = {
                success: true,
                msg: '保存成功',
                data: d
            };
            return true;
        }

        // 新增
        let item_id;
        if(level >= 3){
            ctx.body = {
                success: false,
                msg: '最多只能3级分类'
            }
            return
        }
        try{
            item_id = await this.createId(this.idType.FOOD_CATEGORY_ID)
        }catch(e){
            console.log('获取食品分类id失败')
            ctx.body = {
                success: false,
                msg: '获取数据失败'
            }
            return
        }
        const t = tf().format('YYYY-MM-DD HH:mm:ss')
        let data = {
            parent_id,
            level,
            ...req.body,
            id: item_id,
            create_time: t,
            modify_time: t,
        };
        const model = new FoodCategoryModel(data);
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

    async getChildrenNodeList(ctx, next){
        const req = ctx.request
        const { parent_id = 0, shop_id } = req.query
        console.log('------------', shop_id)
        try{
            if(!shop_id) throw new Error('店铺id不能为空')
        }catch(e){
            ctx.body = {
                success: false,
                msg: e.message
            }
            return false
        }

        let filter = { parent_id, shop_id }
        const list = await FoodCategoryModel.find(filter, {'_id': 0, '__v': 0})
        ctx.body = {
            list,
            success: true
        }
    }
}

module.exports = new FoodCategoryController()
