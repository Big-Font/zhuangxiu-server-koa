module.exports = {
    /*
    *   根据id查询uuid
    */ 
    queryById: `
        SELECT
            caselist_uuid AS uuid
        FROM
            t_sys_caselist
        WHERE
            caselist_id=?
    `,
    fitupDetail: `
        SELECT 
            a.caselist_id AS id,
            caselist_title AS title, 
            caselist_author AS author, 
            caselist_recommend AS recommend, 
            caselist_img AS img, 
            caselist_pageview AS pageview,
            fitupcase_content AS content,
            area,
            apartment,
            spend,
            style,
            company,
            label, 
            Date_Format(fitupcase_create_time,'%Y-%m-%d') AS create_time, 
            Date_Format(fitupcase_update_time,'%Y-%m-%d') AS update_time
        FROM 
            t_sys_caselist AS a
        LEFT JOIN
            t_sys_fitupcase AS b
        ON
            a.caselist_uuid=b.caselist_uuid
        WHERE
            a.caselist_uuid=?
    `,
}