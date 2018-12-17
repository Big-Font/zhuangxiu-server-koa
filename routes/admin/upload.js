const router = require('koa-router')()
const UploadControllers = require('../../controllers/admin/upload');

router.prefix('/admin')

router.post('/upload', UploadControllers.upload)

module.exports = router