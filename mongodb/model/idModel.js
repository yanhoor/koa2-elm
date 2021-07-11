const mongoose  = require('mongoose');
class IdType{
    static USER_ID = 'user_id'
}
const idType = {
    [IdType.USER_ID]: Number,
};

const schema = mongoose.Schema(idType);
const model = mongoose.model('Id', schema);


model.findOne((e, d) => {
    if(!d){
        const newIds = new model({
            [IdType.USER_ID]: 0,
        });
        newIds.save();
    }
})

module.exports = {
    IdModel: model,
    IdType,
    typeList: Object.keys(idType)
};
