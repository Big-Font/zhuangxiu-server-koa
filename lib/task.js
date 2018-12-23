import schedule from 'node-schedule';
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
    async function initSpikeStart(id) {
        try {
            let start = await query(SQL.spikeInit.spikeInitStart, [id]) 
        }catch(e) {
            console.log(`===> 定时活动开启失败， 活动uuid：${id}`)
        }
    }
    async function initSpikeEnd(id) {
        try{
            let end = await query(SQL.spikeInit.spikeInitEnd, [id])
        }catch(e) {
            console.log(`===> 定时活动结束失败， 活动uuid：${id}`)
        }
    }
    return new Promise( async (resolve, rejects) => {
        try{
            let res = await query(SQL.spikeInit.allSpike);
            for(let i = 0; i< res.length; i++) {
                createTask(initSpikeStart, $Date_Format.date2task(res[i].spike_start_time), res[i].spike_id);
                createTask(initSpikeEnd, $Date_Format.date2task(res[i].spike_end_time), res[i].spike_id);
            }
            resolve(res);
        }catch(err) {
            console.log(`定时任务初始化启动失败：${err}`);
            rejects(err)
        }
    })
    
    
}