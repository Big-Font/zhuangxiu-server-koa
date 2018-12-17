/*
*   jwt验证 ajax码和返回处理中间件， 当鉴权验证不通过时，状态码返回401， code返回4001
*
*/

module.exports = function(ctx, next){
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                code: 4001,
                error: err.originalError ? err.originalError.message : err.message,
            };
        } else {
            throw err;
        }
    });
}