keys = [0,0,0,0,0,0,0];
var mouse = {x: 0, y: 0};
var isActive;

//Handle any input from the keyboard and add to keyboard memory
document.onkeydown = onkeydown;
function onkeydown(e) {
	for(i=0; i<keys.length; i++){
		if(keys[i] == e.keyCode){
			//Key already down
			return;
		}
	}

	for(i=0; i<keys.length; i++){
		if(keys[i] == 0){
			keys[i] = e.keyCode;
			return;
		}
	}
}

document.onkeyup = onkeyup;
function onkeyup(e) {
	for(i=0; i<keys.length; i++){
		if(e.keyCode == keys[i]){
			keys[i] = 0;
		}
	}
}

//Reset the keyboard memory
function keysReset(){
	keys = [0,0,0,0,0,0,0];
}

//Detect when the user leaves the tab and pause
window.onfocus = function () { 
  isActive = true;
}; 

window.onblur = function () { 
  isActive = false;
  keysReset()
}; 

//Check keyboard memory and run what needs to be ran depending on keys
var last;
function doStuff() {
	var now = new Date();
	if (now - last < 100) {
		return;
	}
	// Do stuff
	last = now;
}

throttledKeys = [32,120,69,69]
timeKey = []

function checkKeys(){
	if(isActive==false){return;}

	spriting = false
	for (x = 0; x < keys.length; x++) {
		if(keys[x] == 16){
			spriting = true
		}
	}
	
	for (x = 0; x < keys.length; x++) {
		if(keys[x] == 0){continue;}
	
		now = new Date();
		if (timeKey[x] === undefined) {
			timeKey[x] = 0 
		}
		
		//todo - understand this black magic
		if (timeKey[x] < now-100){
			for (i = 0; i<throttledKeys.length;i++){
				if(throttledKeys[i] == keys[x]){
					timeKey[x] = now
				}
			}
		}else{
			continue;
		}
	
		switch (keys[x]){
			case 119:
				unStuck();
				break;
			case 32:
				fire()
				break
			case 120:
				if (debugMode == false){ debugMode = true}
				else{ debugMode = false} 
				break
			case 87 || 38:
				move("up",spriting);
				break
			case 65 || 37:
				move("left",spriting);
				break
			case 83 || 40:
				move("down",spriting);
				break
			case 68 || 39:
				move("right",spriting);
				break
			case 69:
				eKey();
				break
			case 80:
				objects[targetObject].objectInfo.hitbox.x.push(point.x2-objects[targetObject].x);
				objects[targetObject].objectInfo.hitbox.y.push(point.y2-objects[targetObject].y); // todo is  "objects[targetObject].y" correct?
				break
			
		}
	}
}

function eKey(){
	if(objects[controller].riding == -2){
		objects[controller].riding = 2; 
		objects[controller].x = objects[objects[controller].riding].x;
		objects[controller].y = objects[objects[controller].riding].y;
	}else{
		objects[controller].x = objects[objects[controller].riding].x+60;
		objects[controller].y = objects[objects[controller].riding].y+60;
		objects[controller].riding = -2; 
		unStuck();
	}	
	
	sync();
}

//Move in a certain direction
function move(way,spriting){
	playerControl = getPlayerNumber()	
	
	speed = 3
	if(spriting == true){ speed = 5}

	
	movePlayer(speed,way);
	
	//revert
	if(hitDetection() == true) { movePlayer(-speed,way);} ;
	
	sync();
}

function movePlayer(speed,way){
	playerControl = getPlayerNumber()
	
	if(way == "up"){
		objects[playerControl].y -= speed;
	}
	else if(way == "left"){
		objects[playerControl].x -= speed;
	}
	else if(way == "down"){
		objects[playerControl].y += speed;
	}
	else if(way == "right"){
		objects[playerControl].x += speed;
	}
}

var point = {x1:0,y1:0,x2:0,y2:0};
//Mouse movement handling
document.onmousemove = getMouseXY;

function getMouseXY(event) {
		if(ready == 0){return;}
		
		var offset = canvasTouch.getBoundingClientRect();
		
		pageX = event.pageX - offset.left
		pageY = event.pageY - offset.top

		playerControl = getPlayerNumber();
		
		point = {
			x1: objects[playerControl].x-(objects[controller].objectInfo.width/2),
			y1: objects[playerControl].y-(objects[controller].objectInfo.height/2),
			x2: pageX,
			y2: pageY,
			x3: cWidth/2,
			y3: cHeight/2,
		};
}	

// Main function to retrieve mouse x-y pos.s
function checkMouse(){
	playerControl = getPlayerNumber()
	
	if(debugMode == true){
		angleRadians = angleCalc(point.x1, point.x2,  point.y1, point.y2);
	}else{
		angleRadians = angleCalc(point.x3, point.x2,  point.y3, point.y2);
	}
	
	objects[playerControl].r = angleRadians;
	sync();
}

//Calucate the angle between 2 points.
function angleCalc(x1,x2,y1,y2){
	return Math.atan2(y2 - y1, x2 - x1);
}


// TOOD - MOVE INTO SHOOTING????

function fire(){
	newProjectile = createParticle(objects[playerControl].x, objects[playerControl].y, objects[playerControl].r, "bullet");
	socket.emit('projectile',  newProjectile);
}

function createParticle(xPos,yPos,rPos,modelID){
	if(tooManyEntities() == true){
		for (i=0; i<objects.length; i++){
			if (objects[i].age > 1000){
				objectID = i;
				break;
			}
		}
	}else{
		objectID = objects.length;
	}
	
	newProjectile = {id: objectID, socket: "", model: modelID, objectInfo: objectInfo.projectile, x: xPos, y: yPos , r: rPos, age: 0}
	
	objects[objectID] = newProjectile;
	return newProjectile;
}


function moveEntities(){
	for (i=0; i<objects.length; i++){
		speed = 10; //todo - move this int objinfo
		
		if(objects[i].age > 1000){ //object is too old to move
			continue;
		}
		
		if (objects[i].objectInfo.type == "projectile" ){  //and max age and cleanup age
			objects[i].age += 5;
			objects[i].x += speed * Math.cos(objects[i].r);
			objects[i].y += speed * Math.sin(objects[i].r);
		}
	}
}

maxEntities = 400 // todo move
function tooManyEntities(){
	totalEntities = 0;
	for (i=0; i<objects.length; i++){
		if (objects[i].objectInfo.type == "projectile"){ //todo move into entitiy array
			totalEntities += 1;
		}
	}
	if (totalEntities > maxEntities){
		return true
	}
	return false
}

function typeOfEntity(entity){ // 0 = static objects such as buildings | 1 = moveable object | 2 = projectile
	if (entity.hit == "projectile"){
		return 1;
	}
}

