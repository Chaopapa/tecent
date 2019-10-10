function MyScroll(dom, options) {
  var options = options || {};
  options.probeType = 3;

  //判断是否是否能够刷新和加载
  options.canRefresh = false;
  options.canLoad = false;

  var myScroll = new IScroll(dom,options);
  var refreshImg = $(".myScroll-flash img");
  var loadImg = $(".myScroll-load img");
  myScroll.scrollTo(0, -50, 0);

  //监听正在滚动处理下拉刷新
  myScroll.on("scroll", function() {
    if (myScroll.y < 50) {
      refreshImg.attr("src", "../../asserts/refresh.png");
    }
  });
  //监听滚动停止事件。处理下拉刷新
  myScroll.on("scrollEnd", function() {
    if (myScroll.y >= 0) {
      //满足刷新条件加载
      (options.canRefresh&&options.refreshData) &&
        options.refreshData(function() {
          myScroll.scrollTo(0, -50, 300);
          myScroll.refresh();
        });
    } else if (myScroll.y > -50 && myScroll.y < 0) {
      //不刷新
      myScroll.scrollTo(0, -50, 300);
    }
  });

  //监听正在滚动事件处理上拉加载更多
  myScroll.on("scroll", function() {
    if (myScroll.y <= myScroll.maxScrollY) {
      loadImg.attr("src", "../../asserts/load.png");
    }
  });

  //监听滚动结束事件处理上拉加载更多
  myScroll.on("scrollEnd", function() {
    if (myScroll.y <= myScroll.maxScrollY) {
      //满足刷新条件
      (options.canLoad&&options.loadData) &&
        options.loadData(function() {
          myScroll.refresh();
        });
    } else if (
      myScroll.y > myScroll.maxScrollY &&
      myScroll.y < myScroll.maxScrollY + 50
    ) {
      myScroll.scrollTo(0, myScroll.maxScrollY + 50, 300);
    }
  });

  // 提供刷新dom的方法
  myScroll.on("beforeScrollStart", function() {
    console.log("boforeScrollStart");
    myScroll.refresh();
  });

  this.setCanRefresh = function(bool){
    options.canRefresh = bool;
  }

  this.setCanLoad = function(bool){
    options.canLoad = bool;
  }

  


}
