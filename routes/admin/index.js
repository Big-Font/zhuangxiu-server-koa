const router = require('koa-router')()
const adminCtrl = require('../../controllers/admin');
const workerCtrl = require('../../controllers/admin/worker');
const apiUserCtrl = require('../../controllers/api/user');
const goodsCtrl = require('./../../controllers/admin/goods');

router.prefix('/admin')

router
    // 图形验证码
    .get('/captcha', adminCtrl.captcha)
    // 登录接口
    .post('/login', adminCtrl.login)
    // 前端用户列表查询
    .post('/mUserList', apiUserCtrl.mUserList)
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
    // 修改首页banner接口
    .post('/bannerModify', adminCtrl.bannerModify)
    // 获取装修案例列表
    .post('/caseList', adminCtrl.caseList)
    // 发布装修案例
    .post('/fitupCasePublic', adminCtrl.fitupCasePublic)
    // 修改装修案例 
    .post('/fitupcaseModify', adminCtrl.fitupcaseModify)
    // 查询秒杀活动列表
    .post('/spikeActiveList', adminCtrl.spikeActiveList)
    // 发布秒杀活动接口
    .post('/spikeActivePublish', adminCtrl.spikeActivePublish)
    // 查询找师傅列表接口
    .post('/getFindWorkerList', workerCtrl.getWorkerList)
    // 找师傅状态更改
    .post('/handleWorkerType', workerCtrl.modifyWorker)
    // 商品分类查询
    .post('/categoryList', goodsCtrl.categoryList)
    // 商品列表查询
    .post('/getGoods', goodsCtrl.getGoods)
    // 查询品牌列表 
    .post('/getBrandList', goodsCtrl.getBrandList)
    // 查询商家列表 
    .post('/getSellersList', goodsCtrl.getSellersList)
    // 发布商品品牌信息  
    .post('/publicBrandInfo', goodsCtrl.publicBrandInfo)
    // 修改品牌信息  
    .post('/modeifyBrandInfo', goodsCtrl.modeifyBrandInfo)
    // 添加商家接口 
    .post('/publicSellerInfo', goodsCtrl.publicSellerInfo)
    // 商家信息修改接口 
    .post('/modeifySellerInfo', goodsCtrl.modeifySellerInfo)
    // 查询所有商家（不分页） 
    .post('/getSellersListNoPage', goodsCtrl.getSellersListNoPage)
    // 商品列表中品牌、商家、类别查询接口--用于商品信息修改和发布
    .post('/goodsInfoUpdateList', goodsCtrl.goodsInfoUpdateList)

module.exports = router;