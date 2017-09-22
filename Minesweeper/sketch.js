var tiles = [];
var grid_size = 25;
var num_tiles = 625;
var space_width = 20;
var tile_size = 18;
var num_bombs = 75;
var bomb_indices = [];
var counter = 0;
var flag_mode = false;
var game_over = false;
var space = false;
var game_started = false;
var game_over = [0, 0];
var hidden = false;
var canvas_size = [520, 550];

function setup() {
	createCanvas(canvas_size[0], canvas_size[1]);
	background(51);
	loadTiles();
	setTypes();
}

function draw() {
	clear();
	background(51);

	for (var i = 0; i < grid_size; i++){
		for (var j = 0; j < grid_size; j++){
			tiles[i][j].show(game_over);
		}
	}

	if (!game_started)
		displayStart();

	if ((game_over[0] || game_over[1]) && !hidden)
		displayEnd();

	instructions();
}

function mouseClicked(){
	for (var i = 0; i < grid_size; i++){
		for (var j = 0; j < grid_size; j++){
			if(!game_over[0] && !game_over[1] && game_started){
				var dead = tiles[i][j].onClick(mouseX, mouseY, flag_mode, tiles, i, j, grid_size, num_bombs);
				game_over = [checkForWin(), dead];
			}
		}
	}

	if(!game_started && mouseX >= 0 && mouseY >= 0 && mouseX <= canvas_size[0] && mouseY <= canvas_size[1])
		game_started = true;
}

function checkForWin(){
	var won = 1;
	for (var i = 0; i < grid_size; i++){	
		for (var j = 0; j < grid_size; j++){
			(tiles[i][j].type > -1 && !tiles[i][j].clicked) ? won = 0 : null;
		}
	}
	return won;
}

function keyPressed(){
	if (keyCode == ENTER && game_started){
		flag_mode ? flag_mode = false : flag_mode = true;
		flag_mode ? cursor(CROSS) : cursor(ARROW);
	}

	if (key == 'R' && (game_over[0] || game_over[1])){
		resetGame();
	}

	if (key == 'H' && (game_over[0] || game_over[1])){
		hidden ? hidden = false : hidden = true;
	}
}

function randomizeBombIndices(){
	do {
		var ind = [floor(Math.random() * 25), floor(Math.random() * 25)];
		var found = false;
		for (var i = 0; i < bomb_indices.length; i++){
			if (bomb_indices[i][0] == ind[0] && bomb_indices[i][1] == ind[1]){
				found = true;
				break;
			}
		}
		if(!found)
			append(bomb_indices, ind);
	} while(bomb_indices.length < num_bombs)
}

function loadTiles() {
	bomb_indices = [];
	randomizeBombIndices();

	for (var i = 0; i < grid_size; i++){
		tiles[i] = [];
		for (var j = 0; j < grid_size; j++){
			var bomb = false;
			for (var k = 0; k < bomb_indices.length; k++){
				if (bomb_indices[k][0] == i && bomb_indices[k][1] == j){
					bomb = true;
				}
			}
			tiles[i][j] = new Tile((i + 1) * space_width, (j + 1) * space_width, tile_size, bomb);
		}
	}
}

function setTypes(){
	for (var i = 0; i < grid_size; i++){
		for (var j = 0; j < grid_size; j++){
			if (tiles[i][j].type >= 0){
				var bomb_count = 0;
				for(var a = i - 1; a <= i + 1; a++){
					for(var b = j - 1; b <= j + 1; b++){
						if(!(a == i && b == j) && a >= 0 && b >= 0 && a < grid_size && b < grid_size){
							(tiles[a][b].type < 0) ? bomb_count++ : null;
						}
					}
				}
				tiles[i][j].setType(bomb_count);
			}
		}
	}
}

function resetGame(){
	game_over = [0, 0];
	loadTiles();
	setTypes();
	game_started = false;
}

function displayStart(){
	push();
		rectMode(CENTER);
		textAlign(CENTER, CENTER);
		fill(40);
		noStroke();
		rect(260, 260, 300, 100);
		fill(200, 230, 200);
		rect(260, 260, 290, 90);
		fill(0);
		textSize(24);
		textStyle(BOLD);
		text("MINESWEEPER", 260, 250);
		textSize(12);
		text("< click > to begin", 260, 275);
	pop();
}

function displayEnd(){
	push();
		rectMode(CENTER);
		textAlign(CENTER, CENTER);
		fill(40);
		noStroke();
		rect(260, 260, 300, 100);
		fill(200);
		rect(260, 260, 290, 90);
		if(game_over[1]){
			fill(255, 0, 0);
			textSize(24);
			textStyle(BOLD);
			text("GAME OVER", 260, 240);
		}
		else{
			fill(54,150,0);
			textSize(24);
			textStyle(BOLD);
			text("WINNER", 260, 240);
		}
		fill(0);
		textSize(12);
		text("press < r > to restart", 260, 270);
		text("press < h > to hide dialog box", 260, 285);
	pop();
}

function instructions(){
	push();
		textAlign(CENTER, CENTER);
		fill(230);
		text("press < enter > to toggle flag mode", canvas_size[0] / 2, 530);
	pop();
}