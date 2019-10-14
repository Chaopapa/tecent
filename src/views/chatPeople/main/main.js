;(function() {
  var chatPeopleList = new MyScroll(".chatPeople-main-list", {
    click: true,
    tap: true
  });

  //开启一个socket连接,请求好友列表
  var socket;
  var userId = localStorage.getItem('userId');
  if (!window.WebSocket) {
    window.WebSocket = window.MozWebSocket;
  }
  if (window.WebSocket) {
    socket = new WebSocket(
      "ws://localhost:8080/ws?api=friendList&userId=" +
      userId       
    );
    socket.onmessage = function(event) {
      var dataJSON = JSON.parse(event.data);
      if (dataJSON.resCode == "0000") {
        //请求成功并返回数据
        location.href =
          "./people.html?nickName=" +
          dataJSON.data.user.nickName +
          "&username=" +
          dataJSON.data.user.username +
          "&userId=" +
          dataJSON.data.user.userId;
      } else {
        alert("未找到对应用户");
        $(".friend-search input").val("");
      }
    };
    socket.onopen = function(event) {};
    socket.onclose = function(event) {};
  } else {
    alert("你的浏览器不支持 WebSocket！");
  }
})();
