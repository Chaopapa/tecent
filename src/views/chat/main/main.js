(function(){
    
    //监听键盘事件，回车发送消息
    $('.chat-bottom-ipt input').on('keyup',function(event){
        if(event.keyCode=='13'){
            console.log("发送消息");
            sendMessage(function(){
                $('.chat-bottom-ipt input').val('');
            });
        }
    });

    function sendMessage(cb){
        
        cb();
    }

})();