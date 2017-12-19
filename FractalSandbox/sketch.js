var sandbox;
var show_gridlines;
var nodes;
var edges;
var temp_nodes;
var temp_edges;
var creating_seed;
var creating_generator;
var seed_data;
var r_seed_data;
var idx;
var fractalize;
var current_edge;
var edges_drawn;
var control_box;
var screen_bounds = [0, 720, 3, 455];
var load_bar;
var edges_to_replace;
var prev_click;

function setup() {
	createCanvas(720, 520);
	angleMode(RADIANS);

	show_gridlines = true;

	creating_seed = true;
	creating_generator = false;
	fractalize = false;

	edges_drawn = true;

	sandbox = new Sandbox(width / 2, height / 2 - 32, 720);

	nodes = [];
	edges = [];

	seed_data = [];
	r_seed_data = [];
	types = [];

	edges_to_replace = 0;

	nodes[0] = new FractalNode(0, 0);

	var labels = ["LOAD", "COLOR\nSCHEME", "GRID\nLINES", "HELP", "RESTART"];
	control_box = new ControlBox(width / 2 - 2, height - 32, width-3, 60, labels.length, labels);

	load_bar = new LoadBar(20, 20, 80, 10);
}

function draw() {
	if (creating_seed || creating_generator || fractalize){
		background(51);
		if (show_gridlines)
			sandbox.show();
	}

	if (creating_seed){
		showPotentialNode();
		showSeed();
	} 

	else if (creating_generator){
		refreshEdgeType();
		showSelection();
		edges_drawn = false;
	}

	else if (fractalize)
		advance();

	else if (!edges_drawn)
		refresh();

	if (mouseIsPressed && !creating_seed && !creating_generator && !fractalize){
		translateShape();
	}

	control_box.show();	
}

function mousePressed(){
	prev_click = [mouseX, mouseY];
	if (creating_seed && withinBounds(mouseX, mouseY, screen_bounds)){
		nodes = append(nodes, new FractalNode(0, 0));
		edges = append(edges, new FractalEdge(nodes[nodes.length - 2], nodes[nodes.length - 1], 2, 0, [200, 200, 200]));
	}

	if (creating_generator && withinBounds(mouseX, mouseY, screen_bounds)){
		seed_data[idx-1][2] = edges[idx-1].type;
		r_seed_data[r_seed_data.length - idx][2] = edges[idx-1].type;
		edges.splice(idx - 1, 1);
		edges = splice(edges, temp_edges, idx - 1);
		nodes = splice(nodes, temp_nodes, idx);
		idx--;
		if (idx == 0){
			creating_generator = false;
		}
	}

	if (withinBounds(mouseX, mouseY, control_box.bounds)){
		if (withinBounds(mouseX, mouseY, control_box.buttons[2].bounds)){
			show_gridlines ? show_gridlines = false : show_gridlines = true;
			edges_drawn = false;
		}

		if (withinBounds(mouseX, mouseY, control_box.buttons[4].bounds))
			setup();
	}
}

function translateShape(){
	deltaX = mouseX - prev_click[0];
	deltaY = mouseY - prev_click[1];

	prev_click = [mouseX, mouseY];

	for (var i = 0; i < nodes.length; i++){
		nodes[i].setPosition([nodes[i].pos.x + deltaX, nodes[i].pos.y + deltaY]);
		if (i > 0){
			edges[i-1].setStart(edges[i-1].start.x + deltaX, edges[i-1].start.y + deltaY);
			edges[i-1].setEnd(edges[i-1].end.x + deltaX, edges[i-1].end.y + deltaY);
		}
	}

	edges_drawn = false;
}

function keyPressed(){
	if (key == 'R')
		setup();

	if (keyCode == ENTER){
		if (creating_seed)
			setupForGenerator();

		if (!creating_seed && !creating_generator && !fractalize && edges.length <= 10000){
			fractalize = true;
			current_edge = edges.length;
			var level = floor(Math.log(edges.length) / Math.log(seed_data.length)) + 1;
			edges_to_replace = pow(seed_data.length, level);
		}
	}

	if (key == 'G'){
		show_gridlines ? show_gridlines = false : show_gridlines = true;
		edges_drawn = false;
	}
}

function setupForGenerator(){
	nodes.splice(nodes.length -1, 1);
	edges.splice(edges.length - 1, 1);

	for (var i = 0; i < edges.length; i++)
		edges[i].setWeight(1);

	getSeedData();

	idx = nodes.length - 1;
	creating_seed = false;
	creating_generator = true;
}

function showPotentialNode(){
	if (withinBounds(mouseX, mouseY, screen_bounds))
		nodes[nodes.length - 1].setPosition(closestGridPoint(mouseX, mouseY, sandbox.coords));

	if (edges.length > 0)
		edges[edges.length - 1].setEnd(nodes[nodes.length - 1].pos.x, nodes[nodes.length - 1].pos.y);
}

function showSeed(){
	if (withinBounds(mouseX, mouseY, screen_bounds)){
		for (var i = 0; i < edges.length; i++)
			edges[i].show();

		for (var i = 0; i < nodes.length; i++)
			nodes[i].show();
	}
	else{
		for (var i = 0; i < edges.length - 1; i++)
			edges[i].show();

		for (var i = 0; i < nodes.length - 1; i++)
			nodes[i].show();
	}
}

function refreshEdgeType(){
	if (aboveLine(mouseX, mouseY, nodes[idx - 1].pos.x, nodes[idx - 1].pos.y, nodes[idx].pos.x, nodes[idx].pos.y)){
		// text("above", 50, 50);
		if (toTheLeft(mouseX, mouseY, nodes[idx - 1].pos.x, nodes[idx - 1].pos.y, nodes[idx].pos.x, nodes[idx].pos.y)){
			// text("to the left", 50, 70);
			edges[idx - 1].type = 1;
		}
		else 
			edges[idx - 1].type = 0;
	}
	else{
		if (toTheLeft(mouseX, mouseY, nodes[idx - 1].pos.x, nodes[idx - 1].pos.y, nodes[idx].pos.x, nodes[idx].pos.y)){
			// text("to the left", 50, 70);
			edges[idx - 1].type = 3;
		}
		else 
			edges[idx - 1].type = 2;
	}
}

function showSelection(){
	var result = subdivide(idx);
	temp_nodes = result[0];
	temp_edges = result[1];

	for (var i = 0; i < idx - 1; i++)
		edges[i].show();

	for (var i = 0; i < temp_edges.length; i++)
		temp_edges[i].show();

	for (var i = idx; i < edges.length; i++)
		edges[i].show();

	for (var i = 0; i < nodes.length; i++)
		nodes[i].show();
}

function advance(){
	speed = min(100, max(1, floor(edges.length / 100)));
	for (var i = 0; i < speed; i++){
		update(current_edge--);
		if (current_edge == 0){
			fractalize = false;
			break;
		}
	}

	scaleColours();
	for (var i =  edges.length - 1; i >= 0; i--)
		edges[i].show();

	edges_drawn = false;

	load_bar.setPercentage(edges.length / edges_to_replace);
	load_bar.show();
}

function refresh(){
	background(51);
	if (show_gridlines)
		sandbox.show();

	for (var i =  edges.length - 1; i >= 0; i--)	
		edges[i].show();
	edges_drawn = true;
}

function update(e){
	var result = subdivide(e);
	temp_nodes = result[0];
	temp_edges = result[1];
	edges.splice(e - 1, 1);
	edges = splice(edges, temp_edges, e - 1);
	nodes = splice(nodes, temp_nodes, e);
}

// Returns the closest grid coordinate to the point (x,y)
function closestGridPoint(x, y, coords){
	closest_dist = 10000;
	closest_pos = [-1, -1];
	var d;
	for (var i = 0; i < coords.length; i++){
		for (var j = 0; j < coords.length; j++){
			d = dist(coords[i][j][0], coords[i][j][1], x, y);
			if (d < closest_dist){
				closest_dist = d;
				closest_pos = coords[i][j];
			}
		}
	}
	return closest_pos;
}

function getSeedData(){
	var base = createVector(nodes[nodes.length -1].pos.x - nodes[0].pos.x, nodes[nodes.length -1].pos.y - nodes[0].pos.y);
	var sub = createVector(0, 0);
	var r_base = createVector(nodes[0].pos.x - nodes[nodes.length -1].pos.x, nodes[0].pos.y - nodes[nodes.length -1].pos.y);
	var r_sub = createVector(0, 0);
	for (var i = 0; i < nodes.length - 2; i++){
		// SEED DATA - FORWARD DIRECTION
		// Record the polar coordinates of the seed nodes with respect to the vector n1->n2
		sub.x = nodes[i+1].pos.x - nodes[0].pos.x;
		sub.y = nodes[i+1].pos.y - nodes[0].pos.y;
		seed_data[i] = [];
		seed_data[i][0] = sub.mag() * 1.0 / base.mag();
		seed_data[i][1] = angleBetween(sub, base);
		seed_data[i][2] = 0;

		// SEED DATA - REVERSE DIRECTION
		// Record the polar coordinates of the seed nodes with respect to the vector n2->n1
		r_sub.x = nodes[nodes.length - 2 - i].pos.x - nodes[nodes.length - 1].pos.x;
		r_sub.y = nodes[nodes.length - 2 - i].pos.y - nodes[nodes.length - 1].pos.y;
		r_seed_data[i] = [];
		r_seed_data[i][0] = r_sub.mag() * 1.0 / r_base.mag();
		r_seed_data[i][1] = angleBetween(r_base, r_sub);
		r_seed_data[i][2] = 0;
	}

	// Add dummy data point at the end to hold type of final edge connecting the seed back to the shape
	seed_data[nodes.length - 2] = [0, 0, 0];
	r_seed_data[nodes.length -2] = [0, 0, 0];
}

function subdivide(idx){
	var new_base = createVector(nodes[idx].pos.x - nodes[idx-1].pos.x, nodes[idx].pos.y - nodes[idx-1].pos.y);
	var angle_offset = new_base.heading();
	var mag_scaler = new_base.mag();
	var new_nodes = [];
	var new_edges = [];
	var x, y;

	// Determine whether to read the seed in forward or reverse order
	var data;
	if (edges[idx - 1].type == 1 || edges[idx - 1].type == 3)
		data = r_seed_data;
	else 
		data = seed_data;

	// Determine whether to flip the seed
	var neg;
	if (edges[idx - 1].type == 0 || edges[idx - 1].type == 3)
		neg = -1;
	else 
		neg = 1;

	// For each new node in the seed
	for (var j = 0; j < data.length - 1; j++) {
		// Get the new node's coordinates
		x = nodes[idx-1].pos.x + data[j][0] * mag_scaler * Math.cos(neg * data[j][1] + angle_offset);
		y = nodes[idx-1].pos.y + data[j][0] * mag_scaler * Math.sin(neg * data[j][1] + angle_offset);

		// Add a node with these coordinates to the nodes array
		new_nodes = append(new_nodes, new FractalNode(x, y));

		// Add an edge between this node and the previous one
		if (j-1 >= 0)
			new_edges = append(new_edges, new FractalEdge(new_nodes[j-1], new_nodes[j], 1, data[j][2], [200, 200, 200]));
		// 													node1             node2   weight  type         stroke
		else
			new_edges = append(new_edges, new FractalEdge(nodes[idx-1], new_nodes[j], 1, data[j][2], [200, 200, 200]));
	}

	// Finally, add an edge connecting the last node in the seed to the next node in nodes
	new_edges = append(new_edges, new FractalEdge(new_nodes[new_nodes.length - 1], nodes[idx], 1, data[data.length - 1][2], [200, 200, 200]));

	return [new_nodes, new_edges];
}

function angleBetween(v1, v2){
	if (v2.y >= v1.y)
		return Math.acos(dot(v1, v2)/(v1.mag()*v2.mag()));
	else
		return -Math.acos(dot(v1, v2)/(v1.mag()*v2.mag()));
}

function dot(v1, v2){
	return v1.x*v2.x + v1.y*v2.y;
}

// Return the slope of the line  (x1, y1) --> (x2, y2)
function slope(x1, y1, x2, y2){
	if (x2 - x1 == 0) 
		return 1000000;
	else
		return (y2 - y1) / (x2 - x1);
}

// Determine the y intercept of the line y = mx + b given m, x and y
function intercept(m, x, y){
	return y - m*x;
}

// Determine if the point (x, y) is "above" the line (x1, y1) --> (x2, y2)
function aboveLine(x, y, x1, y1, x2, y2){
	if (x2 >= x1){
		var m = slope(x1, y1, x2, y2);
		if (m == 1000000) // check for vertical line
			if (y2 > y1)
				return x > x1;
			else
				return x < x1;
		var b = intercept(m, x1, y1);
		return y < m * x + b;
	}
	else {
		var m = slope(x2, y2, x1, y1);
		if (m == 1000000)
			if (y2 > y1)
				return x > x1;
			else
				return x < x1;
		var b = intercept(m, x1, y1);
		return y > m * x + b;
	}	
}

// Return the midpoint of the line (x1, y1) --> (x2, y2)
function midpoint(x1, y1, x2, y2){
	return [(x1 + x2) / 2, (y1 + y2) / 2];
}

// Determine if the point (x, y) is "to the left" of the line perpendicular to the line (x1, y1) --> (x2, y2)
// and passing through it's midpoint
function toTheLeft(x, y, x1, y1, x2, y2){
	var vec = createVector(x2 - x1, y2 - y1);
	var perp_vec = createVector(1, -vec.x/vec.y);
	var mid = midpoint(x1, y1, x2, y2);
	if (vec.y == 0){
		if (x2 > x1)
			return x < mid[0]
		else
			return x > mid[0]
	}
	var end = [mid[0] + perp_vec.x, mid[1] + perp_vec.y];

	if (end[1] < mid[1])
		return aboveLine(x, y, mid[0], mid[1], end[0], end[1]);
	else
		return aboveLine(x, y, end[0], end[1], mid[0], mid[1]);
}

function scaleColours(){
	var l = edges.length;
	var r, g, b;
	for (var i = 0; i < l; i++){
		// Map position in edges array to value between 0 and 1
		x = map(i, 0, l-1, 0, 1);

		r = 0.79788*Math.exp(-pow(1*(x - 1.0), 2)/0.5);
		r = map(r, 0, 1, 20, 255);

		g = 0.79788*Math.exp(-pow(2*(x - 0.5), 2)/0.5);
		g = map(g, 0, 1, 20, 255);
		
		b = 0.79788*Math.exp(-pow(1*(x - 0.0), 2)/0.5);
		b = map(b, 0, 1, 20, 255);

		edges[i].setStroke([r, g, b]);
	}
}

function withinBounds(x, y, bounds){
	return (x >= bounds[0] && x < bounds[1] && y >= bounds[2] && y < bounds[3]);
}