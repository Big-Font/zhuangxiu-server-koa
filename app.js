const Koa = require('koa')
const cors = require('koa2-cors')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
// const session = require("koa-session2")
// import RedisStore from './lib/store'
// const RedisStore = require('./lib/store')
const session = require('koa-session')
const Redis = require('koa-redis')
const jwt = require('jsonwebtoken');
const jwtKoa= require('koa-jwt');
const onerror = require('koa-onerror')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const config = require('./config');
const errorHandle = require('./middlewares/errorHandle');
const checkJWT = require('./middlewares/checkJWT');

const { adminRouter, apiRouter, ueditorRouter, uploadRouter } = require('./routes');

app.use(cors({
  credentials: true,
}))
// error handler
onerror(app)

// 设置session
app.keys = config[process.env.NODE_ENV].sessionKey;
const CONFIG = {
   key: config[process.env.NODE_ENV].cookieKey,   //cookie key (default is koa:sess)
   maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
   overwrite: true,  //是否可以overwrite    (默认default true)
   httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
   signed: true,   //签名默认true
   rolling: true,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
   renew: false,  //(boolean) renew session when session is nearly expired,
   store: new Redis()
};
app.use(session(CONFIG, app));
// app.use(session({
//   store: new RedisStore()
// }));

// middlewares
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// 处理post请求和文件上传
app.use(koaBody({
  formLimit: 1048576,  // 最大1M
  textLimit: 1048576,
  formidable:{
    multipart: true,
    keepExtensions: true, // 带拓展名上传，否则上传的会是二进制文件而不是图片文件，保持文件后缀
    maxFileSize: 200*1024*1024,    // 设置上传文件大小最大限制，默认2M
    onFileBegin(name,file){
      file.path = __dirname+'/public/images/'+file.name; // 重命名上传文件
    },
    uploadDir: __dirname+'/public/images'
  },  // 输出到images文件夹
  multipart: true,  // 支持文件上传
}))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 自定义 middlewares
app.use(errorHandle);

// jwt 设置和过滤
app.use(jwtKoa({
  secret: config[process.env.NODE_ENV].secret,
}).unless({
  path: [/\/register/, /\/login/, /^\/images\/*/, /^\/api\/v1\/*/,  '/admin/captcha', '/admin/login', '/admin/wangeditor/upload', '/admin/upload','/admin/articleList'],
}))

app.use(checkJWT());

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// 
app.use(require('./middlewares/response'));
// routes uploadRouter
app.use(adminRouter.routes())
	 .use(adminRouter.allowedMethods())
	 .use(apiRouter.routes())
   .use(apiRouter.allowedMethods())
   .use(ueditorRouter.routes())
   .use(ueditorRouter.allowedMethods())
   .use(uploadRouter.routes())
	 .use(uploadRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
