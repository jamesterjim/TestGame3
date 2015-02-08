//Global Variables
var socket = io();

var pageX;
var pageY;

var cHeight = 700;
var cWidth = 960;

var username;

var background;
var foreground;
var foregroundRoll;

//todo fix this???
var guy0 = new Image();
guy0.src = 'public/img/guy0.png';
var house = new Image();
house.src = 'public/img/house.png';
var bullet = new Image();
bullet.src = 'public/img/bullet.png';
var floor = new Image();
floor.src = 'public/img/floor.png';
var car = new Image();
car.src = 'public/img/car.png';
var tree = new Image();
tree.src = 'public/img/tree.png';

//Startup
ready = 0;
function start(){
	socket.emit('assign');
	
	setCanvasVariables();
	setInterval(function(){game()},1000/60);
//	setInterval(function(){lineWidth=Math.random()*10; menuSize=Math.random()*300},500);
}
	
function setCanvasVariables(){
	background = document.getElementById("canvasBackground");
	background = background.getContext("2d");
	foreground = document.getElementById("canvasForeground");
	foreground = foreground.getContext("2d");
}

