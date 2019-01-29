import captchapng from 'svg-captcha';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import SQL from '../../sql/admin';
import API_SQL from '../../sql/api';

class ApiControllers {
    // 图形验证码
    async captchas(ctx) {
        const cap = captchapng.create({
            size: 4,
            ignoreChars: '0oli',
            noise: 4,
            color: true,
            background: '#fff'
        })
        ctx.session.usernam = cap.text.toLocaleLowerCase();
        ctx.response.type ='svg';
        ctx.body = cap.data;
    }
    /*
    *   banner 管理
    *   @response  
    *   capkey  图形验证码
    *   username  账号
    *   password  密码
    */
    async getBanner(ctx) {

    }
    /*
    *   装修案例列表 --- caseList
    *   @params  
    *   page  当前页数
    *   url   图片地址
    *   path  跳转地址
    */
    async caseList(ctx) {
        let { page } = ctx.request.query;
        // 分页
        let queryValues = [],pageValues = [], page_num, total_page, results;
        try{
            let res = await sqlPage(page, SQL.caseList, []);
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
        }catch(err) {
            ctx.error({msg: err.message}); 
            return;
        }

        try {
            results = await query(SQL.caseList, pageValues)
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
        ctx.success({
            list: results
        })
    }
    /*
    *   装修案例详情查询 --- caseList
    *   @params  
    *   id  装修案例列表的id
    */
    async queryFitupcaseDetail(ctx) {
        let { id } = ctx.request.body;
        let uuidRes, uuid;
        if(!id) {
            ctx.error({msg: 'id不能为空'});
            return;
        }
        // 根据id查询uuid
        try{
            uuidRes = await query(API_SQL.queryById, [id]);
            if(!uuidRes.length) {
                ctx.error({msg: '没有查询到对应详情'});
                return;
            }
            console.log(JSON.stringify(uuidRes))
            uuid = uuidRes[0].uuid;
        }catch(error) {
            ctx.error({msg: error.message});
            return;
        }
        
        console.log('uuid====>', uuid);
        // 查询详情
        try{
            let data = await query(API_SQL.fitupDetail, [uuid]);
            ctx.success({
                msg: '查询成功',
                data: data.length ? data[0] : {},
            })
        }catch(err) {
            ctx.error({msg: err.message})
        }
    }
    
}

module.exports = new ApiControllers();