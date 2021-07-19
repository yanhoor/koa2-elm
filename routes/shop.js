const router = require('koa-router')()
const ShopCategoryController = require('../controller/shop/shopCategoryController')
const ShopController = require('../controller/shop/shopController')

router.prefix('/shop')

router.get('/category_list', ShopCategoryController.getList)
router.get('/list', ShopController.getList)
router.post('/category_save', ShopCategoryController.save)
router.post('/save', ShopController.save)

module.exports = router
