## 装修门户koa后台


### 本地启动   需要本地开启 redis mysql  
```
nondemon start
```

## centos启动  安装pm2  ecosystem.config.js为pm2配置文件
```
pm2 start ecosystem.config.js
// 或者
pm2 start --name "name" -- run centos
```

查看监控日志 ： pm2 monit   

## session机制未从 koa-session koa-redis 升级为 koa-session2 ioredis

{
    "presets": ["es2015"]
}

出现问题，尚未解决


babel-plugin-transform-es2015-modules-commonjs


## 商品分类模块查询
新建c_sp_genre_type表关联c_sp_genre表的type
```
SELECT 
	a.`id`,
	a.`pid`,
	a.`name`,
	b.`name` 
FROM 
	`c_sp_genre` a
JOIN 
	`c_sp_genre_type` b 
ON 
	a.`type` = b.`id`
WHERE 
	a.`pid` = 0 AND b.`id` = 1
```

## 微信分享后台接口的步骤
1.接口请求，通过路由经过 sdk 控制器，根据 url 进行获取签名值 （getSignature方法）   
2.getSignature方法：获取 access_token ,根据 access_token 获取 ticket ，然后将 ticket 和 url进行签名，同时添加分享时需要的 appId   
3.获取 ticket 的操作和 获取个人信息中的 获取access_token操作一致，先判断数据库是否有 ticket，如果有并且expires_in在有效期内，则进行下一步，如果没有ticket或者expires_in不在有效期，则调用微信接口 https://api.weixin.qq.com/cgi-bin/ticket/getticket 添加一系列参数来获取 ticket，并整理expires_in后存入数据库（将有效期设置为不到两小时， 这样保证请求在两小时内都是从数据库中获取的ticket，并在2小时有效期即将到来的之前有访问或者有效期到期后的访问是从微信接口获取的新的ticket），注意必须要先获取 access_token 才能根据 access_token去获取 ticket；   
4.签名步骤： 先依次生成 随机串、时间戳 ，然后根据微信文档的步骤，构建一个reg对象，对对象进行字典排序后进行 sha1 加密。然后返回包含 随机串、时间戳、加密值 的对象并添加 appID 后返回给前端   


## 日志系统
logs文件夹下     
分为 错误日志 和 相应日志  