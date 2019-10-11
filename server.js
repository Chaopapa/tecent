const WebSocket = require("ws");

console.log(WebSocket);
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
  const ip = req.connection.remoteAddress;
  const port = req.connection.remotePort;
  const clientName = ip + port;
  console.log("%s is connected", clientName);

  // 发送欢迎信息给客户端
  ws.send("Welcome " + clientName);

  ws.on("message", function(message) {
    console.log("received: %s from %s", message, clientName);

    // 广播消息给所有客户端
    server.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(clientName + " -> " + message);
      }
    });
  });
});
