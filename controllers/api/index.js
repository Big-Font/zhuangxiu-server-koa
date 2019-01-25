import captchapng from 'svg-captcha';

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
    
}

module.exports = new ApiControllers();