const users = require('./users')
const admin = require('./admin')
const shop = require('./shop')
const goods = require('./goods')
const address = require('./address')
const upload = require('./upload')
const mall = require('./mall')
const cors = require('koa2-cors')

module.exports = app => {
  app.use(cors({
    origin(ctx){
      const { origin, Origin, referer, Referer } = ctx.request.headers;
      const allowOrigin = origin || Origin || referer || Referer || '*';
      return allowOrigin;
    },
    credentials: true,
    allowMethods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'mobile_login_token'],
  }))
  app.use(users.routes()).use(users.allowedMethods())
  app.use(admin.routes()).use(admin.allowedMethods())
  app.use(address.routes()).use(address.allowedMethods())
  app.use(shop.routes()).use(shop.allowedMethods())
  app.use(goods.routes()).use(goods.allowedMethods())
  app.use(upload.routes()).use(upload.allowedMethods())
  app.use(mall.routes()).use(mall.allowedMethods())
}
