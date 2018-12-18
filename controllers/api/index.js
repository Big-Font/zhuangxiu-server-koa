import captchapng from 'svg-captcha';

class ApiControllers {
    // 图形验证码
    async captchas(ctx) {
        const cap = captchapng.create({
            size: 4,
            ignoreChars: '0oli',
            noise: 4,
            color: true,
            background: '#fff'
        })
        ctx.session.usernam = cap.text.toLocaleLowerCase();
        ctx.response.type ='svg';
        ctx.body = cap.data;
    }
    /*
    *   banner 管理
    *   @response  
    *   capkey  图形验证码
    *   username  账号
    *   password  密码
    */
    async getBanner(ctx) {

    }

    // 注册
    async register(ctx) {
        
    }
    // 登录
    async login(ctx) {
        
    }
    // user
    async getuser(ctx) {
        
    }
}

module.exports = new ApiControllers();