(function() {
  //监听键盘事件，回车发送消息
  $(".chat-bottom-ipt input").on("keyup", function(event) {
    if (event.keyCode == "13") {
      console.log("发送消息");
      sendMessage(function() {
        send($(".chat-bottom-ipt input").val());
        $(".chat-bottom-ipt input").val('');
      });
    }
  });

  function sendMessage(cb) {
    cb();
  }
  //开启一个socket连接
  var socket;
  if (!window.WebSocket) {
    window.WebSocket = window.MozWebSocket;
  }
  if (window.WebSocket) {
    socket = new WebSocket("ws://localhost:8080/ws?userId=1&api=login");
    socket.onmessage = function(event) {
      var ta = document.getElementById("responseText");
    //   ta.value = ta.value + "\n" + event.data;
    };
    socket.onopen = function(event) {
      var ta = document.getElementById("responseText");
    //   ta.value = "连接开启!";
    };
    socket.onclose = function(event) {
      var ta = document.getElementById("responseText");
    //   ta.value = ta.value + "连接被关闭";
    };
  } else {
    alert("你的浏览器不支持 WebSocket！");
  }

  function send(message) {
    if (!window.WebSocket) {
      return;
    }
    if (socket.readyState == WebSocket.OPEN) {
      socket.send(message);
    } else {
      alert("连接没有开启.");
    }
  }
})();
