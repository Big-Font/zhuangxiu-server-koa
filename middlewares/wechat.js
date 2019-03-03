/*
*   微信相关中间件
*/
import sha1 from 'sha1';
import getRawBody from 'raw-body';
import { parseXML, formatMessage, reply2xml } from '../lib/xml';

//  reply  回复策略
module.exports = (config, reply) => {
    return async (ctx, next) => {
        const { signature, timestamp, nonce, echostr } = ctx.query;
        const token = config.token;
        let str = [token, timestamp, nonce].sort().join('');
        const sha = sha1(str);

        if(ctx.method === 'GET') {
            if(sha === signature) {
                ctx.body = echostr;
            }else {
                ctx.body = 'wechat err';
            }
        }else if(ctx.method === 'POST'){
            if(sha !== signature) {
                return (ctx.body = 'wechat file');
            }

            const data = await getRawBody(ctx.req, {
                length: ctx.length,
                limit: '2mb',
                encoding: ctx.charset
            })

            const content = await parseXML(data);
            const message = formatMessage(content.xml);
            ctx.weixin = message;
            
            await reply.apply(ctx, [ctx, next]);

            const replyBody = ctx.body;
            const msg = ctx.weixin;
            const xml = reply2xml(replyBody, msg);

            ctx.status = 200;
            ctx.type = 'application/xml';
            ctx.body = xml;
            // `<xml>
            //     <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
            //     <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
            //     <CreateTime>${parseInt(new Date().getTime() / 1000, 0)}</CreateTime>
            //     <MsgType><![CDATA[text]]></MsgType>
            //     <Content><![CDATA[${message.Content}]]></Content>
            //     <MsgId>1234567890123456</MsgId>
            // </xml>`
        }
    }
}