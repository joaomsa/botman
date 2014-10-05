// ==UserScript==
// @name        botman
// @namespace   botman
// @description Botman is here to speed up those witty responses on facebook
// @include     https://www.facebook.com/*
// @version     1.0.2
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

// Google Images ----------------------------------------------------------

(function(){
    "use strict";

    function chooseRandom(array){
        return array[Math.floor(Math.random() * array.length)];
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

// Google Translate -----------------------------------------------------------

(function(){
    "use strict";

    var languages = {
        "af": "Afrikaans",
        "sq": "Albanian",
        "ar": "Arabic",
        "az": "Azerbaijani",
        "eu": "Basque",
        "bn": "Bengali",
        "be": "Belarusian",
        "bg": "Bulgarian",
        "ca": "Catalan",
        "zh-CN": "Simplified Chinese",
        "zh-TW": "Traditional Chinese",
        "hr": "Croatian",
        "cs": "Czech",
        "da": "Danish",
        "nl": "Dutch",
        "en": "English",
        "eo": "Esperanto",
        "et": "Estonian",
        "tl": "Filipino",
        "fi": "Finnish",
        "fr": "French",
        "gl": "Galician",
        "ka": "Georgian",
        "de": "German",
        "el": "Greek",
        "gu": "Gujarati",
        "ht": "Haitian Creole",
        "iw": "Hebrew",
        "hi": "Hindi",
        "hu": "Hungarian",
        "is": "Icelandic",
        "id": "Indonesian",
        "ga": "Irish",
        "it": "Italian",
        "ja": "Japanese",
        "kn": "Kannada",
        "ko": "Korean",
        "la": "Latin",
        "lv": "Latvian",
        "lt": "Lithuanian",
        "mk": "Macedonian",
        "ms": "Malay",
        "mt": "Maltese",
        "no": "Norwegian",
        "fa": "Persian",
        "pl": "Polish",
        "pt": "Portuguese",
        "ro": "Romanian",
        "ru": "Russian",
        "sr": "Serbian",
        "sk": "Slovak",
        "sl": "Slovenian",
        "es": "Spanish",
        "sw": "Swahili",
        "sv": "Swedish",
        "ta": "Tamil",
        "te": "Telugu",
        "th": "Thai",
        "tr": "Turkish",
        "uk": "Ukrainian",
        "ur": "Urdu",
        "vi": "Vietnamese",
        "cy": "Welsh",
        "yi": "Yiddish"
    }

    var langCodes = Object.keys(languages);
    var langNames = langCodes.map(function(key){ return languages[key] });

    function getCode(lang){
        if (typeof(lang) !== "string") return undefined;

        lang = lang.toLowerCase();

        if (typeof(languages[lang]) !== "undefined"){
            return lang; // it's already a code;
        }

        for (var i = 0; i < langNames.length; i++){
            if (langNames[i].toLowerCase() === lang){
                return langCodes[i];
            }
        }
    }

    var languageChoices = langCodes.concat(langNames).join("|");
    var pattern = new RegExp("translate(?: me)?" + 
            "(?: from (" + languageChoices + "))?" +
            "(?: (?:in)?to (" + languageChoices + "))?" +
            " (.*)", "i");

    robot.respond(pattern, function(msg){
        var origin = getCode(msg.match[1]);
        if (typeof(origin) === "undefined"){
            origin = "auto";
        }

        var target = getCode(msg.match[2]);
        if (typeof(target) === "undefined"){
            target = "en";
        }

        var phrase = msg.match[3];

        var params = {
            client: "t",
            hl: "en",
            multires: 1,
            sc: 1,
            sl: origin,
            ssel: 0,
            tl: target,
            tsel: 0,
            uptl: "en",
            text: phrase 
        }

        var url = "https://translate.google.com/translate_a/t";

        GM_xmlhttpRequest({
            method: "GET",
            url: url + "?" + serializeToUrlEncoded(params),
            onload: function(resp){
                // Google, why the fuck is this not valid JSON?
                var translations = eval(resp.responseText);
                msg.send(translations[0][0][0]);
            }
        });

    });
}());
