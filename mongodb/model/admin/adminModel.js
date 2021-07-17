const mongoose  = require('mongoose');

const schema = mongoose.Schema({
    name: String,
    mobile: String,
    password: String,
    avatar: String,
    id: Number,
    create_time: String,
    modify_time: String,
})

schema.index({ id: 1 });
mongoose.set('useCreateIndex',true)

module.exports = mongoose.model('Admin', schema);
