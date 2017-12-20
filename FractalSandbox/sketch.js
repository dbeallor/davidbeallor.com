var sandbox;
var show_gridlines;
var nodes;
var edges;
var nodes_copy;
var edges_copy;
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
var canvas_dims = [720, 520];
var upload_button;
var loading_seed;
var ready_to_load;
var show_upload_button;
var saving_seed;
var save_file_name;
var text_input;
var show_text_input;
var show_save_button;

function setup() {
	createCanvas(canvas_dims[0], canvas_dims[1]);
	angleMode(RADIANS);
	show_gridlines = true;

	creating_seed = true;
	creating_generator = false;
	fractalize = false;

	edges_drawn = true;

	sandbox = new Sandbox(width / 2, height / 2 - 32, 720);

	nodes = [];
	edges = [];
	nodes_copy = [];
	edges_copy = [];

	seed_data = [];
	r_seed_data = [];
	types = [];

	edges_to_replace = 0;

	nodes[0] = new FractalNode(0, 0);

	var labels = ["SAVE", "LOAD", "COLOR\nSCHEME", "GRID\nLINES", "HELP", "RESTART"];
	control_box = new ControlBox(width / 2 - 2, height - 32, width-3, 60, labels.length, labels);

	load_bar = new LoadBar(screen_bounds[1] - 100, screen_bounds[3] - 15, 80, 10);

	upload_button = createFileInput(handleFile);
	upload_button.position(sandbox.pos.x - 80, sandbox.pos.y + 5);
	show_upload_button = false;

	loading_seed = false;
	ready_to_load = false;

	saving_seed = false;

	text_input = createInput('enter filename');
	text_input.position(sandbox.pos.x - 90, sandbox.pos.y + 5);
	text_input.input(updateSaveFileName);
	show_text_input = false;

	save_button = createButton('save');
	save_button.position(sandbox.pos.x + 50, sandbox.pos.y + 5);
	save_button.mousePressed(saveSeed);
	show_save_button = false;
}

function draw() {
	if (creating_seed || creating_generator || fractalize || loading_seed){
		background(51);
	}

	if (creating_seed){
		if (show_gridlines)
			sandbox.show();
		showPotentialNode();
		showSeed();
	} 

	else if (creating_generator){
		refreshEdgeType();
		showSelection();
		edges_drawn = false;
	}

	else if (fractalize){
		advance();
		if (edges_to_replace > 100){
			load_bar.setPercentage(edges.length / edges_to_replace);
			load_bar.show();
		}
	}

	else if (!edges_drawn)
		refresh();

	if (mouseIsPressed && !creating_seed && !creating_generator && !fractalize && !loading_seed && !saving_seed){
		translateShape();
	}

	control_box.show();

	if (saving_seed)
		showSaveBox();

	if (loading_seed)
		showLoadBox();

	show_upload_button ? upload_button.show() : upload_button.hide();
	show_text_input ? text_input.show() : text_input.hide();
	show_save_button ? save_button.show() : save_button.hide();
}

function mousePressed(){
	if (!loading_seed && !saving_seed){
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
				nodes = nodeCopy(nodes_copy);
				edges = edgeCopy(edges_copy);
				creating_generator = false;
			}
		}
	}

	if (withinBounds(mouseX, mouseY, control_box.bounds)){
		// Save Button
		if (withinBounds(mouseX, mouseY, control_box.buttons[0].bounds) && !loading_seed && !creating_seed && !creating_generator){
			show_text_input ? show_text_input = false : show_text_input = true;
			show_save_button ? show_save_button = false : show_save_button = true;
			saving_seed ? saving_seed = false : saving_seed = true;	
		}

		// Load Button
		if (withinBounds(mouseX, mouseY, control_box.buttons[1].bounds) && !saving_seed){
			show_upload_button ? show_upload_button = false : show_upload_button = true;
			loading_seed ? loading_seed = false : loading_seed = true;
		}

		// Gridlines Button
		if (withinBounds(mouseX, mouseY, control_box.buttons[3].bounds) && !loading_seed && !saving_seed){
			sandbox.setType((sandbox.type + 1) % 3);
			sandbox.type == 2 ? show_gridlines = false : show_gridlines = true;
			edges_drawn = false;
		}

		if (withinBounds(mouseX, mouseY, control_box.buttons[5].bounds) && !loading_seed && !saving_seed)
			setup();
	}
}

function keyPressed(){
	if (!loading_seed && !saving_seed){
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

		if (key == 'Z' && creating_seed)
			undo();
	}
}

function mouseWheel(event){
	if (!mouseIsPressed && !creating_seed && !creating_generator && !fractalize)
		zoom(map(constrain(event.delta, -200, 200), -200, 200, 1.3, 0.7), [mouseX, mouseY]);
	return false;
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

function zoom(delta, center){
	for (var i = 0; i < nodes.length; i++){
		new_pos = scalePoint(nodes[i].pos.x, nodes[i].pos.y, delta, center);
		nodes[i].setPosition([new_pos[0], new_pos[1]]);
		if (i > 0){
			new_start = scalePoint(edges[i-1].start.x, edges[i-1].start.y, delta, center);
			edges[i-1].setStart(new_start[0], new_start[1]);

			new_end = scalePoint(edges[i-1].end.x, edges[i-1].end.y, delta, center);
			edges[i-1].setEnd(new_end[0], new_end[1]);
		}
	}

	edges_drawn = false;
}

function scalePoint(x, y, delta, center){
	x = x - center[0];
	y = y - center[1];

	var r = pow(pow(x, 2) +  pow(y, 2), 0.5);
	var theta = polarAngle(x, y);

	var new_x = delta * r * cos(theta) + center[0];
	var new_y = delta * r * sin(theta) + center[1];

	return [new_x, new_y];
}

function setupForGenerator(){
	nodes.splice(nodes.length -1, 1);
	edges.splice(edges.length - 1, 1);

	for (var i = 0; i < edges.length; i++)
		edges[i].setWeight(1);

	getSeedData();

	nodes_copy = nodeCopy(nodes);
	edges_copy = edgeCopy(edges);

	idx = nodes.length - 1;
	creating_seed = false;
	creating_generator = true;
}

function showPotentialNode(){
	if (withinBounds(mouseX, mouseY, screen_bounds)){
		if (sandbox.type == 0 || sandbox.type == 1)
			nodes[nodes.length - 1].setPosition(closestGridPoint(mouseX, mouseY, sandbox.coords));
		else
			nodes[nodes.length - 1].setPosition([mouseX, mouseY]);
	}

	if (edges.length > 0)
		edges[edges.length - 1].setEnd(nodes[nodes.length - 1].pos.x, nodes[nodes.length - 1].pos.y);
}

function showSeed(){
	if (withinBounds(mouseX, mouseY, screen_bounds) && !loading_seed){
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

function undo(){
	if (nodes.length > 1){
		nodes.splice(nodes.length-1, 1);
		edges.splice(nodes.length-1, 1);
	}
}

function refreshEdgeType(){
	// if (aboveLine(mouseX, mouseY, nodes[idx - 1].pos.x, nodes[idx - 1].pos.y, nodes[idx].pos.x, nodes[idx].pos.y)){
	// 	// text("above", 50, 50);
	// 	if (toTheLeft(mouseX, mouseY, nodes[idx - 1].pos.x, nodes[idx - 1].pos.y, nodes[idx].pos.x, nodes[idx].pos.y)){
	// 		// text("to the left", 50, 70);
	// 		edges[idx - 1].setType(1);
	// 		edges_copy[idx - 1].setType(1);
	// 	}
	// 	else{
	// 		edges[idx - 1].setType(0);
	// 		edges_copy[idx - 1].setType(0);
	// 	}
	// }
	// else{
	// 	if (toTheLeft(mouseX, mouseY, nodes[idx - 1].pos.x, nodes[idx - 1].pos.y, nodes[idx].pos.x, nodes[idx].pos.y)){
	// 		// text("to the left", 50, 70);
	// 		edges[idx - 1].setType(3);
	// 		edges_copy[idx - 1].setType(3);
	// 	}
	// 	else {
	// 		edges[idx - 1].setType(2);
	// 		edges_copy[idx - 1].setType(2);
	// 	}
	// }
	edges[idx - 1].setType(0);
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
}

function refresh(){
	background(51);
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

function setEdgeTypes(){
	for (var i = 0; i < edges.length; i++){
		edges[i].setType(seed_data[i % seed_data.length][2]);
	}
}

function getSeedData(){
	var base = createVector(nodes[nodes.length-1].pos.x - nodes[0].pos.x, nodes[nodes.length-1].pos.y - nodes[0].pos.y);
	var sub = createVector(0, 0);
	var r_base = createVector(nodes[0].pos.x - nodes[nodes.length-1].pos.x, nodes[0].pos.y - nodes[nodes.length-1].pos.y);
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
		r_seed_data[i][1] = angleBetween(r_sub, r_base);
		r_seed_data[i][2] = 0;
	}

	// Add dummy data point at the end to hold type of final edge connecting the seed back to the shape
	seed_data[nodes.length - 2] = [0, 0, 0];
	r_seed_data[nodes.length -2] = [0, 0, 0];
}

function subdivide(idx){
	var new_base = createVector(nodes[idx].pos.x - nodes[idx-1].pos.x, nodes[idx].pos.y - nodes[idx-1].pos.y);
	var angle_offset = polarAngle(new_base.x, new_base.y);
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

		var new_type = edges[idx - 1].type;
		if (data[j][2] == 2 || data[j][2] == 3)
		 	new_type = (new_type + 2) % 4;
		else if (data[j][2] == 1 || data[j][2] == 3)
			new_type = (new_type + 3) % 4;
		// Add an edge between this node and the previous one
		if (j-1 >= 0)
			new_edges = append(new_edges, new FractalEdge(new_nodes[j-1], new_nodes[j], 1, new_type, [200, 200, 200]));
		// 													node1             node2   weight  type         stroke
		else
			new_edges = append(new_edges, new FractalEdge(nodes[idx-1], new_nodes[j], 1, new_type, [200, 200, 200]));
	}

	// Finally, add an edge connecting the last node in the seed to the next node in nodes
	if (data[data.length - 1][2] == 2 || data[data.length - 1][2] == 3)
	 	new_type = (new_type + 2) % 4;
	else if (data[data.length - 1][2] == 1 || data[data.length - 1][2] == 3)
		new_type = (new_type + 1) % 4;
	new_edges = append(new_edges, new FractalEdge(new_nodes[new_nodes.length - 1], nodes[idx], 1, new_type, [200, 200, 200]));

	return [new_nodes, new_edges];
}

function angleBetween(v1, v2){
	return polarAngle(v2.x, v2.y) - polarAngle(v1.x, v1.y);
}

function quadrant(v){
	if (v.x >= 0 && v.y >= 0)
		return 1
	if (v.x >= 0 && v.y < 0)
		return 2
	if (v.x < 0 && v.y > 0)
		return 3
	else
		return 4
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

		// Shifted gaussians map pixel channels
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
	// 			left             right           bottom             top
}

function polarAngle(x, y){
	if (x > 0 && y > 0)
		return Math.atan(abs(y) / abs(x));
	else if (x < 0 && y > 0)
		return Math.PI - Math.atan(abs(y) / abs(x));
	else if (x > 0 && y < 0)
		return 2*Math.PI - Math.atan(abs(y) / abs(x));
	else if (x < 0 && y < 0)
		return Math.PI + Math.atan(abs(y) / abs(x));
	else if (x == 0 && y > 0)
		return Math.PI / 2;
	else if (x == 0 && y < 0)
		return 3*Math.PI / 2;
	else if (x < 0 && y == 0)
		return Math.PI;
	else
		return 0;
}

function nodeCopy(n){
	result = [];
	for (var i = 0; i < n.length; i++)
		result[i] = new FractalNode(n[i].pos.x, n[i].pos.y);
	return result;
}

function edgeCopy(e){
	result = [];
	for (var i = 0; i < e.length; i++)
		result[i] = new FractalEdge(e[i].node1, e[i].node2, e[i].weight, e[i].type, e[i].stroke);
	return result;
}

function updateSaveFileName(){
	save_file_name = this.value();
}

function saveSeed(){
	var save_data = [];
	for (var i = 0; i < nodes_copy.length; i++)
		if (i == 0)
			save_data = append(save_data, str(nodes_copy[i].pos.x) + "%" + str(nodes_copy[i].pos.y));
		else
			save_data = append(save_data, str(nodes_copy[i].pos.x) + "%" + str(nodes_copy[i].pos.y) + "%" + str(edges_copy[i-1].type));
	saveStrings(save_data, save_file_name);
	saving_seed = false;
	show_save_button = false;
	show_text_input = false;
}

function handleFile(file){
	loadSeed(split(file.data, '\n'));
}

function loadSeed(loaded_data){
	upload_button.remove();
	setup();
	creating_seed = false;
	edges_drawn = false;
	loading_seed = false;
	ready_to_load = false;
	nodes = [];
	var specs;
	for (var i = 0; i < loaded_data.length - 1; i++){
		specs = split(loaded_data[i], '%');
		nodes[i] = new FractalNode(parseFloat(specs[0]), parseFloat(specs[1]));
		if (i > 0)
			edges[i-1] = new FractalEdge(nodes[i-1], nodes[i], 1, parseFloat(specs[2]), [200, 200, 200]);
	}
	console.log(nodes);
	getSeedData();
	for (var i = 0; i < edges.length; i++){
		seed_data[i][2] = edges[i].type;
		r_seed_data[r_seed_data.length - 1 - i][2] = edges[i].type;
 	}
	nodes_copy = nodeCopy(nodes);
	edges_copy = edgeCopy(edges);
}

function showLoadBox(){
	push();
		fill(200);
		stroke(0);
		strokeWeight(7);
		rectMode(CENTER);
		rect(sandbox.pos.x, sandbox.pos.y, 250, 80, 10);
		fill(0);
		noStroke();
		textAlign(CENTER, CENTER);
		textSize(18);
		text("Upload your seed:", sandbox.pos.x, sandbox.pos.y - 15);
	pop();
}

function showSaveBox(){
	push();
		fill(200);
		stroke(0);
		strokeWeight(7);
		rectMode(CENTER);
		rect(sandbox.pos.x, sandbox.pos.y, 280, 80, 10);
		fill(0);
		noStroke();
		textAlign(CENTER, CENTER);
		textSize(14);
		text("What would you like to call your file?", sandbox.pos.x, sandbox.pos.y - 15);
	pop();
}