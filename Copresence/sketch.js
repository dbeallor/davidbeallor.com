var nodes = [];
var show_me = [];
var edges = [];
var num_passengers = 300;
var threshold = 28;
var data;
var copresences;
var cmap;
var threshold_slider;
var num_nodes = num_passengers;

function preload(){
	data = loadStrings('copresence.csv');
}

function setup() {
	createCanvas(600, 650);

	copresences = getData()

	for (var i = 0; i < num_passengers; i++){
		nodes[i] = new Node(i+1, i+1, num_passengers);
		show_me[i] = false;
	}

	loadColourMap();
	refreshThreshold();

	threshold_slider = createSlider(24, 33, 28, 1);
	threshold_slider.position(20, 20);
}

function draw() {
	background(51);
	fill(255);
	text('Threshold: ' +  threshold, 30, 20);

	var prev_threshold = threshold;
	threshold = threshold_slider.value();

	if (threshold != prev_threshold)
		refreshThreshold();

	for (var i = 0; i < num_passengers; i++){
		for (var j = i + 1; j < num_passengers; j++)
			if ((parseInt(copresences[i][j])) >= threshold)
				edges[i][j].show();
	}

	for (var i = 0; i < nodes.length; i++)
		if(show_me[i])
			nodes[i].show();
}

function refreshThreshold(){
	for (var i = 0; i < num_passengers; i++)
		show_me[i] = false

	for (var i = 0; i < num_passengers; i++){
		edges[i] = [];
		for (var j = i + 1; j < num_passengers; j++) {
			if ((parseInt(copresences[i][j])) >= threshold){
				show_me[i] = true;
				show_me[j] = true;
			}
		}
	}

	num_nodes = 0
	for (var i = 0; i < num_passengers; i++){
		if (show_me[i])
			num_nodes++
	}

	node_num = 0;
	for (var i = 0; i < num_passengers; i++){
		if (show_me[i])
			nodes[i].refresh(node_num++)
	}

	for (var i = 0; i < num_passengers; i++){
		edges[i] = [];
		for (var j = i + 1; j < num_passengers; j++) {
			if ((parseInt(copresences[i][j])) >= threshold)
				edges[i][j] = new Edge(nodes[i], nodes[j], parseInt(copresences[i][j]), threshold, cmap)
		}
	}
}


function getData(){
	var result = [];
	for (var i=0; i < data.length; i++){
		result[i] = data[i].split(',');
	}
	return result;
}

function loadColourMap(){
	cmap = [
		[229, 55, 0],
		[231, 75, 25],
		[234, 95, 51],
		[236, 115, 76],
		[239, 135, 102],
		[242, 155, 127],
		[244, 175, 153],
		[247, 195, 178],
		[249, 215, 204],
		[252, 235, 229],
		[255, 255, 255]
	];
}