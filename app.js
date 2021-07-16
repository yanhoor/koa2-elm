const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const indexRouter = require('./routes/index')
const session = require('koa-session')
const passport = require('koa-passport')

require('./mongodb/db'); // 连接数据库

app.keys = ['yanhoor'];

const CONFIG = {
  key: 'SID', /** (string) cookie key (default is koa.sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 1000 * 60 * 60 * 24 * 7,
  // maxAge: 1000 * 30,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: false, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  secure: false, /** (boolean) secure cookie*/
  sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
};

app.use(session(CONFIG, app));
// or if you prefer all default config, just use => app.use(session(app));

// todo: 无效？
app.on('session:expired', (key,value,ctx) => console.log('==========session expired=============', key));
app.on('session:missed', (key,value,ctx) => console.log('==========session missed=============', key));

// app.use(passport.initialize())
// app.use(passport.session())

// error handler
onerror(app)

app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// middlewares，调用app.use()的顺序决定了middleware的顺序
// 如果一个middleware没有调用await next()，那么后续的middleware将不再执行了。await不要省略
app.use(async (ctx, next) => {
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

// routes
indexRouter(app)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
