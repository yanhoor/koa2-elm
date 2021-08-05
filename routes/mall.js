const router = require('koa-router')()
const HomeConfigController = require('../controller/mall/homeConfigController')

router.prefix('/mall')

router.get('/home_config_list', HomeConfigController.list)
router.get('/home_config_valid', HomeConfigController.valid)
router.post('/home_config_save', HomeConfigController.save)

module.exports = router
