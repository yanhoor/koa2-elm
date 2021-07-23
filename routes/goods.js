const router = require('koa-router')()
const GoodsCategoryController = require('../controller/shop/goodsCategoryController')

router.prefix('/goods')

router.post('/category_add', GoodsCategoryController.saveNode)
router.get('/category_children', GoodsCategoryController.getChildrenNodeList)

module.exports = router
