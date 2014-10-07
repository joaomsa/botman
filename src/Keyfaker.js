Keyfaker = {};

Keyfaker.ENTER = 13;
Keyfaker.SPACE = 32;

// Eventually use KeyboardEvent constructor to hopefully cleanup this mess
Keyfaker.keyevent = function(which, type){
    var ev;
    if (navigator.userAgent.contains("Chrome")){
        // Chrome has a broken initKeyboardEvent, don't even bother with it.
        ev = document.createEvent("Event");

        ev.initEvent(type, true, true);
        ev.keyCode = which;
        ev.which = which;
    } else {
        // firefox uses initKeyEvent.
        ev = document.createEvent("KeyboardEvent");

        var keyCode = which;
        var charCode = 0;
        if (type === "keypress" && which !== Keyfaker.ENTER){
            keyCode = 0;
            charCode = which;
        }

        ev.initKeyEvent(type, true, true, document.defaultView,
                false, false, false, false,
                keyCode, charCode);

        if (type === "keyup"){
            // Only need to set it properly on keyup
            delete ev.key;
            Object.defineProperty(ev, "key", {
                enumerable: true,
                get: function(){
                    return which === Keyfaker.ENTER ?
                        "Enter" : String.fromCharCode(which);
                }
            });
        }
    }

    return ev;
};

Keyfaker.keydown = function(which){
    return Keyfaker.keyevent(which, "keydown");
};

Keyfaker.keyup = function(which){
    return Keyfaker.keyevent(which, "keyup");
};

Keyfaker.keypress = function(which){
    return Keyfaker.keyevent(which, "keypress");
};

/*

// Should probably figure out a better way to test this.

function testSpace(){
    console.log("Space key");
    console.log("keydown");
    testEv(Keyfaker.keydown(Keyfaker.SPACE), 0, "", Keyfaker.SPACE, Keyfaker.SPACE);

    console.log("keypress");
    testEv(Keyfaker.keypress(Keyfaker.SPACE), Keyfaker.SPACE, "", 0, Keyfaker.SPACE);

    console.log("keyup");
    testEv(Keyfaker.keyup(Keyfaker.SPACE), 0, " ", Keyfaker.SPACE, Keyfaker.SPACE);
}

function testEnter(){
    console.log("Enter key");
    console.log("keydown");
    testEv(Keyfaker.keydown(Keyfaker.ENTER), 0, "", Keyfaker.ENTER, Keyfaker.ENTER);

    console.log("keypress");
    testEv(Keyfaker.keypress(Keyfaker.ENTER), 0, "", Keyfaker.ENTER, Keyfaker.ENTER);

    console.log("keyup");
    testEv(Keyfaker.keyup(Keyfaker.ENTER), 0, "Enter", Keyfaker.ENTER, Keyfaker.ENTER);
}


function testEv(ev, charCode, key, keyCode, which){
    if (ev.charCode !== charCode)
        console.log("ev.charCode: |" + ev.charCode + "| expected: |" + charCode + "|");
    if (ev.key !== key)
        console.log("ev.key: |" + ev.key + "| expected: |" + key + "|");
    if (ev.keyCode !== keyCode)
        console.log("ev.keyCode: |" + ev.keyCode + "| expected: |" + keyCode + "|");
    if (ev.which !== which)
        console.log("ev.which: |" + ev.which + "| expected: |" + which + "|");
}

testSpace();
testEnter();
*/
