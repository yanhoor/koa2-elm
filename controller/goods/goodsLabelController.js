const BaseController = require('../baseController')
const goodsLabelModel = require('../../mongodb/model/goods/goodsLabelModel')
const AdminModel = require('../../mongodb/model/admin/adminModel')
const tf = require('time-formater')

class GoodsLabelController extends BaseController{
    constructor() {
        super();
        this.detail = this.detail.bind(this)
        this.saveItem = this.saveItem.bind(this)
        this.itemList = this.itemList.bind(this)
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

        const item = await goodsLabelModel.findOne({id}, {'_id': 0, '__v': 0})

        ctx.body = {
            success: true,
            data: item
        }
    }

    async itemList(ctx, next){
        const req = ctx.request
        const {name, current = 1, pageSize = 20 } = req.query
        const offset = pageSize * (current - 1)
        const admin = await AdminModel.findOne({ id: ctx.session.admin_id })
        let filter = {}
        if(name) filter.name = { $regex: new RegExp(name, 'i')} // 模糊查询
        filter.shop_id = admin.shop_id
        const list = await goodsLabelModel.find(filter, {'_id': 0, '__v': 0}).limit(Number(pageSize)).skip(Number(offset)).sort({modify_time: -1})
        const count = await goodsLabelModel.countDocuments(filter)
        ctx.body = {
            success: true,
            list,
            amount: count,
        }
    }

    // 新增标签
    async saveItem(ctx, next){
        const req = ctx.request
        const { name, color, id } = req.body
        try{
            if(!name) throw new Error('名称不能为空')
            if(!color) throw new Error('颜色不能为空')
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
            await goodsLabelModel.findOneAndUpdate({id}, {$set: d});
            ctx.body = {
                success: true,
                msg: '保存成功'
            };
            return true;
        }

        // 新增
        let item_id
        try{
            item_id = await this.createId(this.idType.GOODS_LABEL_ID)
        }catch(e){
            console.log('获取标签id失败')
            ctx.body = {
                success: false,
                msg: '获取数据失败'
            }
            return
        }

        const t = tf().format('YYYY-MM-DD HH:mm:ss')
        const admin = await AdminModel.findOne({ id: ctx.session.admin_id })
        if(!admin.shop_id){
            ctx.body = {
                success: false,
                msg: '店铺不存在，请先添加店铺'
            }
            return
        }
        let newData = {
            ...req.body,
            id: item_id,
            shop_id: admin.shop_id,
            create_time: t,
            modify_time: t,
        }
        const model = new goodsLabelModel(newData)
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

module.exports = new GoodsLabelController()
