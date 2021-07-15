const mongoose  = require('mongoose');

const schema = mongoose.Schema({
    id: Number,
    name: String,
    age: Number,
    mobile: String,
    create_time: String,
    modify_time: String,
    labelList: [{
        name: String,
        id: Number,
        color: String
    }],
});

schema.index({ id: 1 });
mongoose.set('useCreateIndex',true)

module.exports = mongoose.model('User', schema);
