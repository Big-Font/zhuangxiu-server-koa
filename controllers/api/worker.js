import uuid from 'uuid';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import MWorkerSQL from '../../sql/api/worker';
import { getJWTPayload } from '../../lib/user';

class WorkerControllers {
    /*
    *   客户端发布找师傅接口
    *   @params  title   发布信息的标题
    *   @params  address 用户的地址
    *   @params  type    信息的类型：1-安装，2-维修
    *   @params  details 信息的描述
    *   @params  imgs    可以是多张图片，如果是可以放入数组进行toString
    */
    async addWorkerMsg(ctx) {
        let {
            title,
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
        let userid = ctx.user.userid, isOver = 1, workerid = uuid.v1();
        if(!userid || userid == null) {
            ctx.error({msg: '无法查询此用户信息'});
            return;
        }
        let sqlArr = []; 
        sqlArr.push(_getNewSqlParamEntity(MWorkerSQL.worker.addlist, [workerid,title,userid,address,'1',type,'1']));
        sqlArr.push(_getNewSqlParamEntity(MWorkerSQL.worker.addDetail, [workerid, details, imgs]));
        try{
            let info = await execTrans(sqlArr);
            ctx.success({msg: '找师傅发布成功'});
        }catch(err) {
            ctx.error({msg: err});
        }
    }
    /*
    *   查看用户当前发布的找师傅的状态列表
    */  
    async getUserFindWorkerList(ctx) {
        let userid = ctx.user.userid;
        console.log(`找师傅列表的用户id是 ${userid}`)
        if(!userid) {
            ctx.error({msg: '未查询到当前登录用户'});
            return;
        }
        try{
            let list = await query(MWorkerSQL.getUserFindWorkerList, [userid]);
            ctx.success({
                msg: '查询成功',
                list
            })
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
    }
}

module.exports = new WorkerControllers();