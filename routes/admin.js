const router = require('koa-router')()
const AdminController = require('../controller/admin/adminController')

router.prefix('/admin')

router.post('/register', AdminController.register)
router.post('/login', AdminController.login)

module.exports = router
