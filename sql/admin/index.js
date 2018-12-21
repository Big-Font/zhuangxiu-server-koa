module.exports = {

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
    }
}