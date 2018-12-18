const router = require('koa-router')()
const apiCtrl = require('../../controllers/api');

router.prefix('/api')

router
    .get('/register', apiCtrl.register)
    .post('/login', apiCtrl.login)
    .get('/captchas', apiCtrl.captchas)


module.exports = router;