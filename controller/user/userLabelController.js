const BaseController = require('../baseController')
const { IdType } = require('../../mongodb/model/idModel')
const userLabelModel = require('../../mongodb/model/user/userLabelModel')

class UserLabelController extends BaseController{
    constructor() {
        super();
        this.saveItem = this.saveItem.bind(this)
    }

    async itemList(ctx, next){
        const req = ctx.request;
        const {name, current = 1, pageSize = 20 } = req.query
        const offset = pageSize * (current - 1)
        let filter = {};
        if(name) filter.name = name
        const list = await userLabelModel.find(filter, {'_id': 0, '__v': 0}).limit(Number(pageSize)).skip(Number(offset))
        const count = await userLabelModel.count(filter)
        ctx.body = {
            list,
            amount: count,
        }
    }

    // 新增用户标签
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
            await userLabelModel.findOneAndUpdate({id}, {$set: req.body});
            ctx.body = {
                success: true,
                msg: '保存成功'
            };
            return true;
        }

        // 新增
        let user_label_id
        try{
            user_label_id = await this.createId(IdType.USER_LABEL_ID)
        }catch(e){
            console.log('获取用户标签id失败')
            ctx.body = {
                success: false,
                msg: '获取数据失败'
            }
            return
        }

        let newData = { ...req.body, id: user_label_id}
        const userLabel = new userLabelModel(newData)
        userLabel.save().then(r => {

        }).catch(e => {
            console.log('-----------------', e);
        })
        ctx.body = {
            success: true,
            msg: '保存成功'
        };
    }
}

module.exports = new UserLabelController()
