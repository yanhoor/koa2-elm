const router = require('koa-router')()
const ShopCategoryController = require('../controller/shop/shopCategoryController')

router.prefix('/shop')

router.get('/category_list', ShopCategoryController.getList)
router.post('/category_save', ShopCategoryController.save)

module.exports = router
