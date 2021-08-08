const manageMall = require('koa-router')()
const mobileMall = require('koa-router')()
const HomeConfigController = require('../controller/mall/homeConfigController')

manageMall.prefix('/mall')
mobileMall.prefix('/mall')

manageMall.get('/home_config_list', HomeConfigController.list)
manageMall.post('/home_config_save', HomeConfigController.save)

mobileMall.get('/home_config_valid', HomeConfigController.valid)

module.exports = { manageMall, mobileMall }
