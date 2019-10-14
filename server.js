const WebSocket = require("ws");
//连接数据库
const mysql = require("mysql");
var connection = null;

const server = new WebSocket.Server({
  port: 8080
});

server.on("open", function() {
  console.log("connected");
});

server.on("close", function() {
  console.log("closed");
});

server.on("connection", function(ws, req) {
  console.log(ws);
  //处理请求
  opaRequest(req.url, ws);
  const ip = req.connection.remoteAddress;
  const port = req.connection.remotePort;
  const clientName = ip + port;
  console.log("%s is connected", clientName);
  // console.log(server.clients);

  // 发送欢迎信息给客户端
  ws.send("Welcome " + clientName);

  ws.on("message", function(message) {
    console.log("received: %s from %s", message, clientName);

    // 广播消息给所有客户端
    server.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        console.log(client);
        client.send(clientName + " -> " + message);
        ws.send("哈个鬼");
      }
    });
  });
});

/**
 * 切割url放回对应
 */
function getParams(url) {
  var params = url.split("?"); //取出地址后拼接的参数
  if (params.length < 2) {
    return {};
  }

  //取出含有等号的参数数组
  var paramArr = params[1].split("&");
  //循环遍历将数组转为对象
  var paramObject = {};
  paramArr.forEach(function(item) {
    var [key, value] = item.split("=");
    // var entries = item.split('=');
    // var key = entries[0]
    paramObject[key] = value;
  });

  return paramObject;
}

/**
 * 数据库操作
 * @param {*操作回调} curd
 */
function opaDatabase(curd) {
  //建立连接
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cc123456",
    database: "tecent"
  });

  if (!connection) {
    console.log("连接失败");
    return;
  }

  console.log("---------连接成功----------");
  curd();
  connection.end(); //关闭连接,防止内存的泄露
}
/**
 * url操作
 * @param {*} url
 */
function opaRequest(url, ws) {
  var paramObject = getParams(url);
  var api = paramObject.api;
  switch (api) {
    case "login":
      login(paramObject, ws);
      break;

    case "register":
      register(paramObject, ws);
      break;
    case "userSearch":
      userSearch(paramObject, ws);
      break;
    case "addFriend":
      addFriend(paramObject, ws);
    default:
      ws.send("请求地址不存在");
      break;
  }
}
/* ****************API接口********************** */
/**
 * 登录接口
 * @param {*} paramObject
 * @param {*} ws
 */
function login(paramObject, ws) {
  var username = paramObject.username;
  var password = paramObject.password;
  opaDatabase(function() {
    //存在sql注入隐患
    var sql = `select * from biz_user where username = "${username}" and password="${password}"`;

    connection.query(sql, function(err, result) {
      if (err) {
        var data = {
          resCode: 5000,
          resMsg: "服务器错误"
        };

        ws.send(JSON.stringify(result));
        return;
      }
      if (result.length) {
        var data = {
          resCode: 0000,
          resMsg: "操作成功",
          data: {
            user: result[0]
          }
        };
      } else {
        var data = {
          resCode: 1111,
          resMsg: "操作失败"
        };
      }
      ws.send(JSON.stringify(data));
    });
  });
}
/**
 * 注册
 * @param {*} paramObject
 * @param {*} ws
 */
function register(paramObject, ws) {
  var username = paramObject.username;
  var password = paramObject.password;
  var nickName = paramObject.nickName;

  var sql = `insert into biz_user(username,password,nick_name) values("${username}","${password}","${nickName}")`;
  opaDatabase(function() {
    connection.query(sql, function(err, result) {
      if (err) {
        var data = {
          resCode: 5000,
          resMsg: "服务器错误"
        };
        console.log(err);
        ws.send(JSON.stringify(data));
        return;
      }
      if (result.affectedRows > 0) {
        //受影响行数大于1
        var data = {
          resCode: 0000,
          resMsg: "操作成功",
          data: {
            userId: result.insertId
          }
        };
      } else {
        var data = {
          resCode: 1111,
          resMsg: "操作失败"
        };
      }
      ws.send(JSON.stringify(data));
    });
  });
}

/**
 * 用户查找接口
 * @param {*} paramObject
 * @param {*} ws
 */
function userSearch(paramObject, ws) {
  var username = paramObject.targetName;
  var sql = `select * from biz_user where username="${username}"`;

  opaDatabase(function() {
    connection.query(sql, function(err, result) {
      if (err) {
        var data = {
          resCode: 5000,
          resMsg: "服务器错误"
        };
        console.log(err);
        ws.send(JSON.stringify(data));
        return;
      }

      if (result.length) {
        var data = {
          resCode: 0000,
          resMsg: "操作成功",
          data: {
            user: {
              nickName: result[0].nick_name,
              username: result[0].username,
              userId: result[0].id
            }
          }
        };
      } else {
        var data = {
          resCode: 1111,
          resMsg: "操作失败"
        };
      }
      ws.send(JSON.stringify(data));
    });
  });
}

/**
 * 加好友
 * @param {*} paramObject
 * @param {*} ws
 */
function addFriend(paramObject, ws) {
  var friendsStr = "";

  //查找对应的好友列表
  //建立连接
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cc123456",
    database: "tecent"
  });

  connection.beginTransaction(function(err) {
    connection.query(
      `select * from biz_user where id="${paramObject.userId}"`,
      function(err, result) {
        if (err) {
          console.log(err);
          return;
        }

        if (result.length > 0) {
          var friends = JSON.parse(result[0].friends);
          console.log("----------获取到好友数组---------------" + friends);
          console.log(friends);
          friends.push(parseInt(paramObject.friendId));
          console.log(friends);
        }

        friendsStr = JSON.stringify(friends);
        console.log(friendsStr);

        if (!friendsStr) {
          var data = {
            resCode: 1111,
            resMsg: "操作失败"
          };
          ws.send(JSON.stringify(data));
          return;
        }
      }
    );
    setTimeout(function() {
      var sql = `update biz_user set friends="${friendsStr}" where id="${paramObject.userId}"`;
      connection.query(sql, function(err, result) {
        if (err) {
          var data = {
            resCode: 5000,
            resMsg: "服务器错误"
          };
          console.log(err);
          ws.send(JSON.stringify(data));
          return;
        }
        if (result.affectedRows > 0) {
          //受影响行数大于1
          var data = {
            resCode: 0000,
            resMsg: "操作成功"
          };
        } else {
          var data = {
            resCode: 1111,
            resMsg: "操作失败"
          };
        }
        ws.send(JSON.stringify(data));
      });
      // 提交事务
      connection.commit(function(err) {
        if (err) {
          connection.rollback(function() {
            throw err;
          });
        }
        console.log("success!");
      });
    }, 100);
  });
}

/**
 * 发消息接口
 * @param {*} paramObject
 * @param {*} ws
 */
function sendMessage(paramObject, ws) {}

/**
 * 好友列表
 * @param {*} paramObject 
 * @param {*} ws 
 */
function friendList(paramObject,ws){
  var userId = paramObject.userId;
  connection.beginTransaction(function(err){
    if(err){
      console.log(err);
      return;
    }
  })
}