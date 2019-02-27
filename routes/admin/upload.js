const router = require('koa-router')()
const UploadControllers = require('../../controllers/api/upload');

router.prefix('/admin')

router.post('/upload/:pid', UploadControllers.upload)

module.exports = router