import captchapng from 'svg-captcha';
import uuid from 'uuid';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import SQL from '../../sql/admin';
import TASK_SQL from '../../sql/admin/task';
import { getToken, getJWTPayload } from '../../lib/user';
import config from '../../config';
import { md5 } from '../../lib/md5';
import { createTask } from '../../lib/task';
import $Date_Format from '../../lib/dateFormat';
import * as types from '../../lib/types';

class WorkerControllers {
    /*
    *   找师傅列表接口
    */
    async addWorkerMsg(ctx) {
        let {} = ctx.request.body;
        
    }
    /*
    *   找师傅列表接口
    */
    async gerWorkerList(ctx) {
        let { page } = ctx.request.body;
        // 分页
        let queryValues = [],pageValues = [], page_num, total_page;
        try{
            let res = await sqlPage(page, 't_sys_workerlist');
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
            page = res.page;
        }catch(err) {
            ctx.error({msg: err.message}); 
            return;
        }

        try {
            let results = await query(SQL.gerWorkerList.list, pageValues);
            ctx.success({
                page,
                total_page,
                list: results
            })
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
    }
}

module.exports = new WorkerControllers();