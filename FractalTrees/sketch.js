var left_angle;
var right_angle;

var left_scale;
var right_scale;

var left_weight;
var right_weight;

var r_scale;
var g_scale;
var b_scale;

var sliderL;
var sliderR;
var sliderSL;
var sliderSR;
var sliderWL;
var sliderWR;

function setup() {
	createCanvas(800,475);

	sliderL = createSlider(0, PI, 0.46, 0.01);
	sliderL.position(width-155, 40);
	sliderR = createSlider(0, PI, 1.23, 0.01);
	sliderR.position(width-155, 70);

	sliderSL = createSlider(0, 0.67, 0.67, 0.01);
	sliderSL.position(width-155, 150);
	sliderSR = createSlider(0, 0.67, 0.67, 0.01);
	sliderSR.position(width-155, 180);

	sliderWL = createSlider(0.5, 1, 0.87, 0.01);
	sliderWL.position(width-155, 260);
	sliderWR = createSlider(0.5, 1, 0.97, 0.01);
	sliderWR.position(width-155, 290);

	redSlider = createSlider(0.7,1,0.8,0.001);
	redSlider.position(width-155, 370);
	greenSlider = createSlider(0.7,1,0.9,0.001);
	greenSlider.position(width-155, 400);
	blueSlider = createSlider(0.7,1,0.8,0.001);
	blueSlider.position(width-155, 430);
}	

function draw() {
	background(51);

	sliderLabels();
	left_angle = sliderL.value();
	right_angle = sliderR.value();
	left_scale = sliderSL.value();
	right_scale = sliderSR.value();
	left_weight = sliderWL.value();
	right_weight = sliderWR.value();
	r_scale = redSlider.value();
	b_scale = blueSlider.value();
	g_scale = greenSlider.value();

	push();
	stroke(255);
	strokeWeight(2);
	translate(280, height);
	branch(160, 2, 255, 255, 255);
	pop();
}

function branch(len, weight, r, g, b){
	line(0,0,0,-len);
	translate(0,-len);
	if(len>2){
		push();
		stroke(r,g,b);
		strokeWeight(weight);
		rotate(-left_angle);
		branch(len*left_scale, weight*left_weight, r*r_scale, g*g_scale, b*b_scale);
		pop();
		push();
		stroke(r,g,b);
		strokeWeight(weight);
		rotate(right_angle);
		branch(len*right_scale, weight*right_weight, r*r_scale, g*g_scale, b*b_scale);
		pop();
	}
}

function sliderLabels(){
	push();
	fill(255);
	textSize(16);
	textAlign(CENTER,CENTER);
	text("Branch Angles", width-90, 20);
	text("Length Scaler", width-90, 130);
	text("Stroke Scaler", width-90, 240);
	text("Colour Scaler", width-90, 350);
	pop();
	push();
	fill(255);
	strokeWeight(0.2);
	textSize(15);
	textAlign(CENTER,CENTER);
	text("Left:", width-180, 50);
	text("Right:", width-185, 80);
	text("Left:", width-180, 160);
	text("Right:", width-185, 190);
	text("Left:", width-180, 270);
	text("Right:", width-185, 300);
	text("r:", width-185, 380);
	text("g:", width-185, 410);
	text("b:", width-185, 440);
	pop();
}