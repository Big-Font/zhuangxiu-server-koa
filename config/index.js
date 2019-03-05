module.exports = {
  development: {
    secret: 'jwt_secret',
    sessionKey: ['some secret hurr'],
    cookieKey: 'QR:zhuangshi',
    mysql: {
      host     : '127.0.0.1',   // 数据库地址
      user     : 'root',    // 数据库用户
      password : 'SHEN396689144@',   // 数据库密码
      database : 'jason_blog',  // 选中数据库
    },
    // wangeditor 配置
    address: 'http://127.0.0.1:5000', 
    // md5 盐
    MD5_SUFFIX: () => {
      return 'sdfadfDFADFADFA_121$&^%&*!啊瞬间法律的类似阿里斯顿sdlfalsfasdfa'
    },
    // 邮箱验证码服务配置
    mailConfig: {
      host: 'smtp.qq.com',
      port: 587,
      auth: {
        user: '773983210@qq.com',
        pass: 'jacbkwmzdxcxbdbd'
      }
    },
    mail: {
      get code() {
        return () => {
          return Math.random().toString(16).slice(2,6).toUpperCase();
        }
      },
      // 过期时间 3分钟
      get expire() {
        return () => {
          return new Date().getTime()+3*60*60*1000
        }
      }
    },
    wechat: {
      token: 'qingrui520dalaishuizuchongzhi258',//微信后台配置的token
      // appid: 'wx8b44732d0addeb4f',//微信公众号的appid   jason
      appid: 'wxc8d29a5949bd1de9',  // 测试
      encodingAESKey: 'RwElu82ieB8rn8IwlDocSd3zAoO2YxOgKHzfpRgAnQm',//微信公众号的encodingAESKey
      // appSecret: 'd97f2f1e667c28368b34a78c631dd762',  //微信开发者密码AppSecret  json
      appSecret: '7f1e4dabc04919d9aab0712de9e1b33d',  //测试
    },
    wechatBaseUrl: 'https://api.weixin.qq.com/cgi-bin/',
    baseUrl: 'https://qingruiserver.wangshen.top/wechat'
  },
  production: {
    secret: 'jwt_secret',
    sessionKey: ['some secret hurr'],
    cookieKey: 'QR:zhuangshi',
    mysql: {
      host     : '127.0.0.1',   // 数据库地址
      user     : 'root',    // 数据库用户
      password : 'SHEN396689144@',   // 数据库密码
      database : 'zhuangxiu',  // 选中数据库
    },
    // wangeditor 配置
    address: 'https://qingruiserver.wangshen.top', 
    // md5 盐
    MD5_SUFFIX: () => {
      return 'sdfadfDFADFADFA_121$&^%&*!啊瞬间法律的类似阿里斯顿sdlfalsfasdfa'
    },
    // 邮箱验证码服务配置
    mailConfig: {
      host: 'smtp.qq.com',
      port: 587,
      auth: {
        user: '773983210@qq.com',
        pass: 'jacbkwmzdxcxbdbd'
      }
    },
    mail: {
      get code() {
        return () => {
          return Math.random().toString(16).slice(2,6).toUpperCase();
        }
      },
      // 过期时间 3分钟
      get expire() {
        return () => {
          return new Date().getTime()+3*60*60*1000
        }
      }
    },
    wechat: {
      token: 'qingrui520dalaishuizuchongzhi258',//微信后台配置的token
      // appid: 'wx8b44732d0addeb4f',//微信公众号的appid   jason
      appid: 'wxc8d29a5949bd1de9',  // 测试
      encodingAESKey: 'RwElu82ieB8rn8IwlDocSd3zAoO2YxOgKHzfpRgAnQm',//微信公众号的encodingAESKey
      // appSecret: 'd97f2f1e667c28368b34a78c631dd762',  //微信开发者密码AppSecret  json
      appSecret: '7f1e4dabc04919d9aab0712de9e1b33d',  //测试
    },
    wechatBaseUrl: 'https://api.weixin.qq.com/cgi-bin/',
    baseUrl: 'https://qingruiserver.wangshen.top/wechat'
  }
}