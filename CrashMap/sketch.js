var mapimg;

var clon = 0;
var clat = 22;
var cx, cy;

var zoom = 1;
var textdata, crashes;
var yr = 2008;
var Show_All_Years = true;

var gui;

function preload(){
	mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/0,22,1/950x500?access_token=pk.eyJ1IjoiZGJlYWxsb3IiLCJhIjoiY2l6NjlncXphMDZubTJ3cWZ5d29wdjdrNiJ9.wJlJEcVG9P2EKtFFzZfMkA');
	textdata = loadStrings('TrimmedData.csv');
}

function setup() {
	createCanvas(950,500);
	cx = mercX(clon);
	cy = mercY(clat);
	crashes = getData();
	// Create the GUI
	sliderRange(2000, 2016, 1);
	gui = createGui('CHOOSE YEAR');
	gui.addGlobals('yr','Show_All_Years');
}

function draw(){
	clear();
	translate(width/2, height/2);
	imageMode(CENTER);
	image(mapimg, 0, 0);
	var x,y;
	for (var i=1; i<crashes.length; i++){
		var crash_year = parseInt("20"+crashes[i][2].split('/')[2]);
		var x = mercX(crashes[i][6]) - cx;
		var y = mercY(crashes[i][5]) - cy;
		var r = 2*pow(crashes[i][7],1/1.8);
		if (crash_year == yr || Show_All_Years){
			push();
			if (crashes[i][7]<20){
				fill(255,255,0,150);
			}
			else if (crashes[i][7]>= 20 && crashes[i][7]<80){
				fill(255,100,0,150);
			}
			else if (crashes[i][7]>= 80){
				fill(255,0,0,150);
			}
			stroke(0);
			ellipse(x,y,r);
			pop();
		}
	}
	for (var i=crashes.length-1; i>0; i--){
		var crash_year = parseInt("20"+crashes[i][2].split('/')[2]);
		var x = mercX(crashes[i][6]) - cx;
		var y = mercY(crashes[i][5]) - cy;
		var r = 2*pow(crashes[i][7],1/1.8);
		if ((crash_year == yr || Show_All_Years) && dist(mouseX-width/2,mouseY-height/2,x,y)<r/2){
			push();
			fill(200,200,200,235);
			rectMode(CENTER);
			rect((x>0)? x-75:x+75, y, 110, 100, 10);
			fill(0);
			textStyle(BOLD);
			textAlign(CENTER,CENTER);
			text(crashes[i][3],(x>0)? x-75:x+75, y-30);
			textStyle(NORMAL);
			textAlign(CENTER,CENTER);
			text(crashes[i][4],(x>0)? x-75:x+75, y-15);
			text(crashes[i][2].trim(),(x>0)? x-75:x+75, y+8);
			fill(200,10,10);
			text("fatalities: " + crashes[i][7],(x>0)? x-75:x+75, y+30);
			pop();
			break;
		}
	}
}

function getData(){
	var result = [];
	for (var i=0; i<textdata.length; i++){
		result[i] = textdata[i].split(',');
	}
	return result;
}

function mercX(x) {
	x = radians(x);
	var a = (256/PI)*pow(2,zoom);
	var b = x + PI;
	return a*b;
}

function mercY(y) {
	y = radians(y);
	var a = (256/PI)*pow(2,zoom);
	var b = tan(PI/4 + y/2);
	var c = PI-log(b);
	return a*c;
}