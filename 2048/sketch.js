var padding = 20;
var tile_length = 100;
var gap = 12;
var row = [];
var col = [];

var tiles = [];
var collisions = [-1,-1,-1,-1];

var speed = 25;
var keysEnabled = true;

var added_new_tile = true;

var game_over = false;
var game_started = false;

function setup() {
	createCanvas(500,500);
	//canvas2.parent('holder-2048');
	gridSetup();
	addInitialTiles();
}

function draw() {
	background(51);
	var all_stopped = true;
	drawGrid();

	if (!game_started){
		push();
		fill(200);
		rectMode(CENTER);
		rect(width/2,height/2,230,65);
		pop();
		push();
		fill(161,212,144);
		rectMode(CENTER);
		rect(width/2,height/2,225,60);
		pop();
		push();
		fill(0);
		textSize(24);
		textAlign(CENTER,CENTER);
		text("< click to start >",width/2,height/2);
		pop();
	}
	else if (game_over){
		keysEnabled = false;
		for (var i = 0; i<tiles.length; i++)
			tiles[i].show();
		displayEnd();
	}

	if (!game_over && game_started) {
		for (var i = 0; i<tiles.length; i++){
			collisions[i] = -1;
		}
	
		for (var i = 0; i<tiles.length; i++){
			tiles[i].show();
			for(var j=0; j<speed; j++){
				if(tiles[i].reachedTarget() && tiles[i].isMoving()){
					tiles[i].stopMoving();
					collisions[i] = tiles[i].checkCollisions(tiles,i);
				}
				if (!tiles[i].reachedTarget() && tiles[i].isMoving()){
					tiles[i].move();
					all_stopped = false;
					added_new_tile = false;
				}
			}	
		}
	
		for(var i = collisions.length-1; i>=0; i--){
			if(collisions[i] >= 0){
				console.log("------------")
				console.log("TILE")
				console.log(i);
				console.log("COLLIDED WITH TILE")
				console.log(collisions[i]);
				for(var j = 0; j<tiles.length; j++){
					console.log("TILE:" + j)
					console.log(' ' +' ' +"ROW:" + ' ' + tiles[j].row + ' ' + "COL:" + tiles[j].col);
					console.log(' ' +' ' +"VAL:" + ' ' + tiles[j].val)
				}
				tiles[collisions[i]].val = (tiles[collisions[i]].val)*2;
				collisions[i] = -2;
			}
		}

		for(var i = tiles.length-1; i>=0; i--){
			if(collisions[i] == -2)
				tiles.splice(i,1);
		}
	
		if(all_stopped){
			keysEnabled = true;
			if (!added_new_tile){
				var tile_val = floor(Math.random()*2 + 1)*2;
				do{
					rand_row = floor(Math.random()*4);
					rand_col = floor(Math.random()*4);
					var temp = new Tile(col[rand_col], row[rand_row], rand_row, rand_col, tile_val);
				}while(temp.checkCollisions(tiles,-1) != -1);
				append(tiles,temp);
				added_new_tile = true;
			}
		}
	
		if (tiles.length == 16){
			if (!availableMoves()){
				game_over = true;
			}
		}
	}
}

function keyPressed() {
	if (keyCode == UP_ARROW && keysEnabled){
		for (var i=0; i<tiles.length; i++){
			tiles[i].setDirection(0,-1);
			tiles[i].setTarget(tiles,i,row,col);
			keysEnabled = false;
			console.log("***************");
		}
	}
	else if (keyCode == DOWN_ARROW && keysEnabled){
		for (var i=0; i<tiles.length; i++){
			tiles[i].setDirection(0,1);
			tiles[i].setTarget(tiles,i,row,col);
			keysEnabled = false;
			console.log("***************");
		}
	}
	else if (keyCode == LEFT_ARROW && keysEnabled){
		for (var i=0; i<tiles.length; i++){
			tiles[i].setDirection(-1,0);
			tiles[i].setTarget(tiles,i,row,col);
			keysEnabled = false;
			console.log("***************");
		}
	}
	else if (keyCode == RIGHT_ARROW && keysEnabled){
		for (var i=0; i<tiles.length; i++){
			tiles[i].setDirection(1,0);
			tiles[i].setTarget(tiles,i,row,col);
			keysEnabled = false;
			console.log("***************");
		}
	}
	else if (key == 'R' && game_over){
		game_over = false;
		game_started = false;
		tiles = [];
		addInitialTiles();
	}
}

function mousePressed(){
	if (!game_started && mouseX<=width && mouseY<=height){
		game_started = true;
	}
}

function gridSetup(){
	for (var i = 0; i<4; i++){
		row[i] = padding+gap+(tile_length+gap)*i;
	}

	for (var i = 0; i<4; i++){
		col[i] = padding+gap+(tile_length+gap)*i;
	}
	
}

function drawGrid(){
	push();
	stroke(150);
	noFill();
	rectMode(CENTER);
	rect(width/2, height/2, 460, 460);
	pop();

	push();
	fill(100);
	noStroke();
	for(var i = 0; i<4; i++){
		for (var j = 0; j<4; j++){
			rect(col[i], row[j], tile_length, tile_length);
		}
	}
	pop();
}

function addInitialTiles(){
	rand_row = floor(Math.random()*4);
	rand_col = floor(Math.random()*4);
	var temp = new Tile(col[rand_col], row[rand_row], rand_row, rand_col, 2);
	append(tiles,temp);

	do{
		rand_row = floor(Math.random()*4);
		rand_col = floor(Math.random()*4);
		var temp = new Tile(col[rand_col], row[rand_row], rand_row, rand_col, 2);
	}while(temp.checkCollisions(tiles,-1) != -1);
	append(tiles,temp);

	var third_tile = floor(Math.random()*3);
	if (third_tile !=0){
		if (third_tile == 1)
			var tile_val = 2;
		else
			var tile_val = 4;
		do{
			rand_row = floor(Math.random()*4);
			rand_col = floor(Math.random()*4);
			var temp = new Tile(col[rand_col], row[rand_row], rand_row, rand_col, tile_val);
		}while(temp.checkCollisions(tiles,-1) != -1);
		append(tiles,temp);
	}
}

function availableMoves(){
	console.log("CHECKING");
	for (var i = 0; i<tiles.length; i++){
		for (var j = 0; j<tiles.length; j++){
			if (i!=j){
				if (tiles[i].row == tiles[j].row-1 || tiles[i].row == tiles[j].row+1){
					if(tiles[j].col == tiles[i].col && tiles[j].val == tiles[i].val){
						console.log(tiles[i].row + ' ' + tiles[i].col + ' ' +  tiles[i].val);
						console.log(tiles[j].row + ' ' + tiles[j].col + ' ' +  tiles[j].val);
						return true;
					}
				}
				if (tiles[i].col == tiles[j].col-1 || tiles[i].col == tiles[j].col+1){
					if(tiles[j].row == tiles[i].row && tiles[j].val == tiles[i].val){
						console.log(tiles[i].row + ' ' + tiles[i].col + ' ' +  tiles[i].val);
						console.log(tiles[j].row + ' ' + tiles[j].row + ' ' +  tiles[j].val);
						return true;
					}	
				}
			}
		}
	}
	return false;
}

function displayEnd(){
	push();
	fill(200);
	rectMode(CENTER);
	rect(width/2,height/2,230,65);
	pop();

	push();
	fill(204,129,129);
	rectMode(CENTER);
	rect(width/2,height/2,225,60);
	pop();

	push();
	fill(0);
	textAlign(CENTER,CENTER);
	textSize(24);
	text("GAME OVER", width/2, height/2-10);
	textSize(14);
	text("press < r > to restart", width/2, height/2+15);
	pop();

}