import xml2js from 'xml2js';
import template from './xml-template';
import Sha1 from 'sha1';

export function parseXML(xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, { trim: true}, (err, content) => {
            if(err) reject(err);
            resolve(content);
        })
    })
};

export function formatMessage(result) {
    let message = {};
    if(typeof result === 'object') {
        const keys = Object.keys(result);

        for(let i = 0; i < keys.length; i++) {
            let item = result[keys[i]];
            let key = keys[i]
            if(!(item instanceof Array) || item.length === 0) {
                continue;
            }

            if(item.length === 1) {
                let val = item[0];

                if(typeof val === 'object') {
                    message[key] = formatMessage(val);
                }else {
                    message[key] = (val || '').trim();
                }
            }else {
                message[key] = [];

                for(let j = 0; j < item.length; j++) {
                    message[key].push(formatMessage(item[j]));
                }
            }

        }
    }

    return message;
}

export function reply2xml(content, message) {
    let type = 'text';

    if(Array.isArray(content)) {
        type = 'news';
    }

    if(!content) content = 'Empty News';
    if(content && content.type) {
        type = contnet.type
    }

    let info = Object.assign({}, {
        content: content,
        msgType: type,
        createTime: new Date().getTime(),
        fromUserName: message.ToUserName,
        toUserName: message.FromUserName
    })

    return template(info);
}

// 生成随机字符串
const createNonce = () => {
    return Math.random().toString(36).substr(2, 16);
};

// 生成时间戳
const createTimestamp = () => {
    return parseInt(new Date().getTime() / 1000, 10) + '';
};

const shaIt = (noncestr, ticket, timestamp, url) => {
    const Ret = {
        jsapi_ticket: ticket,
        nonceStr: noncestr,
        timestamp: timestamp,
        url,
    };
    const Str = signIt(Ret);
    const Sha = Sha1(Str);
  
    return Sha;
};

// sdk 字典排序 
export function signIt(args) {
    let keys = Object.keys(args).sort();
    let newArgs = {};
    let str = '';

    keys.forEach( key => {
        newArgs[key.toLowerCase()] = args[key];
    });

    for(let k in newArgs){
        str += "&" + k + '=' + newArgs[k];
    }
    
    return str.substr(1);
};

// sdk加密签名的入口
export function sign(ticket, url) {
    // 依次生成 随机串、时间戳 并加密
    let noncestr = createNonce();
    let timestamp = createTimestamp();
    let signature = shaIt(noncestr, ticket, timestamp, url);

    return {
        noncestr,
        timestamp,
        signature,
    };
};