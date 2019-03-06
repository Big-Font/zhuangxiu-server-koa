import { query } from '../../sql';
import wechatSQL from '../../sql/wechat';

exports.reply = async (ctx, next) => {
    const message = ctx.weixin;

    if(message.MsgType === 'text') {
        // 消息型文本
        let content = message.Content;
        let reply = null;
        try{
            let data = await query(wechatSQL.getReplyFromBase, [content]);
            if(data.length) {
                let res = data[0];
                if(res.type == 1) {
                    reply = res.reply_to;
                }
                if(res.type == 6) {
                    reply = [{
                                type: 'news',
                                title: res.title,
                                description: res.description,
                                picUrl: res.pic_url,
                                url: res.url
                            }]
                }
            }else {
                // 数据库中无匹配的时候转发到 客服
                // message.MsgType = 'transfer_customer_service';
                // reply = {
                //     type: 'transfer_customer_service'
                // }
            }
        }catch(err) {
            console.log(err)
            reply =  '抱歉，服务出现问题';
        }

        if(reply == null) {
            reply = '抱歉，公众号目前联系不到客服，您可致电0312-xxxxxx联系我们';
        }

        // if(content === '王深') {
        //     reply = '这名字是你叫的么？'
        // }else if(content === '258') {
        //     reply = '传说中最牛逼的班级';
        // }else if(content === '设计图') {
        //     reply = [{
        //         type: 'news',
        //         title: '新东城',
        //         description: '晴睿装饰，用科技让装修更简单',
        //         picUrl: 'https://qingruiserver.wangshen.top/images/banner/0b87bab03a5011e98ad19582e02645980031c771-71bb-4978-8c45-9ab9f5e6c4e4.png',
        //         url: 'http://co.dabanjia.com/co/pano/viewer/111030/15Nd2Xtb'
        //     }]
        // }

        ctx.body = reply;
    }

    await next();
}