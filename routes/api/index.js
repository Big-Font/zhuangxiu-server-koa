const router = require('koa-router')()
const adminCtrl = require('../../controllers/admin');

router.prefix('/api')

router
    .get('/', adminCtrl.hello)


module.exports = router;