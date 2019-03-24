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
    /*
    *   查询首页数据
    */
    getIndex: {
        spikeList: `
            SELECT 
                spike_id AS id, 
                spike_name AS name, 
                Date_Format(spike_start_time,'%Y-%m-%d %H:%i:%s') as startTime, 
                Date_Format(spike_end_time,'%Y-%m-%d %H:%i:%s') as endTime, 
                spike_type AS type, 
                spike_img AS img, 
                spike_place AS place 
            FROM 
                t_sys_spikelist
            WHERE
                spike_type=1 AND spike_place=1
            ORDER BY 
                spike_id
            `,
        caseList:`
            SELECT 
                caselist_author,
                caselist_id,
                caselist_img,
                caselist_pageview,
                caselist_recommend,
                caselist_title
            FROM 
                t_sys_caselist 
            WHERE
                caselist_recommend=1
            ORDER BY 
                caselist_id
        `
    },
    /*
    *   装修案例列表 
    */
   caseList: `
        SELECT 
            * 
        FROM 
            t_sys_caselist 
        WHERE
            caselist_recommend=0
        ORDER BY 
            caselist_id 
        DESC
        LIMIT 
            ? OFFSET ?`,
}