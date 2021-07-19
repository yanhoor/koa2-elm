const mongoose  = require('mongoose');

const schema = mongoose.Schema({
    id: Number,
    create_time: String,
    modify_time: String,
    name: String,
})

schema.index({ id: 1 });
mongoose.set('useCreateIndex',true)

module.exports = mongoose.model('ShopCategory', schema, 'shopCategories');
