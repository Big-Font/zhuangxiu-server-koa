import uuid from 'uuid';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import MWorkerSQL from '../../sql/api/worker';

class WorkerControllers {
    /*
    *   客户端增加找师傅接口
    */
    async addWorkerMsg(ctx) {
        let {title,
            address,
            type,
            details,
            imgs
        } = ctx.request.body;
        if(!title) {
            ctx.error({msg: '标题不能为空'});
            return;
        }
        if(!address) {
            ctx.error({msg: '地址不能为空'});
            return;
        }
        if(!type) {
            ctx.error({msg: '类型不能为空'});
            return;
        }
        if(!details) {
            ctx.error({msg: '描述不能为空'});
            return;
        }
        if(!imgs) {
            imgs = '';
        }
        let userid = ctx.session.userid; isOver = 1, uuid = uuid.v1();
        let sqlArr = []; 
        sqlArr.push(_getNewSqlParamEntity(MWorkerSQL.worker.addlist, [uuid,title,userid,address,'1',type,'1']));
        sqlArr.push(_getNewSqlParamEntity(MWorkerSQL.worker.addDetail, [uuid, details, imgs]));
        try{
            let info = await execTrans(sqlArr);
            ctx.success({msg: '找师傅发布成功'});
        }catch(err) {
            ctx.error({msg: err});
        }
    }
}

module.exports = new WorkerControllers();