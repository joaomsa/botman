// Google Maps ----------------------------------------------------------------

(function(){
    "use strict";

    robot.comply(/map( me)?(.+)/i, function(msg){
        var location = msg.match[2];

        var url = "http://maps.google.com/maps?q=" +
            encodeURIComponent(location) +
            "&hl=en&sll=37.0625,-95.677068&sspn=73.579623,100.371094&vpsrc=0&hnear=" +
            encodeURIComponent(location) +
            "&t=m&z=11";

        msg.replace(url + " ");
        setTimeout(function(){
            msg.replace("");
        }, 1000);
    });
}());
