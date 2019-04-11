import captchapng from 'svg-captcha';
import uuid from 'uuid';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import SQL from '../../sql/admin';
import TASK_SQL from '../../sql/admin/task';
import { getToken, getJWTPayload } from '../../lib/user';
import config from '../../config';
import { md5 } from '../../lib/md5';
import { createTask } from '../../lib/task';
import moment from 'moment';
import $Date_Format from '../../lib/dateFormat';
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
        ctx.session.cap = cap.text.toLocaleLowerCase();
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
        if(capkey.toLocaleLowerCase() !== ctx.session.cap) {
            ctx.error({msg: '验证码错误'})
            return;
        }

        try{
            let hasUser = await query(SQL.login, [username]);
            if(hasUser.length === 0) {
                ctx.error({msg: '登录失败,用户名错误'})
                return;
            }else if(hasUser[0].password !== password) {
                ctx.error({msg: '登录失败，密码错误'})
                return;
            }else {
                ctx.session.userid = hasUser[0].userid;
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
    *   @query
    *    page   当前页
    */
   async getList(ctx) {
        let { page } = ctx.request.query;
        // 分页
        let queryValues = [],pageValues = [], page_num, total_page;
        try{
            let res = await sqlPage(page, SQL.getList, []);
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
            page = res.page;
        }catch(err) {
            ctx.error({msg: err.message}); 
            return;
        }
        
        try {
            let results = await query(SQL.getList, pageValues);
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
            content,
            img
        } = ctx.request.body;
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
        
        // 事务修改版本
        let sqlArr = []; 
        sqlArr.push(_getNewSqlParamEntity(SQL.articlePublish.list, [artUUID, title, author, img]));
        sqlArr.push(_getNewSqlParamEntity(SQL.articlePublish.detail, [artUUID, content]));
        try{
            let info = await execTrans(sqlArr);
            ctx.success({msg: '文章发布成功'});
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
            let result = await query(SQL.getArticle, [id]);
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
    *   type: 类型：0-外部链接， 1-装修案例，2-秒杀活动，3-资讯，
    *   infoId: 装修案例，资讯,秒杀活动的id
    *   @params  
    */
   async getBannerList(ctx) {
        let results;
        try {
            results = await query( SQL.getBannerList)
            ctx.success({
                msg: '查询成功',
                list: results
            })
        }catch(err) {
            ctx.error({msg: err.message});
        }
   }
   /*
    *   banner管理 -- banner 添加 banner
    *   @params  
    *   url   图片地址
    *   path  跳转地址
    */
   async bannerPublic(ctx) {
        let { url, path, name, type, infoId } = ctx.request.body;
        if(!url) {
            ctx.error({msg: 'banner图片地址不能为空'});
            return;
        }
        if(typeof type === 'number' && (type != 0 && type != 1 && type != 2)) {
            ctx.error({msg: 'banner类型不能为空'});
            return;
        }
        try{
            let result = await query(SQL.bannerPublic, [url, path, name, type, infoId]);
            ctx.success({msg: 'banner更新成功'});
        }catch(err) {
            ctx.error({msg: err});
        }
   }
   /*
    *   banner管理 -- 修改
    *   @params  
    *   url   图片地址
    *   path  跳转地址
    */
   async bannerModify(ctx) {
       let { banner_id, banner_name, banner_url, banner_path, type, infoId} = ctx.request.body;
       if(!banner_id) {
           ctx.error({msg: 'id不能为空'});
           return;
       }
       if(!banner_url) {
           ctx.error({msg: '图片地址不能为空'});
           return;
       }
       if(!type) {
            ctx.error({msg: 'banner类型不能为空'});
            return;
       }
       try{
           let res = await query(SQL.bannerModify, [banner_name, banner_url, banner_path, type, infoId, banner_id,]);
           ctx.success({msg: 'banner更新成功'});
       }catch(err) {
           ctx.error({msg: err.message});
       }
   }
    /*
    *   装修案例列表
    *   @params  
    *   page         当前页数
    *   recommend    是否推荐 0-不推荐  1--推荐 
    *   模糊搜索项：
    *   title        标题
    *   author       作者
    *   recommend    是否推荐 0-不推荐  1--推荐
    *   style        装修风格
    *   company      装修公司
    */
   async caseList(ctx) {
        let { title, author, recommend, style, company, page } = ctx.request.body;
        // 分页
        let queryValues = [], values = [],pageValues = [], sql, page_num, total_page, results;
        if(!page) {
            page = 1;
        }
        if(!!recommend && (recommend !== '0' && recommend !== '1')) {
            ctx.error({msg: '用户推荐类型错误'});
            return;
        }

        if(!!title) {
            values.push('caselist_title');
            values.push(`%${title}%`);
        }
        if(!!author) {
            values.push('caselist_author');
            values.push(`%${author}%`);
        }
        if(!!style) {
            values.push('style');
            values.push(`%${style}%`);
        }
        if(!!company) {
            values.push('company');
            values.push(`%${company}%`);
        }
        if(!!recommend) {
            values.push('caselist_recommend');
            values.push(`%${recommend}%`);
        }

        if(values.length === 10) {
            sql = SQL.queryCaseDetailFive;
        }else if(values.length === 8) {
            sql = SQL.queryCaseDetailFour;
        }else if(values.length === 6) {
            sql = SQL.queryCaseDetailThree;
        }else if(values.length === 4) {
            sql = SQL.queryCaseDetailTwo;
        }else if(values.length === 2) {
            sql = SQL.queryCaseDetailOne;
        }else {
            sql = SQL.queryCaseDetail;
        }

        try{
            let res = await sqlPage(page, sql, values);
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
        }catch(err) {
            ctx.error({msg: err.message}); 
            return;
        }

        queryValues = values.concat(pageValues);
        
        try {
            results = await query(sql, queryValues)
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
        ctx.success({
            list: results,
            total_page,
            page,
        })
   }
    /*
    *   发布装修案例 
    *   @params  
    *   title   标题
    *   author  作者
    *   recommend 是否推荐到首页  0--不推荐，1--推荐
    *   titleImg  列表图片
    *   content   文章内容
    */
   async fitupCasePublic(ctx) {
        let { 
            title, 
            author, 
            recommend, 
            titleImg, 
            content, 
            area,
            apartment,
            spend,
            style,
            company,
            label
        } = ctx.request.body;
        if(!title) {
            ctx.error({msg: '标题不能为空'});
            return;
        }
        if(!author) {
           author = types.FITUP_AUTHOR;
        }
        if(!recommend) {
            recommend = 0;
        }
        if(!titleImg) {
            ctx.error({msg: '默认图片不能为空'});
            return;
        }
        if(!content) {
            ctx.error({msg: '文章内容不能为空'});
            return;
        }

        const fiupcaseUUID = uuid.v1();
        const pageview = parseInt(Math.random()*100);
        // 事务处理版本
        let sqlArr = [];
        // let fitupcaseSQL = `INSERT INTO t_sys_fitupcase (caselist_uuid, fitupcase_content, fitupcase_create_time, fitupcase_update_time) VALUES ('${fiupcaseUUID}', '${content}', NOW(), NOW())`;
        // let caselistSQL = `INSERT INTO t_sys_caselist (caselist_uuid, caselist_title, caselist_author, caselist_recommend, caselist_img, caselist_pageview) VALUES ('${fiupcaseUUID}', '${title}', '${author}', '${recommend}', '${titleImg}', '${pageview}')`;
        sqlArr.push(_getNewSqlParamEntity(SQL.fitupCasePublic.detail, [fiupcaseUUID, content, area, apartment, spend, style, company, label]));
        sqlArr.push(_getNewSqlParamEntity(SQL.fitupCasePublic.list, [fiupcaseUUID, title, author, recommend, titleImg, pageview]));
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
        let { id, title, author, recommend, titleImg, content, spend, pageview, style, area, apartment, company} = ctx.request.body;
        let caselist_uuid;
        if(!id) {
            ctx.error({msg: 'id不能为空'});
            return;
        }
        if(!title) {
            ctx.error({msg: '标题不能为空'});
            return;
        }
        if(!author) {
           author = types.FITUP_AUTHOR;
        }
        if(!recommend) {
            recommend = 0;
        }
        if(!titleImg) {
            ctx.error({msg: '默认图片不能为空'});
            return;
        }
        if(!content) {
            ctx.error({msg: '文章内容不能为空'});
            return;
        }
        pageview += parseInt(Math.random()*100);
        // 事务处理版本
        try{
            let res = await query(SQL.fitupcaseModify, [title, author, recommend, titleImg, pageview, content, spend,style, area, apartment, company, id]);
            ctx.success({msg: '装修案例更新成功'});
        }catch(e) {
            ctx.error({msg: e.message});
            return;
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
        let { place, type, page} = ctx.request.body;
        let queryValues = [], values = [],pageValues = [], sql, page_num, total_page;      
 
        if(!!place && (place == 1 || place == 2|| place == 3)) {
            values.push('spike_place');
            values.push(place);
        }
        if(!!type && (type == 1 || type == 2 || type == 3)) {
            values.push('spike_type');
            values.push(type);
        }

        if(values.length === 4){
            sql = SQL.spikeActiveListSQL.queryTwo;
        }else if(values.length === 2) {
            sql = SQL.spikeActiveListSQL.queryOne;
        }else {
            sql = SQL.spikeActiveListSQL.queryALL;
        }

        try{
            let res = await sqlPage(page, sql, values);
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
            page = res.page;
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }

        // start end 
        queryValues = values.concat(pageValues);
        
        try{
            let list = await query(sql, queryValues);
            ctx.success({
                msg: '查询成功',
                total_page,
                page,
                list,
                nowTime: new Date().getTime()
            })
        }catch(err) {
            ctx.error({msg: err.message})
        }
   }
   /*
    *   根据秒杀活动列表id查询秒杀活动详情
    *   @params id-秒杀活动列表id
    */
    async querySpikeDetail(ctx) {
        let { id } = ctx.request.body;
        if(!id) {
            ctx.error({msg: '秒杀活动id不能为空'});
            return;
        }

        try{
            let res = await query(SQL.querySpikeDetail, [id]);
            ctx.success({
                msg: '查询成功',
                nowTime: new Date().getTime(),
                data: res[0]
            })
        }catch(err) {
            ctx.error({msg: err.message});
            return;
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
    *    type,          活动状态  1-未开始， 2-进行中， 3- 已结束
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
        let type=3;
        if(!goods) {
            ctx.error({msg: '商品介绍不能为空'});
            return;
        }else if(!name) {
            ctx.error({msg: '活动名称不能为空'});
            return;
        }else if(!startTime) {
            ctx.error({msg: '活动开始时间不能为空'});
            return;
        }else if(!endTime) {
            ctx.error({msg: '活动结束时间不能为空'});
            return;
        }else if(endTime <= startTime) {
            ctx.error({msg: '活动结束时间不能小于活动开始时间'});
            return;
        }else if(!img) {
            ctx.error({msg: '产品图片不能为空'})
            return;
        }else if(!place) {
            place = 3;
        }
        // 获取当前时间
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        if(moment(startTime).isBefore(now) && moment(endTime).isAfter(now)) {
            // 进行中   spike_start_time 大于 当前时间  并且 spike_end_time 小于当前时间
            type = 1;
        }else if(moment(endTime).isBefore(now)){
            // 已结束   spike_end_time 小于当前时间
            type = 2;
        }
        
        var spikeUUID = uuid.v1();
        let sqlArr = [];
        // let listSQL = `INSERT INTO t_sys_spikelist (spike_name, spike_start_time, spike_end_time, spike_update_time, spike_type, spike_img, spike_place) VALUES (?, ? , ?, NOW(), 3, ?, ?)`;
        // let listParams = [name, startTime, endTime, type, img, place];
        // let infoSQL = `INSERT INTO t_sys_spikes (spike_stock, spike_seller, spike_goods, spike_activity, spike_price) VALUES (?, ?, ?, ?, ?)`;
        // let infoParams = [stock, seller, goods, activity, price];
        sqlArr.push(_getNewSqlParamEntity(SQL.spikeActivePublish.list, [spikeUUID, name, startTime, endTime, type, img, place]));
        sqlArr.push(_getNewSqlParamEntity(SQL.spikeActivePublish.detail, [spikeUUID, stock, seller, goods, activity, price]));
        
        try{
            let info = await execTrans(sqlArr); 
            /*
            *
            * 如果 startTime 小于当前时间，马上开启，不需要经过 定时任务， 
            * 如果 startTime 大于当前任务， 开启两个定时任务， 一条用于创建活动，一条用于修改活动状态为已下架
            * 
            */
            function spikeActiveStart(spikeUUID) {
                try {
                    let start = query(TASK_SQL.spikeActiveStartTask, [spikeUUID]) 
                }catch(e) {
                    console.log(`===> 定时活动开启失败， 活动uuid：${spikeUUID}`)
                }
            }
            function spikeActiveEnd(spikeUUID) {
                try{
                    let end = query(TASK_SQL.spikeActiveEndTask, [spikeUUID])
                }catch(e) {
                    console.log(`===> 定时活动结束失败， 活动uuid：${spikeUUID}`)
                }
            }
            // 2018-12-01 12:09:12  ===> return new Date(2012, 11, 21, 5, 30, 0);
            // function startTime(time) {
            //     var oDate = new Date(time);
            //     return new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(), oDate.getHours(), oDate.getMinutes(), oDate.getSeconds())
            // }
            if(moment(startTime).isBefore(now) && moment(endTime).isAfter(now)) {
                // 进行中   spike_start_time 大于 当前时间  并且 spike_end_time 小于当前时间
                // 进行中：只开启关闭的定时任务
                createTask(spikeActiveEnd, $Date_Format.date2task(endTime))
            }else if(moment(endTime).isBefore(now)){
                // 已结束   spike_end_time 小于当前时间 
                // 已结束的不进行任何定时任务
            }else {
                // 未开始   spike_start_time 大于 当前时间 ---- 开启定时任务
                // 未开始： 开启开始定时任务和结束定时任务
                createTask(spikeActiveStart, $Date_Format.date2task(startTime), spikeUUID)
                createTask(spikeActiveEnd, $Date_Format.date2task(endTime), spikeUUID)
            }
            // createTask(spikeActiveStart, $Date_Format.date2task(startTime))
            ctx.success({msg: '发布成功'});
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
   }
   /*
   *     修改秒杀活动
   */
   async modifySpikeActive(ctx) {
        let {
            id,
            stock,
            seller,
            goods,
            activity,
            price,
            name,
            startTime,
            endTime,
            img,
            place
        } = ctx.request.body;
        // startTime 是 mysql 的保留字
        let startTime2 = startTime;
        let type=3, spikeUUID;
        if(!id) {
            ctx.error({msg: '秒杀活动id不能为空'});
            return;
        }
        if(!goods) {
            ctx.error({msg: '商品介绍不能为空'});
            return;
        }
        if(!name) {
            ctx.error({msg: '活动名称不能为空'});
            return;
        }
        if(!startTime) {
            ctx.error({msg: '活动开始时间不能为空'});
            return;
        }
        if(!endTime) {
            ctx.error({msg: '活动结束时间不能为空'});
            return;
        }
        if(endTime <= startTime) {
            ctx.error({msg: '活动结束时间不能小于活动开始时间'});
            return;
        }
        if(!img) {
            ctx.error({msg: '产品图片不能为空'})
            return;
        }
        if(!place) {
            place = 3;
        }

        /*
            a.spike_name=?,             name
            a.spike_start_time=?,       startTime
            a.spike_end_time=?,         endTime 
            a.spike_img=?,              img
            a.spike_place=?,            place
            b.spike_stock=?,            stock
            b.spike_seller=?,           seller
            b.spike_goods=?,            goods
            b.spike_activity=?,         activity
            b.spike_price=?,            price
            a.spike_type=?,             type
        */
        try{
            let res = await query(SQL.querySpikeActiveUUID, [id]);
            spikeUUID = res[0].spike_uuid;
        }catch(e) {
            ctx.error({msg: e.message});
        }
        // 获取当前时间
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        if(moment(startTime).isBefore(now) && moment(endTime).isAfter(now)) {
            // 进行中   spike_start_time 大于 当前时间  并且 spike_end_time 小于当前时间
            type = 1;
        }else if(moment(endTime).isBefore(now)){
            // 已结束   spike_end_time 小于当前时间
            type = 2;
        }
        
        try{
            let info = await query(SQL.modifySpikeActive, [name, startTime2 , endTime, img, place, stock, seller, goods, activity, price, type, id]); 
            /*
            *
            * 如果 startTime 小于当前时间，马上开启，不需要经过 定时任务， 
            * 如果 startTime 大于当前任务， 开启两个定时任务， 一条用于创建活动，一条用于修改活动状态为已下架
            * 
            */
            async function spikeActiveStart(id) {
                try {
                    let start = await query(TASK_SQL.spikeInit.spikeInitStart, [id]) 
                }catch(e) {
                    console.log(`===> 定时活动开启失败， 活动id：${id}`)
                }
            }
            async function spikeActiveEnd(id) {
                try{
                    let end = await query(TASK_SQL.spikeInit.spikeInitEnd, [id])
                }catch(e) {
                    console.log(`===> 定时活动结束失败， 活动uuid：${id}`)
                }
            }
            if(moment(startTime).isBefore(now) && moment(endTime).isAfter(now)) {
                // 进行中   spike_start_time 大于 当前时间  并且 spike_end_time 小于当前时间
                // 进行中：只开启关闭的定时任务
                createTask(spikeActiveEnd, $Date_Format.date2task(endTime))
            }else if(moment(endTime).isBefore(now)){
                // 已结束   spike_end_time 小于当前时间 
                // 已结束的不进行任何定时任务
            }else {
                // 未开始   spike_start_time 大于 当前时间 ---- 开启定时任务
                // 未开始： 开启开始定时任务和结束定时任务
                createTask(spikeActiveStart, $Date_Format.date2task(startTime), id)
                createTask(spikeActiveEnd, $Date_Format.date2task(endTime), id)
            }
            // createTask(spikeActiveStart, $Date_Format.date2task(startTime))
            ctx.success({msg: '更新成功'});
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
   }
}

module.exports = new AdminControllers();