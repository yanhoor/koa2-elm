const BaseController = require('../baseController')
const SkuModel = require('../../mongodb/model/goods/skuModel')
const tf = require('time-formater')

class SkuController extends BaseController{
    constructor() {
        super();
        this.save = this.save.bind(this)
    }

    async save(skuInfo){
        const { id: sku_id } = skuInfo
        if(sku_id){
            // 修改sku信息
            const skuData = {
                ...skuInfo,
                modify_time: tf().format('YYYY-MM-DD HH:mm:ss')
            }
            await SkuModel.findOneAndUpdate({id: sku_id}, {$set: skuData})
            return sku_id
        }else{
            // 新增sku信息
            let item_id
            try{
                item_id = await this.createId(this.idType.GOODS_ID)
            }catch(e){
                console.log('获取商品id失败')
                return
            }
            const t = tf().format('YYYY-MM-DD HH:mm:ss')
            let data = {
                ...skuInfo,
                id: item_id,
                create_time: t,
                modify_time: t,
            };
            const model = new SkuModel(data);
            model.save().then(r => {

            }).catch(e => {
                console.log('-----------------', e);
            })
            return item_id
        }
    }
}

module.exports = new SkuController()
