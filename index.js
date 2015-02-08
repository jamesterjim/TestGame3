//Config
var port = 3000
var version = 1
var maxEntities = 200;
// Requrirments 
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Print Errors
process.on('uncaughtException', function (err) {
  console.error(err);
});

// Send files to the user
app.get('*', function (req, res, next) {
	console.log(req.url);
	if(req.url == "/"){
		res.sendFile(__dirname + "/public/" + req.url);
	}else{
		res.sendFile(__dirname + "/" + req.url);
	}
})

//Variables
var objectInfo = { 
	house:      {width: 38,  height: 28, type: "house" , img: "house", hitbox: {x:["",-15,-14,376,377,346,375,376,258,258,287,258,258,-14,-14,-13,378,375,-14], y:["",220,263,265,128,127,127,-8,-9,126,126,126,-7,-7,161,-9,-8,261,263]} }, 
	player:     {width: 38,  height: 28, type: "player", hitbox: "auto" , img: "guy0"}, 
	projectile: {width: 38,  height: 28, type: "projectile", hitbox: "auto", img: "bullet"},
	car:        {width: 165, height: 75, type: "car", hitbox: "auto", img: ""},
	none:       {}
};

var objects = [
	{id: 0, socket: "", model: "floor", objectInfo: objectInfo.none, x: 50, y: 150, r:0},
	{id: 0, socket: "", model: "house", objectInfo: objectInfo.house, x: 50, y: 150, r:0},
	{id: 0, socket: "", model: "car",   objectInfo: objectInfo.car, x: 50, y: -100, r:1.8, passengers: [0,0,0,0,0]},
];

// Start HTTP server
http.listen(port, function(){
	console.log('listening on *:3000');
});

// Handle any data coming to the server
io.on('connection', function(socket){
	socket.on('assign', function(){		
		objectsLength = objects.length;
		
		console.log("assinging " + objectsLength);
		
		objects.push({id: objectsLength, socket: socket.id, model: "guy0", objectInfo: objectInfo.player, x: 170, y: 170, r:0, riding: -2})
	
		socket.emit('assign', [objectsLength,objectInfo,objects,maxEntities])
		
	});
	socket.on('projectile', function(msg){	
		
		newProjObj = []
		
		//todo - handle the projectile here of the server for testing ect. (YOU WONT NEED NEWPROJOB)
		
		newProjObj.x = msg.x;
		newProjObj.y = msg.y;
		newProjObj.r = msg.r;
		newProjObj.riding = msg.riding;
		
		//todo make newProjObj work and not just send msg!.
		io.emit('projectile', msg)
	});
	socket.on('objects', function(msg){	
		target = -1;
		for(i=0; i<objects.length; i++){
			if(objects[i].socket == socket.id){
				target = i;
			}
		}

		objects[target].r = msg.r;
		objects[target].riding = msg.riding;	
		if(typeof msg.riding != 'undefined' && msg.riding != -2){
			
			if(objects[msg.riding].passengers[0] == target){
				objects[msg.riding].x = msg.x;
				objects[msg.riding].y = msg.y;
			}
			//else{    //abilitiy to move while in vehicle.
			//	objects[target].x = msg.x;
			//	objects[target].y = msg.y;
			//}
			
			for(i=0; i<objects[msg.riding].passengers.length; i++){
				if(objects[msg.riding].passengers[i] == target){
					break;
				}
				if(objects[msg.riding].passengers[i] == 0){
					objects[msg.riding].passengers[i] = target;
					break;
				}
			}
			io.emit('objects', objects[msg.riding])
		}else{
			objects[target].x = msg.x;
			objects[target].y = msg.y;
			
			//remove player from passenger array if not riding.
			for(i=0; i<objects.length;i++){
				if(typeof objects[i].passengers != 'undefined'){
					for(i2=0; i2<objects[i].passengers.length;i2++){
						if(objects[i].passengers[i2] == target){
							objects[i].passengers[i2] = 0;
						}
					}
				}
			}
		}
		
	
		//console.log(objects[2].passengers)
		
		
		io.emit('objects', objects[target])
	});
});

