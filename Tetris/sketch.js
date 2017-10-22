var grid;
var grid_size = [15, 20];
var block_types = [];
var tile_size = 26;
var spacing = 28;
var canvas_size = [460, 660];
var speed = 1000;
var drop_speed = 40;
var shift_speed = 100;
var shift_time;
var last_shift_time = -1;
var game_over = false;
var queue;
var queue_spacing = 12;
var line_count = 0;
var level = 1;
var threshhold = 5;
var game_started = false;
var game_paused = false;

function setup() {
	createCanvas(canvas_size[0], canvas_size[1]);
	background(51)
	loadBlockTypes();

	grid = new Grid(grid_size, getGridCoords(), tile_size, speed);
	grid.initialize();

	queue = new Queue(new Block(block_types), getQueueCoords());
	queue.addBlock(new Block(block_types));	
	queue.initialize();
}

function draw() {
	clear();
	background(51);

	showHeader();
	showScores();
	
	queue.show();
	if (!game_paused)
		grid.update();

	if (!game_started)
		displayStart();

	if (game_paused)
		displayControls();

	if (game_over)
		displayEnd();
	
	if (game_started && !game_over && !game_paused && grid.block.frozen){
		game_over = grid.checkEndGame();
		line_count += grid.clearLines();
		if (line_count >= threshhold){
			level++;
			threshhold += 5 * level;
			speed = speed / 1.5;
			grid.speed = speed;
		}
		grid.addBlock(queue.block);
		queue.addBlock(new Block(block_types));
		queue.initialize();
	}

	if(keyIsDown(DOWN_ARROW) && !game_over && game_started && !game_paused){
		if (speed >= drop_speed)
			grid.speed = drop_speed;
	}

	shift_time = Math.floor(millis() / shift_speed) * shift_speed;

	if(keyIsDown(LEFT_ARROW) && !game_over && game_started && !game_paused){
		if (shift_time != last_shift_time){
			last_shift_time = shift_time;
			grid.block.shift(-1, grid.tiles, grid_size);
			grid.update();
		}
	}

	if(keyIsDown(RIGHT_ARROW) && !game_over && game_started && !game_paused){
		if (shift_time != last_shift_time){
			last_shift_time = shift_time;
			grid.block.shift(1, grid.tiles, grid_size);
			grid.update();
		}
	}	
}

function keyPressed(){
	if (keyCode == UP_ARROW && !game_over && game_started && !game_paused)
		grid.block.rotate(grid.tiles, grid_size);

	if (game_over && key == 'R'){
		game_over = false;
		game_started = false;

		line_count = 0;
		level = 1;
		speed = 1000;

		grid = new Grid(grid_size, getGridCoords(), tile_size, speed);
		grid.initialize();

		queue = new Queue(new Block(block_types), getQueueCoords());
		queue.addBlock(new Block(block_types));	
		queue.initialize();	
		
	}

	if (!game_over && game_started && key == 'P'){
		game_paused ? game_paused = false : game_paused = true;
	}
}

function keyReleased(){
	if (keyCode == DOWN_ARROW)
		grid.speed = speed;
}

function mousePressed(){
	if (!game_started && !game_over && mouseX > 0 && mouseY > 0 && mouseX < canvas_size[0] && mouseY < canvas_size[1]){
		grid.addBlock(queue.block);
		queue.addBlock(new Block(block_types));
		queue.initialize();
		game_started = true;
	}
}

function loadBlockTypes(){
	// Square
	append(block_types, [[1, 1], [1, 1]]);
	// T 
	append(block_types, [[0, 0, 1], [0, 1, 1], [0, 0, 1]]);
	// Right L
	append(block_types, [[0, 0, 0], [0, 0, 1], [1, 1, 1]]);
	// Left L
	append(block_types, [[1, 1, 1], [0, 0, 1], [0, 0, 0]]);
	// Right S
	append(block_types, [[0, 0, 0], [0, 1, 1], [1, 1, 0]]);
	// Left S
	append(block_types, [[1, 1, 0], [0, 1, 1], [0, 0, 0]]);
	// Line
	append(block_types, [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]);
}

function getGridCoords(){
	var grid_coords = [];
	for (var i = 0; i < grid_size[0]; i++){
		grid_coords[i] = [];
		for (var j = 0; j < grid_size[1]; j++){
			grid_coords[i][j] = [(i + 1) * spacing + 7, (j + 1) * spacing + 50];
		}
	}
	return grid_coords;
}

function getQueueCoords(){
	var queue_coords = [];
	for (var i = 0; i < 4; i++){
		queue_coords[i] = [];
		for (var j = 0; j < 4; j++){
			queue_coords[i][j] = [(i + 1) * queue_spacing + 387, (j + 1) * queue_spacing + 2];
		}
	}
	return queue_coords;
}

function showHeader(){
	push();
		fill(250);
		textStyle(BOLD);
		textSize(40);
		textAlign(CENTER, CENTER);
		textFont('Trebuchet MS');
		text('TETRIS', 90, 33);
	pop();
}

function showScores(){
	push();
		fill(255);
		textSize(14);
		textAlign(LEFT, CENTER);
		textFont('Trebuchet MS');
		text('Lines: ' + line_count, 190, 33);
		text('Level: ' + level, 270, 33);
		text('Next:', 350, 33);
		if (game_paused)
			text('press < p > to resume', 305, 640)
		else if (game_started)
			text('press < p > to pause / for controls', 225, 640);
	pop();
}

function displayEnd(){
	push();
		noStroke();
		rectMode(CENTER);
		fill(250, 200, 200);
		rect(canvas_size[0] / 2, canvas_size[1] / 2, 220, 120);
		fill(51);
		rect(canvas_size[0] / 2, canvas_size[1] / 2, 210, 110);
		fill(255);
		textSize(28);
		textAlign(CENTER, CENTER);
		textFont('Trebuchet MS');
		text('GAME OVER', canvas_size[0] / 2, canvas_size[1] / 2 - 17);
		textSize(16);
		textStyle(NORMAL);
		text('press < r > to restart', canvas_size[0] / 2, canvas_size[1] / 2 + 20);
	pop();
}

function displayStart(){
	push();
		noStroke();
		rectMode(CENTER);
		fill(200, 250, 200);
		rect(canvas_size[0] / 2, canvas_size[1] / 2, 200, 70);
		fill(51);
		rect(canvas_size[0] / 2, canvas_size[1] / 2, 190, 60);
		fill(255);
		textSize(20);
		textFont('Trebuchet MS');
		textAlign(CENTER, CENTER);
		text('CLICK TO START', canvas_size[0] / 2, canvas_size[1] / 2);
	pop();
}

function displayControls(){
	push();
		noStroke();
		rectMode(CENTER);
		fill(200, 250, 200);
		rect(canvas_size[0] / 2, canvas_size[1] / 2, 250, 180);
		fill(200);
		rect(canvas_size[0] / 2, canvas_size[1] / 2, 240, 170);
		fill(0);
		textSize(26);
		textStyle(BOLD);
		textFont('Trebuchet MS');
		textAlign(CENTER, CENTER);
		text('CONTROLS', canvas_size[0] / 2, canvas_size[1] / 2 - 55);
		fill(51);
		rect(canvas_size[0] / 2, canvas_size[1] / 2 + 5 , 30, 30, 5);
		rect(canvas_size[0] / 2, canvas_size[1] / 2 + 40, 30, 30, 5);
		rect(canvas_size[0] / 2 + 35, canvas_size[1] / 2 + 40, 30, 30, 5);
		rect(canvas_size[0] / 2 - 35, canvas_size[1] / 2 + 40, 30, 30, 5);
		fill(200);
		text('>', canvas_size[0] / 2 + 35, canvas_size[1] / 2 + 40);
		text('<', canvas_size[0] / 2 - 35, canvas_size[1] / 2 + 40);
		textSize(18);
		text('v', canvas_size[0] / 2, canvas_size[1] / 2 + 40);
		textSize(26);
		text('^', canvas_size[0] / 2, canvas_size[1] / 2  + 10);
		textSize(15);
		fill(0);
		textStyle(NORMAL);
		text('rotate', canvas_size[0] / 2, canvas_size[1] / 2 - 20);
		text('drop', canvas_size[0] / 2, canvas_size[1] / 2 + 65);
		text('shift\nright', canvas_size[0] / 2 + 75, canvas_size[1] / 2 + 40);
		text('shift\nleft', canvas_size[0] / 2 - 75, canvas_size[1] / 2 + 40);
	pop();
}