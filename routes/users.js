const router = require('koa-router')()
const UserController = require('../controller/user/userController')
const UserLabelController = require('../controller/user/UserLabelController')

router.prefix('/user')

router.post('/save', UserController.saveUser)
router.get('/list', UserController.listUser)
router.post('/label_save', UserLabelController.saveItem)
router.get('/label_list', UserLabelController.itemList)

module.exports = router
