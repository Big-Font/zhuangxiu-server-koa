import schedule from 'node-schedule';
import { query } from '../sql';
 
/*
*   开启定时任务
*   @params
*   fn    需要执行的任务
*   date  new Date(年，月，日，时，分，秒)
*/
export function createTask(fn, date) {
    console.log('定时任务函数执行了')
    schedule.scheduleJob(date, function(){  
        fn();  
    }); 
}