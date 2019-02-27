// module.exports = {
//   apps : [
//     {
//       name: 'QRserver',
//       script: './bin/www',
//       cwd: "./",
//       interpreter: "babel-node",
//       node_args: "--harmony",
//       // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
//       args: '',
//       instances: 1,
//       //watch: false,
//       //autorestart: true,
//       watch: [  // 监控变化的目录，一旦变化，自动重启
//      	 "bin",
//      	 "routes"
//       ],
//       ignore_watch : ["./node_modules", "./public/*"],
//       max_memory_restart: '1G',
//       env: {
//         NODE_ENV: 'production'
//       },
//       env_production: {
//         NODE_ENV: "production",
//       }
//     }
//   ],
// };

module.exports = {
  "apps" : [
    {
      name: "QRserver",
      script: "./bin/www",
      cwd: "./",
      interpreter: "babel-node",
      node_args: "--harmony",
      watch: false,
      ignore_watch: ["*"],
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: "production",
      }
    }
  ]
}
