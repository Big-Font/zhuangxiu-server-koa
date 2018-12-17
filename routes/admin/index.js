const router = require('koa-router')()
const adminCtrl = require('../../controllers/admin');
const checkJWT = require('../../middlewares/checkJWT');

router.prefix('/admin')

router
    // 图形验证码
    .get('/captcha', adminCtrl.captcha)
    // 登录接口
    .post('/login', adminCtrl.login)
    .get('/articleList', adminCtrl.getList)
    // 发布资讯列表接口 articlePublish
    .post('/articlePublish', adminCtrl.articlePublish)


module.exports = router;