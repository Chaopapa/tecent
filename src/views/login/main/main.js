(function() {
  //登录
  $(".login").on("click", function() {
    var socket;
    if (!window.WebSocket) {
      window.WebSocket = window.MozWebSocket;
    }
    if (window.WebSocket) {
      var username = $(".username").val();
      var password = $(".password").val();
     
      socket = new WebSocket(
        "ws://localhost:8080/ws?api=login&username=" +
          username +
          "&password=" +password +""
      );
      socket.onmessage = function(event) {
        console.log(event.data);
        var dataJSON = JSON.parse(event.data);
        // var dataJSON =event.data;
        if (dataJSON.resCode == "0000") {
          console.log(dataJSON.data.user);
          localStorage.setItem("userId", dataJSON.data.user.id);
          location.href = './message.html';
          
        } else {
          alert("登陆失败");
        }
        // console.log((event.data).parseJSON);
      };
      socket.onopen = function(event) {
        //   var ta = document.getElementById("responseText");
        //   //   ta.value = "连接开启!";
      };
      socket.onclose = function(event) {
        //   var ta = document.getElementById("responseText");
        //   //   ta.value = ta.value + "连接被关闭";
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
  });
})();
