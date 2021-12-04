
var fs = require('fs');
module.exports = {
  // devServer: {
  //   https: {
  //     key: fs.readFileSync('./certs/example.com+5-key.pem'),
  //     cert: fs.readFileSync('./certs/example.com+5.pem'),
  //   },
  //   public: 'https://192.168.100.5:8082/'
  // },
  // devServer: {
  //   https: true,
  // }, 

  publicPath: process.env.NODE_ENV === 'production'
  ? '/banners/orbis/'
  : '/',
  assetsDir: './', 
};
