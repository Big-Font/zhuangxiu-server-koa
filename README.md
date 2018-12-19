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

