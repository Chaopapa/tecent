//mock数据中间件
const Mock = require("mockjs");
//导入url
const url = require("url");
//导入jcarry模块
const jCarry = require("../app/static/script/jcarry");
let map = {
  "/api/message/refresh"(response) {
    //拦截请求，制造mock假数据
    let result = Mock.mock({
      "list|10": [
        {
          "id|+1": 1,
          "title|1": ["赞同与感谢", "邀请", "评论与转发"],
          desc: "@cname()的邀请请你会回答",
          content: "@cparagraph(1)",
          imgSrc: Mock.Random.image("90x90", jCarry.getRandomColor()),
          time: "1天前"
          // 'timeText':'@time 天前',
        }
      ]
    });
    //序列化json
    let resultStr = JSON.stringify(result);
    //设置响应头
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(resultStr);
  },

  "/api/message/load"(response) {
    let result = Mock.mock({
      "list|10": [
        {
          "id|+1": 1,
          "title|1": ["赞同与感谢", "邀请", "评论与转发"],
          desc: "@cname()、@cname等21人赞同你的会答",
          content: "@cparagraph(1)",
          imgSrc: Mock.Random.image("90x90", jCarry.getRandomColor()),
          time: "2天前"
          // 'timeText':'@time 天前',
        }
      ]
    });

    //序列化json
    let resultStr = JSON.stringify(result);
    //设置响应头
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(resultStr);
  },
  //主页
  "/api/index/noticeRefresh"(response) {
    let result = Mock.mock({
      "list|10": [
        {
          name: "@cname",
          imgSrc: Mock.Random.image("33x33", jCarry.getRandomColor()),
          content: "@cparagraph(7,10)"
        }
      ]
    });
    //序列化json
    let resultStr = JSON.stringify(result);
    //设置响应头
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(resultStr);
  },
  "/api/index/noticeLoad"(response) {
    let result = Mock.mock({
      "list|5": [
        {
          name: "@cname",
          imgSrc: Mock.Random.image("33x33", jCarry.getRandomColor()),
          content: "@cparagraph(7,10)"
        }
      ]
    });
    //序列化json
    let resultStr = JSON.stringify(result);
    //设置响应头
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(resultStr);
  },
  //热榜刷新
  "/api/index/rankRefresh"(response) {
    let result = Mock.mock({
      "list|50": [
        {
          "id|+1":1,
          title: "@ctitle(7,15)",
          imgSrc: Mock.Random.image("139x139", jCarry.getRandomColor()),
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
