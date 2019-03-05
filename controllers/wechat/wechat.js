import { reply } from './reply';
import config from './../../config';
import { getOAuth } from '../../routes/wechat';
import wechatMiddle from '../../middlewares/wechat';

// 介入微信消息中间件
exports.hear = async (ctx, next) => {
    const middle = wechatMiddle(config[process.env.NODE_ENV].wechat, reply);

    await middle(ctx, next);
}

// 获取用户信息中间件
exports.oauth = async (ctx, next) => {
    const oauth = getOAuth();
    // let target = config[process.env.NODE_ENV].baseUrl + '/userinfo';
    let target = `${config[process.env.NODE_ENV].baseUrl}/userinfo`;
    let scope = 'snsapi_userinfo';
    let state = ctx.query.id;
    
    let url = oauth.getAuthorizeUrl(scope, target, state);

    ctx.redirect(url);
};

exports.userinfo = async (ctx, next) => {
    const oauth = getOAuth();
    const code = ctx.query.code;
    const data = await oauth.fetchAccessToken(code);
    const UserData = await oauth.getUserInfo(data.access_token, data.openid);

    ctx.body = UserData;
};
