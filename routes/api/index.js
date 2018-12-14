const router = require('koa-router')()
const apiCtrl = require('../../controllers/api');

router.prefix('/api')

router
    .get('/captchas', apiCtrl.hello)
    .get('/register', apiCtrl.register)
    .post('/login', apiCtrl.login)
    .post('/getuser', apiCtrl.getuser)
    .get('/captchas', apiCtrl.captchas)


module.exports = router;