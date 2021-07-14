const mongoose  = require('mongoose');
class IdType{
    static USER_ID = 'user_id'
    static USER_LABEL_ID = 'user_label_id'
}
const idType = {
    [IdType.USER_ID]: Number,
    [IdType.USER_LABEL_ID]: Number,
};

const schema = mongoose.Schema(idType);
const model = mongoose.model('Id', schema);


const initData = {
    [IdType.USER_ID]: 0,
    [IdType.USER_LABEL_ID]: 0,
}

model.findOne((e, doc) => {
    if(!doc){
        const newIds = new model(initData);
        newIds.save();
    }else{
        for(let k in initData){
            if(!doc[k]){
                doc[k] = initData[k]
            }
        }
        doc.save()
    }
})

module.exports = {
    IdModel: model,
    IdType,
    typeList: Object.keys(idType)
};
