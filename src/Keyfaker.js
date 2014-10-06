Keyfaker = {};
Keyfaker.keyevent = function(keyCode, type){
    var ev = document.createEvent("Event");

    ev.initEvent(type, true, true);

    ev.keyCode = keyCode;
    ev.which = keyCode;

    return ev;
};

Keyfaker.keydown = function(keyCode){
    return Keyfaker.keyevent(keyCode, "keydown");
};

Keyfaker.keyup = function(keyCode){
    return Keyfaker.keyevent(keyCode, "keyup");
};

Keyfaker.keypress = function(keyCode){
    return Keyfaker.keyevent(keyCode, "keypress");
};
