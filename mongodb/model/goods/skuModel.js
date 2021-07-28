const mongoose = require('mongoose')

const schema = mongoose.Schema({
    id: Number,
    create_time: String,
    modify_time: String,
    price: Number, // 价格
    pack_fee: Number, // 打包费
    sku_id: String,
    goods_id: Number,
})

schema.index({id: -1})
mongoose.set('useCreateIndex',true)

module.exports = mongoose.model('GoodsSku', schema, 'skus')

