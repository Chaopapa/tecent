// gulp模块
const {src,dest,watch,parallel} = require("gulp");
const concat = require('gulp-concat');
const minifyCss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const minifyHTML = require('gulp-minify-html')
//gulp服务模块
const webserver = require("gulp-webserver");
//导入CSS配置
const cssConfig = require("./build/css.config");
//导入js配置
const jsConfig = require("./build/js.config");




//处理所有的CSS文件
const handleCSS = function(cb){
  Object.entries(cssConfig).forEach((item)=>{
    let key = item[0];
    let value = item[1];
    src(value)
    .pipe(concat(`${key}.css`))
    .pipe(minifyCss())
    .pipe(dest("./dist/css"));
  });
  cb();
}

// 处理字体包
const handleFont = ()=>{
  return src('./src/css/font/*.ttf')
  .pipe(dest('./dist/css'));
}


// 处理js库
const handleLibJS = () => {
  return src('./src/lib/**/*.js')
  .pipe(dest('./dist/lib'));
}

//处理布局flexible.js
const handleFlexible = ()=>{
  return src('./src/utils/flexible.js')
  .pipe(dest('./dist/js'));
}

const handleJS = (cb) => {
  // 处理所有的css
  Object.entries(jsConfig).forEach((item)=>{
    let key =item[0];
    let value =item[1];
    src(value)
    .pipe(concat(`${key}.js`))
    // .pipe(uglify())
    .pipe(dest('./dist/js'));
  })
  // 结束任务
  cb();
}

// 处理图片
const handleIMG = () => {
  return src('./src/asserts/**/*')
  .pipe(dest('./dist/asserts'));
}

//处理HTML
const handleHTML = ()=>{
  return src(require('./build/html.config.js'))
  .pipe(minifyHTML())
  .pipe(dest('./dist/views'));
}



//文件监听
const watchTask = ()=>{
  //ignoreInitial第一次启动时候回打包模块
  return watch('./src/**/*', {ignoreInitial: false, delay: 500}, 
  parallel(handleCSS, handleLibJS,handleFlexible,handleJS,handleFont,handleHTML,handleIMG));
};


const server = function() {
  return src("./") //该文件夹是服务器的根路径
    .pipe(
      webserver({
        host: "127.0.0.1",
        port: "8082",
        livereload: true, //热更新
        directoryListing: true, //是否文件夹列表
        open: false, //打开浏览器
        // 中间件,拦截请求
        middleware: require("./data/mockDataMiddleware")
      })
    );
};



if(process.env.NODE_ENV === 'production'){
  exports.default = parallel(handleCSS, handleLibJS,handleFlexible,handleJS,handleFont,handleHTML,handleIMG);
}else{
  exports.default= parallel(
    watchTask,
    server
  );
}
