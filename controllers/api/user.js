import captchapng from 'svg-captcha';
import uuid from 'uuid';
import Redis from 'koa-redis';
import nodemail from 'nodemail';
import axios from '../../lib/axios';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import SQL from '../../sql/admin';
import M_USER_SQL from '../../sql/api/user';
import { getToken, getJWTPayload } from '../../lib/user';
import config from '../../config';
import { md5 } from '../../lib/md5';
import * as types from '../../lib/types';

class MUserControllers {
    /*
    *   邮箱验证码的发送
    */
    async mailVerify(ctx) {
        let { phone, email, } = ctx.request.body;
        const saveExpire = await Store.hget(`nodemail:${phone}`, 'expire');
        if(saveExpire && new Date().getTime() - saveExpire < 0) {
            ctx.error({msg: '验证请求过于频繁，请稍后再试'});
            return;
        } 
        // 发送邮件
        let conf = config[process.env.NODE_ENV];
        let transporter = nodemail.createTransport(conf.mailConfig);
        let ko = {
            code: conf.mail.code(),
            expire: conf.mail.expire(),
            email,
            phone
        }
        // 邮件中显示的内容
        let mailOptions = {
            from: `”认证邮件“<${phone}>`,
            to: ko.email,
            subject: `${types.FITUP_AUTHOR}在线注册码`,
            html: `尊敬的”${phone}“, 欢迎您在《${types.FITUP_AUTHOR}》中注册，您的验证码是 ${ko.code} ，有效期3分钟`
        }
        await transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                // 此处应该添加报警信息
                return console.log(error);
            }else {
                Store.hmset(`nodemail:${phone}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email);
            }
        });
        ctx.success({msg: '邮件已发送，可能会有延迟，验证码有效期3分钟'});
    }
    /*
    *   前端用户注册接口
    */
    async mUserRegister(ctx) {
        let { phone, password, email, code } = ctx.request.body;
        if(!phone) {
            ctx.error({msg: '请填写手机号'});
            return;
        }
        if(!password) {
            ctx.error({msg: '请填写密码'});
            return;
        }
        if(!mail) {
            ctx.error({msg: '请填写邮箱'});
            return;
        }
        if(!code) {
            ctx.error({msg: '请填写验证码'});
            return;
        }
        const saveCode = await Store.hget(`nodemail${phone}`, 'code');
        const saveExpire = await Store.hget(`nodemail${phone}`, 'expire');
        if(code === saveCode) {
            if(new Date().getTime() - saveExpire > 0) {
                ctx.error({msg: '验证码已过期， 请重新尝试'});
                return;
            }
        }else { 
            ctx.error({msg: '验证码错误，请填写正确的验证码'});
            return;
        }
        /*
        *   入库操作，依次执行  1.验证手机号是否被注册 2.入库 3.调登录接口
        */
        // 1.验证手机号是否被注册
        try{
            let res = await query(M_USER_SQL.queryUser, [phone]);
            if(res.length) {
                ctx.error({msg: '该手机号已被注册'});
                return;
            }
        }catch(err) {
                ctx.error({msg: err.message});
        }
        //  2.入库
        let userid = uuid.v1();
        password = md5(password + config[process.env.NODE_ENV].MD5_SUFFIX());
        try {
            let res = await query(M_USER_SQL.createUser, [userid, null, password, phone, email, null]);
            if(res){
                // 3.调登录服务
                let captcha = await axios.get('/api/captcha');
                let login = await axios.post('/api/login', {
                    capkey: ctx.session.cap,
                    phone,
                    password
                });
                if(login.data.code === 0) {
                    ctx.success({
                        msg: '恭喜您注册成功',
                        token: login.data.token
                    })
                }else {
                    // 登录失败，回滚删除用户
                    let errReg = await query(M_USER_SQL.deleteUser, [userid]);
                    ctx.error({msg: '注册失败，请重新尝试'});
                }
            }
        }catch(err) {
            ctx.error({msg: error.message});
        }
    }
    /*
    *    前端用户登录接口
    */
    async mUserLogin(ctx) {

    }
    /*
    *     前端用户个人信息修改接口
    */
    async mUserInfo(ctx) {
        
    }
}

module.exports = new MUserControllers();
