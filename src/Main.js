// ==UserScript==
// @name        botman
// @namespace   botman
// @description Botman is here to speed up those witty responses on facebook
// @include     https://www.facebook.com/*
// @version     1.1.2
// @grant       GM_xmlhttpRequest
// ==/UserScript==

var robot = new Botman("botman");
robot.listen();
