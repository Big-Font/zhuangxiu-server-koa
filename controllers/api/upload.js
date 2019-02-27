import fs from 'fs';  //文件模块
import path from 'path';
import mkdirp from 'mkdirp';
import config from '../../config';
import uuid from 'uuid';

class UploadControllers {
    // 图片、文件上传接口 配置
    async upload(ctx) {
        const pidPath = ctx.params.pid;
        const { fields,files } = ctx.request;
        let file = JSON.parse(JSON.stringify(files)).file; // 获取上传文件
        let reader = fs.createReadStream(file.path);
        // 拼接文件路径
        const uploadPath = path.join(__dirname.replace('/controllers/api', ''), `/public/images/${pidPath}`); 
        // 判断文件夹是否存在
        const flag = fs.existsSync(uploadPath); 
        console.log(`${uploadPath} 这个路径存在判断的结果是： ${flag}`);
        // 如果不存在创建文件夹
        if(!flag) mkdirp.sync(uploadPath);
        let nameUUID = uuid.v1().replace(/\-/g, '')
        let filePath = path.join(__dirname.replace('/controllers/api', ''), 'public/images/'+pidPath+'/') + `${nameUUID}${file.name}`;
        let newPath = `${config[process.env.NODE_ENV].address}/images/${pidPath}/${nameUUID}${file.name}`;
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