var debugMode = false;
var fpsAmm = 0;
var fpsTime = 0;
function fps(){
	fpsAmm = 1000 / (new Date - fpsTime);
	fpsTime = new Date;
}

debug = {totalObjects: 0, totalRendered: 0}
function debugScreen(){
	hitBoxes();
	debugText();
}

var targetObject = -2;
function debugText(){
	if (objects[targetObject] === undefined) { targetObject = controller; } 

	debug.totalObjects = 0;
	for(i=0; i<objects.length; i++){
		debug.totalObjects += 1;
	}
	textHeight = 10;
	debugContents = ["ID: " + targetObject, "socket: " + objects[targetObject].socket, "hit: " + objects[targetObject].hit, "x: " + objects[targetObject].x, "y: " + objects[targetObject].y, "r: " + objects[targetObject].r,"" ,"objects: " + debug.totalObjects, "keys: " + keys, "FPS: " + fpsAmm.toFixed(1) ];
	
	foreground.font= textHeight + "px Verdana";
	for(i=0; i<debugContents.length; i++){
		foreground.fillText(debugContents[i] ,0, (i+1)*textHeight );
	}
}