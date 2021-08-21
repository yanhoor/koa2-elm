const mongoose  = require('mongoose');

const schema = mongoose.Schema(
    {
        id: Number,
        create_time: String,
        modify_time: String,
        name: String, // 店名
        admin_id: Number, // 店主
        // admin: {
        //     type : mongoose.Schema.ObjectId,
        //     ref: 'Admin'
        // },
        contract: String, // 联系电话
        shop_category_id: {type: Number, ref: 'ShopCategory'}, // 分类id
        // shop_category: {
        //     type : mongoose.Schema.ObjectId,
        //     ref: 'ShopCategory'
        // },
        desc: String, // 店铺简介
        slogan: String, // 店铺标语
        opening_range: [], // 营业时间
        avatar: String, // 头像
        business_license: String, // 营业执照
        service_permission: String, // 服务许可证
        deliver_fee: String, // 配送费
        deliver_fee_start_amount: String, // 配送费起送价
        provinceCode: String,
        cityCode: String,
        countyCode: String,
        townCode: String,
        headAddress: String,
        tailAddress: String,
    },
    {
        toJSON: { virtuals: true }, // 默认下面的 virtual 输出不会包含相应字段，需要设置 true
    }
)

schema.virtual('admin', {
    ref: 'Admin', // 关联的 model 名称
    localField: 'admin_id', // 本 model 字段名
    foreignField: 'id', // 对应的关联 model 的字段名
    justOne: true, // 只查找一条数据, false 将返回数组
    // options: { sort: { name: -1 }, limit: 5 }
})

schema.virtual('shop_category', {
    ref: 'ShopCategory', // 关联的 model 名称
    localField: 'shop_category_id', // 本 model 字段名
    foreignField: 'id', // 对应的关联 model 的字段名
    justOne: true, // 只查找一条数据, false 将返回数组
    // options: { sort: { name: -1 }, limit: 5 }
})

schema.index({ id: 1, modify_time: -1 });
mongoose.set('useCreateIndex',true)

module.exports = mongoose.model('Shop', schema);
