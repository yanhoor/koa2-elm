const BaseController = require('../baseController')
const HomeConfigModel = require('../../mongodb/model/mall/homeConfigModel')
const tf = require('time-formater')

class HomeConfigController extends BaseController{
    constructor() {
        super()
        this.valid = this.valid.bind(this)
        this.list = this.list.bind(this)
        this.save = this.save.bind(this)
    }

    async valid(ctx){
        const conf = await HomeConfigModel.findOne({ state: 1 })
        if(!conf){
            ctx.body = {
                success: false,
                msg: '没有已启用的配置项'
            }
            return
        }

        ctx.body = {
            success: true,
            conf
        }
    }

    async list(ctx, next){
        const req = ctx.request;
        const {name, current = 1, pageSize = 20 } = req.query
        const offset = pageSize * (current - 1)
        let filter = {};
        if(name) filter.name = name
        const list = await HomeConfigModel.aggregate([
            { $match : filter },
            { $limit : Number(pageSize) },
            { $skip : Number(offset) },
            { $sort : { modify_time : -1 } }
        ])
        const count = await HomeConfigModel.countDocuments(filter)
        ctx.body = {
            list: list,
            amount: count,
            success: true
        }
    }

    async save(ctx, next){
        const req = ctx.request
        const { id, name, logo, banner_list } = req.body
        try{
            if(!name) throw new Error('名称不能为空')
            if(!logo) throw new Error('logo不能为空')
            if(!banner_list || banner_list.length == 0) throw new Error('轮播图不能为空')
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
            await HomeConfigModel.findOneAndUpdate({id}, {$set: d})
            ctx.body = {
                success: true,
                msg: '保存成功'
            };
            return true
        }

        // 新增
        let item_id;
        try{
            item_id = await this.createId(this.idType.HOME_CONFIG_ID)
        }catch(e){
            console.log('获取id失败')
            ctx.body = {
                success: false,
                msg: '获取数据失败'
            }
            return
        }
        await HomeConfigModel.findOneAndUpdate({state: 1}, {$set: {state: 2}})
        const t = tf().format('YYYY-MM-DD HH:mm:ss')
        let data = {
            ...req.body,
            id: item_id,
            state: 1,
            admin_id: ctx.session.admin_id,
            create_time: t,
            modify_time: t,
        };
        const model = new HomeConfigModel(data)
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

module.exports = new HomeConfigController()
