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

    robot.comply(pattern, function(msg){
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
                msg.replace(translations[0][0][0]);
            }
        });

    });
}());
