import captchapng from 'svg-captcha';
import uuid from 'uuid';
// import Store from '../../lib/store';
import Redis from 'koa-redis';
import nodeMailer from 'nodemailer';
import axios from '../../lib/axios';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import SQL from '../../sql/admin';
import M_USER_SQL from '../../sql/api/user';
import { getToken, getJWTPayload } from '../../lib/user';
import config from '../../config';
import { md5 } from '../../lib/md5';
import { hidePhone } from '../../lib';
import * as types from '../../lib/types';

let Store = new Redis().client;

class MUserControllers {
    /*
    *   邮箱验证码的发送
    *   @params  phone  手机号
    *   @params  email  邮箱
    */
    async mailVerify(ctx) {
        let { phone, email } = ctx.request.body;
        const saveExpire = await Store.hget(`nodemail${email}${phone}`, 'expire');
        if(saveExpire && new Date().getTime() - saveExpire < 0) {
            ctx.error({msg: '验证请求过于频繁，请稍后再试'});
            return;
        } 
        // 发送邮件
        let conf = config[process.env.NODE_ENV];
        let transporter = nodeMailer.createTransport(conf.mailConfig);
        let ko = {
            code: conf.mail.code(),
            expire: conf.mail.expire(),
            email,
            phone
        }
        // 邮件中显示的内容
        let mailOptions = {
            from: `”认证邮件“<${conf.mailConfig.auth.user}>`,
            to: ko.email,
            subject: `${types.FITUP_AUTHOR}在线注册码`,
            html: `尊敬的”${ko.phone}“, 欢迎您在《${types.FITUP_AUTHOR}》中注册，您的验证码是 ${ko.code} ，有效期3分钟`
        }
        await transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                // 报警信息
                return console.log(error)
            }else {
                console.log(`注册邮件发送成功：${mailOptions.to}`, `nodemail${email}${phone}`)
                Store.hmset(`nodemail${mailOptions.to}${phone}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email);
            }
        })
        ctx.success({msg: '邮件已发送，可能会有延迟，验证码有效期3分钟'});
    }
    /*
    *   前端用户注册接口
    *   @params   phone    手机号
    *   @params   password 登录密码
    *   @params   email    接收验证码的邮箱
    *   @params   code     邮箱接收到的验证码 
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
        if(!email) {
            ctx.error({msg: '请填写邮箱'});
            return;
        }
        if(!code) {
            ctx.error({msg: '请填写验证码'});
            return;
        }
        const saveCode = await Store.hget(`nodemail${email}${phone}`, 'code');
        const saveExpire = await Store.hget(`nodemail${email}${phone}`, 'expire');
        console.log(`saveCode:${saveCode},code:${code},saveExpire:${saveExpire}`)
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
            let res = await query(M_USER_SQL.queryUser, [phone, email]);
            if(res.length) {
                ctx.error({msg: '该手机号或邮箱已被注册'});
                return;
            }
        }catch(err) {
                ctx.error({msg: err.message});
                return;
        }
        //  2.入库
        let userid = uuid.v1();
        let pwd = md5(password + config[process.env.NODE_ENV].MD5_SUFFIX());
        // 事务处理 用户表、用户信息表同时添加
        let sqlArr = []; 
        sqlArr.push(_getNewSqlParamEntity(M_USER_SQL.createUser, [userid, null, pwd, phone, email, null]));
        sqlArr.push(_getNewSqlParamEntity(M_USER_SQL.createUserInfo, [userid]));
        try {
            let res = await execTrans(sqlArr)
            // 3.调登录服务
            let login = await axios.post('/api/v1/login', {
                    capkey: ctx.session.cap,
                    phone,
                    password,
                    isServer: 1
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
        }catch(err) {
            ctx.error({msg: err.message});
        }
    }
    /*
    *   图形验证码接口
    */
    async captcha(ctx) {
        const cap = captchapng.create({
            size: 4,
            ignoreChars: '0oli',
            noise: 2,
            color: true,
            background: '#fff'
        })
        console.log('=======>',ctx.session);
        ctx.session.cap = cap.text.toLocaleLowerCase();
        ctx.response.type ='svg';
        ctx.body = cap.data;
    }
    /*
    *   前端用户登录接口
    *   @params  capkey    图形验证码
    *   @params  phone     手机号
    *   @params  password  登录密码
    *   @params  isServer  是否是服务端调用(非必填)
    */
    async mUserLogin(ctx) {
        console.log(`图形验证码是：${ctx.session.cap}`);
        let { phone, password, capkey, isServer } = ctx.request.body;
        if(!phone) {
            ctx.error({msg: '手机号不能为空'});
            return;
        }
        if(!password) {
            ctx.error({msg: '密码不能为空'});
            return;
        }
        if(!isServer) {
            if(!capkey) {
                ctx.error({msg: '验证码不能为空'});
                return;
            }
            if(capkey.toLocaleLowerCase() !== ctx.session.cap) {
                ctx.error({msg: '验证码错误'});
                return;
            }
        }
        
        password = md5(password + config[process.env.NODE_ENV].MD5_SUFFIX());

        try{
            let hasUser = await query(M_USER_SQL.queryUserInfo, [phone]);
            if(!hasUser.length) {
                ctx.error({msg: '登录失败，无此用户'});
                return;
            }else if(hasUser[0].pwd !== password){
                ctx.error({msg: '登录失败，密码错误'});
                return;
            }else {
                ctx.session.userid = hasUser[0].userid;
                console.log(`session中存储的userid是：${ctx.session.userid}`);
                ctx.success({
                    msg: '登录成功',
                    token: getToken({userid: hasUser[0].userid, phone: hasUser[0].phone, email: hasUser[0].email, username: hasUser[0].username})
                })
            }
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
    }
    /*
    *     获取前端用户个人信息接口
    */
    async getmUserInfo(ctx) {
        let userid = ctx.user.userid;
        console.log(ctx.user)
        console.log(`当前用户是:${ctx.user.username}, 当前用户userid是：${userid}`);
        try{
            let res = await query(M_USER_SQL.getmUserInfo, [userid]);
            let data = res.length ? res[0] : {};
            if(data.phone != null) data.phone =  hidePhone(data.phone);
            // if(data.name != null) data.name = 
            ctx.success({
                msg: '查询成功',
                data
            })
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
    }
    /*
    *     前端用户个人信息修改接口
    *     @params  sex, age, address, name, username, phone, email, img
    */
    async modeifymUserInfo(ctx) {
        let { sex, age, address, name, username, phone, email, img } = ctx.request.body;
        let userid = ctx.user.userid;

        if(!phone) {
            ctx.error({msg: '手机号不能为空!'});
            return;
        }
        if(!email) {
            ctx.error({msg: '邮箱不能设置为空!'});
            return;
        }

        try{
            let res = query(M_USER_SQL.modeifymUserInfo, [sex, age, address, name, username, phone, email, img, userid, userid]);
            ctx.success({msg: '用户个人心修改成功'});
        }catch(err) {
            ctx.error({msg: err.error});
            return;
        }

    }
    /*
    *     后台管理用户列表
    */
    async mUserList(ctx) {
        let { page, phone, username, name } = ctx.request.body;
        let queryValues = [], values = [],pageValues = [], sql, page_num, total_page; 
        if(!!phone) {
            values.push('phone');
            values.push(`%${phone}%`);
        }
        if(!!username) {
            values.push('username');
            values.push(`%${username}%`);
        }
        if(!!name) {
            values.push('name');
            values.push(`%${name}%`);
        }

        if(values.length === 6) {
            sql = M_USER_SQL.queryUserListThree;
        }else if(values.length === 4) {
            sql = M_USER_SQL.queryUserListTwo;
        }else if(values.length === 2) {
            sql = M_USER_SQL.queryUserListOne;
        }else {
            sql = M_USER_SQL.queryUserListAll;
        }

        try{
            let res = await sqlPage(page, sql, values);
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
            page = res.page;
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }

        // start end 
        queryValues = values.concat(pageValues);

        try{
            let list = await query(sql, queryValues);
            ctx.success({
                msg: '查询成功',
                total_page,
                page,
                list,
            })
        }catch(err) {
    ctx.error({msg: err.message})
        }
    }
}

module.exports = new MUserControllers();
