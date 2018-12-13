const router = require('koa-router')()
const adminCtrl = require('../../controllers/admin');

router.prefix('/admin')

router
    .get('/', adminCtrl.hello)


module.exports = router;