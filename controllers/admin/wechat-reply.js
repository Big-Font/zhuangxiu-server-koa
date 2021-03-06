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
    /*
    *   修改和删除回复策略
    */
    async modifyWechatReply(ctx) {
        let { id, replyFrom, replyTo, type, title, description, picUrl, url, musicUrl, mediaId, delFlag, } = ctx.request.body;
        if(!id) {
            ctx.error({msg: '微信消息回复策略id不能为空'});
            return;
        }
        if(!replyFrom) {
            ctx.error({msg: '用户发来的消息不能为空'});
            return;
        }
        if(type != 1 && type != 6) {
            type = 1;
        }
        if(type == 1 && !replyTo) {
            ctx.error({msg: '回复类型为文本类型时，回复文本不能设置为空'});
            return;
        }
        if(type == 6 && (!title || !description || !picUrl || !url)) {
            ctx.error({msg: '回复类型为回复链接时，回复的标题、描述、缩略图、链接地址均不能为空'});
            return;
        }

        try{
            let res = await query(wechatSQL.modifyWechatReply, [replyFrom, replyTo, type, title, description, picUrl, url, musicUrl, mediaId, delFlag, id]);
            ctx.success({msg: '微信回复策略修改成功'});
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }

    }
    /*
    *   添加回复策略
    */
    async publicWechatReply(ctx) {
        let { from, to, type, title, description, picUrl, url} = ctx.request.body;
        if(!from) {
            ctx.error({msg: '用户发来的消息不能为空'});
            return;
        }
        if(!type) {
            ctx.error({msg: '回复类型不能为空'});
            return;
        }
        console.log(type, typeof type, type != 1, type != 6)
        if(type != 1 && type != 6) {
            type = 1;
        }
        if(type == 1 && !to) {
            ctx.error({msg: '回复类型为文本类型时，回复文本不能设置为空'});
            return;
        }
        if(type == 6 && (!title || !description || !picUrl || !url)) {
            ctx.error({msg: '回复类型为回复链接时，回复的标题、描述、缩略图、链接地址均不能为空'});
            return;
        }

        try{
            let dataList = await query(wechatSQL.queryFromReply, [from]);
            if(dataList.length) {
                ctx.error({msg: `用户消息为 "${from}" 的消息已有已设定的回复，请去列表页进行修改操作!`});
                return;
            }
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
        
        try{
            let res = await query(wechatSQL.publicWechatReply, [from, to, type, title, description, picUrl, url ]);
            ctx.success({msg: '回复策略添加成功'})
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
    }

}

module.exports = new WechatReplyAdminControllers();