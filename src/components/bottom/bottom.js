(function() {
  function initTabBar(list) {
    var template =
      ' <a href="{{href}}" class="{{active}}">\
          <span class="iconfont {{icon}}"></span>\
          <span>{{name}}</span>\
      </a>';

    var elements = "";
    var tmpArr = window.location.href.split("/");
    var currentPath = tmpArr[tmpArr.length - 1].split(".")[0];
    for (var i = 0, count = list.length; i < count; i++) {
      var item = list[i];
      console.log(1);
      var eleTemplate = template.replace(/{{href}}/, item.href);
      eleTemplate = eleTemplate.replace(/{{icon}}/, item.icon);
      eleTemplate = eleTemplate.replace(/{{name}}/, item.text);
      eleTemplate = eleTemplate.replace(
        /{{active}}/,
        item.id == currentPath ? "active" : ""
      );
      elements += eleTemplate;
    }

    $(".pub-bottom").html(elements);
  }

  var data = [
    {
      id: "message",
      icon: "icon-message",
      text: "消息",
      href: "./message.html"
    },
    {
      id: "chatPeople",
      icon: "icon-lianxiren",
      text: "联系人",
      href: "./chatPeople.html"
    },

    { id: "see", icon: "icon-see", text: "看点", href: "./see.html" },

    { id: "activity", icon: "icon-xianxing_xingqiu", text: "动态", href: "../activity/activity.html" }
  ];

  initTabBar(data);
})();
