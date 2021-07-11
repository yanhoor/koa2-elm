const {typeList, IdModel} = require('../mongodb/model/idModel')
const chalk = require('chalk')

class BaseController{
    typeList = typeList;

    // 获取数据库id
    async createId(type){
        if(!this.typeList.includes(type)){
            console.log(chalk.red('id 类型错误'));
            throw new Error('id 类型错误');
        }
        try{
            const d = await IdModel.findOne()
            console.log('base create id ', d)
            d[type] ++
            await d.save()
            return d[type]
        }catch(e){
            console.log(chalk.red(`获取id数据失败${e}`));
        }
    }
}

module.exports = BaseController
