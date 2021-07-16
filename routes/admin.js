const router = require('koa-router')()
const AdminController = require('../controller/admin/adminController')

router.prefix('/admin')

router.post('/register', AdminController.register)
router.post('/login', AdminController.login)
router.post('/logout', AdminController.logout)
router.post('/user_info', AdminController.userInfo)

module.exports = router
