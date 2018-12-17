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