import { query, sqlPage } from '../../sql';
import wechatSQL from '../../sql/wechat';

class WechatReplyAdminControllers {
    /*
    *   模糊搜索查找所有回复策略
    */
    async getALLReply(ctx) {
        let { from, to, type, title, page } = ctx.request.body;
        // 分页
        let queryValues = [], values = [],pageValues = [], sql, page_num, total_page, results;
        if(!page) {
            page = 1;
        }

        if(!!from) {
            values.push('reply_from');
            values.push(`%${from}%`);
        }
        if(!!to) {
            values.push('reply_to');
            values.push(`%${to}%`);
        }
        if(!!type) {
            values.push('type');
            values.push(`%${type}%`);
        }
        if(!!title) {
            values.push('title');
            values.push(`%${title}%`);
        }

        if(values.length === 8) {
            sql = `${wechatSQL.getALLReply.base} WHERE ?? like ? AND ?? like ? AND ?? like ? AND ?? like ?`;
        }else if(values.length === 6) {
            sql = `${wechatSQL.getALLReply.base} WHERE ?? like ? AND ?? like ? AND ?? like ? `;
        }else if(values.length === 4) {
            sql = `${wechatSQL.getALLReply.base} WHERE ?? like ? AND ?? like ? `;
        }else if(values.length === 2) {
            sql = `${wechatSQL.getALLReply.base} WHERE ?? like ? `;
        }else {
            sql = wechatSQL.getALLReply.base;
        }
        
        sql = `${sql} ${wechatSQL.getALLReply.limit}`; 

        try{
            let res = await sqlPage(page, sql, values);
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
        }catch(err) {
            ctx.error({msg: err.message}); 
            return;
        }

        queryValues = values.concat(pageValues);

        try{
            let list = await query(sql, queryValues);
            ctx.success({
                list,
                msg: '查询成功',
                total_page,
                page,
            })
            return;
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
    }
}

module.exports = new WechatReplyAdminControllers();