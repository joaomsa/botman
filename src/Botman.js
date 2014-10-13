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

(function(open) {

    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

        this.addEventListener("readystatechange", function() {
            if (this.readyState == XMLHttpRequest.DONE){
                try {
                    var jsonResp = JSON.parse(this.responseText.slice(this.responseText.indexOf('{')));
                    if (jsonResp.t == "msg"){
                        for (var i = 0; i < jsonResp.ms.length; i++){
                            if (jsonResp.ms[i].type == "messaging"){
                                console.log(jsonResp.ms[i]);
                                console.log(jsonResp.ms[i].message.mid);
                                var mid = jsonResp.ms[i].message.mid.match("mid\.(.+):(.+)");
                                var selector = 'div[data-reactid$="1' + mid[1] + '=2' + mid[2] + '"]';
                                console.log(selector);
                                // parse message body and if it matches
                                // this needs to be sent to a queue
                                // when the user opens
                                // then it should send the message
                                console.log(document.querySelector(selector));
                            }
                        }
                    }
                } catch (e) {
                    var txt = this.responseText.slice(this.responseText.indexOf('{'));
                    var newtxt = txt.split("\n")
                    for (var j = 0; j < newtxt.length; j++){
                        console.log(newtxt[j]);
                    }
                }
            }
        }, false);

        return open.apply(this, [].slice.call(arguments));
        //open.call(this, method, url, async, user, pass);
    };

})(XMLHttpRequest.prototype.open);
