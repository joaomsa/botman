// ==UserScript==
// @name        botman
// @namespace   botman
// @author      Joao Sa <me@joaomsa.com>
// @homepage    https://github.com/joaomsa/botman
// @description Botman is here to speed up those witty responses on facebook
// @downloadURL https://github.com/joaomsa/botman/raw/master/dist/botman.user.js
// @include     https://www.facebook.com/*
// @exclude     https://www.facebook.com/ai.php*
// @exclude     https://www.facebook.com/xti.php*
// @version     2.0.1
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// ==/UserScript==

var robot = new Botman();
robot.listen();
