module.exports = {
    getAccessToken: `
        SELECT 
            wechat_value AS access_token,
            expires_in
        FROM
            w_chat_base
        WHERE
            wechat_key='access_token'
    `,
    saveAccessToken: `
        UPDATE
            w_chat_base
        SET
            wechat_value=?,
            expires_in=?,
            update_time=NOW()
        WHERE
            wechat_key='access_token'
    `,
    // 获取ticket
    getTicket: `
        SELECT 
            wechat_value AS ticket,
            expires_in
        FROM
            w_chat_base
        WHERE
            wechat_key='ticket'
    `,
    // 更新ticket
    saveTicket: `
        UPDATE
            w_chat_base
        SET
            wechat_value=?,
            expires_in=?,
            update_time=NOW()
        WHERE
            wechat_key='ticket'
    `,
    // 根据回复查找回复内容
    getReplyFromBase: `
        SELECT 
            *
        FROM
            w_chat_relpy
        WHERE 
            del_flag=0 AND reply_from=?
    `,

    /*
    *   以下为管理端的查询
    */
    getALLReply: {
        base: `
            SELECT
                id,
                reply_from AS replyFrom,
                reply_to AS replyTo,
                type,
                title,
                description,
                music_url AS musicUrl,
                media_id As mediaId,
                pic_url AS picUrl,
                url,
                del_flag AS delFlag,
                Date_Format(update_time,'%Y-%m-%d') AS update_time
            FROM
                w_chat_relpy
        `,
        limit: `
            ORDER BY 
                id 
            DESC
            LIMIT 
                ? OFFSET ? 
        `
    },
    // 添加回复策略
    publicWechatReply: `
        INSERT INTO
            w_chat_relpy
            (
                reply_from,
                reply_to,
                type,
                title,
                description,
                pic_url,
                url,
                del_flag,
                create_time,
                update_time,
                media_id,
                music_url
            )
        VALUES
            (?,?,?,?,?,?,?,0,NOW(),NOW(),null,null)
    `,
    // 修改回复策略 replyFrom, replyTo, type, title, description, picUrl, url, musicUrl, mediaId, delFlag, id
    modifyWechatReply: `
        UPDATE
            w_chat_relpy
        SET
            reply_from=?,
            reply_to=?,
            type=?,
            title=?,
            description=?,
            pic_url=?,
            url=?,
            music_url=?,
            media_id=?,
            del_flag=?,
            update_time=NOW()
        WHERE
            id=?
    `,
    queryFromReply: `
            SELECT 
                reply_from 
            FROM
                w_chat_relpy  
            WHERE
                reply_from=?
    `
}