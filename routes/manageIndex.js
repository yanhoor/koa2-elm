const users = require('./users')
const admin = require('./admin')
const { manageShop } = require('./shop')
const goods = require('./goods')
const address = require('./address')
const upload = require('./upload')
const { manageMall } = require('./mall')
const manageRouter = require('koa-router')()

manageRouter.prefix('/manage')

manageRouter.use(async (ctx, next) => {
    if(!ctx.session.admin_id && !ctx.url.includes('/admin')){
        ctx.body = {
            code: 900,
            success: false,
            msg: '未登录'
        }
        return
    }
    await next()
})

manageRouter.use(users.routes(), users.allowedMethods())
manageRouter.use(admin.routes(), admin.allowedMethods())
manageRouter.use(address.routes(), address.allowedMethods())
manageRouter.use(manageShop.routes(), manageShop.allowedMethods())
manageRouter.use(goods.routes(), goods.allowedMethods())
manageRouter.use(upload.routes(), upload.allowedMethods())
manageRouter.use(manageMall.routes(), manageMall.allowedMethods())

module.exports = manageRouter
