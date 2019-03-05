const router = require('koa-router')();
const Wechat = require('./../../controllers/wechat/wechat');

router.prefix('/wechat')

router
    // 消息路由
    .get('/wx-hear', Wechat.hear)
    .post('/wx-hear', Wechat.hear)
    // 跳转到授权中间服务页面
    .get('/wx-oauth', Wechat.oauth)
    // 通过 code 获取用户信息
    .get('/userinfo', Wechat.userinfo)
    
module.exports = router;