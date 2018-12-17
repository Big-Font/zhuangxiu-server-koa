import captchapng from 'svg-captcha';
import { query } from '../../sql';
import { getToken, getJWTPayload } from '../../config/user';

class AdminControllers {
    /*
    *   图形验证码接口
    */
    async captcha(ctx) {
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
    /*
    *   登录接口
    */
    async login(ctx) {
        let {capkey, username, password} = ctx.request.body;
        console.log(capkey, ctx.session.usernam)
        if(capkey === ctx.session.usernam){
            ctx.body = {
                code: 0,
                msg: '登录成功',
                token: getToken({ username: 'aaa', password: '123456' })
            }
        }else{
            ctx.body = {
                code: -1,
                msg: '验证码错误',
            }
        }
    }
    /*
    *   获取资讯列表接口
    */
   async getList(ctx) {
        let results;
        try {
            results = await query(`SELECT * FROM t_sys_articlelist`)
        }catch(err) {
            ctx.body = {
                code: -1,
                msg: err.message
            }
        }
        ctx.body = {
            code: 0,
            list: JSON.parse(JSON.stringify(results))
        }
   }
    /*
    *   发布资讯列表接口
    */
   async articlePublish(ctx) {
        console.log('======》',ctx.user, ctx.request.user)
        ctx.body = {
            code: 0,
            msg: '发布成功',
            user: ctx.user.username,
            password: ctx.user.password
        }
   }
}

module.exports = new AdminControllers();