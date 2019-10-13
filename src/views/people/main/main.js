;(function(){
    //获取用户信息填入页面
    var params = location.href.split('?')[1];
    console.log(params);
    var paramsArr = params.split('&');
    var paramsObject = {};
    for(var i=0;i<paramsArr.length;i++){
        var [key,value] = paramsArr[i].split('=');
        paramsObject[key] = decodeURIComponent(value);
    }
    console.log(paramsObject);
    $('.username').text("QQ:"+paramsObject.username);
    $('.nickName').text(paramsObject.nickName);
})()