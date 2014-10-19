function Botman(name){
    "use strict";
    var that = this;

    that.name = name;

    var hearCaptures = [];
    var hearCallbacks = [];

    var complyCaptures = [];
    var complyCallbacks = [];

    var replyCaptures = [];
    var replyCallbacks = [];

    that.hear = function(capture, callback){
        hearCaptures.push(capture);
        hearCallbacks.push(callback);
    };

    that.comply = function(capture, callback){
        complyCaptures.push(capture);
        complyCallbacks.push(callback);
    };

    that.reply = function(capture, callback){
        replyCaptures.push(capture);
        replyCallbacks.push(callback);
    }

    function interpretSent(msg){
        if (msg.botmanGenerated())
            return;

        var cmdMatch = msg.body().match(new RegExp("^" + that.name + "\\s*(.*)", "i"));
        if (!!cmdMatch){ // Triggers registered with comply
            var cmd = cmdMatch[1];
            for (var i = 0; i < complyCaptures.length; i++){
                var match = cmd.match(complyCaptures[i]);
                if (!!match){
                    //keep it in the oven before sending
                    msg.hold();
                    msg.match = match;
                    // execute response callback with message
                    complyCallbacks[i](msg);
                    return;
                }
            }
        } else { // Triggers registered with hear
            for (var i = 0; i < hearCaptures.length; i++){
                var match = msg.body().match(hearCaptures[i]);
                if (!!match){
                    msg.hold();
                    msg.match = match;
                    hearCallbacks[i](msg);
                    return;
                }
            }
        }
    }

    function interpretReceived(msg){
        for (var i = 0; i < replyCaptures.length; i++){
            var match = msg.body().match(replyCaptures[i]);
            if (!!match){
                msg.match = match;
                replyCallbacks[i](msg);
                return;
            }
        }
    }

    function listenSend(){
        window.addEventListener("keydown", function(ev){
            if (ev.target.nodeName === "TEXTAREA"
                    && ev.target.classList.contains("uiTextareaAutogrow")){
                if (ev.which === Keyfaker.ENTER){
                    var msg = new SentMessage(ev);
                    interpretSent(msg)
                }
            }
        }, true);
    }

    that.receivedQueue = [];

    function listenReceived(){
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
                                        that.receivedQueue.push(resp.ms[j]);
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

    that.listen = function(){
        listenSend();
        listenReceived();

        setInterval(function(){
            if (that.receivedQueue.length > 0){
                var payload = that.receivedQueue[0];
                var mid = payload.message.mid.match("mid\.(.+):(.+)");
                var selector = 'div[data-reactid$="1' + mid[1] + '=2' + mid[2] + '"]';
                var element = document.querySelector(selector);

                if (element !== null){
                    var msg = new ReceivedMessage(element, payload.message.body);
                    interpretReceived(msg);
                    that.receivedQueue.shift();
                }
            }
        }, 1000);
    };
}
