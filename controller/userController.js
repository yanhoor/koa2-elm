const BaseController = require('./baseController')
const {IdType} = require('../mongodb/model/idModel')
const UserModel = require('../mongodb/model/userModel')

class UserController extends BaseController{
    constructor() {
        super();
        this.saveUser = this.saveUser.bind(this)
        this.listUser = this.listUser.bind(this)
    }

    // 用户列表
    async listUser(ctx, next){
        const list = await UserModel.find({}, '-_id')
        ctx.body = list
    }

    // 保存用户
    async saveUser(ctx, next){
        const req = ctx.request;
        const id = req.body.id;
        console.log('================ddd', id);
        if(id){
            await UserModel.findOneAndUpdate({id}, {$set: req.body});
            ctx.body = {
                success: true,
                msg: '保存成功'
            };
            return true;
        }

        let user_id;
        try{
            user_id = await this.createId(IdType.USER_ID)
        }catch(e){
            console.log('获取用户id失败')
            ctx.body = {
                success: false,
                msg: '获取数据失败'
            }
            return
        }
        let data = {
            ...req.body,
            id: user_id,
        };
        console.log('================ddd=========', data);
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
