import captchapng from 'svg-captcha';
import uuid from 'uuid';
import { query } from '../../sql';
import { getToken, getJWTPayload } from '../../lib/user';
import config from '../../config';
import { md5 } from '../../lib/md5';

class AdminControllers {
    /*
    *   图形验证码接口
    */
    async captcha(ctx) {
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
            list: results
        })
   }
    /*
    *   后台管理 文章发布接口
    *   @params  
    *   title      文章标题
    *   author     文章作者
    *   content    文章内容
    */
   async articlePublish(ctx) {
        let {
            title,
            author,
            content
        } = ctx.request.body;
        console.log()
        if(!title){
            ctx.error({msg: '标题不能为空'});
            return;
        }else if(!author) {
            ctx.error({msg: '作者不能为空'});
            return;
        }else if(!content) {
            ctx.error({msg: '内容不能为空'});
            return;
        }
        const artUUID = uuid.v1();
        try{
            let articles = await query(`INSERT INTO t_sys_articlelist (artlist_uuid, artlist_title, artlist_author) VALUES ('${artUUID}','${title}', '${author}')`)
            try{
                let atticleList = await query(`INSERT INTO t_sys_articles ( artlist_uuid, articles_content, articles_create_time, articles_update_time) VALUES ('${artUUID}', '${content}', NOW(), NOW())`)
                ctx.success({msg: '文章发布成功'})
            }catch(error) {
                ctx.error({msg: error.message})
                return;
            }
        }catch(err) {
            ctx.error({msg: err.message})
        }
   }
   /*
   *   前台 获取文章详情
   *   @params  
   *   id      文章id
   */
    async getArticle(ctx) {
        let {id} = ctx.request.body;
        if(!id) {
            ctx.error({msg: '文章id不能为空'});
            return;
        }
        try{
            let result = await query(`SELECT artlist_id, artlist_title, artlist_author, artlist_recommend, articles_content, articles_update_time FROM t_sys_articlelist AS a LEFT JOIN t_sys_articles AS b ON a.artlist_uuid=b.artlist_uuid WHERE artlist_id='${id}'`);
            let resMsg = {};
            for(let key in result[0]) {
                resMsg[key.split('_')[1]] = result[0][key];
            }
            ctx.success({
                msg: '查询成功！',
                data: resMsg
            })
        }catch(err) {
            ctx.error({msg: err})
        }
    }
}

module.exports = new AdminControllers();