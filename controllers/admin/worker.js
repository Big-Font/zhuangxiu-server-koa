import uuid from 'uuid';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import MWorkerSQL from '../../sql/api/worker';

class WorkerControllers {
    /*
    *   找师傅列表接口
    *   @params  page   页码
    *   @params  type   类型：1-安装，2-维修  0-全部
    *   @params  isOver 是否已经结束： 1-未结束，2-已结束  0-全部
    *   @params  phone  用户手机号
    */
    async getWorkerList(ctx) {
        let { page, type, isOver, phone } = ctx.request.body;
        let sqlValues = [], sql;
        // 处理查询参数
        if(type && type !== '0') {
            // 查询全部类型：1-安装，2-维修
            sqlValues.push('type');
            sqlValues.push(`%${type}%`)
        }
        if(isOver && isOver !== '0') {
            sqlValues.push('isOver');
            sqlValues.push(`%${isOver}%`);
        }
        if(!!phone) {
            sqlValues.push('phone');
            sqlValues.push(`%${phone}%`);
        }

        if(sqlValues.length === 2) {
            sql = MWorkerSQL.worker.queryOne;
        }else if(sqlValues.length === 4) {
            sql = MWorkerSQL.worker.queryTwo;
        }else if(sqlValues.length === 6) {
            sql = MWorkerSQL.worker.queryThree;
        }else {
            sql = MWorkerSQL.worker.query;
        }
        // 分页
        let queryValues = [],pageValues = [], page_num, total_page;
        try{
            let res = await sqlPage(page, sql, sqlValues);
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
            page = res.page;
        }catch(err) {
            ctx.error({msg: err.message}); 
            return;
        }

        let sqlParams = sqlValues.concat(pageValues);

        try {
            let results = await query(sql, sqlParams);
            results.forEach( item => {
                if(/\[/.test(item.imgs)) {
                    item.imgs = eval(item.imgs);
                    console.log(item.imgs, typeof item.imgs)
                }
            })
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
    *   @params id     找师傅列表的id
    *   @params state  isOver的状态  1--未结束  2--已结束
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
       if(state !== '1') {
           ctx.error({msg: '此条找师傅状态不是未结束'});
           return;
       }else {
           state = '2';
       }

       try{
            let res = await query(MWorkerSQL.worker.uuid, [id]);
            uuid = res[0].uuid;
            try{
                let modify = await query(MWorkerSQL.worker.update, [state, uuid]);
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