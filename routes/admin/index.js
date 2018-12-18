const router = require('koa-router')()
const adminCtrl = require('../../controllers/admin');
const checkJWT = require('../../middlewares/checkJWT');

router.prefix('/admin')

router
    // 图形验证码
    .get('/captcha', adminCtrl.captcha)
    // 登录接口
    .post('/login', adminCtrl.login)
    // 查询文章列表接口
    .get('/articleList', adminCtrl.getList)
    // 发布资讯列表接口 
    .post('/articlePublish', adminCtrl.articlePublish)
    // 根据id查询文章接口
    .post('/article', adminCtrl.getArticle)
    // 获取首页banner列表 
    .get('/getBannerList', adminCtrl.getBannerList)
    // 发布首页banner接口
    .post('/bannerPublic', adminCtrl.bannerPublic)
    // 获取装修案例列表
    .get('/caseList', adminCtrl.caseList)
    // 发布装修案例
    .post('/fitupCasePublic', adminCtrl.fitupCasePublic)
    // 修改装修案例 
    .post('/fitupcaseModify', adminCtrl.fitupcaseModify)


module.exports = router;