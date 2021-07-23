const router = require('koa-router')()
const ShopCategoryController = require('../controller/shop/shopCategoryController')
const ShopController = require('../controller/shop/shopController')
const FoodCategoryController = require('../controller/shop/foodCategoryController')

router.prefix('/shop')

router.get('/category_list', ShopCategoryController.getList)
router.get('/list', ShopController.getList)
router.get('/detail', ShopController.getShopInfo)
router.post('/category_save', ShopCategoryController.save)
router.post('/save', ShopController.save)
router.post('/food_category_add', FoodCategoryController.saveNode)
router.get('/food_category_children', FoodCategoryController.getChildrenNodeList)

module.exports = router
