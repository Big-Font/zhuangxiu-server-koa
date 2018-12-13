

class AdminControllers {
    async hello(ctx) {
        ctx.body = {
            code: 1
        }
    }
}

module.exports = new AdminControllers();