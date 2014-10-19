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
                        msg.send(chooseRandom(images).unescapedUrl + " ");
                        // Clear link after facebook share has parsed it
                        setTimeout(function(){
                            msg.send("");
                        }, 1000); // 
                    }
                }
            },
            onerror: function(resp){
                console.log("garr error");
                console.log(resp);
            }
        });
    }

    robot.comply(/(?:image|img)(?: me)? (.*)/i, function(msg){
        imageMe(msg, msg.match[1], false);
    });

    robot.comply(/(?:animate|gif)(?: me)? (.*)/i, function(msg){
        imageMe(msg, msg.match[1], true);
    });
}());
