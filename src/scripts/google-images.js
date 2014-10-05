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
        imageMe(msg, msg.matches[3], false);
    });

    robot.respond(/animate( me)? (.*)/i, function(msg){
        imageMe(msg, msg.matches[2], true);
    });
}());
