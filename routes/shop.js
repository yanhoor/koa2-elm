const manageShop = require('koa-router')()
const mobileShop = require('koa-router')()
const ShopCategoryController = require('../controller/shop/shopCategoryController')
const ShopController = require('../controller/shop/shopController')

manageShop.prefix('/shop')
mobileShop.prefix('/shop')

manageShop.get('/category_list', ShopCategoryController.getList)
manageShop.get('/cate_list', ShopCategoryController.mobileList)
manageShop.get('/list', ShopController.getList)
manageShop.get('/detail', ShopController.getShopInfo)
manageShop.post('/category_save', ShopCategoryController.save)
manageShop.post('/save', ShopController.save)

mobileShop.get('/cate_list', ShopCategoryController.mobileList)
mobileShop.get('/list', ShopController.getList)

module.exports = { manageShop, mobileShop }
