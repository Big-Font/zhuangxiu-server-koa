module.exports = {
    queryUser: `
        SELECT 
            phone,
            email
        FROM
            m_sys_user
        WHERE
            phone=? OR email=?
    `,
    /*
    *   查询前端用户用户信息
    */
    getmUserInfo: `
        SELECT
            b.phone,
            b.email,
            b.img,
            b.username,
            a.age,
            a.sex,
            a.address
        FROM
            m_sys_userinfo AS a
        JOIN
            m_sys_user AS b
        ON
            a.userid=b.userid
        WHERE
            a.userid=?
    `,
    /*
    *   修改前端用户个人信息  sex, age, address, name, username, phone, email, img
    */
    modeifymUserInfo: `
        UPDATE
            m_sys_userinfo AS a,
            m_sys_user AS b
        SET
            a.sex=?,
            a.age=?,
            a.address=?,
            a.name=?,
            b.username=?,
            b.phone=?,
            b.email=?,
            b.img=?
        WHERE
            a.userid=? AND b.userid=?
    `,
    queryUserInfo: `
        SELECT
            *
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
            (?,?,?,?,?,?,NOW())
    `,
    createUserInfo: `
        INSERT INTO
            m_sys_userinfo
            (
                userid,
                updateTime
            )
        VALUES
            (?, NOW())
    `,
    // 删除用户(仅用于注册失败回滚)
    deleteUser: `
        DELETE 
        FROM
            m_sys_user
        WHERE
            userid=?
    `,
    // 查询用户列表（后台管理)
    queryUserListAll: `
        SELECT
            a.id,
            a.userid,
            username,
            phone,
            email,
            img,
            Date_Format(createTime,'%Y-%m-%d') AS createTime,
            sex,
            age,
            address,
            name
        FROM
            m_sys_user AS a
        LEFT JOIN
            m_sys_userinfo AS b
        ON
            a.userid=b.userid
        ORDER BY
            createTime
        DESC
        LIMIT 
            ? OFFSET ? 
    `,
    queryUserListOne: `
        SELECT
            a.id,
            a.userid,
            username,
            phone,
            email,
            img,
            Date_Format(createTime,'%Y-%m-%d') AS createTime,
            sex,
            age,
            address,
            name
        FROM
            m_sys_user AS a
        LEFT JOIN
            m_sys_userinfo AS b
        ON
            a.userid=b.userid
        WHERE
            ?? like ?
        ORDER BY
            createTime
        DESC
        LIMIT 
            ? OFFSET ? 
    `,
    queryUserListTwo: `
        SELECT
            a.id,
            a.userid,
            username,
            phone,
            email,
            img,
            Date_Format(createTime,'%Y-%m-%d') AS createTime,
            sex,
            age,
            address,
            name
        FROM
            m_sys_user AS a
        LEFT JOIN
            m_sys_userinfo AS b
        ON
            a.userid=b.userid
        WHERE
            ??=? AND ??=?
        ORDER BY
            createTime
        DESC
        LIMIT 
            ? OFFSET ?  
    `,
    queryUserListThree: `
        SELECT
            a.id,
            a.userid,
            username,
            phone,
            email,
            img,
            Date_Format(createTime,'%Y-%m-%d') AS createTime,
            sex,
            age,
            address,
            name
        FROM
            m_sys_user AS a
        LEFT JOIN
            m_sys_userinfo AS b
        ON
            a.userid=b.userid
        WHERE
            ??=? AND ??=? AND ??=?
        ORDER BY
            createTime
        DESC
        LIMIT 
            ? OFFSET ? 
    `,
}