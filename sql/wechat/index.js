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
    `
}