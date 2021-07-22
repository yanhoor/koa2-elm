const BaseController = require('../baseController')
const UserModel = require('../../mongodb/model/user/userModel')
const tf = require('time-formater')

class UserController extends BaseController{
    constructor() {
        super();
        this.saveUser = this.saveUser.bind(this)
        this.listUser = this.listUser.bind(this)
    }

    // 用户列表
    async listUser(ctx, next){
        const req = ctx.request;
        const {name, current = 1, pageSize = 20 } = req.query
        const offset = pageSize * (current - 1)
        let filter = {};
        if(name) filter.name = name
        const list = await UserModel.aggregate([
            { $match : filter },
            { $limit : Number(pageSize) },
            { $skip : Number(offset) },
            { $project : { _id : 0 , __v : 0 } },
            {
                $lookup: {
                    from: 'userLabels',
                    localField: 'labelIds',
                    foreignField: 'id',
                    as: 'labelList',
                }
            },
            { $sort : { modify_time : -1 } }
        ])
        const count = await UserModel.countDocuments(filter)
        ctx.body = {
            list,
            amount: count,
        }
    }

    // 保存用户
    async saveUser(ctx, next){
        const req = ctx.request;
        const { id, name, age, mobile } = req.body
        try{
            if(!name) throw new Error('名字不能为空')
            if(!age) throw new Error('年龄不能为空')
            if(!mobile) throw new Error('手机号不能为空')
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
            await UserModel.findOneAndUpdate({id}, {$set: d});
            ctx.body = {
                success: true,
                msg: '保存成功'
            };
            return true;
        }

        // 新增
        let user_id;
        try{
            user_id = await this.createId(this.idType.USER_ID)
        }catch(e){
            console.log('获取用户id失败')
            ctx.body = {
                success: false,
                msg: '获取数据失败'
            }
            return
        }
        const t = tf().format('YYYY-MM-DD HH:mm:ss')
        let data = {
            ...req.body,
            id: user_id,
            create_time: t,
            modify_time: t,
        };
        const user = new UserModel(data);
        user.save().then(r => {

        }).catch(e => {
            console.log('-----------------', e);
        })
        ctx.body = {
            success: true,
            msg: '保存成功'
        };
    }
}

module.exports = new UserController()
