(function() {
  //监听键盘事件，回车发送消息
  $(".friend-search input").on("keyup", function(event) {
    if (event.keyCode == "13") {
      //开启一个socket连接
      var socket;
      if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
      }
      if (window.WebSocket) {
        socket = new WebSocket("ws://localhost:8080/ws?api=userSearch&targetName="+$('.friend-search input').val());
        socket.onmessage = function(event) {
            var dataJSON= JSON.parse(event.data);
            if(dataJSON.resCode=='0000'){//请求成功并返回数据
                location.href = './people.html?nickName='+dataJSON.data.user.nickName+'&username='+dataJSON.data.user.username+'&userId='+dataJSON.data.user.userId;
            }else{
                alert("未找到对应用户");
                $('.friend-search input').val('');
            }
        };
        socket.onopen = function(event) {
         
        };
        socket.onclose = function(event) {
         
        };
      } else {
        alert("你的浏览器不支持 WebSocket！");
      }
    }
  });
})();
