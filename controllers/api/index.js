import captchapng from 'svg-captcha';
import { getToken, getJWTPayload } from '../../config/user'

const user = {
    name: 'jason',
    password: '111111'
}

class ApiControllers {
    async hello(ctx) {
        ctx.body = {
            code: 1
        }
    }
    // 图形验证码
    async captchas(ctx) {
        console.log(ctx.session.views)
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
    // 注册
    async register(ctx) {
        const cap = captchapng.create({
            size: 4,
            ignoreChars: '0oli',
            noise: 4,
            color: true,
            background: '#fff'
        })
        ctx.session.usernam = cap.text;
        ctx.response.type ='svg';
        let session = ctx.session.usernam
        ctx.body = {
            code: 0,
            msg: '注册成功',
            session,
            token: getToken({ user: user.name, password: user.password })
        }
    }
    // 登录
    async login(ctx) {
        // const {user, password} = ctx.request.body;
        // console.log(user, password);
        ctx.body = {
            code: 0,
            msg: '登录成功',
            token: getToken({ user: 'aaa', password: '123456' })
        }
    }
    // user
    async getuser(ctx) {
        console.log('进入user接口了')
        // 前端访问时会附带token在请求头
        payload = getJWTPayload(ctx.headers.authorization)
        console.log(payload)

        if(payload.name == user.name && payload.password == user.password){
            ctx.body = {
                code: 1,
                msg: '身份验证成功',
                user: payload.name
            }
        }else {
            ctx.body = {
                code: -1,
                msg: '身份验证失败'
            }   
        }

        
    }
}

module.exports = new ApiControllers();