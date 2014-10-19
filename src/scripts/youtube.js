// Youtube --------------------------------------------------------------------

(function(){
    "use strict";

    robot.comply(/(?:yt|youtube)(?: me)? (.*)/i, function(msg){
        var query = msg.match[1];

        var params = {
            orderBy: "relevance",
            "max-results": 15,
            alt: "json",
            q: query
        }

        var url = "http://gdata.youtube.com/feeds/api/videos";

        GM_xmlhttpRequest({
            method: "GET",
            url: url + "?" + serializeToUrlEncoded(params),
            onload: function(resp){
                var videos = JSON.parse(resp.responseText);
                videos = videos.feed.entry;
                var video = videos[0];

                for (var i = 0; i < video.link.length; i++){
                    var link = video.link[i];
                    if (link.rel === "alternate" && link.type === "text/html"){
                        msg.send(link.href);
                    }
                }
            }
        });
    });

}());
