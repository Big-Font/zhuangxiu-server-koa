// wechat-lib/index.js  微信 access_token ticket 的获取
import request from 'request-promise';
import config from '../../config';

// https请求方式: GET
// https://api.weixin.qq.com/cgi-bin/
// https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
const api = {
    accessToken: 'token?grant_type=client_credential'
}

class WeichatControllers {
    constructor(opts) {
        this.opts = Object.assign({}, opts);
        this.appID = opts.appid;
        this.appSecret = opts.appSecret;
        this.getAccessToken = opts.getAccessToken;
        this.saveAccessToken = opts.saveAccessToken;
        this.getTicket = opts.getTicket;
        this.saveTicket = opts.saveTicket;

        this.fetchAccessToken();
    }
    
    /*
    *   发送请求
    */
    async request(options) {
        options = Object.assign({}, options, {json: true});

        try{
            const res = await request(options);
            return res;
        }catch(err) {
            console.log(`wechat服务获取access_token请求错误：${err}`);
        }
    }
    /*
    *   获取token
    */
    async fetchAccessToken() {
        // 先从数据库获取token并检查token是否过期
        let data = await this.getAccessToken();
        console.log('====>',JSON.stringify(data))
        console.log(`检测acess_token的结果是： ${this.isValid(data, 'acess_token')}`)
        if(!this.isValid(data, 'acess_token')) {
            data = await this.updatedAccessToken();
        }

        return data;
    }
    /*
    *   刷新请求
    */
    async updatedAccessToken() {
        const url = `${config[process.env.NODE_ENV].wechatBaseUrl}${api.accessToken}&appid=${this.appID}&secret=${this.appSecret}`;
        
        const data = await this.request({url});
        console.log(data);        
        const now = new Date().getTime();
        // 设置过期时间小于两个小时
        const expires_in = now + (data.expires_in - 20) * 1000;
        data.expires_in = expires_in;
        console.log(data);

        // 存储token  
        await this.saveAccessToken(data);
        
        return data;
    }

    /*
    *   请求来以后获取 ticket
    */
    async fetchTicket(token){
        let data = await this.getTicket();
        if(!this.isValid(data, 'ticket')){
            data = await this.updateTicket(token);
        }

        // await this.saveTicket(data);

        return data;
    }

    // 更新 ticket
    async updateTicket(token){
        const url = `${config[process.env.NODE_ENV].wechatBaseUrl}ticket/getticket?access_token=${token}&type=jsapi`;

        const data = await this.request({ url });

        const Now = new Date().getTime();
        const ExpiresIn = Now + (data.expires_in - 20) * 1000;

        data.expires_in = ExpiresIn;

        await this.saveTicket(data);

        return data;
    }

    /*
    *   验证token 或者 ticket 是否过期，返回true或者false
    *   @params 数据库里取出的对象 {access_token: xxx, expires_in: xxx}  或者  { ticket: xxx, expires_in: xxxx }
    */
    isValid(data, name) {
        if(!data || !data.expires_in || !data[name]) {
            return false;
        }

        const expires_in = data.expires_in;
        const now = new Date().getTime();

        if(now < expires_in) {
            return true;
        }else {
            return false;
        }
    }
}

module.exports = WeichatControllers;