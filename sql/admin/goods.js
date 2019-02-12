module.exports = {
    categoryList: `
        SELECT
            s.id,
            s.pid,
            s.name
        FROM
            c_sp_genre as s
        LEFT JOIN
            c_sp_genre as p
        ON
            s.pid=p.id
    `,
    categoryList1: `
        SELECT 
            p.id,
            p.pid,
            p.name,
            s.name as type
        FROM 
            c_sp_genre as p 
        LEFT JOIN
            c_sp_genre as s
        ON
            s.pid=p.id
        ORDER BY
            p.name
    `
}