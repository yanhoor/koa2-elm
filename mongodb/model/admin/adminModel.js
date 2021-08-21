const mongoose  = require('mongoose');

const schema = mongoose.Schema(
    {
        name: String,
        mobile: String,
        password: String,
        avatar: String,
        id: Number,
        state: Number, // 用户状态, 1--正常， 2--禁用
        type: Number, // 管理员类型，1--超级管理员，2--店铺管理员
        roles: [String], // 角色权限
        shop_id: Number, // 店铺id
        create_time: String,
        modify_time: String,
    },
    {
        toJSON: { virtuals: true }, // 默认下面的 virtual 输出不会包含相应字段，需要设置 true
    }
)

schema.virtual('shop', {
    ref: 'Shop', // 关联的 model 名称
    localField: 'shop_id', // 本 model 字段名
    foreignField: 'id', // 对应的关联 model 的字段名
    justOne: true, // 只查找一条数据, false 将返回数组
    // options: { sort: { name: -1 }, limit: 5 }
})

schema.index({ id: 1, modify_time: -1 });
mongoose.set('useCreateIndex',true)

module.exports = mongoose.model('Admin', schema);
