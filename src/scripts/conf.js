// Configuration --------------------------------------------------------------

(function(){
    "use strict";

    robot.comply(/rename (\b\w+\b)$/i, function(msg){
        robot.name = msg.match[1];
        GM_setValue("name", robot.name);
        msg.send("");
    });
}());
