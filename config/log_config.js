var path = require('path');

//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs')

//错误日志目录
var errorPath = "/error";
//错误日志文件名
var errorFileName = "error";
//错误日志输出完整路径
var errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
 
//响应日志目录
var responsePath = "/response";
//响应日志文件名
var responseFileName = "response";
//响应日志输出完整路径
var responseLogPath = baseLogPath + responsePath + "/" + responseFileName;

module.exports =  {
    replaceConsole: true,
    // appender定义必须具有属性type（字符串） - 其他属性取决于appender类型。
    appenders: {
        stdout: {//控制台输出
            type: 'stdout'
        },
        req: {//请求日志
            type: 'dateFile',
            filename: responseLogPath,
            path: responsePath,
            pattern: 'req-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        err: {//错误日志
            type: 'dateFile',
            filename: errorLogPath, 
            path: errorPath,
            pattern: 'err-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
    },
    //设置logger名称对应的的日志等级, 用于定义自定义日志级别或重新定义现有日志级别; ALL <TRACE <DEBUG <INFO <WARN <ERROR <FATAL <MARK <OFF - 请注意，OFF用于关闭日志记录，而不是实际记录的级别
    categories: {
        default: { appenders: ['stdout', 'req'], level: 'info' },//appenders:采用的appender,取appenders项,level:设置级别
        err: { appenders: ['stdout', 'err'], level: 'error' }
    },
    pm2: true,
}