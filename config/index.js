module.exports = {
  development: {
    secret: 'jwt_secret',
    sessionKey: ['some secret hurr'],
    cookieKey: 'QR:zhuangshi',
    mysql: {
      host     : '47.95.223.216',   // 数据库地址
      user     : 'root',    // 数据库用户
      password : 'SHEN396689144@',   // 数据库密码
      database : 'jason_blog'  // 选中数据库
    }
  },
  production: {
    
  }
}