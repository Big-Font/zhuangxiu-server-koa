module.exports = {
    /*
    *   后台管理登录接口
    */ 
    login: `
        SELECT 
            username, 
            password,
            userid 
        FROM 
            t_sys_user 
        WHERE 
            username=?`,
    /*
    *   后台管理登录接口
    */
    getList: `
        SELECT * 
        FROM 
            t_sys_articlelist 
        ORDER BY 
            artlist_id 
        DESC 
        LIMIT 
            ? OFFSET ?`,
    /*
    *   后台管理 文章发布接口
    */
     articlePublish: {
        list: `
            INSERT INTO 
                t_sys_articlelist 
                    (artlist_uuid, 
                    artlist_title, 
                    artlist_author,
                    artlist_img) 
            VALUES  
            (?, ?, ?, ?)`,
        detail: `
            INSERT INTO 
                t_sys_articles 
                    ( artlist_uuid, 
                    articles_content, 
                    articles_create_time, 
                    articles_update_time) 
            VALUES 
                (?, ?, NOW(), NOW())`
    },
    /*
    *   获取文章详情
    */
    getArticle: `
        SELECT 
            artlist_id, 
            artlist_title, 
            artlist_author, 
            artlist_recommend, 
            articles_content, 
            articles_update_time,
            artlist_img 
        FROM 
            t_sys_articlelist AS a 
        LEFT JOIN 
            t_sys_articles AS b 
        ON 
            a.artlist_uuid=b.artlist_uuid 
        WHERE 
            artlist_id=?`,
    /*
    *   banner管理 -- banner 列表查询
    *   @params  
    *   
    */
    getBannerList: `
        SELECT 
            banner_id,
            banner_url,
            banner_path,
            banner_name,
            banner_type as type,
            banner_info_id as infoId,
            Date_Format(banner_update_time,'%Y-%m-%d %H:%i:%s') as banner_update_time
        FROM 
            t_sys_bannerlist 
        ORDER BY 
            banner_id 
        ASC`,
    /*
    *   banner添加接口
    */
    bannerPublic: `
        INSERT INTO 
            t_sys_bannerlist 
            (banner_url, 
            banner_path, 
            banner_name,
            banner_type,
            banner_info_id,
            banner_update_time) 
        VALUES 
            (?, ?, ?, ?, ? NOW())`
    ,
    /*
    *   banner修改接口
    */
    bannerModify: `
        UPDATE
            t_sys_bannerlist 
        SET
            banner_name=?,
            banner_url=?,
            banner_path=?,
            banner_type=?,
            banner_info_id=?,
            banner_update_time=NOW()
        WHERE
            banner_id=?
    `,
    /*
    *   装修案例列表 
    */
    caseList: `
        SELECT 
            * 
        FROM 
            t_sys_caselist 
        ORDER BY 
            caselist_id 
        DESC
        LIMIT 
            ? OFFSET ?`,
    /*
    *   装修案例列表查询（全部）
    */
    queryCaseDetail: `
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
        ORDER BY 
            a.caselist_id 
        DESC
        LIMIT 
            ? OFFSET ?   
    `,
    /*
    *   装修案例列表查询：一个模糊查询
    */
    queryCaseDetailOne: `
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
            ?? like ?
        ORDER BY 
            a.caselist_id 
        DESC
        LIMIT 
            ? OFFSET ?   
    `,
    /*
    *   装修案例列表查询：一个模糊查询
    */
    queryCaseDetailTwo: `
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
            ?? like ? AND ?? like ?
        ORDER BY 
            a.caselist_id 
        DESC
        LIMIT 
            ? OFFSET ?   
    `,
    /*
    *   装修案例列表查询：一个模糊查询
    */
    queryCaseDetailThree: `
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
            ?? like ? AND ?? like ? AND ?? like ?
        ORDER BY 
            a.caselist_id 
        DESC
        LIMIT 
            ? OFFSET ?   
    `,
    /*
    *   装修案例列表查询：一个模糊查询
    */
    queryCaseDetailFour: `
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
            ?? like ? AND ?? like ? AND ?? like ? AND ?? like ?
        ORDER BY 
            a.caselist_id 
        DESC
        LIMIT 
            ? OFFSET ?   
    `,  
    /*
    *   装修案例列表查询：一个模糊查询
    */
    queryCaseDetailFive: `
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
            ?? like ? AND ?? like ? AND ?? like ? AND ?? like ? AND ?? like ?
        ORDER BY 
            a.caselist_id 
        DESC
        LIMIT 
            ? OFFSET ?   
    `, 
    /*
    *   发布装修案例 
    */
    fitupCasePublic: {
        detail: `
            INSERT INTO 
                t_sys_fitupcase 
                (
                    caselist_uuid, 
                    fitupcase_content,
                    area,
                    apartment,
                    spend,
                    style,
                    company,
                    label,
                    fitupcase_create_time, 
                    fitupcase_update_time
                ) 
            VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        list: `
            INSERT INTO 
                t_sys_caselist 
                (caselist_uuid, 
                caselist_title, 
                caselist_author, 
                caselist_recommend, 
                caselist_img, 
                caselist_pageview) 
            VALUES 
                (?, ?, ?, ?, ?, ?)`
    },
    /*
    *   修改装修案例   title, author, recommend, img,pageview, content, spend, style, area, apartment, company
    */
    fitupcaseModify: `
        UPDATE
            t_sys_caselist as l
        JOIN
            t_sys_fitupcase AS d
        ON
            l.caselist_uuid=d.caselist_uuid
        SET
            l.caselist_title=?,
            l.caselist_author=?,
            l.caselist_recommend=?,
            l.caselist_img=?,
            l.caselist_pageview=?,
            d.fitupcase_content=?,
            d.spend=?,
            d.style=?,
            d.area=?,
            d.apartment=?,
            d.company=?, 
            d.fitupcase_update_time=NOW()
        WHERE
            l.caselist_id=?
    `,
    /*
    *   秒杀活动查询 
    *   queryTwo    同时限制 spike_type 和 spike_place
    *   queryOne    只限制  spike_type 和 spike_place 其中一个
    *   queryALL    无限制
    */
    spikeActiveListSQL: {
        queryTwo: 
            `SELECT 
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
                ??=? AND ??=?
            ORDER BY 
                spike_start_time 
            DESC
            LIMIT 
                ? OFFSET ?`,
        queryOne: 
            `SELECT 
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
                ??=?
            ORDER BY 
                spike_start_time
            DESC
            LIMIT 
                ? OFFSET ?`,
        queryALL: 
            `SELECT 
                spike_id AS id, 
                spike_name AS name, 
                Date_Format(spike_start_time,'%Y-%m-%d %H:%i:%s') as startTime, 
                Date_Format(spike_end_time,'%Y-%m-%d %H:%i:%s') as endTime, 
                spike_type AS type, 
                spike_img AS img, 
                spike_place AS place 
            FROM 
                t_sys_spikelist
            ORDER BY 
                spike_id    
            DESC
            LIMIT 
                ? OFFSET ?`
    },
    /*
    *   根据id查询秒杀活动详情
    */
    querySpikeDetail: `
        SELECT
            a.spike_id AS id,
            a.spike_name AS name, 
            Date_Format(a.spike_start_time,'%Y-%m-%d %H:%i:%s') as startTime, 
            Date_Format(a.spike_end_time,'%Y-%m-%d %H:%i:%s') as endTime,  
            a.spike_img AS img, 
            a.spike_place AS place,
            b.spike_stock AS stock, 
            b.spike_seller AS seller, 
            b.spike_goods AS goods, 
            b.spike_activity AS activity, 
            b.spike_price AS price,
            a.spike_type AS type
        FROM
            t_sys_spikelist as a
        JOIN
            t_sys_spikes as b
        on 
            a.spike_uuid=b.spike_uuid
        WHERE
            a.spike_id=?
    `,
    /*
    *   添加限时秒杀活动
    */
    spikeActivePublish: {
        list: `
            INSERT INTO 
                t_sys_spikelist 
                (spike_uuid,
                spike_name, 
                spike_start_time, 
                spike_end_time, 
                spike_update_time, 
                spike_type, 
                spike_img, 
                spike_place) 
            VALUES  
                (?, ?, ?, ?, NOW(), 3, ?, ?)`,
        detail: `
            INSERT INTO 
                t_sys_spikes 
                (spike_uuid,
                spike_stock, 
                spike_seller, 
                spike_goods, 
                spike_activity, 
                spike_price) 
            VALUES 
                (?, ?, ?, ?, ?, ?)`
    },
    /*
    *   修改限时秒杀活动
    */
    modifySpikeActive: `
        UPDATE
            t_sys_spikelist AS a
        LEFT JOIN
            t_sys_spikes AS b
        ON
            a.spike_uuid=b.spike_uuid
        SET
            a.spike_name=?, 
            a.spike_start_time=?, 
            a.spike_end_time=?, 
            a.spike_img=?, 
            a.spike_place=?,
            b.spike_stock=?, 
            b.spike_seller=?, 
            b.spike_goods=?, 
            b.spike_activity=?, 
            b.spike_price=?,
            a.spike_type=?,
            a.spike_update_time=NOW()
        WHERE
            a.spike_id=?
    `
}