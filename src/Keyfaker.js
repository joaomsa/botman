Keyfaker = {};

Keyfaker.keyevent = function(keyCode, type){
    // Eventually use KeyboardEvent constructor for this mess
    var ev;
    if (navigator.userAgent.contains("Chrome")){
        // Chrome has a broken initKeyboardEvent, don't even bother with it.
        ev = document.createEvent("Event");

        ev.initEvent(type, true, true);
        ev.keyCode = keyCode;
        ev.which = keyCode;
    } else {
        // firefox uses initKeyEvent.
        ev = document.createEvent("KeyboardEvent");
        ev.initKeyEvent(type, true, true, document.defaultView,
                false, false, false, false,
                keyCode, 0);
    }

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
