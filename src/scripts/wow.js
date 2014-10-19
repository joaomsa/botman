// Wow intensifies ------------------------------------------------------------

(function(){
    "use strict";

    var img = "http://i.imgur.com/W05Q4XR.gif";

    robot.reply(/(wo+w)/i, function(msg){
        msg.replace(img + " ");
        setTimeout(function(){
            msg.send("");
        }, 1000);
    });
}());
