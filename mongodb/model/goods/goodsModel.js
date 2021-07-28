const mongoose = require('mongoose')

const schema = mongoose.Schema({
    id: Number,
    create_time: String,
    modify_time: String,
    name: String,
    shop_id: Number,
    category_ids: [Number],
    pic_list: [String],
    label_ids: [Number],
    desc: String,
    // sku_list: [Number],
    // 前端提交时的信息：
    sku_list: [{
        name: String,
        price: Number, // 价格
        pack_fee: Number, // 打包费
    }]
})

schema.index({id: -1})
mongoose.set('useCreateIndex',true)

module.exports = mongoose.model('Goods', schema, 'goods')

