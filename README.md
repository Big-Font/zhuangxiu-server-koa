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