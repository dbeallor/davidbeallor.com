var textures = [];
var grid;
var NUM_TEXTURES = 5;
var window_dims;

function preload(){
	createCanvas(windowWidth, windowHeight);
	loadTextures();
	window_dims = createVector(windowWidth, windowHeight);
}

function setup(){
	grid = new Grid();
	tilebox = new TileBox();
	// tilebox.open();
	angleMode(RADIANS);
}

function draw() {
	background(51);
	grid.show();
	tilebox.show();
}

function mousePressed(){
	grid.mousePressedEvents();
	tilebox.onClick();
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	grid.resize();
	tilebox.resize();
	window_dims.x = windowWidth;
	window_dims.y = windowHeight;
}

function loadTextures(){
	for (var i = 0; i < NUM_TEXTURES; i++)
		textures = append(textures, loadImage('texture' + i  + (i == 0 ? '.png' : '.jpg')));
}
