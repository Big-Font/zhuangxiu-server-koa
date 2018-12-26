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
    // 获取资讯列表
    .get('/articleList', adminCtrl.getList)
    // 获取资讯详情
    .post('/article', adminCtrl.getArticle)
    // 获取装修列表
    .get('/caseList', adminCtrl.caseList)
    // 查询秒杀活动列表
    .post('/spikeActiveList', adminCtrl.spikeActiveList)

module.exports = router;