const BaseController = require('./baseController')
const md5 = require('md5')

/*
* 腾讯地址接口文档：https://lbs.qq.com/service/webService/webServiceGuide/webServiceDistrict#2
*
* 请求签名说明：https://lbs.qq.com/faq/serverFaq/webServiceKey
*
* */

class AddressController extends BaseController{
    constructor() {
        super();
        this.queryChildren = this.queryChildren.bind(this)
        this.searchAddress = this.searchAddress.bind(this)
    }

    // 获取省市区，parentCode：父代码，为空时查省份
    async queryChildren(ctx, next){
        const req = ctx.request;
        const { parentCode } = req.query
        let p
        p = parentCode ? `id=${parentCode}&key=${this.globalConfig.tencentAddressKey}` : `key=${this.globalConfig.tencentAddressKey}`
        const sig = md5(`/ws/district/v1/getchildren?${p}${this.globalConfig.tencentSK}`)
        const data = {
            key: this.globalConfig.tencentAddressKey,
            sig,
        }
        if(parentCode) data.id = parentCode
        const res = await this.fetch('https://apis.map.qq.com/ws/district/v1/getchildren', data, 'GET')
        return ctx.body = res
    }

    // 城市/区域搜索
    async searchAddress(ctx, next){
        const req = ctx.request;
        const { keyword, cityName = '北京' } = req.query
        const p = `boundary=region(${cityName})&key=${this.globalConfig.tencentAddressKey}&keyword=${keyword}`
        const sig = md5(`/ws/place/v1/search?${p}${this.globalConfig.tencentSK}`)
        const res = await this.fetch('https://apis.map.qq.com/ws/place/v1/search', {
            keyword: encodeURIComponent(keyword),
            boundary: encodeURIComponent(`region(${cityName})`),
            key: this.globalConfig.tencentAddressKey,
            sig,
        }, 'GET')
        return ctx.body = res
    }
}

module.exports = new AddressController()
