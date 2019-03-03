/*
*   接口层数据
*   分为 两层  /api 为前端路由,路由存储在/index目录下   /admin 为后台管理路由，路由存储在/admin文件夹下
*   ===========================================
*   逻辑层
*   同样也分为两层   
*
*/
import { batchProcessTask } from '../lib/task';

let res = batchProcessTask();

const adminRouter = require('./admin');
const apiRouter = require('./api');
const ueditorRouter = require('./admin/ueditor');
const uploadRouter = require('./admin/upload');
const wechatRouter = require('./wechat');

export { adminRouter, apiRouter, ueditorRouter, uploadRouter, wechatRouter };
