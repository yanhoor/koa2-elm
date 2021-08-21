const BaseController = require('../baseController')
const GoodsCategoryModel = require('../../mongodb/model/goods/goodsCategoryModel')
const AdminModel = require('../../mongodb/model/admin/adminModel')
const tf = require('time-formater')

class GoodsCategoryController extends BaseController{
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
            const newCate = await GoodsCategoryModel.findOneAndUpdate({id}, {$set: d}, { useFindAndModify: false, new: true })
            ctx.body = {
                success: true,
                msg: '保存成功',
                data: newCate
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
            item_id = await this.createId(this.idType.GOODS_CATEGORY_ID)
        }catch(e){
            console.log('获取商品分类id失败')
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
        const model = new GoodsCategoryModel(data);
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
        const { parent_id = 0 } = req.query
        const admin = await AdminModel.findOne({ id: ctx.session.admin_id })

        let filter = { parent_id }
        filter.shop_id = admin.shop_id
        console.log('-------------', filter)
        const list = await GoodsCategoryModel.find(filter, {'_id': 0, '__v': 0})
        ctx.body = {
            list,
            success: true
        }
    }
}

module.exports = new GoodsCategoryController()
