import { reply } from './reply';
import config from './../../config';
import { getOAuth } from '../../routes/wechat';
import wechatMiddle from '../../middlewares/wechat';
import { UrlJoin, IsWeChat } from '../../lib/wechat';
import { getSignature } from './api-wechat';
import { getToken } from '../../lib/user';

// 介入微信消息中间件
exports.hear = async (ctx, next) => {
    const middle = wechatMiddle(config[process.env.NODE_ENV].wechat, reply);

    await middle(ctx, next);
}

// 获取用户信息中间件
exports.oauth = async (ctx, next) => {
    // const oauth = getOAuth();
    // let target = `${config[process.env.NODE_ENV].baseUrl}/userinfo`;
    // let scope = 'snsapi_userinfo';
    // let state = ctx.query.id;
    // let url = oauth.getAuthorizeUrl(scope, target, state);

    let { target } = ctx.request.query;
    console.log(target)
    target = decodeURIComponent(target)
    const oauth = getOAuth();
    const scope = 'snsapi_userinfo';
    const state = '';
    const url = oauth.getAuthorizeUrl(scope, target, state);
    ctx.success({data: url});
    // ctx.redirect(url);
};

// 获取用户信息  code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
exports.userinfo = async (ctx, next) => {
    // const oauth = getOAuth();
    // const code = ctx.query.code;
    // const data = await oauth.fetchAccessToken(code);
    // 返回值为
    // { 
    //     "access_token":"ACCESS_TOKEN",
    //     "expires_in":7200,
    //     "refresh_token":"REFRESH_TOKEN",
    //     "openid":"OPENID",
    //     "scope":"SCOPE" 
    // }
    // 获取用户信息：  https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
    // const UserData = await oauth.getUserInfo(data.access_token, data.openid);
    // ctx.body = UserData;

    const oauth = getOAuth();
    const { code } = ctx.request.query;
    const data = await oauth.fetchAccessToken(code);
    const userData = await oauth.getUserInfo(data.access_token, data.openid);

    ctx.success({
        msg: '获取微信用户信息成功',
        token: getToken({userid: userData.openid, phone: null , email: null, username: userData.nickname}),
        // 可以获取的是 openid, nickname,sex(1-男),language, city,province,country, headimgurl
        userData,
    })
};

// 微信sdk中间件 根据 接口传入的 url 进行签名
/*
*   微信分享服务端签名流程
*   1.接口请求，通过路由经过 sdk 控制器，根据 url 进行获取签名值 （getSignature方法）
*   2.getSignature方法：获取 token ,根据 token 获取 ticket ，然后将 ticket 和 url进行签名，同时添加分享时需要的 appId
*   3.获取 ticket 的操作和 获取个人信息中的 获取access_token操作一致，先判断数据库是否有 ticket，如果有并且expires_in在有效期内，则进行下一步，如果没有ticket或者expires_in不在有效期，则调用微信接口 https://api.weixin.qq.com/cgi-bin/ticket/getticket 添加一系列参数来获取 ticket，并整理expires_in后存入数据库（将有效期设置为不到两小时， 这样保证请求在两小时内都是从数据库中获取的ticket，并在2小时有效期即将到来的之前有访问或者有效期到期后的访问是从微信接口获取的新的ticket），注意必须要先获取 access_token 才能根据 access_token去获取 ticket；
*   4.签名步骤： 先依次生成 随机串、时间戳 ，然后根据微信文档的步骤，构建一个reg对象，对对象进行字典排序后进行 sha1 加密。然后返回包含 随机串、时间戳、加密值 的对象并添加 appID 后返回给前端
*/
exports.sdk = async (ctx, next) => {
    let { url } = ctx.request.body;
    const params = await getSignature(url);
    ctx.success({
        msg: '验签成功',
        params
    })
}
