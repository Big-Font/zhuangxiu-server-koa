// wechat-lib/util.js

const Xml2Js = require('xml2js');
const Template = require('./tpl');
const Sha1 = require('sha1');

const ParseXML = xml => {
    return new Promise((resolve, reject)=>{
        Xml2Js.parseString(xml, {
            trim: true,
        }, (err, content)=>{
            if(err){
                reject(err);
            }else{
                resolve(content);
            }
        });
    });
};

const FormatMessage = content =>{
    let message = {};
    if("object" === typeof content){
        const Keys = Object.keys(content);
        for(let i = 0; i < Keys.length; i++){
            let key = Keys[i];
            let item = content[key];
            if(!(item instanceof Array) || 0===item.length){
                continue;
            }
            if(1===item.length){
                let val = item[0];
                if("object" === typeof val){
                    message[key] = FormatMessage(val);
                }else{
                    message[key] = (val || '').trim();
                }
            }else{
                message[key] = [];
                for(let j=0;j<item.length;j++){
                    message[key].push(FormatMessage(item[j]));
                }
            }
        }
    }
    return message;
};

const Tpl = (content, message)=>{
    let type = "text";
    if(Array.isArray(content)){
        type = 'news';
    }
    if(!content){
        content = "Empty News";
    }
    if(content && content.type){
        type = content.type;
    }
    let info = Object.assign({}, {
        content: content,
        msgType: type,
        createTime: new Date().getTime(),
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
    });
    return Template(info);
};

const createNonce = () => {
    return Math.random().toString(36).substr(2, 16);
};

const createTimestamp = () => {
    return parseInt(new Date().getTime() / 1000, 10) + '';
};

const signIt = (args) => {
    let keys = Object.keys(args).sort();
    let newArgs = {};
    let str = '';
    keys.forEach(key=>{
        newArgs[key.toLowerCase()] = args[key];
    });
    for(let k in newArgs){
        str += "&" + k + '=' + newArgs[k];
    }
    return str.substr(1);
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

const Sign = (ticket, url) => {
    let noncestr = createNonce();
    let timestamp = createTimestamp();
    let signature = shaIt(noncestr, ticket, timestamp, url);
    return {
        noncestr,
        timestamp,
        signature,
    };
};

module.exports = {
    ParseXML,
    FormatMessage,
    Tpl,
    Sign,
};