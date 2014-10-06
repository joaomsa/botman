// ==UserScript==
// @name        botman
// @namespace   botman
// @description Botman is here to speed up those witty responses on facebook
// @include     https://www.facebook.com/*
// @version     1.1.0
// @grant       GM_xmlhttpRequest
// ==/UserScript==

function Botman(name){
    "use strict";
    var that = this;

    that.name = name;

    that.hearCaptures = [];
    that.hearCallbacks = [];

    that.responseCaptures = [];
    that.responseCallbacks = [];

    that.hear = function(capture, callback){
        that.hearCaptures.push(capture);
        that.hearCallbacks.push(callback);
    };

    that.respond = function(capture, callback){
        that.responseCaptures.push(capture);
        that.responseCallbacks.push(callback);
    };

    that.interpret = function(msg){
        if (msg.botmanGenerated())
            return;

        var cmdMatch = msg.body().match(new RegExp("^" + that.name + "\\s*(.*)", "i"));
        if (!!cmdMatch){ // Triggers registered with respond
            var cmd = cmdMatch[1];
            for (var i = 0; i < that.responseCaptures.length; i++){
                var match = cmd.match(that.responseCaptures[i]);
                if (!!match){
                    //keep it in the oven before sending
                    msg.hold();
                    msg.match = match;
                    // execute response callback with message
                    that.responseCallbacks[i](msg);
                    return;
                }
            }
        } else { // Triggers registered with hear
            for (var i = 0; i < that.hearCaptures.length; i++){
                var match = msg.body().match(that.hearCaptures[i]);
                if (!!match){
                    msg.hold();
                    msg.match = match;
                    that.hearCallbacks[i](msg);
                    return;
                }
            }
        }
    };

    that.listen = function(){
        window.addEventListener("keydown", function(ev){
            if (ev.target.nodeName === "TEXTAREA" 
                && ev.target.classList.contains("uiTextareaAutogrow")){ 
                if (ev.which === 13){ // enter key
                    var msg = new Message(ev);
                    that.interpret(msg);
                }
            }
        }, true);
    };
}

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

Keyfaker = {};
Keyfaker.keyevent = function(keyCode, type){
    var ev = document.createEvent("Event");

    ev.initEvent(type, true, true);

    ev.keyCode = keyCode;
    ev.which = keyCode;

    return ev;
};

Keyfaker.keydown = function(keyCode){
    return Keyfaker.keyevent(keyCode, "keydown");
};

Keyfaker.keyup = function(keyCode){
    return Keyfaker.keyevent(keyCode, "keyup");
};

Keyfaker.keypress = function(keyCode){
    return Keyfaker.keyevent(keyCode, "keypress");
};

function serializeToUrlEncoded(obj){
    "use strict";

    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)){
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

var robot = new Botman("botman");
robot.listen();
