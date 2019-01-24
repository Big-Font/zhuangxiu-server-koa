import fs from 'fs';  //文件模块
import path from 'path';
import config from '../../config';

class UploadControllers {
    // 图片、文件上传接口 配置
    async upload(ctx) {
        const { fields,files } = ctx.request;
        let file = JSON.parse(JSON.stringify(files)).file; // 获取上传文件
        let reader = fs.createReadStream(file.path);
        let filePath = path.join(__dirname.replace('/controllers/admin', ''), 'public/images/ueditor/') + `${file.name}`;
        let newPath = `${config[process.env.NODE_ENV].address}/images/ueditor/${file.name}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        
        return ctx.body = {
            code: 0,
            fileList: [newPath]
        }
    }
}

module.exports = new UploadControllers();