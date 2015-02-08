var controller = 0;
var objects = [];

// Get what number the player is 
function getPlayerNumber(){
	return controller;
	for(i=0; i<objects.length; i++){
		if(objects[i].id == controller){
			return i;
		}
	}
}

// Assign a number to the player
var objectInfo;
socket.on('assign', function(msg){
	controller = msg[0];
	objectInfo = msg[1];
	objects = msg[2]
	console.log("Player is object " + controller);
	ready = 1;
});

// Draw projectile
socket.on('projectile', function(msg){
	createParticle(msg.x, msg.y, msg.r, bullet);
});
// Get objectInfo



// Assign to variable when getting object data from the server
socket.on('objects', function(msg){
	target = -1; targetID = -1;
	for(i=0; i<objects.length; i++){
		if(objects[i].id == msg.id){
			target = i;
			targetID = msg.id;
		}
	}
	
	if(targetID == controller){
		return;
	}
	
	//todo - refractor this mess
	if(target == -1){ // Checks if the object need to be created
		objects.push({id: msg.id, model: guy0, x: msg.x, y: msg.y, objectInfo: msg.objectInfo}); //todo make dynamic
	}else{
		//todo !IMPORTANT! - object data keeps getting spammed from the server?!?!?!
		objects[target].x = msg.x;
		objects[target].y = msg.y;
		objects[target].r = msg.r;
		objects[target].riding = msg.riding;
		objects[target].passengers = msg.passengers;
	//	console.log(objects[target].objectInfo.width);
	}	
});

// send playerdata to the server
function sync(){
	toSend = {x: objects[controller].x, y: objects[controller].y, r: objects[controller].r, riding: objects[controller].riding};
	socket.emit('objects',  toSend);
}

