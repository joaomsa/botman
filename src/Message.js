function Message(ev){
    "use strict";
    var that = this;

    if (ev instanceof Event) {
        that.event = ev;
        that.target = that.event.target;
    } else {
        that.target = ev;
    }

    that.body = function(){
        return that.target.value;
    }

    // [Deprecate] 
    that.botmanGenerated = function(){
        return !!that.event.botmanGenerated ? true : false;
    }

    // [Deprecate]
    that.hold = function(){
        that.event.stopPropagation();
    }

    that.send = function(body){
        that.target.value = body;

        var ev = Keyfaker.keydown(Keyfaker.SPACE);
        ev.botmanGenerated = true;
        that.target.dispatchEvent(ev);
    }

    that.sendNow = function(body){
        that.target.value = body;

        var ev = Keyfaker.keydown(Keyfaker.ENTER);
        ev.botmanGenerated = true;
        that.target.dispatchEvent(ev);
    }
}
