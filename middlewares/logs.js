const logUtil = require('../lib/logs');

module.exports = function() {
    return async function(ctx, next) {
        console.log(`进入自定义中间件了`)
        //响应开始时间
        const start = new Date();
        //响应间隔时间
        var ms;
        try {
            //开始进入到下一个中间件
            await next();
            console.log(`进入下一个了`)
            ms = new Date() - start;
            //记录响应日志
            logUtil.logResponse(ctx, ms);

        } catch (error) {
            
            ms = new Date() - start;
            //记录异常日志
            logUtil.logError(ctx, error, ms);
        }
    }
}