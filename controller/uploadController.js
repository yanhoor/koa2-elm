const BaseController = require('./baseController')

class UploadController extends BaseController{
    constructor() {
        super();
        this.upload = this.upload.bind(this)
        this.delete = this.delete.bind(this)
    }

    async upload(ctx, next){
        const req = ctx.request;
        const { lastFilePath } = req.body
        let path = ''
        try{
            path = await this.saveLocalFile(req.files.file)
        }catch(e){
            ctx.body = {
                success: false,
                msg: '上传失败'
            }
        }
        if(lastFilePath){
            await this.deleteFile(lastFilePath)
        }
        ctx.body = {
            success: true,
            path: path
        }
    }

    async delete(ctx, next){
        const req = ctx.request;
        const { path } = req.body
        try{
            if(!path) throw new Error('路径不能为空')
        }catch(e){
            ctx.body = {
                success: false,
                msg: e.message
            }
            return false
        }

        await this.deleteFile(path)
        ctx.body = {
            success: true,
            msg: '删除成功'
        }
    }
}

module.exports = new UploadController()
