// export async function reply(ctx, next) {
exports.reply = async (ctx, next) => {
    const message = ctx.weixin;

    if(message.MsgType === 'text') {
        // 消息型文本
        let content = message.Content;
        let reply = `Oh,你说的'${content}'太复杂了，我听不懂诶！`;

        if(content === '王深') {
            reply = '这名字是你叫的么？'
        }else if(content === '258') {
            reply = '传说中最牛逼的班级';
        }

        ctx.body = reply;
    }

    await next();
}