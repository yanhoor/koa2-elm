const {typeList, IdModel, IdType} = require('../mongodb/model/idModel')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const config = require('config-lite')(__dirname);

class BaseController{
    typeList = typeList
    idType = IdType

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

    async upload(file){
        return new Promise(async (resolve, reject) => {
            const ext = path.extname(file.name)
            if(!config.imgTypeList.includes(ext)){
                return reject(`仅允许以下格式：${config.imgTypeList.join('/')}`)
            }

            let img_id
            try{
                img_id = await this.createId(this.idType.IMG_ID)
            }catch(e){
                console.log('获取图片id失败')
                return reject('生成图片id失败')
            }

            const hashName = (new Date().getTime() + Math.ceil(Math.random()*10000)).toString(16) + img_id
            const extname = path.extname(file.name)
            const fullName = hashName + extname
            const savePath = './public/upload/' + fullName // 相对根目录路径
            try{
                fs.renameSync(file.path, savePath)
                return resolve(fullName)
            }catch(e){
                console.log('保存图片失败--------------', e.message)
                return reject('保存图片失败')
            }
        })
    }
}

module.exports = BaseController
