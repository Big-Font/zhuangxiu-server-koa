import uuid from 'uuid';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import MWorkerSQL from '../../sql/api/worker';

class WorkerControllers {
    /*
    *   找师傅列表接口
    */
    async getWorkerList(ctx) {
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
            let results = await query(MWorkerSQL.worker.query, pageValues);
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
    /*
    *   找师傅接口状态更改
    */
   async modifyWorker(ctx) {
       let {id, state} = ctx.request.body;
       let uuid;
       if(!id) {
           ctx.error({msg: 'id不能为空'});
           return;
       }
       if(!state) {
           ctx.error({msg: '状态不能为空'});
           return;
       }

       try{
            let res = await query(MWorkerSQL.worker.uuid, [id]);
            uuid = res[0].uuid;
            try{
                let modify = await query(MWorkerSQL.worker.update, [type, state]);
                ctx.success({msg: '修改成功'});
            }catch(e) {
                ctx.error({msg: e.message});
            }
       }catch(err) {
            ctx.error({msg: err.message});
       }
   }
}

module.exports = new WorkerControllers();