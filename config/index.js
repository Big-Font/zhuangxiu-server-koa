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
    address: 'http://127.0.0.1:4003', 
    // md5 盐
    MD5_SUFFIX: () => {
      return 'sdfadfDFADFADFA_121$&^%&*!啊瞬间法律的类似阿里斯顿sdlfalsfasdfa'
    }  
  },
  production: {
    
  }
}