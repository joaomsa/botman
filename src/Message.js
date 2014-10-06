function Message(ev){
    "use strict";
    var that = this;

    that.event = ev;

    that.body = function(){
        return that.event.target.value;
    }

    that.botmanGenerated = function(){
        return !!that.event.botmanGenerated ? true : false;
    }

    that.send = function(body){
        that.event.target.value = body;
    }

    that.sendNow = function(body){
        that.event.target.value = body;

        // the gambiarra begins
        if (navigator.userAgent.contains("Chrome")){
            var ev = Keyfaker.keydown(13);
            ev.botmanGenerated = true;
            that.event.target.dispatchEvent(ev);
        } else {
            that.event.botmanGenerated = true;
            that.event.target.dispatchEvent(that.event);
        }

    }

    that.hold = function(){
        that.event.stopPropagation();
    }
}
