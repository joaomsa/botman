// ==UserScript==
// @name        botman
// @namespace   botman
// @description Botman is here to speed up those witty responses on facebook
// @include     https://www.facebook.com/*
// @exclude     https://www.facebook.com/ai.php*
// @exclude     https://www.facebook.com/xti.php*
// @version     1.1.4
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// ==/UserScript==

var robot = new Botman("botman");
robot.listen();
