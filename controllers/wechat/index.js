import request from 'request-promise';
import config from '../../config';

// https请求方式: GET
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
        console.log(`检测acess_token的结果是： ${this.isValidToken(data)}`)
        if(!this.isValidToken(data)) {
            data = await this.updatedAccessToken();
        }

        // 存储token  
        await this.saveAccessToken(data);

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
        // 设置火气时间小于两个小时
        const expires_in = now + (data.expires_in - 20) * 1000;
        data.expires_in = expires_in;
        console.log(data);
        
        return data;
    }
    /*
    *   验证token是否过期，返回true或者false
    */
    isValidToken(data) {
        if(!data || !data.expires_in || !data.access_token) {
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