const cors = require('koa2-cors')
const manageRouter = require('./manageIndex')
const mobileRouter = require('./mobileIndex')

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
  app.use(manageRouter.routes())
  app.use(mobileRouter.routes())
}
