const router = require('koa-router')()
const GoodsCategoryController = require('../controller/goods/goodsCategoryController')
const GoodsLabelController = require('../controller/goods/goodsLabelController')
const GoodsController = require('../controller/goods/goodsController')

router.prefix('/goods')

router.post('/list', GoodsController.getList)
router.post('/save', GoodsController.save)
router.get('/detail', GoodsController.detail)
router.get('/export/:name', GoodsController.exportFile)
router.post('/category_save', GoodsCategoryController.saveNode)
router.get('/category_children', GoodsCategoryController.getChildrenNodeList)
router.get('/label_detail', GoodsLabelController.detail)
router.get('/label_list', GoodsLabelController.itemList)
router.post('/label_save', GoodsLabelController.saveItem)

module.exports = router
