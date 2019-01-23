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
                phone
            FROM
                t_sys_workerlist AS a
            LEFT JOIN
                m_sys_user AS b
            ON
                a.userid=b.userid
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
                phone
            FROM
                t_sys_workerlist AS a
            LEFT JOIN
                m_sys_user AS b
            ON
                a.userid=b.userid
            WHERE
                ??=?
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
                phone
            FROM
                t_sys_workerlist AS a
            LEFT JOIN
                m_sys_user AS b
            ON
                a.userid=b.userid
            WHERE
                ??=? AND ??=?
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
                phone
            FROM
                t_sys_workerlist AS a
            LEFT JOIN
                m_sys_user AS b
            ON
                a.userid=b.userid
            WHERE
                ??=? AND ??=? AND ??=?
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
    }
}