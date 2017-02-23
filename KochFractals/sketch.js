var fractalize = false;

var base = 300;
var a,b,c,d,e;
var move = [false, false, false, false, false];
var mouseX_orig, mouseY_orig;
var seed;
var started = false;

function setup() {
	createCanvas(700,350);
	a = createVector(0,0);
	b = createVector(200,0);
	c = createVector(250, -200);
	d = createVector(300, 0);
	e = createVector(500, 0);
}

function draw() {
	background(51);
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
	else{
		translate(100,base);
		if (!fractalize){
			push();
			fill(255);
			noStroke();
			textSize(12);
			text("drag me around", 208, -285);
			text("press < space > to lock", 187, -268);
			pop();
			movePoints();
			drawLines();
		}		
		else {
			push();
			fill(255);
			noStroke();
			textSize(12);
			text("press < enter > to fractalize", 445, -285);
			text("press < r > to restart", 467, -268);
			pop();
			seed.show();
		}
	}
}

function keyPressed(){
	if (key == ' ' && !fractalize){
		seed = new SeedCopy(a,b,c,d,e);
		fractalize = true;
	}

	if (keyCode == ENTER){
		seed.update();
		if (seed.level_number>6)
			seed.restart();
	}

	if (key === "R"){
		fractalize = false;
	}
}

function mousePressed(){
	var points = [a, b, c, d, e];
	if (!started && mouseX<=width && mouseY<=height){
		started = true;
	}
	if (!fractalize && started){
		for (var i=0; i<points.length; i++){
			if (dist(mouseX-100, mouseY-base, points[i].x, points[i].y)<6){
				mouseX_orig = mouseX;
				mouseY_orig = mouseY;
				pointX_orig = points[i].x;
				pointY_orig = points[i].y;
				move[i] = true;
			}
		}
	}
}

function mouseReleased(){
	if (!fractalize){
		for (var i=0; i<move.length; i++){
			if (move[i])
				move[i] = false;
		}
	}
}

function drawLines(){
	push();
		stroke(255);
		strokeWeight(10);
		point(a.x, a.y);
		point(b.x, b.y);
		point(c.x, c.y);
		point(d.x, d.y);
		point(e.x, e.y);

		strokeWeight(2);
		line(a.x, a.y, b.x, b.y);
		line(b.x, b.y, c.x, c.y);
		line(c.x, c.y, d.x, d.y);
		line(d.x, d.y, e.x, e.y);
	pop();
}

function movePoints(){
	var new_loc_x, new_loc_y;
	if (move[0]){
		push();
		new_loc_x = pointX_orig + mouseX-mouseX_orig;
		if (new_loc_x>=-70 && new_loc_x<=b.x)
			a.x = new_loc_x;
		pop();
	}
	if (move[1]){
		push();
		new_loc_x = pointX_orig + mouseX-mouseX_orig;
		new_loc_y = pointY_orig + mouseY-mouseY_orig;
		if (new_loc_x>=a.x && new_loc_x<=c.x)
			b.x = new_loc_x;
		if (new_loc_x>c.x)
			b.x = c.x;
		if (new_loc_y>=c.y && new_loc_y<=0)
			b.y = new_loc_y;
		if (new_loc_y>0)
			b.y = 0;
		pop();
	}
	if (move[2]){
		push();
		new_loc_y = pointY_orig + mouseY-mouseY_orig;
		if (new_loc_y>=-250 && new_loc_y<=-30 && new_loc_y>=b.y && new_loc_y>=d.y)
			c.y = new_loc_y;
		pop();
	}
	if (move[3]){
		push();
		new_loc_x = pointX_orig + mouseX-mouseX_orig;
		new_loc_y = pointY_orig + mouseY-mouseY_orig;
		if (new_loc_x>=c.x && new_loc_x<=e.x)
			d.x = new_loc_x;
		if (new_loc_x<c.x)
			d.x = c.x;
		if (new_loc_y>=c.y && new_loc_y<=0)
			d.y = new_loc_y;
		if (new_loc_y > 0)
			d.y = 0;
		pop();
	}
	if (move[4]){
		push();
		new_loc_x = pointX_orig + mouseX-mouseX_orig;
		if (new_loc_x>=d.x && new_loc_x<=600)
			e.x = new_loc_x;
		pop();
	}

}