module.exports = {
    worker: {
        addlist: `
            INSERT INTO
                t_sys_workerlist
                (
                    uuid,
                    title,
                    userid,
                    address,
                    classify,
                    type,
                    createTime,
                    isOver,
                    phone
                )
            VALUES
                (?,?,?,?,?,?,NOW(),?,?)     
        `,
        addDetail: `
            INSERT INTO
                t_sys_workers
                (
                    uuid,
                    details,
                    imgs
                )
            VALUES
                (?,?,?)
        `,
    },
    queryAdminWorkerList: {
        sql: `
            SELECT 
                a.id,
                title,
                a.address,
                classify,
                type,
                a.createTime,
                isOver,
                username,
                a.phone,
                b.phone AS userPhone,
                details,
                a.ishurry,
                a.del_flag,
                imgs
            FROM
                t_sys_workerlist AS a
            LEFT JOIN
                m_sys_user AS b
            ON
                a.userid=b.userid
            LEFT JOIN
                t_sys_workers AS c
            ON
                a.uuid=c.uuid
            WHERE
                a.del_flag=0  
        `,
        filter:`
            ORDER BY
                a.createTime
            DESC
            LIMIT
                ? OFFSET ?
        `
    },
    // 查看用户当前发布的找师傅的状态列表
    getUserFindWorkerList: `
        SELECT
            l.id,
            title,
            address,
            phone,
            classify,
            type,
            createTime,
            isOver,
            ishurry,
            del_flag,
            imgs,
            details
        FROM
            t_sys_workerlist AS l
        JOIN
            t_sys_workers AS d
        ON
            l.uuid=d.uuid
        WHERE
            l.userid=? AND del_flag=0
        ORDER BY
            createTime
        DESC
    `,
    // 用户操作改变找师傅列表状态 (催单和删除)
    handleStatus: `
        UPDATE
            t_sys_workerlist
        SET
            ??=-1
        WHERE
            userid=? AND id=?
    `
}