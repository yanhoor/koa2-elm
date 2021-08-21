const BaseController = require('../baseController')
const AdminModel = require('../../mongodb/model/admin/adminModel')
const tf = require('time-formater')

class AdminController extends BaseController{
    constructor() {
        super();
        this.list = this.list.bind(this)
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.register = this.register.bind(this)
        this.userInfo = this.userInfo.bind(this)
        this.updateAvatar = this.updateAvatar.bind(this)
        this.changeState = this.changeState.bind(this)
    }

    async list(ctx, next){
        const req = ctx.request
        let { mobile, name, current = 1, pageSize = 20 } = req.query
        const offset = pageSize * (current - 1)
        let filter = {}
        if(mobile) filter.mobile = mobile
        if(name) filter.name = { $regex: new RegExp(name, 'i')} // 模糊查询
        const list = await AdminModel
            .find(filter, {'_id': 0, '__v': 0})
            .sort({modify_time: -1})
            .skip(Number(offset))
            .limit(Number(pageSize))
            .populate({
                path: 'shop',
                select: '-_id -__v'
            })
        const count = await AdminModel.countDocuments(filter)
        ctx.body = {
            list,
            amount: count,
        }
    }

    async userInfo(ctx, next){
        const admin_id = ctx.session.admin_id
        const admin = await AdminModel.findOne({ id: admin_id }, {'_id': 0, '__v': 0 }).populate({
            path: 'shop',
            select: '-_id -__v'
        })
        ctx.body = {
            success: true,
            info: admin
        }
    }

    async updateAvatar(ctx, next){
        const req = ctx.request;
        const admin_id = ctx.session.admin_id
        let path = ''
        try{
            path = await this.saveLocalFile(req.files.file)
        }catch(e){
            ctx.body = {
                success: false,
                msg: '上传失败'
            }
        }
        const updateData = {
            avatar: path,
            modify_time: tf().format('YYYY-MM-DD HH:mm:ss')
        }
        const admin = await AdminModel.findOne({ id: admin_id })
        if(admin.avatar){
            await this.deleteFile(admin.avatar)
        }
        await admin.updateOne({$set: updateData})
        ctx.body = {
            success: true,
            path: path
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
        }else if(admin.state !== 1){
            ctx.body = {
                success: false,
                msg: '该账号已禁止使用'
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
        let { name, mobile, password, type } = req.body
        try{
            if(!name) throw new Error('用户名不能为空')
            if(!mobile) throw new Error('手机号不能为空')
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
            admin_id = await this.createId(this.idType.ADMIN_ID)
        }catch(e){
            console.log('获取用户id失败')
            ctx.body = {
                success: false,
                msg: '获取数据失败'
            }
            return
        }
        type = Number(type)
        const t = tf().format('YYYY-MM-DD HH:mm:ss')
        let data = {
            ...req.body,
            type,
            state: 1,
            roles: type === 1 ? ['super', 'admin'] : ['admin'],
            id: admin_id,
            create_time: t,
            modify_time: t,
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

    async changeState(ctx, next){
        const req = ctx.request
        const { state, id } = req.body
        if(id === ctx.session.admin_id){
            ctx.body = {
                success: false,
                msg: '操作失败'
            }
            return false
        }
        await AdminModel.findOneAndUpdate({ id }, { $set: { state } })
        ctx.body = {
            success: true,
            msg: '操作成功'
        }
    }
}

module.exports = new AdminController()
