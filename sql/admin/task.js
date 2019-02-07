module.exports = {
    spikeActiveStartTask: `
        UPDATE 
            t_sys_spikelist
        SET 
            spike_type=2
        WHERE
            spike_uuid=?
    `,
    spikeActiveEndTask: `
        UPDATE 
            t_sys_spikelist
        SET 
            spike_type=3
        WHERE
            spike_uuid=?
    `,
    spikeInit: {
        allSpike: `
            SELECT 
                spike_id,
                Date_Format(spike_start_time,'%Y-%m-%d %H:%i:%s') as spike_start_time, 
                Date_Format(spike_end_time,'%Y-%m-%d %H:%i:%s') as spike_end_time, 
                spike_type,
                spike_uuid
            FROM 
                t_sys_spikelist
        `,
        spikeInitStart:  `
            UPDATE 
                t_sys_spikelist
            SET 
                spike_type=2
            WHERE
                spike_id=?
        `,
        spikeInitEnd: `
            UPDATE 
                t_sys_spikelist
            SET 
                spike_type=3
            WHERE
                spike_id=?
        `,
    },
    
}