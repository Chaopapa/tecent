;(function() {
    var listBox = $('.message-main ul')
  var messageList = new MyScroll(".message-main", {
    click: true,
    tap: false,
    refreshData: function(endScroll) {
     messageList.setCanRefresh(false);
     messageList.setCanLoad(false);
      loadData(params, function(data) {
        params.page = 1;
        listBox.html(createElement(data));
        endScroll();
       messageList.setCanRefresh(true);
       messageList.setCanLoad(true);
      });
    },
    loadData: function(endScroll) {
     messageList.setCanRefresh(false);
     messageList.setCanLoad(false);
      loadData(params, function(data) {
        params.page++;
        listBox.append(createElement(data));
        endScroll();
       messageList.setCanRefresh(true);
       messageList.setCanLoad(true);
      });
    }
  });

  function loadData(params, callback) {
    $.ajax({
      url:MESSAGE_LIST_API,
      method: "get",
      dataType: "json",
      data: params,
      success: function(data) {
        if (data.status == "0") {
          callback(data.data);
        } else {
          console.log("请求失败");
        }
      },
      fail: function(err) {
        console.log(err);
      }
    });
  }

  function createElement(data) {
    var ele = "";
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      ele += '<li data-user="'+item.userId+'">\
                <img src="'+item.imgsrc+'" alt="">\
                <div class="message-item-main">\
                    <h3>'+item.name+'</h3>\
                    <p>'+item.content+'</p>\
                </div>\
                <div class="message-item-info">\
                    <span class="message-item-info-time">'+item.time+'</span>\
                    <span  class="message-item-info-count">'+item.messageCount+'</span>\
                </div>\
          </li>';
    }

    return ele;
  }

  var params = {
    page: 1,
    count: 10
  };
  messageList.setCanRefresh(true);
  messageList.setCanLoad(true);
  loadData(params, function(data) {
    params.page = 1;
    listBox.html(createElement(data));
  });
})();
