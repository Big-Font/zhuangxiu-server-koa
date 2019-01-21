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
                id,
                title,
                address,
                classify,
                type,
                createTime,
                isOver,
                name,
            FROM
                t_sys_workerlist AS a
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