const router = require('koa-router')()
const UserController = require('../controller/userController')

router.prefix('/user')

router.post('/save', UserController.saveUser)
router.get('/list', UserController.listUser)

module.exports = router
