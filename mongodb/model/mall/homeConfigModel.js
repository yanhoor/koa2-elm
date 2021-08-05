const mongoose = require('mongoose')

const schema = mongoose.Schema({
    id: Number,
    admin_id: Number,
    name: String, // 配置名称
    logo: String, // logo
    float_icon: String, // 浮动图标
    float_icon_link: String, // 浮动图标指向链接
    float_valid_time_range: Array, // 浮层有效时间范围
    state: Number, // 状态，1--正常， 2--禁用
    banner_list: [{
        img: {
            type: String,
            required: [true, '图片不能为空']
        }, // 轮播图
        link: {
            type: String,
            required: [true, '链接不能为空']
        }, // 指向链接
        color: {
            type: String,
            required: [true, '颜色不能为空']
        }, // 颜色
    }],
    create_time: String,
    modify_time: String,
})

schema.index({ id: 1, modify_time: -1 })

module.exports = mongoose.model('HomeConfig', schema, 'homeConfigs')
