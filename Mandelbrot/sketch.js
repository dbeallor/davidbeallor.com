var x_range = [-1.5, 0.5];
var y_range = [-1, 1];
var c1 = [0, 0];
var c2 = [0, 0];
var iterations = 250;
var f = [];
var cmap = [
[0, 0, 0],
[59, 76, 192],
[68, 90, 204],
[77, 104, 215],
[87, 117, 225],
[98, 130, 234],
[108, 142, 241],
[119, 154, 247],
[130, 165, 251],
[141, 176, 254],
[152, 185, 255],
[163, 194, 255],
[174, 201, 253],
[184, 208, 249],
[194, 213, 244],
[204, 217, 238],
[213, 219, 230],
[221, 221, 221],
[229, 216, 209],
[236, 211, 197],
[241, 204, 185],
[245, 196, 173],
[247, 187, 160],
[247, 177, 148],
[247, 166, 135],
[244, 154, 123],
[241, 141, 111],
[236, 127, 99],
[229, 112, 88],
[222, 96, 77],
[213, 80, 66],
[203, 62, 56],
[192, 40, 47],
[180, 4, 38]];

function setup() {
	createCanvas(500, 500);
	pixelDensity(1);
	for (var i = 0; i < width; i++){
		f[i] = [];
		for (var j = 0; j < height; j++){
			f[i][j] = [];
		}
	}
	refresh_drawing();
	console.log(cmap.length)
}

function draw() {
	loadPixels();
	for (var i = 0; i < width; i++){
		for (var j = 0; j < height; j++){
			var pix_idx = (i + j * width) * 4;
			pixels[pix_idx + 0] = f[i][j][0];
			pixels[pix_idx + 1] = f[i][j][1];
			pixels[pix_idx + 2] = f[i][j][2];
			pixels[pix_idx + 3] = 255;
		}
	}
	updatePixels();
	if (mouseIsPressed){
		c2 = [mouseX, mouseY];
		push();
		noFill();
		stroke(255, 0, 0);
		strokeWeight(2);
		rectMode(CORNERS);
		rect(c1[0], c1[1], c2[0], c2[1]);
		pop();
	}
	push();
	fill(200);
	stroke(100)
	rectMode(CORNERS);
	rect(10, 490, 180, 450);
	fill(255, 0, 0);
	textSize(16);
	noStroke();
	text('click and drag to zoom', 15, 465);
	text('      press r to reset', 15, 485);
	pop();
}

function refresh_drawing(){
	for (var i = 0; i < width; i++){
		for (var j = 0; j < height; j++){
			a = map(i, 0, width, x_range[0],  x_range[1]);
			b = map(j, 0, height, y_range[0],  y_range[1]);
			// console.log(mandelbrot([0, 0], [a, b], 0, iterations))
			f[i][j] = cmap[mandelbrot([0, 0], [a, b], 0, iterations)];
		}
	}
}

function mandelbrot(z, c, ctr, i) {
	if (ctr == i) return 0;
	if (z[0]*z[0] + z[1]*z[1] > 4) 
		return Math.floor(map(Math.pow(map(ctr, 0, i, 0, 1), 1/1.5), 0, 1, 0, cmap.length));
	return mandelbrot(c_add(c_square(z), c), c, ctr + 1, i);
}

function c_add(a, b){
	return [a[0] + b[0], a[1] + b[1]];
}

function mousePressed() {
	c1 = [mouseX, mouseY];
}

function mouseReleased() {
	c2 = [mouseX, mouseY];
	if (dist(c1[0], c1[1], c2[0], c2[1]) > 10){
		center_x = map((c1[0] + c2[0])/2, 0, 500, x_range[0], x_range[1]);
		center_y = map((c1[1] + c2[1])/2, 0, 500, y_range[0], y_range[1]);
		if (abs(c2[0] - c1[0]) > abs(c2[1] - c1[1]))
			r = map(abs(c2[0] - c1[0])/2, 0, 250, 0, abs(x_range[1] - x_range[0]) / 2);
		else
			r = map(abs(c2[1] - c1[1])/2, 0, 250, 0, abs(y_range[1] - y_range[0]) / 2);
		x1 = center_x - r;
		x2 = center_x + r;
		y1 = center_y - r;
		y2 = center_y + r;
		console.log([x1, x2, y1, y2])
		zoom([x1, x2], [y1, y2]);
	}
	refresh_drawing();
}

function c_square(z){
	// z^2 = (a + ib)^2 = (a^2 - b^2) + (2ab)*i 
	return [z[0]*z[0] - z[1]*z[1], 2*z[0]*z[1]];
}

function zoom(new_x, new_y){
	x_range = new_x;
	y_range = new_y;
}

function keyPressed(){
	if (key == 'R'){
		x_range = [-1.5, 0.5];
		y_range = [-1, 1];
		refresh_drawing();
	}
}