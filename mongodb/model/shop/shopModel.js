const mongoose  = require('mongoose');

const schema = mongoose.Schema({
    id: Number,
    create_time: String,
    modify_time: String,
    name: String, // 店名
    admin_id: Number, // 店主
    contract: String, // 联系电话
    shop_category_id: {type: Number, ref: 'ShopCategory'}, // 分类id
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
})

schema.index({ id: 1, modify_time: -1 });
mongoose.set('useCreateIndex',true)

module.exports = mongoose.model('Shop', schema);
