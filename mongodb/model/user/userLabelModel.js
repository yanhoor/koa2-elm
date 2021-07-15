const mongoose = require('mongoose')

const schema = mongoose.Schema({
    id: Number,
    create_time: String,
    modify_time: String,
    name: {
        type: String,
        required: [true, '名称不能为空']
    },
    color: {
        type: String,
        required: [true, '颜色不能为空']
    },
})

schema.index({id: 1})
mongoose.set('useCreateIndex',true)

module.exports = mongoose.model('UserLabel', schema)

