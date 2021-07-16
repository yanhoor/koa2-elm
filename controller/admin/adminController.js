const BaseController = require('../baseController')
const {IdType} = require('../../mongodb/model/idModel')
const AdminModel = require('../../mongodb/model/admin/adminModel')
const tf = require('time-formater')

class AdminController extends BaseController{
    constructor() {
        super();
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.register = this.register.bind(this)
        this.userInfo = this.userInfo.bind(this)
    }

    async userInfo(ctx, next){
        const admin_id = ctx.session.admin_id
        const admin = await AdminModel.findOne({ id: admin_id }, {'_id': 0, '__v': 0 })
        ctx.body = {
            success: true,
            info: admin
        }
    }

    async login(ctx, next){
        const req = ctx.request;
        const { mobile, password } = req.body
        try{
            if(!mobile) throw new Error('名字不能为空')
            if(!password) throw new Error('密码不能为空')
        }catch(e){
            ctx.body = {
                success: false,
                msg: e.message
            }
            return false
        }

        const admin = await AdminModel.findOne({ mobile })
        if(!admin){
            ctx.body = {
                success: false,
                msg: '该手机号尚未注册'
            }
            return
        }else if(admin.mobile === mobile){
            ctx.session.admin_id = admin.id
            ctx.body = {
                success: true,
                msg: '登录成功'
            }
        }
    }

    async logout(ctx, next){
        ctx.session = null
        ctx.body = {
            success: true,
            msg: '退出登录成功'
        }
    }

    async register(ctx, next){
        const req = ctx.request;
        const { mobile, password } = req.body
        try{
            if(!mobile) throw new Error('名字不能为空')
            if(!password) throw new Error('密码不能为空')
        }catch(e){
            ctx.body = {
                success: false,
                msg: e.message
            }
            return false
        }

        const admin = await AdminModel.findOne({ mobile })
        if(admin){
            ctx.body = {
                success: false,
                msg: '该手机号已注册'
            }
            return
        }


        // 新增
        let admin_id;
        try{
            admin_id = await this.createId(IdType.ADMIN_ID)
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
            id: admin_id,
            create_time: tf().format('YYYY-MM-DD HH:mm:ss')
        };
        const user = new AdminModel(data);
        user.save().then(r => {

        }).catch(e => {
            console.log('-----------------', e);
        })
        ctx.body = {
            success: true,
            msg: '注册成功'
        };
    }
}

module.exports = new AdminController()
