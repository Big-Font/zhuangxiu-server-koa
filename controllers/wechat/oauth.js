/*
*   1.用户访问网页  /a  
*   2.服务器构建二跳网页地址  /b?state&appid 各种参数追加
*   3.跳到微信授权页面，用户主动授权，跳回来到  /a?code
*   4.通过code 换取 token code => wechat => access_token , openid
*   5.通过 token + openid 换取资料 access_token => 用户资料
*/


const Request = require('request-promise');

const Base = 'https://api.weixin.qq.com/sns/';
const Api = {
    authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
    accessToken: `${Base}oauth2/access_token?`,
    userInfo: `${Base}userinfo?`,
};

class WeChatOAuth {
    constructor(opts){
        // wechat: {
        //     token: 'qingrui520dalaishuizuchongzhi258',//微信后台配置的token
        //     appid: 'wx8b44732d0addeb4f',//微信公众号的appid
        //     encodingAESKey: 'RwElu82ieB8rn8IwlDocSd3zAoO2YxOgKHzfpRgAnQm',//微信公众号的encodingAESKey
        //     appSecret: 'd97f2f1e667c28368b34a78c631dd762',  //微信开发者密码AppSecret
        // },
        console.log(`options: ${opts}`)
        this.opts = Object.assign({}, opts);
        this.appID = opts.appid;
        this.appSecret = opts.appSecret;       
    }
    async request(opts){
        opts = Object.assign({}, opts, {json: true});
        try{
            const res = await Request(opts);
            return res;
        }catch(err){
            console.log(err);
        }
    }
    getAuthorizeUrl(scope='snsapi_base', target, state){
        let url = `${Api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
        return url;
    }
    async fetchAccessToken(code){
        const url = `${Api.accessToken}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`;
        const res = await this.request({url});
        return res;
    }
    async getUserInfo(token, openId, lang="zh_CN"){
        const url = `${Api.userInfo}access_token=${token}&openid=${openId}&lang=${lang}`;
        const res = await this.request({url});
        return res;
    }
};

module.exports = WeChatOAuth;