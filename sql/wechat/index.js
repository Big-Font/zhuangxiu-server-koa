module.exports = {
    getAccessToken: `
        SELECT 
            wechat_value,
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
            wechat_value,
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
    // getALLReply:  `
    //     SELECT
    //         id,
    //         reply_from AS replyFrom,
    //         reply_to AS replyTo,
    //         type,
    //         title,
    //         description,
    //         music_url AS musicUrl,
    //         pic_url AS picUrl,
    //         url,
    //         del_flag AS delFlag,
    //         Date_Format(update_time,'%Y-%m-%d') AS update_time
    //     FROM
    //         w_chat_relpy
    // `
}