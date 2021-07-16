# koa2-elm

后端接口，[对应管理系统](https://github.com/yanhoor/mall-web)

## 技术栈

`Koa2 + Node.js + MongoDB + Mongoose`

## 项目运行

- 确保已安装 `MongoDB`

- `npm i`

- `npm run dev`

- 访问 `http://localhost:3000`

## 技术实现

### 登录

在 `/admin` 实现了注册和登录接口，使用 `koa-session` 存储登录 `cookie`

- 在 `app.js` 引入，初始化

  ```javascript
    const session = require('koa-session')
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
  ```

- 在登录接口 `/admin/login` 登陆成功时，保存用户 `id`: `ctx.session.admin_id = admin.id`

- 对所有接口（除了登录和注册）进行拦截，校验登录状态

  ```javascript
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
  ```
  
- 退出登录：直接使用 `ctx.session = null`，也会将新的 `cookie` 在响应头返回前端
