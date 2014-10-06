// Caetano --------------------------------------------------------------------

(function(){
    "use strict";

    var script = [
        "Não...",
        "Você é burro cara,",
        "que loucura,",
        "como você é burro.",
        "Que coisa absurda,",
        "isso aí que você disse é tudo burrice,",
        "burrice...",
        "Eu num num num",
        "num cunsigo gravar muito bem o que você falou porque você fala de uma maneira burra...",
        "Entendeu...?"
    ];

    var pattern = /(maneira burra|que loucura|(como )?(voc(e|ê)|vc) (é|e) burro|(que )?coisa absurda)/i;

    robot.hear(pattern, function(msg){
        var i = 0;
        var delay = 1500;

        (function sayLine(){
            msg.sendNow(script[i]);
            i += 1;
            if (i < script.length){
                setTimeout(sayLine, delay);
            }
        }());
    });
}());
