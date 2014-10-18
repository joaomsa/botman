function Message(target){
    "use strict";

    var that = this;

    that.target = target;

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

function SentMessage(ev){
    "use strict";

    var that = this;

    that.event = ev;
    Message.call(that, that.event.target);

    that.body = function(){
        return that.target.value;
    }

    that.botmanGenerated = function(){
        return !!that.event.botmanGenerated ? true : false;
    }

    that.hold = function(){
        that.event.stopPropagation();
    }
}

SentMessage.prototype = Object.create(Message.prototype);

function ReceivedMessage(replyElement, body){
    "use strict";

    var that = this;

    // Holy shiiiit this is horrible
    var textarea = replyElement.
        parentElement.
        parentElement.
        parentElement.
        parentElement.
        parentElement.
        parentElement.
        parentElement.
        parentElement.
        parentElement.
        parentElement.
        querySelector("textarea");

    Message.call(that, textarea);

    that.body = function(){
        return body;
    }
}

ReceivedMessage.prototype = Object.create(Message.prototype);
