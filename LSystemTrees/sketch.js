var axiom = "F";
var sentence = axiom;
var len = 130;
var r = 255;
var g = 255;
var b = 255;

var started = false;

var writing = true;

var rule = {a: "F", b: "F["};

var rSlider, bSlider, gSlider;

var r_scale, g_scale, b_scale;

function setup() {
	createCanvas(800, 500);
	background(51);
}

function draw(){
	if (!started){
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
}

function keyPressed(){
	if (started){
		if (writing){
			if (keyCode == UP_ARROW){
				rule.b += "F";
				turtle(rule.b + "F");
			}		
			if (keyCode == DOWN_ARROW){
				rule.b += "][";
				turtle(rule.b + "F");
			}
			if (keyCode == LEFT_ARROW){
				rule.b += "-";
				turtle(rule.b + "F");
			}
			if (keyCode == RIGHT_ARROW){
				rule.b += "+";
				turtle(rule.b + "F");
			}
			if (keyCode == ENTER){
				while (rule.b.charAt(rule.b.length-1) == "["){
					rule.b = rule.b.substring(0,rule.b.length-1);
				}
				var pushes = 0;
				for (var i=0; i<rule.b.length; i++){
					if (rule.b.charAt(i) == "[")
						pushes++;
					else if (rule.b.charAt(i) == "]")
						pushes--;
				}
				if(pushes>0){
					for (var i=0; i<pushes; i++)
						rule.b += "]";
				}
				writing = false;
				update();
			}
		}
		if (key == ' ' && !writing){
			update();
			var f_count = 0;
			for (var i=0; i<sentence.length; i++){
				if (sentence.charAt(i) == "F")
					f_count++;
			}
			if (f_count>=25000){
				sentence = axiom;
			}
		}

		if (key === "R"){
			console.log("woo");
			writing = true;
			sentence = axiom;
			rule.b = "F[";
			turtle(rule.b);
		}
	}
}

function mousePressed(){
	if (!started && mouseX<=width && mouseY<=height){
		started = true;
		sliders();
		r_scale = rSlider.value();
		g_scale = gSlider.value();
		b_scale = bSlider.value();
		turtle(rule.b);	
	}
}

function update() {
	var next = "";
	for (var i=0; i<sentence.length; i++){
		if (sentence.charAt(i) == rule.a){
			next += rule.b;
		}
		else {
			next += sentence.charAt(i);
		}
	}
	sentence = next;
	console.log(sentence);
	turtle(sentence);
}

function turtle(str) {
	background(51);
	resetMatrix();
	sliderLabels();
	translate(width/2, height);
	r_scale = rSlider.value();
	g_scale = gSlider.value();
	b_scale = bSlider.value();
	var prev_len = [];
	var prev_r = [];
	var prev_g = [];
	var prev_b = [];
	for (var i=0; i<str.length; i++){
		if (i!=str.length-1){
			if (str.charAt(i) == "F"){
				stroke(r,g,b);
				line(0,0,0,-len);
				translate(0,-len);
				len*=0.75;
				r*=r_scale;
				g*=g_scale;
				b*=b_scale;
			}
			else if (str.charAt(i) == "+"){
				rotate(radians(15));
			}
			else if (str.charAt(i) == "-"){
				rotate(-radians(15));
			}
			else if (str.charAt(i) == "["){
				prev_len.push(len);
				prev_r.push(r);
				prev_g.push(g);
				prev_b.push(b);
				if (writing){
					push();
					stroke(200,200,0);
					strokeWeight(10);
					point(0,0);
					pop();
				}
				push();
			}
			else if (str.charAt(i) == "]"){
				len = prev_len.pop();
				r = prev_r.pop();
				g = prev_g.pop();
				b = prev_b.pop();
				pop();
			}
		}
		else if (writing){
			push();
			stroke(200,200,0);
			strokeWeight(3);
			line(0,0,0,-len);
			pop();
		}
	}
	len = 130;
	r = 255;
	g = 255;
	b = 255;
}

function sliders(){
	rSlider = createSlider(0.7, 1, 0.7, 0.001);
	gSlider = createSlider(0.7, 1, 0.85, 0.001);
	bSlider = createSlider(0.7, 1, 0.7, 0.001);
	rSlider.position(30, 10);
	gSlider.position(30, 40);
	bSlider.position(30, 70);
}

function sliderLabels(){
	push();
	fill(255);
	noStroke();
	textSize(12);
	text("r:", 10, 22);
	text("g:", 10, 52);
	text("b:", 10, 82);
	text("press < r > to restart", width-130, 12);
	if (writing){
		text("< arrowkeys > to draw", width-135, 27);
		text("press < enter > to lock", width-135, 42);
	}
	else
		text("press < space > to fractalize", width-150, 27);
	
	pop();
}