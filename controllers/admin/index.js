import captchapng from 'svg-captcha';
import { query } from '../../sql';
import { getToken, getJWTPayload } from '../../lib/user';
import config from '../../config';
import { md5 } from '../../lib/md5';

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
    *   后台管理登录接口
    *   @params  
    *   username  账号
    *   password  密码
    *   capkey  图形验证码
    */
    async login(ctx) {
        let {capkey, username, password} = ctx.request.body;
        console.log(capkey, ctx.session.usernam)
        password = md5(password + config[process.env.NODE_ENV].MD5_SUFFIX());
        if(capkey.toLocaleLowerCase() !== ctx.session.usernam) {
            ctx.error({msg: '验证码错误'})
            return;
        }

        try{
            let hasUser = await query(`SELECT username, password FROM t_sys_user WHERE username='${username}'`)
            console.log(hasUser[0].password, password, hasUser[0].password !== password)
            if(hasUser.length === 0) {
                ctx.error({msg: '登录失败,用户名错误'})
                return;
            }else if(hasUser[0].password !== password) {
                ctx.error({msg: '登录失败，密码错误'})
                return;
            }else {
                ctx.success({
                    msg: '登录成功',
                    token: getToken({username: hasUser.user}), 
                    user: username
                })
                return;
            }
        }catch(err) {
            ctx.error({msg: err})
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
            ctx.error({msg: err.message});
            return;
        }
        ctx.success({
            code: 0,
            list: JSON.parse(JSON.stringify(results))
        })
   }
    /*
    *   发布资讯列表接口
    */
   async articlePublish(ctx) {
        ctx.body = {
            code: 0,
            msg: '发布成功',
            user: ctx.user.username,
            password: ctx.user.password
        }
   }
}

module.exports = new AdminControllers();