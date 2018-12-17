// import query from '../sql';
import { getJWTPayload } from '../config/user';

/* 
*   验证是否通过JWT验证，通过返回 true ，未通过返回 false 
*/
// async function allowJWTPass(ctx) {
//     console.log('进入jwt验证了')
//     return new Promise((resolve, rejects) => {
//         let users = query(`SELECT * FROM t_sys_user`);
//         console.log(users);
//         let payload = getJWTPayload(ctx.headers.authorization)
//         if(!payload) rejects()
//         if(payload.user === users[0].username) {
//             resolve(true)
//         }else {
//             resolve(false)
//         }
//     })
// }

// const unless = ['/api', '/api/login', '/api/register','/api/captchas', '/admin/captcha', '/admin/login', '/admin/articleList', '/admin/wangeditor/upload', '/admin/upload']

// let checkJWT = async (ctx, next) => {
//     if(unless.indexOf(ctx.url) !== -1) {
//         await next();
//     }else {
//         try{
//             const passJWT = await allowJWTPass(ctx);
//             if(!passJWT) {
//                 ctx.throw(401);
//             }
//             await next()
//         }catch(err) {
//             ctx.throw(401);
//         }
//     }
// }

//编写token验证中间件
// const jwt = require('jsonwebtoken');
// const util = require('util');
// import userModels from '../models/usertest.js'
// const verify = util.promisify(jwt.verify);
/**
 * 判断token是否可用
 */
module.exports = function () {
    return async function (ctx, next) {
        console.log('进入中间件验证')
        // 获取jwt
        const token = ctx.header.authorization;
        if (!!token) {
            try {
                // 解密payload，获取用户名和ID
                // let payload = await verify(token.split(' ')[1], 'lxPhone');
                let payload = await getJWTPayload(token)
                if (!!payload) {
                    ctx.user = {
                        username: payload.username,
                        password: payload.password
                    }
                } else {
                    console.log('解析出来的域账号不在数据库中')
                }
            } catch (err) {
                ctx.throw(401);
            }
        }
        await next();
    }
}