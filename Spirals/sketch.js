var r, angle, ratio;
var frame;
var dots = [];

function setup() {
	createCanvas(windowWidth,windowHeight);
	r = 0;
	angle = 0;
	ratio = 0.618;
	frame = [-windowWidth / 2, windowWidth / 2, -windowHeight / 2, windowHeight / 2];
	background(51);
}

function draw() {
	// background(51);
	translate(width / 2, height / 2);
	r += 2;
	angle += ratio * 2 * PI;
	dots = append(dots, new Dot(r, angle));
	showDots();
}

function zoomOut(b, v){
	if (b == 0){
		frame[0] = -v;
		frame[1] = v;
		var d = (frame[1] - frame[0]) * windowHeight / windowWidth;
		frame[2] = -d/2;
		frame[3] = d/2;
	}
	else {
		frame[2] = -v;
		frame[3] = v;
		var d = (frame[3] - frame[2]) * windowWidth / windowHeight;
		frame[0] = -d/2;
		frame[1] = d/2;
	}
}

function Dot(r, theta){
	this.r = r;
	this.theta = theta;


	this.show = function(){
		push();
		fill(255);
		noStroke();
		var x = map(r * cos(angle), frame[0], frame[1], -windowWidth / 2, windowWidth / 2);
		var y = map(r * sin(angle), frame[2], frame[3], -windowHeight / 2, windowHeight / 2);
		ellipse(x, y, 10, 10);
		pop();
		if (abs(x) > frame[1])
			zoomOut(0, abs(x));
		if (abs(y) > frame[3])
			zoomOut(1, abs(y));
	}
}

function showDots(){
	// for (var i = 0; i < dots.length; i++)
	// 	dots[i].show();
	dots[dots.length - 1].show();
}