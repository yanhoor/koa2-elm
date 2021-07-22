const mongoose  = require('mongoose');

const schema = mongoose.Schema({
    name: String,
    mobile: String,
    password: String,
    avatar: String,
    id: Number,
    type: Number, // 管理员类型，1--超级管理员，2--店铺管理员
    roles: [String], // 角色权限
    shop_id: Number, // 店铺id
    create_time: String,
    modify_time: String,
})

schema.index({ id: 1, modify_time: -1 });
mongoose.set('useCreateIndex',true)

module.exports = mongoose.model('Admin', schema);
