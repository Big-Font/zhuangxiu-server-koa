const router = require('koa-router')()
const apiCtrl = require('../../controllers/api');
const apiUserCtrl = require('../../controllers/api/user');
const adminCtrl = require('../../controllers/admin');
const workerCtrl = require('../../controllers/api/worker');
const goodsCtrl = require('./../../controllers/admin/goods');
const shopcarCtrl = require('./../../controllers/api/shopcar');
const UploadControllers = require('../../controllers/api/upload');

router.prefix('/api')

router
    // 上传图片的接口
    .post('/upload/:pid', UploadControllers.upload)
    // 前端用户注册邮箱验证码接口
    .post('/v1/mailVerify', apiUserCtrl.mailVerify)
    // 前端用户注册接口
    .post('/v1/register', apiUserCtrl.mUserRegister)
    // 登录图形验证码接口
    .get('/v1/captcha', apiUserCtrl.captcha)
    // 前端用户登录接口
    .post('/v1/login', apiUserCtrl.mUserLogin)
    // 获取前端用户的用户信息 
    .post('/getUserInfo', apiUserCtrl.getmUserInfo)
    // 修改前端用户个人信息 
    .post('/modeifymUserInfo', apiUserCtrl.modeifymUserInfo)
    // 获取首页信息接口 getIndex
    .post('/v1/getIndex', apiCtrl.getIndex)
    // 获取banner
    .get('/v1/banner', adminCtrl.getBannerList)
    // 获取资讯列表
    .get('/v1/articleList', adminCtrl.getList)
    // 获取资讯详情
    .post('/v1/article', adminCtrl.getArticle)
    // 获取装修案例列表
    .post('/v1/caseList', apiCtrl.caseList)
    // 根据id查找装修案例详情
    .post('/v1/caseDetail', apiCtrl.queryFitupcaseDetail)
    // 查询秒杀活动列表
    .post('/v1/spikeActiveList', adminCtrl.spikeActiveList)
    // 根据秒杀活动列表id查询秒杀活动详情  
    .post('/v1/querySpikeDetail', adminCtrl.querySpikeDetail)
    // 发布找师傅资讯
    .post('/addWorkerMsg', workerCtrl.addWorkerMsg)
    // 查询当前用户的找师傅发布记录  
    .post('/getUserFindWorkerList', workerCtrl.getUserFindWorkerList)
    // 用户删除找师傅列表 
    .post('/userDeleteFindWorker', workerCtrl.userDeleteFindWorker)
    // 用户催单找师傅列表 
    .post('/userHurryFindWorker', workerCtrl.userHurryFindWorker)
    // 查询商品分类列表
    .post('/v1/goodsTypeList', goodsCtrl.categoryList)
    // 查询商品列表
    .post('/v1/getGoods', goodsCtrl.getGoods)
    // 根据商品列表id查询商品详情 getGoodDetail
    .post('/v1/getGoodDetail', goodsCtrl.getGoodDetail)
    // 添加购物车 
    .post('/addShopcar', shopcarCtrl.addShopcar)
    // 查询购物车列表
    .post('/queryShopcarList', shopcarCtrl.queryShopcarList)
    // 修改购物车信息
    .post('/modeifyShopcar', shopcarCtrl.modeifyShopcar)

module.exports = router;