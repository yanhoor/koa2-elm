const router = require('koa-router')()
const AdminController = require('../controller/admin/adminController')

router.prefix('/admin')

router.get('/list', AdminController.list)
router.post('/register', AdminController.register)
router.post('/login', AdminController.login)
router.post('/logout', AdminController.logout)
router.post('/update_avatar', AdminController.updateAvatar)
router.post('/user_info', AdminController.userInfo)

module.exports = router
