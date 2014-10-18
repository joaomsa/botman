function Botman(name){
    "use strict";
    var that = this;

    that.name = name;

    that.hearCaptures = [];
    that.hearCallbacks = [];

    that.responseCaptures = [];
    that.responseCallbacks = [];

    var replyCaptures = [];
    var replyCallbacks = [];

    that.hear = function(capture, callback){
        that.hearCaptures.push(capture);
        that.hearCallbacks.push(callback);
    };

    that.respond = function(capture, callback){
        that.responseCaptures.push(capture);
        that.responseCallbacks.push(callback);
    };

    that.reply = function(capture, callback){
        replyCaptures.push(capture);
        replyCallbacks.push(callback);
    }

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

    function interpretReceived(msg){
        for (var i = 0; i < replyCaptures.length; i++){
            console.log(replyCaptures[i]);
            var match = msg.body().match(replyCaptures[i]);
            if (!!match){
                msg.match = match;
                console.log("weee matched :)");
                replyCallbacks[i](msg);
                return;
            }
        }
    }

    that.listen = function(){
        window.addEventListener("keydown", function(ev){
            if (ev.target.nodeName === "TEXTAREA"
                    && ev.target.classList.contains("uiTextareaAutogrow")){
                if (ev.which === Keyfaker.ENTER){
                    var msg = new SentMessage(ev);
                    that.interpret(msg);
                }
            }
        }, true);

        that.monitor();
    };

    that.messageQueue = [];

    that.monitor = function(){
        var origOpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            this.addEventListener("readystatechange", function() {
                if (this.readyState == XMLHttpRequest.DONE){

                    var responses = this.responseText.
                        slice(this.responseText.indexOf('{')).
                        split('\n');

                    for (var i = 0; i < responses.length; i++){
                        if (!responses[i]) continue;

                        try {
                            var resp = JSON.parse(responses[i]);
                            if (resp.t === "msg"){
                                for (var j = 0; j < resp.ms.length; j++){
                                    if (resp.ms[j].type === "messaging" 
                                            && resp.ms[j].event === "deliver"
                                            && resp.ms[j].is_unread){
                                        that.messageQueue.push(resp.ms[j]);
                                    }
                                }
                            }
                        } catch (e){
                            console.log("Couldn't parse:\n|" + responses[i] + "|");
                        }

                    }
                }
            }, false);

            return origOpen.apply(this, [].slice.call(arguments));
        };
    }

    setInterval(function(){
        if (that.messageQueue.length > 0){
            var payload = that.messageQueue[0];
            var mid = payload.message.mid.match("mid\.(.+):(.+)");
            var selector = 'div[data-reactid$="1' + mid[1] + '=2' + mid[2] + '"]';
            var element = document.querySelector(selector);

            if (element !== null){
                var msg = new ReceivedMessage(element, payload.message.body);
                interpretReceived(msg);
                that.messageQueue.shift();
            }
        }
    }, 1000);
}
