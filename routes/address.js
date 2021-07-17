const router = require('koa-router')()
const AddressController = require('../controller/adressController')

router.prefix('/address')

router.get('/query_children', AddressController.queryChildren)
router.get('/search', AddressController.searchAddress)

module.exports = router
