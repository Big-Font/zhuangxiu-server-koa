import { getJWTPayload } from '../lib/user';

/**
 * 判断token是否可用
 */
module.exports = function () {
    return async function (ctx, next) {
        // 获取jwt
        const token = ctx.header.authorization;
        if (!!token) {
            try {
                // 解密payload，获取用户名和ID
                let payload = await getJWTPayload(token)
                if (!!payload) {
                    ctx.user = {
                        phone: payload.phone, 
                        email: payload.email, 
                        username: payload.username,
                        userid: payload.userid
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