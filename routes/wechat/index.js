import WeichatControllers from '../../controllers/wechat';
import config from '../../config';
import { query } from '../../sql';
import wechatSQL from '../../sql/wechat';

const wechat = config[process.env.NODE_ENV].wechat;

const wechatCfg = Object.assign({}, wechat, {
    getAccessToken: async () => {
        const res = await query(wechatSQL.getAccessToken);
        console.log(res[0])
        return res[0];
    },
    saveAccessToken: async (data) => {
        console.log(`saveAccessToken传入的是： ${JSON.stringify(data)}`)
        const res = await query(wechatSQL.saveAccessToken, [data.access_token, data.expires_in]);
        return res;
    } 
});

;(async function() {
    const client = new WeichatControllers(wechatCfg);
})()