import schedule from 'node-schedule';
import moment from 'moment';
import { query } from '../sql';
import SQL from '../sql/admin/task';
import $Date_Format from './dateFormat';
 
/*
*   开启定时任务
*   @params
*   fn    需要执行的任务
*   date  new Date(年，月，日，时，分，秒) 
*/
export function createTask(fn, date, id) {
    console.log('定时任务函数执行了')
    schedule.scheduleJob(date, function(){  
        fn(id);  
    }); 
}


/*
*   初始化定秒杀活动表，用于服务器重启时执行
*   判断秒杀活动表中 活动开始时间小于当前时间 的活动，并进行批量处理，  res = [{uuid, start_time, end_time, date},{uuid}, {uuid}]
*   同时根据结束时间 开启结束活动的定时活动
*/
export async function batchProcessTask() {
    // 进行中
    async function initSpikeStart(id) {
        try {
            let start = await query(SQL.spikeInit.spikeInitStart, [id]) 
        }catch(e) {
            console.log(`===> 定时活动开启失败， 活动uuid：${id}`)
        }
    }
    // 已结束
    async function initSpikeEnd(id) {
        try{
            let end = await query(SQL.spikeInit.spikeInitEnd, [id])
        }catch(e) {
            console.log(`===> 定时活动结束失败， 活动uuid：${id}`)
        }
    }
    // 未开始
    async function initSpikePrepare(id) {
        try{
            let end = await query(SQL.spikeInit.spikeInitPrepare, [id])
        }catch(e) {
            console.log(`===> 定时活动结束失败， 活动uuid：${id}`)
        }
    }
    return new Promise( async (resolve, rejects) => {
        try{
            let res = await query(SQL.spikeInit.allSpike);
            // 获取当前时间
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log(now)
            for(let i = 0; i< res.length; i++) {
                console.log(`数据库中第${i}个的开始时间是 ${res[i].spike_start_time} ,结束时间是 ${res[i].spike_end_time} , ${moment(res[i].spike_start_time).isBefore(now) && moment(res[i].spike_end_time).isAfter(now)} , ${moment(res[i].spike_end_time).isBefore(now)}`)
                if(moment(res[i].spike_start_time).isBefore(now) && moment(res[i].spike_end_time).isAfter(now)) {
                    // 进行中   spike_start_time 大于 当前时间  并且 spike_end_time 小于当前时间
                    // type 设置为 1 开启结束定时任务
                    console.log('进行中的',res[i].spike_start_time)
                    await initSpikeStart(res[i].spike_id);
                    // await initSpikeStart(res[i].spike_id);
                    createTask(initSpikeEnd, $Date_Format.date2task(res[i].spike_end_time), res[i].spike_id);
                }else if(moment(res[i].spike_end_time).isBefore(now)){
                    // 已结束   spike_end_time 小于当前时间 
                    // type 设置为 2
                    console.log('已结束的',res[i].spike_start_time)
                    await initSpikeEnd(res[i].spike_id);
                }else {
                    // 未开始   spike_start_time 大于 当前时间 ---- 开启定时任务
                    // type 设置为 3 开启两个定时任务
                    console.log('定时任务的',res[i].spike_start_time)
                    await initSpikePrepare(res[i].spike_id);
                    createTask(initSpikeStart, $Date_Format.date2task(res[i].spike_start_time), res[i].spike_id);
                    createTask(initSpikeEnd, $Date_Format.date2task(res[i].spike_end_time), res[i].spike_id);
                }
                // if(new Date(res[i].spike_end_time) < new Date() ) {
                //     // 结束时间小于当前时间，设置为已结束
                //     console.log('已结束的',res[i].spike_start_time)
                //     await initSpikeEnd(res[i].spike_id);
                // }else if(new Date(res[i].spike_start_time) < new Date()) {
                //     // 结束时间大于当前时间并且开始时间小于当前时间，设置为进行中
                //     console.log('进行中的',res[i].spike_start_time)
                //     await initSpikeStart(res[i].spike_id);
                // }else {
                //     // 结束时间大于当前时间，并且开始时间也大于当前时间，开启定时任务
                //     console.log('定时任务的',res[i].spike_start_time)
                //     createTask(initSpikeStart, $Date_Format.date2task(res[i].spike_start_time), res[i].spike_id);
                //     createTask(initSpikeEnd, $Date_Format.date2task(res[i].spike_end_time), res[i].spike_id);
                // } 
            }
            resolve(res);
        }catch(err) {
            console.log(`定时任务初始化启动失败：${err}`);
            rejects(err)
        }
    })
    
    
}