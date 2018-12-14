import jwt from 'jsonwebtoken';
import config from './index';

/* 
*   获取一个期限为4小时的token 
*/
export function getToken(payload = {}) {
    return jwt.sign(payload, config[process.env.NODE_ENV].secret, { expiresIn: '24h' });
}

/* 
*   通过token获取JWT的payload部分 
*/
export function getJWTPayload(token) {
    // 验证并解析JWT
    return jwt.verify(token.split(' ')[1], config[process.env.NODE_ENV].secret);
}