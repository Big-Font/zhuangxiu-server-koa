const router = require('koa-router')()
const adminCtrl = require('../../controllers/admin');

router.prefix('/admin')

router
    // 图形验证码
    .get('/captcha', adminCtrl.captcha)
    // 登录接口
    .post('/login', adminCtrl.login)
    .post('/articleList', adminCtrl.getList)


module.exports = router;