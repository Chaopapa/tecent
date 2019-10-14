var http = require("http");
var fs = require("fs");
var path = require("path");

var server = http.createServer();

server.listen(8080, err => {
  if (err) {
    console.log("启动失败");
  } else {
    console.log("启动成功");
  }
});

server.on("request", function(req, res) {
  const { url } = req;
  const { ext} = path.parse(url);
  var pictureArr = [".jpg", ".png", ".jpeg", ".gif"];

  if (url == "/") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    fs.createReadStream("./dist/views/login.html").pipe(res);
  }
  console.log(ext);

  if (ext === ".html") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    fs.createReadStream("./dist" +url).pipe(res);

  } else if (index= pictureArr.indexOf(ext.toLocaleLowerCase()) >=0) {//图片资源
    console.log("---------图片资源------------");
    res.setHeader("Content-Type", "image/" + pictureArr[index]);
    fs.createReadStream("./dist" + url).pipe(res);

  } else if (ext === ".css") {//css资源
    res.setHeader("Content-Type", "text/css; charset=utf-8");
    fs.createReadStream("./dist" + url).pipe(res);

  }else if(ext===".js"){//js资源
    res.setHeader("Content-Type", "text/js; charset=utf-8");
    fs.createReadStream("./dist" + url).pipe(res);

  }else if(ext.indexOf(".ttf")>=0){//加载字体包资源
    console.log("---------字体包------------");
    res.setHeader("Content-Type", "font/ttf; charset=utf-8");
    fs.createReadStream(__dirname+"/dist" + url.split('?')[0]).pipe(res);

  }else if(ext.indexOf('.')==-1&&url!="/"){//访问路径后缀不含有点，表示访问html
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    fs.createReadStream("./dist/views" +url+'.html').pipe(res);
  }
  // req.parse(req.url);
});

// http.get("http://localhost:8080",res=>{
//
// });
