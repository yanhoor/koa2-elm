const mongoose = require('mongoose')

const schema = mongoose.Schema({
    id: Number,
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

