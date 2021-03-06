testgame3
========

This was made over 2 weeks to try and work on many features of a game engine from stratch.

Here is an example of the hit detection, it works by drawing a line from every object point defined in the objectData:
```javascript
	house:      {width: 38,  height: 28, type: "house" , img: "house", hitbox: {x:["",-15,-14,376,377,346,375,376,258,258,287,258,258,-14,-14,-13,378,375,-14], y:["",220,263,265,128,127,127,-8,-9,126,126,126,-7,-7,161,-9,-8,261,263]} }, 
	player:     {width: 38,  height: 28, type: "player", hitbox: "auto" , img: "guy0"}, 
```
If the hitbox is "auto" it will trig to get the points using width and height for collision, if a a line is colliding then it is detected:

![alt text](http://puu.sh/fCzbv/1daaa4042b.png "")


This is an example of multiplayer:
![alt text](http://puu.sh/fCyPv/7ab85cb3e5.png "")

##What is each file?
* index.js - serverside code
* public/index.html - HTML to load canvas and JS files
* public/index.css - CSS to format some elements
* public/img/*.png - Image assets not made by me (the only thing I did not do from scratch!)
* public/js/controls.js - handles keyboard and mouse movements
* public/js/debug.js - Display any debug code and handle FPS
* public/js/game.js - Draw everything that is on the scene
* public/js/hitDetection.js - Hit detection
* public/js/main.js - Start everything and hold main variables
* public/js/server.js - handle anything coming from the server

##Installing
Install NodeJS https://github.com/joyent/node/wiki/installing-node.js-via-package-manager

Download testgame and unzip

Install the packages
```text
npm install socket.io
npm install express
```

Run server
```text
node . 
```
You can now open your browser and goto localhost:3000 to play.
