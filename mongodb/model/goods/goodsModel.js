const mongoose = require('mongoose')

const schema = mongoose.Schema(
    {
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
    },
    {
        toJSON: { virtuals: true }, // 默认下面的 virtual 输出不会包含相应字段，需要设置 true
    }
)

schema.virtual('category_list', {
    ref: 'GoodsCategory', // 关联的 model 名称
    localField: 'category_ids', // 本 model 字段名
    foreignField: 'id', // 对应的关联 model 的字段名
    justOne: false, // 只查找一条数据, false 将返回数组
    // options: { sort: { name: -1 }, limit: 5 }
})

schema.virtual('label_list', {
    ref: 'GoodsLabel', // 关联的 model 名称
    localField: 'label_ids', // 本 model 字段名
    foreignField: 'id', // 对应的关联 model 的字段名
    justOne: false, // 只查找一条数据, false 将返回数组
    // options: { sort: { name: -1 }, limit: 5 }
})

schema.index({id: -1})
mongoose.set('useCreateIndex',true)

module.exports = mongoose.model('Goods', schema, 'goods')

