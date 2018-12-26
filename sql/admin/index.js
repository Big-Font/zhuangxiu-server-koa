module.exports = {
    /*
    *   后台管理登录接口
    */ 
    login: `
        SELECT 
            username, 
            password 
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
            * 
        FROM 
            t_sys_bannerlist 
        ORDER BY 
            banner_id 
        DESC`,
    /*
    *   banner添加接口
    */
    bannerPublic: `
        INSERT INTO 
            t_sys_bannerlist 
            (banner_url, 
            banner_path, 
            banner_update_time) 
        VALUES 
            (?, ?, NOW())`,
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
    *   发布装修案例 
    */
    fitupCasePublic: {
        detail: `
            INSERT INTO 
                t_sys_fitupcase 
                (caselist_uuid, 
                fitupcase_content, 
                fitupcase_create_time, 
                fitupcase_update_time) 
            VALUES 
                (?, ?, NOW(), NOW())`,
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
    *   修改装修案例
    */
   fitupcaseModify: {
        uuid: `
            SELECT 
                caselist_uuid 
            FROM 
                t_sys_caselist 
            WHERE 
                caselist_id=?`,
        detail: `
            UPDATE 
                t_sys_fitupcase 
            SET 
                fitupcase_content=?, 
                fitupcase_update_time=NOW() 
            WHERE 
                caselist_uuid=?`,
        list: `
            UPDATE 
                t_sys_caselist 
            SET 
                caselist_title=?, 
                caselist_author=?, 
                caselist_recommend=?, 
                caselist_img=? 
            WHERE 
                caselist_uuid=?`
   },

    /*
    *   秒杀活动查询 
    *   queryTwo    同时限制 spike_type 和 spike_place
    *   queryOne    只限制  spike_type 和 spike_place 其中一个
    *   queryALL    无限制
    */
    spikeActiveListSQL: {
        queryTwo: 
            `SELECT 
                spike_id, 
                spike_name, 
                Date_Format(spike_start_time,'%Y-%m-%d %H:%i:%s') as spike_start_time, 
                Date_Format(spike_end_time,'%Y-%m-%d %H:%i:%s') as spike_end_time, 
                spike_type, 
                spike_img, 
                spike_place 
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
                spike_id, 
                spike_name, 
                Date_Format(spike_start_time,'%Y-%m-%d %H:%i:%s') as spike_start_time, 
                Date_Format(spike_end_time,'%Y-%m-%d %H:%i:%s') as spike_end_time, 
                spike_type, 
                spike_img, 
                spike_place 
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
                spike_id, 
                spike_name, 
                Date_Format(spike_start_time,'%Y-%m-%d %H:%i:%s') as spike_start_time, 
                Date_Format(spike_end_time,'%Y-%m-%d %H:%i:%s') as spike_end_time, 
                spike_type, 
                spike_img, 
                spike_place 
            FROM 
                t_sys_spikelist
            ORDER BY 
                spike_id    
            DESC
            LIMIT 
                ? OFFSET ?`
    },
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
    }
}