var calls = 5;
var points = 1001;
var x = [];
var y = [];
var zero;
var p_range;
var x_range;
var h_shift = 0;


function setup() {
	createCanvas(windowWidth, windowHeight);
	p_range = [50, windowWidth - 50];
	x_range = [0, 1];
	angleMode(RADIANS);
}

function draw() {
	background(51);

	zero = floor(points / 2);

	var y_start = 0.05 * windowHeight;
	var gap = 0.9 * windowHeight / (calls - 1);
	for (var i = 0; i < calls; i++){
		y[i] = y_start + i * gap;
		push();
		stroke(255, 0.55 * 255);
		// line(0, y[i], windowWidth, y[i]);
		pop();
	}

	push();
	noStroke();
	var x_offset = windowWidth / (points + 1);
	x = linspace(x_range[0], x_range[1], points)
	var new_x;
	for (var j = 0; j < calls; j++){			
		for (var i = 0; i < points; i++){
			if (j > 0)
				new_x = recurse(x[i]);

			xx = toPixelVal(j == 0 ? x[i] : new_x);

			colorMode(HSB);
			fill(0 + i / 2, 255, 255, 0.55);
			if (j != 0){
				stroke(0 + i * 360 / points, 255, 255, 0.55);
				line(toPixelVal(x[i]), y[j-1], xx, y[j]);
				x[i] = new_x;
			}
			ellipse(xx, y[j], x_offset * 0.8, x_offset * 0.8);
			// push();
			// fill(255);
			// text(x[i], xx, y[j] - 10)
			// pop();
		}
	}
	pop();
}

function keyPressed(){
	var d = p_range[1] - p_range[0];
	if (keyCode == UP_ARROW){
		p_range[0] -= d * 0.2;
		p_range[1] += d * 0.2;
	}
	if (keyCode == DOWN_ARROW){
		p_range[0] += d * 0.2;
		p_range[1] -= d * 0.2;
	}
	if (keyCode == LEFT_ARROW){
		h_shift += 50;
	}
	if (keyCode == RIGHT_ARROW){
		h_shift -= 50;
	}
}

function recurse(x){
	return tan(x);
}

function toPixelVal(x){
	return map(x, x_range[0], x_range[1], p_range[0], p_range[1]) + h_shift;
}

function linspace(a,b,n) {
    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
    if(n<2) { return n===1?[a]:[]; }
    var i,ret = Array(n);
    n--;
    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
    return ret;
}
