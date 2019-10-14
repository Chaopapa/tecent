;(function(){
    //获取用户信息填入页面
    var params = location.href.split('?')[1];
    console.log(params);
    var paramsArr = params.split('&');
    var paramsObject = {};
    for(var i=0;i<paramsArr.length;i++){
        var [key,value] = paramsArr[i].split('=');
        
        paramsObject[key] = decodeURIComponent(value);

        if(value.endsWith('#')){
            value = value.substring(0,value.length-1);
        }
    }
    console.log(paramsObject);
    $('.username').text("QQ:"+paramsObject.username);
    $('.nickName').text(paramsObject.nickName);

    //跳转发消息页面
    $('.send-message').on('click',function(){
        location.href = './chat.html';
    });

    //添加好友
    $('.add-friend').on('click',function(){
        var friendId = paramsObject.userId;
        var userId = localStorage.getItem('userId');
        var socket;
      if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
      }
      if (window.WebSocket) {
        socket = new WebSocket("ws://localhost:8080/ws?api=addFriend&friendId="+friendId+"&userId="+userId);
        socket.onmessage = function(event) {
            var dataJSON= JSON.parse(event.data);
            if(dataJSON.resCode=='0000'){//请求成功并返回数据
                location.href = './chatPeople.html';
            }else{
                alert("操作失败");
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
    });
})()