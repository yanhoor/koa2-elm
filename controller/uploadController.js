const BaseController = require('./baseController')

class UploadController extends BaseController{
    constructor() {
        super();
        this.upload = this.upload.bind(this)
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
}

module.exports = new UploadController()
