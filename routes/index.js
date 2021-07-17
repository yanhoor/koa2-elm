const users = require('./users')
const admin = require('./admin')
const shop = require('./shop')
const address = require('./address')
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
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }))
  app.use(users.routes(), users.allowedMethods())
  app.use(admin.routes(), users.allowedMethods())
  app.use(address.routes(), address.allowedMethods())
  app.use(shop.routes(), shop.allowedMethods())
}
