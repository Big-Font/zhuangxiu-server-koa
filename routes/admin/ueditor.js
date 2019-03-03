const router = require('koa-router')()
const UeditorCtrl = require('../../controllers/admin/ueditor');

router.prefix('/admin')

router.post('/wangeditor/upload/:nameid', UeditorCtrl.upload)

module.exports = router