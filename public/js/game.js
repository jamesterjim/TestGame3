function game(){
	if(ready == 0){return;}
	if(debugMode == true){
		debugScreen();
	}
	
	//RENDER SCREEN
	foreground.clearRect ( 0 , 0 , cWidth , cHeight );
	background.clearRect ( 0 , 0 , cWidth , cHeight );
	render();
	fps();
	menu();
	
	//MOVEMENT
	moveEntities();
	checkKeys();
	checkMouse();
	
	//MATHS
	hitDetection(); // TODO - CHECK IF IS THIS A GOOD IDEA? ONLY USING IT FOR BULLETS?
}

function render(){
	for (i=-1; i<3; i++){
		foreground.save();
		
		if(debugMode == true){

		}else{
			foreground.translate(-objects[controller].x%652, -objects[controller].y%425);
			for (i2=-1; i2<3; i2++){
				foreground.drawImage(floor, i*652, i2*425);
			}
		}
		foreground.restore();
	}

	for (i=0; i<objects.length; i++){	
		if(objects[i].age > 1000){continue;}
		
		objects[i].model = eval(objects[i].model);
	
		foreground.save();
		
		foreground.font="60px Georgia";
		
		controllerUsing = controller;
		controllerUsingOther = i;
		if(typeof objects[controller].riding != 'undefined' && objects[controller].riding != -2 && objects[objects[controller].riding].passengers != controller){
			//controllerUsing = objects[objects[controller].riding].passengers[0]
			controllerUsing = objects[controller].riding
		}else if(typeof objects[i].riding != 'undefined' && objects[i].riding != -2 && objects[objects[i].riding].passengers != i){
			controllerUsingOther = objects[i].riding
		}
			
		if(debugMode == true){
			foreground.translate(objects[i].x, objects[i].y );
			foreground.rotate(objects[i].r);
			foreground.drawImage(objects[i].model, -(objects[i].objectInfo.width/2), -(objects[i].objectInfo.height/2));
		}
		else{
			if(i == controller){
				if(typeof objects[i].riding != 'undefined' && objects[i].riding != -2){
					
				}
				foreground.translate(cWidth/2, cHeight/2);
				foreground.rotate(objects[i].r);
				foreground.drawImage(objects[i].model, -(objects[i].objectInfo.width/2), -(objects[i].objectInfo.height/2));
			//	foreground.fillText( controllerUsing ,0,0);
			}else{
				foreground.translate(objects[controllerUsingOther].x - objects[controllerUsing].x + cWidth/2               ,              objects[controllerUsingOther].y-objects[controllerUsing].y   + cHeight/2); 
				foreground.rotate(objects[i].r);
				
			//	foreground.fillText( controllerUsing ,0,0);
				foreground.drawImage(objects[i].model, -(objects[i].objectInfo.width/2), -(objects[i].objectInfo.height/2));
			}
		}
	
		foreground.restore();
	}
}
menuSize = 100;
lineWidth = 4;
lineColor = "003300"
fillColor = "73736B"

function menu(){ //cHeight cWidth
	foreground.save();

	
	foreground.beginPath();
	foreground.lineWidth= lineWidth;
	foreground.strokeStyle="#" + lineColor;
	
	foreground.rect(lineWidth/2,cHeight-menuSize-(lineWidth/2),menuSize,menuSize);
	foreground.stroke(); 
		
	foreground.rect(0,cHeight-menuSize-(lineWidth/2),cWidth,menuSize);
	foreground.stroke();
	
	foreground.rect(cWidth-menuSize-(lineWidth/2),cHeight-menuSize-(lineWidth/2),menuSize,menuSize);
	foreground.stroke();
	
	

	foreground.fillStyle = "#" + fillColor;
	foreground.fillRect(0,cHeight-menuSize-(lineWidth/2),cWidth,menuSize);
	foreground.stroke();


	foreground.fillStyle = "#" + fillColor;
	foreground.fillRect(lineWidth/2,cHeight-menuSize-(lineWidth/2),menuSize,menuSize);
	foreground.stroke(); 
		

	
	foreground.fillStyle = "#" + fillColor;
	foreground.fillRect(cWidth-menuSize-(lineWidth/2),cHeight-menuSize-(lineWidth/2),menuSize,menuSize);
	foreground.stroke();	
	
	
	
	
	foreground.restore();
}