const { mobileMall } = require('./mall')
const { mobileShop } = require('./shop')
const mobileRouter = require('koa-router')()

mobileRouter.prefix('/mobile')

// mobileRouter.use(async (ctx, next) => {
//     if(!ctx.session.admin_id && !ctx.url.includes('/admin')){
//         ctx.body = {
//             code: 900,
//             success: false,
//             msg: '未登录'
//         }
//         return
//     }
//     await next()
// })

mobileRouter.use(mobileMall.routes(), mobileMall.allowedMethods())
mobileRouter.use(mobileShop.routes(), mobileShop.allowedMethods())

module.exports = mobileRouter
