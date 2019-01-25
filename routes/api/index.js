const router = require('koa-router')()
const apiCtrl = require('../../controllers/api');
const apiUserCtrl = require('../../controllers/api/user');
const adminCtrl = require('../../controllers/admin');
const workerCtrl = require('../../controllers/api/worker');

router.prefix('/api')

router
    // 前端用户注册邮箱验证码接口
    .post('/mailVerify', apiUserCtrl.mailVerify)
    // 前端用户注册接口
    .post('/register', apiUserCtrl.mUserRegister)
    // 登录图形验证码接口
    .get('/captcha', apiUserCtrl.captcha)
    // 前端用户登录接口
    .post('/login', apiUserCtrl.mUserLogin)
    // 获取banner
    .get('/banner', adminCtrl.getBannerList)
    // 获取资讯列表
    .get('/articleList', adminCtrl.getList)
    // 获取资讯详情
    .post('/article', adminCtrl.getArticle)
    // 获取装修列表
    .get('/caseList', apiCtrl.caseList)
    // 查询秒杀活动列表
    .post('/spikeActiveList', adminCtrl.spikeActiveList)
    // 发布找师傅资讯
    .post('/addWorkerMsg', workerCtrl.addWorkerMsg)

module.exports = router;