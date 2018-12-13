const Koa = require('koa')
const cors = require('koa2-cors')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const koaBody = require('koa-body')
const logger = require('koa-logger')

const { adminRouter, apiRouter } = require('./routes');

app.use(cors())
// error handler
onerror(app)

// middlewares
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
// 处理post请求和文件上传
app.use(koaBody({
  formLimit: 1048576,  // 最大1M
  textLimit: 1048576,
  formidable:{
    keepExtensions: true, // 带拓展名上传，否则上传的会是二进制文件而不是图片文件，保持文件后缀
    onFileBegin(name,file){
      file.path = __dirname+'/public/images/'+file.name; // 重命名上传文件
    },
    uploadDir: __dirname+'/public/images'
  },  // 输出到images文件夹
  multipart:true,  // 支持文件上传
}))

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

// routes
app.use(adminRouter.routes())
	 .use(adminRouter.allowedMethods())
	 .use(apiRouter.routes())
	 .use(apiRouter.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
