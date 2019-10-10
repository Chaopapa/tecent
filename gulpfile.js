// 使用严格模式
'use strict';

// gulp模块
const gulp = require('gulp');

//gulp服务模块
const webserver = require('gulp-webserver');

//中间件模块
const mockDataMiddleware = require('./data/mockDataMiddleware');

// 压缩js
const uglify = require('gulp-uglify');

// 压缩css
const minifyCss = require('gulp-minify-css');

// 压缩html
const minifyHtml = require('gulp-minify-html');

// 压缩图片//const imagemin = require('gulp-imagemin');

// 编译sass
const sass = require('gulp-sass');

// 文件合并（js、css）
const concat = require('gulp-concat');

// 重命名
const rename = require('gulp-rename');

// ES6转ES5
const babel = require('gulp-babel');

// 错误处理提示
const plumber = require('gulp-plumber');

// 控制task中的串行和并行。（gulp默认是并行）
// 串行是指多个任务时，各个任务按顺序执行，完成一个之后才能进行下一个。
// 并行指的是多个任务可以同时执行。
const runSequence = require('gulp-run-sequence');

//压缩文件
const zip = require('gulp-zip');

// 删除文件
//const clean = require('gulp-clean');

// 自动刷新
var server = require('browser-sync').create(); //执行函数返回对象

// 自动加载
// const load = require('gulp-load-plugins')();//立即执行之后得到一个加载对象


// 创建任务
gulp.task('js', function() {
    // 取得scripts下的所有为.js的文件（**/的意思是包含所有子文件夹)
    gulp.src('app/static/scripts/**/*.js')
        //错误管理模块（有错误时会自动输出提示到终端上）
        .pipe(plumber())
        //合并同一目录下的所有文件,并指定文件名
        .pipe(concat('main.js'))
        //js压缩
        .pipe(uglify())
        //将合并压缩后的文件输出到dist/static/scripts下（如没有dist目录则自动生成dist）
        .pipe(gulp.dest('dist/static/scripts'))
});

gulp.task('sass', function() {
    // 取得sass下的所有为.scss的文件（**/的意思是包含所有子文件夹)
    gulp.src('app/static/sass/**/*.scss')
        //错误管理模块（有错误时会自动输出提示到终端上）
        .pipe(plumber())
        //编译sass文件使其转换为css文件
        .pipe(sass())
        //合并同一目录下的所有文件,并指定文件名
        .pipe(concat('main.css'))
        //css压缩
        .pipe(minifyCss())
        //将合并压缩后的文件输出到dist/static/css下（假如没有dist目录则自动生成dist目录）
        .pipe(gulp.dest('dist/static/css'))
});

gulp.task('html', function() {
    // 首先取得app/views下的所有为.html的文件（**/的意思是包含所有子文件夹)
    gulp.src('app/views/**/*.html')
        //错误管理模块（有错误时会自动输出提示到终端上）
        .pipe(plumber())
        //html压缩
        .pipe(minifyHtml())
        //将压缩后的文件输出到dist/views下（假如没有dist目录则自动生成dist目录）
        .pipe(gulp.dest('dist/views'))
});

gulp.task('images', function() {
    // 首先取得app/static/images下的所有为.{png,jpg,jpeg,ico,gif,svg}后缀的图片文件（**/的意思是包含所有子文件夹)
    gulp.src('app/static/images/**/*.{png,jpg,jpeg,ico,gif,svg}')
        //错误管理模块（有错误时会自动输出提示到终端上）
        .pipe(plumber())
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 6 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        //将压缩后的图片输出到dist/static/images下（假如没有dist目录则自动生成dist目录）
        .pipe(gulp.dest('dist/static/images'))
});

gulp.task('clean', function() {
    // 首先取得dist/*下的所有文件,read: false 返回空值，也就是并不会去读取文件
    gulp.src('dist/*', { read: false })
        //删除dist/*下的所有文件
        .pipe(clean())
})

gulp.task('build', function() {
    // 首先取得dist/*下的所有文件
    gulp.src('dist/*')
        //错误管理模块（有错误时会自动输出提示到终端上）
        .pipe(plumber())
        //将dist/*下的所有文件进行压缩打包生成为build.zip文件
        .pipe(zip('build.zip'))
        //将生成的build.zip文件输出到build下（假如没有build目录则自动生成build目录）
        .pipe(gulp.dest('build'))
})

gulp.task('watch', function() {
    //监听各个目录的文件，如果有变动则执行相应的任务操作文件
    gulp.watch('app/static/scripts/**/*.js', ['js']);
    gulp.watch('app/static/sass/**/*.scss', ['sass']);
    gulp.watch('app/views/**/*.html', ['html']);
})

gulp.task('redist', function() {
    //先运行clean，然后并行运行html,js,sass,images,watch
    //如果不使用gulp-run-sequence插件的话，由于gulp是并行执行的
    //有可能会出现一种情况（其他文件处理速度快的已经处理完了，然后clean最后才执行，会把前面处理完的文件删掉，所以要用到runSequence）
    runSequence('clean', ['html', 'sass', 'js', 'images'], 'watch')
})

//在终端上输入gulp命令，会默认执行default任务，并执行redist任务
gulp.task('default', ['redist']);

gulp.task('webserver', ()=>{

  gulp.src('./')//该文件夹是服务器的根路径
  .pipe(
    webserver({
      host: '127.0.0.1',
      port: '8089',
      livereload: true,//热更新
      directoryListing: true,//是否文件夹列表
      open: true,//打开浏览器
      // 中间件,拦截请求
      middleware: mockDataMiddleware
    })
  );
  
});