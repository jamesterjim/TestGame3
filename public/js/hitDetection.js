function hitDetection(){		
		for (i=0; i<objects.length; i++){
			if (i == controller) continue; //Skip yourself
			lp = getVertexPositions(controller); //localPoints
			op = getVertexPositions(i); //otherPoints	
			if(op == 0){continue;} //no collision needed
	
			//fix vertex positions from relative to absolute
			for(j=1; j<lp.x.length; j++){ 
				lp.x[j] += objects[controller].x;
				lp.y[j] += objects[controller].y;
			}
		
			for(j=1; j<op.x.length; j++){
				op.x[j] += objects[i].x;
				op.y[j] += objects[i].y;
			}
		
			op.x.push(op.x[1]); //make the last value the same as first to loop all sides
			op.y.push(op.y[1]);
			lp.x.push(lp.x[1]); //make the last value the same as first to loop all sides
			lp.y.push(lp.y[1]);	
			
			//get max values to see if you even need to perform hit detection

			//Start main collision
			totalCollided = 0
			for(v=1; v < op.x.length; v++){
				x3 = op.x[ v ]; 
				y3 = op.y[ v ];
				x4 = op.x[ v+1 ];
				y4 = op.y[ v+1 ];
				for(v2=1; v2<lp.x.length; v2++){
					x1 = lp.x[ v2 ];
					y1 = lp.y[ v2 ];
					x2 = lp.x[ v2+1 ];
					y2 = lp.y[ v2+1 ];
					
					collided = intersectLine(lp.x[ v2 ]  ,  lp.y[ v2 ]  ,  lp.x[ v2+1 ]  ,  lp.y[ v2+1 ]  ,  op.x[ v ]  ,  op.y[ v ]  ,   op.x[ v+1 ]  ,  op.y[ v+1 ]);
					collided = intersectLine(x1,y1,x2,y2,x3,y3,x4,y4);
					
					if(collided == 1 && objects[i].objectInfo.type == "projectile" && objects[i].age > 1000){
						//todo add death code
						objects[controller].x = 20;
						objects[controller].y = 20;
						sync();
					}else{
						totalCollided += collided; //projectile wont have collision.
					}
					
				
					if(debugMode == true){
						if(collided == 1){
							foreground.strokeStyle = '#00FF00'
						}else{
							foreground.strokeStyle = 'rgba(255,0,0,0.2)'
						}
						foreground.beginPath();
						foreground.moveTo(x1, y1)
						foreground.lineTo(x2, y2)
						foreground.lineTo(x3, y3)
						foreground.lineTo(x4, y4)			
						foreground.stroke();
					}
				}
			}
			if(totalCollided != 0){ return true }
			
		}
}

function unStuck(){
	while(hitDetection() == true) { movePlayer(1,"up");} ;
}

function hitBoxes(){
	for (i=0; i<objects.length; i++){
		foreground.save(); 
		
		foreground.strokeStyle = '#FFFFFF'
		
		lp = getVertexPositions(i);
		if(lp == 0){continue;}
		
		foreground.beginPath();
		foreground.translate(objects[i].x, objects[i].y);
		foreground.lineWidth = 3;
		
		vertices = lp.x.length-1; 
			
		for(v=0; v<vertices-1; v++){
			foreground.moveTo(lp.x[v%vertices+1], lp.y[v%vertices+1])
			foreground.lineTo(lp.x[v%vertices+2], lp.y[v%vertices+2])
			//foreground.rect(lp.x[v%vertices+1],lp.y[v%vertices+1],3,3);
		}
		foreground.moveTo(lp.x[vertices], lp.y[vertices]);
		foreground.lineTo(lp.x[1], lp.y[1]);
		
		foreground.stroke();
		foreground.restore(); 
	}
}

function exportVertex(){
	xDump = '""'
	for(i=0; i<houseSize.x.length; i++){
		xDump += houseSize.x[i] + ","
	}
	yDump = '""'
	for(i=0; i<houseSize.y.length; i++){
		yDump += houseSize.y[i] + ","
	}
	
	console.log( xDump);
	console.log( yDump);

}

function getVertexPositions(object){
	if(objects[object].objectInfo.type == "house"){
		return JSON.parse(JSON.stringify(objects[object].objectInfo.hitbox)); 
	}
	if(objects[object].hit == "projectile"){
		return JSON.parse(JSON.stringify(objectInfo.projectile.hitbox)); 
	}
	
	if(objects[object].objectInfo.hitbox == "auto"){	
		width = objects[object].objectInfo.width;
		height = objects[object].objectInfo.height;
		
		varA = Math.atan(height/width)
		varB = Math.sqrt(width*width + height*height)/2
		
		angA = (varA+objects[object].r);
		Y1 = varB * Math.sin(angA);
		X1 = varB * Math.cos(angA);
				
		Y3 = Y1*-1;
		X3 = X1*-1;

		angA = (varA-objects[object].r)*-1;
		Y2 = varB * Math.sin(angA);
		X2 = varB * Math.cos(angA);

		Y4 = Y2*-1;
		X4 = X2*-1;
		
		return {x:["",X1,X2,X3,X4], y:["",Y1,Y2,Y3,Y4]};
	}
	return 0;
}


function intersectLine(x1, y1, x2, y2, x3, y3, x4, y4, isReturnPosition) {
	if (!isReturnPosition) {
		return ccw(x1, y1, x3, y3, x4, y4) != ccw(x2, y2, x3, y3, x4, y4) && ccw(x1, y1, x2, y2, x3, y3) != ccw(x1, y1, x2, y2, x4, y4);
	}

	/* http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345 */
	var s1_x, s1_y, s2_x, s2_y;
	s1_x = x2 - x1;     s1_y = y2 - y1;
	s2_x = x4 - x3;     s2_y = y4 - y3;

	var s, t;
	s = (-s1_y * (x1 - x3) + s1_x * (y1 - y3)) / (-s2_x * s1_y + s1_x * s2_y);
	t = ( s2_x * (y1 - y3) - s2_y * (x1 - x3)) / (-s2_x * s1_y + s1_x * s2_y);

	if (s >= 0 && s <= 1 && t >= 0 && t <= 1){
		// Collision detected
		var atX = x1 + (t * s1_x);
		var atY = y1 + (t * s1_y);
		//return { x: atX, y: atY };
		return 1;
	}

	return 0; // No collision
}
function ccw(x1, y1, x2, y2, x3, y3) {           
	var cw = ((y3 - y1) * (x2 - x1)) - ((y2 - y1) * (x3 - x1));
	return cw > 0 ? true : cw < 0 ? false : true
}