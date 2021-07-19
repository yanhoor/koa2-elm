const mongoose  = require('mongoose');
class IdType{
    static USER_ID = 'user_id'
    static ADMIN_ID = 'admin_id'
    static USER_LABEL_ID = 'user_label_id'
    static IMG_ID = 'img_id'
    static SHOP_CATEGORY_ID = 'shop_category_id'
    static SHOP_ID = 'shop_id'
}
const idType = {
    [IdType.USER_ID]: Number,
    [IdType.ADMIN_ID]: Number,
    [IdType.USER_LABEL_ID]: Number,
    [IdType.IMG_ID]: Number,
    [IdType.SHOP_CATEGORY_ID]: Number,
    [IdType.SHOP_ID]: Number,
};

const schema = mongoose.Schema(idType);
const model = mongoose.model('Id', schema);


const initData = {
    [IdType.USER_ID]: 0,
    [IdType.ADMIN_ID]: 0,
    [IdType.USER_LABEL_ID]: 0,
    [IdType.IMG_ID]: 0,
    [IdType.SHOP_CATEGORY_ID]: 0,
    [IdType.SHOP_ID]: 0,
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
