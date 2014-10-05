# botman

#### Botman is here to speed up those witty responses on Facebook

![Demo](./demos/demo.gif)

## Requirements

Compatible with

-   <img src="http://www.actsofvolition.com/images/firefox_icon.png" height="16px" /> Firefox + <img src="http://c.fsdn.com/allura/p/greasemonkey/icon" height="16px" />  [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
-   <img src="http://cdn.portableapps.com/GoogleChromePortable_128.png" height="16px" /> Chrome + <img src="http://tampermonkey.net/images/icon128.png" height="16px" />  [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)


## Installation

Get it [here](https://github.com/joaomsa/botman/raw/master/dist/botman.user.js)

## Known commands

### images

    - botman image (query) 
    - botman animate (query) 
    
Returns a pertinent image or animated gif for the query from Google Images

![](./demos/imagedemo.gif)

### maps

    - botman map (query)

Returns a google maps link to the queried location

![](./demos/mapdemo.gif)

### translate

    - botman translate from (lang) to (lang) (query)
    - botman translate to (lang) (query)
    - botman translate from (lang) (query)

Translate the query from the source language to to target language.
Source if not specified source language defaults to "auto" and target language to "english".

![](./demos/translatedemo.gif)

### youtube

    - botman yt (query)
    - botman youtube (query)

Returns the most relevant video for the query

![](./demos/videodemo.gif)

## Contributing

Get started

-   Install node.js and grunt with `npm install -g grunt-cli`
-   Fork and clone your copy of the repo
-   Run `npm install` in the project root

Build

- Build with `grunt`
- Continuously build with `grunt watch`

Heavily inspired by [github/hubot](https://github.com/github/hubot)

Credits to [@gbmoretti](https://github.com/gbmoretti) for the idea :sparkling_heart:
