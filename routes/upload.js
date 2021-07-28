const router = require('koa-router')()
const UploadController = require('../controller/UploadController')

router.prefix('/file')

router.post('/upload', UploadController.upload)
router.post('/delete', UploadController.delete)

module.exports = router
