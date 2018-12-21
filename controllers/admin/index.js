import captchapng from 'svg-captcha';
import uuid from 'uuid';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import SQL from '../../sql/admin';
import { getToken, getJWTPayload } from '../../lib/user';
import config from '../../config';
import { md5 } from '../../lib/md5';
import { createTask } from '../../lib/task';
import * as types from '../../lib/types';

class AdminControllers {
    /*
    *   图形验证码接口
    */
    async captcha(ctx) {
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
    *   后台管理登录接口
    *   @params  
    *   username  账号
    *   password  密码
    *   capkey  图形验证码
    */
    async login(ctx) {
        let {capkey, username, password} = ctx.request.body;
        password = md5(password + config[process.env.NODE_ENV].MD5_SUFFIX());
        if(capkey.toLocaleLowerCase() !== ctx.session.usernam) {
            ctx.error({msg: '验证码错误'})
            return;
        }

        try{
            let hasUser = await query(`SELECT username, password FROM t_sys_user WHERE username=?`, [username])
            console.log(hasUser[0].password, password, hasUser[0].password !== password)
            if(hasUser.length === 0) {
                ctx.error({msg: '登录失败,用户名错误'})
                return;
            }else if(hasUser[0].password !== password) {
                ctx.error({msg: '登录失败，密码错误'})
                return;
            }else {
                ctx.success({
                    msg: '登录成功',
                    token: getToken({username: hasUser.user}), 
                    user: username
                })
                return;
            }
        }catch(err) {
            ctx.error({msg: err})
        }
    }
    /*
    *   获取资讯列表接口
    */
   async getList(ctx) {
        let results;
        try {
            results = await query(`SELECT * FROM t_sys_articlelist`)
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
        ctx.success({
            code: 0,
            list: results
        })
   }
    /*
    *   后台管理 文章发布接口
    *   @params  
    *   title      文章标题
    *   author     文章作者
    *   content    文章内容
    */
   async articlePublish(ctx) {
        let {
            title,
            author,
            content
        } = ctx.request.body;
        console.log()
        if(!title){
            ctx.error({msg: '标题不能为空'});
            return;
        }else if(!author) {
            ctx.error({msg: '作者不能为空'});
            return;
        }else if(!content) {
            ctx.error({msg: '内容不能为空'});
            return;
        }
        const artUUID = uuid.v1();
        // try{
        //     let articles = await query(`INSERT INTO t_sys_articlelist (artlist_uuid, artlist_title, artlist_author) VALUES ('${artUUID}','${title}', '${author}')`)
        //     try{
        //         let atticleList = await query(`INSERT INTO t_sys_articles ( artlist_uuid, articles_content, articles_create_time, articles_update_time) VALUES ('${artUUID}', '${content}', NOW(), NOW())`)
        //         ctx.success({msg: '文章发布成功'})
        //     }catch(error) {
        //         ctx.error({msg: error.message})
        //         return;
        //     }
        // }catch(err) {
        //     ctx.error({msg: err.message})
        // }
        
        // 事务修改版本
        let sqlArr = [];
        let articlelistSQL = `INSERT INTO t_sys_articlelist (artlist_uuid, artlist_title, artlist_author) VALUES ('${artUUID}','${title}', '${author}')`;
        let articlesSQL = `INSERT INTO t_sys_articles ( artlist_uuid, articles_content, articles_create_time, articles_update_time) VALUES ('${artUUID}', '${content}', NOW(), NOW())`;
        sqlArr.push(_getNewSqlParamEntity(articlelistSQL));
        sqlArr.push(_getNewSqlParamEntity(articlesSQL));
        try{
            let info = await execTrans(sqlArr)
            ctx.success({msg: '文章发布成功', info: info});
        }catch(err) {
            ctx.error({msg: err});
        }
   }
   /*
   *   获取文章详情
   *   @params  
   *   id      文章id
   */
    async getArticle(ctx) {
        let {id} = ctx.request.body;
        if(!id) {
            ctx.error({msg: '文章id不能为空'});
            return;
        }
        try{
            let result = await query(`SELECT artlist_id, artlist_title, artlist_author, artlist_recommend, articles_content, articles_update_time FROM t_sys_articlelist AS a LEFT JOIN t_sys_articles AS b ON a.artlist_uuid=b.artlist_uuid WHERE artlist_id=?`, [id]);
            let resMsg = {};
            for(let key in result[0]) {
                resMsg[key.split('_')[1]] = result[0][key];
            }
            ctx.success({
                msg: '查询成功！',
                data: resMsg
            })
        }catch(err) {
            ctx.error({msg: err})
        }
    }
    /*
    *   banner管理 -- banner 列表查询
    *   @params  
    *   
    */
   async getBannerList(ctx) {
        let results;
        try {
            results = await query(`SELECT * FROM t_sys_bannerlist ORDER BY bannerlist_id DESC`)
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
        ctx.success({
            code: 0,
            list: results
        })
   }
   /*
    *   banner管理 -- banner 添加 banner
    *   @params  
    *   url   图片地址
    *   path  跳转地址
    */
   async bannerPublic(ctx) {
        let { url, path } = ctx.request.body;
        if(!url) {
            ctx.error({msg: 'banner图片地址不能为空'})
        }
        try{
            let result = await query(`INSERT INTO t_sys_bannerlist (banner_url, banner_path, banner_update_time) VALUES ('${url}', '${path}', NOW())`);
            ctx.success({msg: 'banner更新成功'});
        }catch(err) {
            ctx.err({msg: err});
        }
   }
    /*
    *   装修案例列表 --- caseList
    *   @params  
    *   url   图片地址
    *   path  跳转地址
    */
   async caseList(ctx) {
        let results;
        try {
            results = await query(`SELECT * FROM t_sys_caselist ORDER BY caselist_id DESC`)
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
        ctx.success({
            code: 0,
            list: results
        })
   }
    /*
    *   发布装修案例 
    *   @params  
    *   title   标题
    *   author  作者
    *   recommend 是否推荐到首页
    *   titleImg  列表图片
    *   content   文章内容
    */
   async fitupCasePublic(ctx) {
        let { title, author, recommend, titleImg, content} = ctx.request.body;
        if(!title) {
            ctx.error({msg: '标题不能为空'});
        }else if(!author) {
           author = types.FITUP_AUTHOR;
        }else if(!recommend) {
            recommend = 0;
        }else if(!titleImg) {
            ctx.error({msg: '默认图片不能为空'});
        }else if(!content) {
            ctx.error({msg: '文章内容不能为空'});
        }

        const fiupcaseUUID = uuid.v1();
        const pageview = parseInt(Math.random()*100);
        // try{
        //     let fitupCase = query(`INSERT INTO t_sys_fitupcase (caselist_uuid, fitupcase_content, fitupcase_create_time, fitupcase_update_time) VALUES ('${fiupcaseUUID}', '${content}', NOW(), NOW())`);
        //     try{
        //         let caselist = query(`INSERT INTO t_sys_caselist (caselist_uuid, caselist_title, caselist_author, caselist_recommend, caselist_img, caselist_pageview) VALUES ('${fiupcaseUUID}', '${title}', '${author}', '${recommend}', '${titleImg}', '${pageview}')`)
        //         ctx.success({msg: '发布成功'});
        //     }catch(error) {
        //         ctx.error({msg: err});
        //     }
        // }catch(err) {
        //     ctx.error({msg: err});
        // }
        // 事务处理版本
        let sqlArr = [];
        let fitupcaseSQL = `INSERT INTO t_sys_fitupcase (caselist_uuid, fitupcase_content, fitupcase_create_time, fitupcase_update_time) VALUES ('${fiupcaseUUID}', '${content}', NOW(), NOW())`;
        let caselistSQL = `INSERT INTO t_sys_caselist (caselist_uuid, caselist_title, caselist_author, caselist_recommend, caselist_img, caselist_pageview) VALUES ('${fiupcaseUUID}', '${title}', '${author}', '${recommend}', '${titleImg}', '${pageview}')`;
        sqlArr.push(_getNewSqlParamEntity(fitupcaseSQL));
        sqlArr.push(_getNewSqlParamEntity(caselistSQL));
        try{
            let info = await execTrans(sqlArr)
            ctx.success({msg: '发布成功'});
        }catch(err) {
            ctx.error({msg: err});
        }
   }
   /*
    *   修改装修案例 
    *   @params
    *   id      装修推荐列表id（根据列表id查询uuid并更新列表和详情表）  
    *   title   标题
    *   author  作者
    *   recommend 是否推荐到首页
    *   titleImg  列表图片
    *   content   文章内容
    */
   async fitupcaseModify(ctx) {
        let { id, title, author, recommend, titleImg, content} = ctx.request.body;
        if(!id) {
            ctx.error({msg: 'id不能为空'});
        }else if(!title) {
            ctx.error({msg: '标题不能为空'});
        }else if(!author) {
           author = types.FITUP_AUTHOR;
        }else if(!recommend) {
            recommend = 0;
        }else if(!titleImg) {
            ctx.error({msg: '默认图片不能为空'});
        }else if(!content) {
            ctx.error({msg: '文章内容不能为空'});
        }
        
        // try{
        //     let res = query(`SELECT caselist_uuid FROM t_sys_caselist WHERE caselist_id='${id}'`);
        //     let caselist_uuid = res[0].caselist_uuid
        //     try{
        //         let resultFitupCase = query(`UPDATE t_sys_fitupcase SET fitupcase_content='${content}', fitupcase_update_time=NOW() WHERE caselist_uuid='${caselist_uuid}'`)
        //         try{
        //             let resultCaseList = query(`UPDATE t_sys_caselist SET caselist_title='${title}', caselist_author='${author}', caselist_recommend='${recommend}', caselist_img='${titleImg}' WHERE caselist_uuid='${caselist_uuid}'`)
        //         }catch(error) {
        //             ctx.error({msg: error});
        //         }
        //     }catch(err) {
        //         ctx.error({msg: err})
        //     }
        // }catch(e) {
        //     ctx.error({msg: e});
        // }

        // 事务处理版本
        try{
            let res = query(`SELECT caselist_uuid FROM t_sys_caselist WHERE caselist_id=？`, [id]);
            let caselist_uuid = res[0].caselist_uuid;
            let sqlArr = [];
            let fitupcaseSQL = `UPDATE t_sys_fitupcase SET fitupcase_content='${content}', fitupcase_update_time=NOW() WHERE caselist_uuid='${caselist_uuid}'`;
            let caselistSQL = `UPDATE t_sys_caselist SET caselist_title='${title}', caselist_author='${author}', caselist_recommend='${recommend}', caselist_img='${titleImg}' WHERE caselist_uuid='${caselist_uuid}'`;
            sqlArr.push(_getNewSqlParamEntity(fitupcaseSQL));
            sqlArr.push(_getNewSqlParamEntity(caselistSQL));
            try{
                let info = await execTrans(sqlArr)
                ctx.success({msg: '发布成功'});
            }catch(err) {
                ctx.error({msg: err});
            }
        }catch(e) {
            ctx.error({msg: e});
        }
   }
   /*
    *   秒杀活动查询 
    *   @query
    *   place       限时秒杀活动的位置： 1-首页推荐位， 2-首页列表位， 3-其他位置  
    *   type        限时秒杀活动的状态： 1-进行中， 2-已结束, 3-未开始
    *   page        要查询的页数 
    *   total_page  总页数
    */
   async spikeActiveList(ctx) {
        let { place, type, page} = ctx.request.query;
        let queryValues = [], values = [],pageValues = [], sql, page_num, total_page;
        try{
            let res = await sqlPage(page, 't_sys_spikelist');
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
        }catch(err) {
            ctx.error({msg: err});
        }
        

        if(!!place && (place === '1' || place === '2'|| place === '3')) {
            values.push('spike_place');
            values.push(place);
        }
        if(!!type && (type === '1' || type === '2')) {
            values.push('spike_type');
            values.push(type);
        }
        // start end 
        queryValues = values.concat(pageValues);
        

        if(values.length === 6){
            sql = SQL.spikeActiveListSQL.queryTwo;
        }else if(values.length === 4) {
            sql = SQL.spikeActiveListSQL.queryOne;
        }else {
            sql = SQL.spikeActiveListSQL.queryALL;
        }
        
        try{
            let list = await query(sql, queryValues);
            ctx.success({
                msg: '查询成功',
                total_page,
                page,
                list
            })
        }catch(err) {
            ctx.error({msg: err})
        }
   }
   /*
    *   添加限时秒杀活动
    *   @params
    *    stock,         商品库存
    *    seller,        商家介绍
    *    goods,         商品介绍
    *    activity,      活动介绍
    *    price,         产品价格
    *    name,          活动名称
    *    startTime,     活动开始时间
    *    endTime,       活动结束时间
    *    type,          活动状态  1-进行中  2--已结束 3-未开始
    *    img,           产品图片
    *    place,         活动显示位置  1-首页推荐位  2-首页列表  3-其他位置
    */
   async spikeActivePublish(ctx) {
        // 前端传过来的时间是 2018-11-11 12:00:00
        let {
            stock,
            seller,
            goods,
            activity,
            price,
            name,
            startTime,
            endTime,
            img,
            place,
        } = ctx.request.body;
        if(!goods) {
            ctx.error({msg: '商品介绍不能为空'});
        }else if(!name) {
            ctx.error({msg: '活动名称不能为空'});
        }else if(!startTime) {
            ctx.error({msg: '活动开始时间不能为空'});
        }else if(!endTime) {
            ctx.error({msg: '活动结束时间不能为空'});
        }else if(endTime <= startTime) {
            ctx.error({msg: '活动结束时间不能小于活动开始时间'});
        }else if(!img) {
            ctx.error({msg: '产品图片不能为空'})
        }else if(!place) {
            place = 3;
        }

        let sqlArr = [];
        let listSQL = `INSERT INTO t_sys_spikelist (spike_name, spike_start_time, spike_end_time, spike_update_time, spike_type, spike_img, spike_place) VALUES (?, ? , ?, NOW(), 3, ?, ?)`;
        let listParams = [name, startTime, endTime, type, img, place];
        let infoSQL = `INSERT INTO t_sys_spikes (spike_stock, spike_seller, spike_goods, spike_activity, spike_price) VALUES (?, ?, ?, ?, ?)`;
        let infoParams = [stock, seller, goods, activity, price];
        sqlArr.push(_getNewSqlParamEntity(listSQL, listParams));
        sqlArr.push(_getNewSqlParamEntity(infoSQL, infoParams));
        
        try{
            let info = await execTrans(sqlArr)
            createTask() 
            ctx.success({msg: '发布成功'});
        }catch(err) {
            ctx.error({msg: err});
        }

   }
}

module.exports = new AdminControllers();