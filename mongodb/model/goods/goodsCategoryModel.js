const mongoose = require('mongoose')

const schema = mongoose.Schema({
    id: Number,
    create_time: String,
    modify_time: String,
    name: String,
    level: Number, // 节点等级，0开始
    parent_id: Number, // 上级节点，0为第一级
    shop_id: Number,
})

schema.index({id: 1})
mongoose.set('useCreateIndex',true)

module.exports = mongoose.model('GoodsCategory', schema, 'goodsCategories')

