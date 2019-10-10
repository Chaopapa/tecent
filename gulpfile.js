
// gulp模块
const gulp = require('gulp');
//gulp服务模块
const webserver = require('gulp-webserver');
//中间件模块
const mockDataMiddleware = require('../data/mockDataMiddleware');

gulp.task('webserver', ()=>{

  gulp.src('./')//该文件夹是服务器的根路径
  .pipe(
    webserver({
      host: '127.0.0.1',
      port: '8082',
      livereload: true,//热更新
      directoryListing: true,//是否文件夹列表
      open: true,//打开浏览器
      // 中间件,拦截请求
      middleware: mockDataMiddleware
    })
  );
  
});