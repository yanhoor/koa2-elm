const users = require('./users')
const admin = require('./admin')
const shop = require('./shop')
const goods = require('./goods')
const address = require('./address')
const cors = require('koa2-cors')
const router = require('koa-router')()
const UploadController = require('../controller/UploadController')

router.post('/upload', UploadController.upload)

module.exports = app => {
  app.use(cors({
    origin(ctx){
      const { origin, Origin, referer, Referer } = ctx.request.headers;
      const allowOrigin = origin || Origin || referer || Referer || '*';
      return allowOrigin;
    },
    credentials: true,
    allowMethods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }))
  app.use(users.routes()).use(users.allowedMethods())
  app.use(admin.routes()).use(admin.allowedMethods())
  app.use(address.routes()).use(address.allowedMethods())
  app.use(shop.routes()).use(shop.allowedMethods())
  app.use(goods.routes()).use(goods.allowedMethods())
  app.use(router.routes()).use(router.allowedMethods())
}
