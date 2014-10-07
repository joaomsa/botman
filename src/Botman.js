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
                if (ev.which === Keyfaker.ENTER){
                    var msg = new Message(ev);
                    that.interpret(msg);
                }
            }
        }, true);
    };
}
