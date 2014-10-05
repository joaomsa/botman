// ==UserScript==
// @name        botman
// @namespace   botman
// @description Botman is here to speed up those witty responses on facebook
// @include     https://www.facebook.com/*
// @version     1.0.1
// @grant       GM_xmlhttpRequest
// ==/UserScript==

function Botman(name){
    "use strict";
    var that = this;

    that.name = name;

    that.captures = [];
    that.responses = [];

    that.respond = function(capture, responseCb){
        that.captures.push(capture);
        that.responses.push(responseCb);
    }

    that.interpret = function(msg){
        var cmd = msg.body().match(new RegExp("^" + that.name + "\\s*(.*)", "i"))[1];

        if (!!cmd){
            for (var i = 0; i < that.captures.length; i++){
                var match = cmd.match(that.captures[i]);
                if (!!match){
                    //keep it in the oven before sending
                    msg.hold();

                    msg.match = match;

                    // execute response callback with message
                    that.responses[i](msg);
                    return;
                }
            }
        }
    }

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
    }
}


function Message(ev){
    "use strict";
    var that = this;

    that.event = ev;

    that.body = function(){
        return that.event.target.value;
    }

    that.send = function(body){
        that.event.target.value = body;

        // Don't automatically send, until I figure out how to 
        // automatically trigger share link parsing
        //that.event.target.dispatchEvent(that.event);
    }

    that.hold = function(){
        that.event.stopPropagation();
    }
}

var robot = new Botman("botman");
robot.listen();

// Google Images ----------------------------------------------------------

(function(){
    "use strict";

    function chooseRandom(array){
        return array[Math.floor(Math.random() * array.length)];
    }

    function serializeToUrlEncoded(obj){
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    }

    function imageMe(msg, query, animated){
        var q = {
            v: "1.0", 
            rsz: "8",
            q: query,
            safe: "active"
        };
        if (animated)
            q["imgtype"] = "animated";

        var url = "http://ajax.googleapis.com/ajax/services/search/images";

        GM_xmlhttpRequest({
            method: "GET",
            url: url + "?" + serializeToUrlEncoded(q),
            onload: function(resp){
                var images = JSON.parse(resp.responseText);
                if (!!images.responseData){
                    images = images.responseData.results;
                    if (!!images && images.length > 0){
                        msg.send(chooseRandom(images).unescapedUrl)
                    }
                }
            },
            onerror: function(resp){
                console.log("garr error");
                console.log(resp);
            }
        });
    }

    robot.respond(/(image|img)( me)? (.*)/i, function(msg){
        imageMe(msg, msg.match[3], false);
    });

    robot.respond(/animate( me)? (.*)/i, function(msg){
        imageMe(msg, msg.match[2], true);
    });
}());

// Google Maps ----------------------------------------------------------------

(function(){
    "use strict";

    robot.respond(/map( me)?(.+)/i, function(msg){
        var url = "http://maps.google.com/maps?q=" +
            encodeURIComponent(location) +
            "&hl=en&sll=37.0625,-95.677068&sspn=73.579623,100.371094&vpsrc=0&hnear=" +
            encodeURIComponent(location) +
            "&t=m&z=11";

        msg.send(url);
    });
}())
