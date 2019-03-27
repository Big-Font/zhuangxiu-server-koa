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
                    isOver 
                )
            VALUES
                (?,?,?,?,?,?,NOW(),?)     
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
        query:`
            SELECT 
                a.id,
                title,
                a.address,
                classify,
                type,
                a.createTime,
                isOver,
                username,
                phone,
                details,
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
            ORDER BY
                a.createTime
            DESC
            LIMIT
                ? OFFSET ?
        `,
        queryOne:`
            SELECT 
                a.id,
                title,
                a.address,
                classify,
                type,
                a.createTime,
                isOver,
                username,
                phone,
                details,
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
                ?? like ?
            ORDER BY
                a.createTime
            DESC
            LIMIT
                ? OFFSET ?
        `,
        queryTwo:`
            SELECT 
                a.id,
                title,
                a.address,
                classify,
                type,
                a.createTime,
                isOver,
                username,
                phone,
                details,
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
                ?? like ? AND ?? like ?
            ORDER BY
                a.createTime
            DESC
            LIMIT
                ? OFFSET ?
        `,
        queryThree:`
            SELECT 
                a.id,
                title,
                a.address,
                classify,
                type,
                a.createTime,
                isOver,
                username,
                phone,
                details,
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
                ?? like ? AND ?? like ? AND ?? like ?
            ORDER BY
                a.createTime
            DESC
            LIMIT
                ? OFFSET ?
        `,
        update: `
            UPDATE
                t_sys_workerlist 
            SET
                isOver=?
            WHERE
                uuid=?      
        `,
        uuid: `
            SELECT 
                uuid
            FROM
                t_sys_workerlist
            WHERE
                id=?
        `
    },
    // 查看用户当前发布的找师傅的状态列表
    getUserFindWorkerList: `
        SELECT
            l.id
            title,
            address,
            classify,
            type,
            createTime,
            isOver,
            imgs,
            details
        FROM
            t_sys_workerlist AS l
        JOIN
            t_sys_workers AS d
        ON
            l.uuid=d.uuid
        WHERE
            l.userid=?
        ORDER BY
            createTime
        DESC
    `
}