module.exports = {
    queryUser: `
        SELECT 
            phone
        FROM
            m_sys_user
        WHERE
            phone=?
    `,
    createUser: `
        INSERT INTO
            m_sys_user
            (
                userid,
                username,
                pwd,
                phone,
                email,
                img,
                createTime
            )
        VALUES 
            (?,?,?,?,?,NOW())
    `,
    // 删除用户(仅用于注册失败回滚)
    deleteUser: `
        DELETE 
        FROM
            m_sys_user
        WHERE
            userid=?
    `
}