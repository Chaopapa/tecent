//mock数据中间件
const Mock = require("mockjs");
//导入url
const url = require("url");
let map = {
  "/api/message/list"(response) {
    //拦截请求，制造mock假数据
    let result = Mock.mock({

      status:0,
      message:"请求成功",
      "data|10": [
        {
          "userId|+1": 1,
          imgsrc:'@image(104x104)',
          name: "@cname",
          content: "@cparagraph(1)",
          time: "@time('mm:ss')",
          messageCount:'@natural(1,99)'
        }
      ]
    });
    //序列化json
    let resultStr = JSON.stringify(result);
    //设置响应头
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(resultStr);
  }

};
function mockDataMiddleWare(request, response, next) {
  //解析url路径中的的pathname;
  let { pathname } = url.parse(request.url);
  //判断是否要拦截请求
  map[pathname] ? map[pathname](response) : next();
}

module.exports = mockDataMiddleWare;
