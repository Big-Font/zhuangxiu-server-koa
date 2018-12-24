const router = require('koa-router')()
const apiCtrl = require('../../controllers/api');
const adminCtrl = require('../../controllers/admin');

router.prefix('/api')

router
    .get('/register', apiCtrl.register)
    .post('/login', adminCtrl.login)
    .get('/captcha', adminCtrl.captcha)
    // 获取banner
    .get('/banner', adminCtrl.getBannerList)
    // 获取装修列表
    .get('/caseList', adminCtrl.caseList)

module.exports = router;