// =======================================================================================================
// ==GLOBALS
// =======================================================================================================
// Canvas and screen (canvas excluding menubar)
var canv;
var canvas_dims = [720, 520];
var screen_bounds;

// Grid
var grid;
var show_gridlines;

// Zoom and drag
var drag_mode;
var zoom_mode;

// Windows
var menu_bar;
var load_bar;
var save_dialog;
var screenshot_dialog;
var save_file_name;
var load_dialog;
var color_dialog;
var gallery;
var gallery_images = [];
var new_fractal_warning_box;
var samples = ["brushstrokes", "snowflake", "parallelogram", "sierpinski", "spiral2", "fingerprint", "pinwheel", "rhombi5", "rhombi8", 
				"honeycomb2", "spiral8", "shield", "honeycomb3", "pinwheel3", "jellyfish", "snake",  "spiral16", "rhombi2",  "spiral7", "waves", 
				"parallelogram2", "spiral6"];

var fractal;
var ready;

// =======================================================================================================
// ==PRELOAD AND SETUP
// =======================================================================================================
function preload(){
	for (var i = 0; i < samples.length; i++)
		gallery_images[i] = loadImage("snapshots/" + samples[i] + ".png");
}

function setup() {
	// pixelDensity(1);
	canv = createCanvas(windowWidth, windowHeight);
	angleMode(RADIANS);
	show_gridlines = true;

	initializeMenuBar();
	screen_bounds = [0, width, menu_bar.height, height];
	grid = new Grid(width / 2, height / 2 + menu_bar.height / 2, windowWidth);

	zoom_mode = 0;
	drag_mode = 0;

	load_bar = new LoadBar(screen_bounds[1] - 100, screen_bounds[3] - 15, 80, 10);

	save_file_name = '';

	save_dialog = new SaveDialogBox("Download as .txt file...", grid.pos.x, grid.pos.y, 250, 80, ".txt", saveSeed, updateSaveFileName);
	save_dialog.initialize();

	screenshot_dialog = new SaveDialogBox("Capture Screenshot...", grid.pos.x, grid.pos.y, 250, 80, ".png", saveScreenshot, updateSaveFileName);
	screenshot_dialog.initialize();

	load_dialog = new LoadDialogBox("Open File...", grid.pos.x, grid.pos.y, 250, 120, handleFile, highlightDropArea, unhighlightDropArea);
	load_dialog.initialize();

	color_dialog = new ColorDialogBox("Customize Color Scheme", grid.pos.x, grid.pos.y, 250, 110);
	color_dialog.initialize();

	var message = "Are you sure you want to start over?\nAll unsaved data will be lost.";
	new_fractal_warning_box = new WarningBox(grid.pos.x, grid.pos.y, 220, 120, message, newFractal, closeWarningBox);

	initializeSampleGallery();

	ready = false;

	max_out = false;
	fractal = new Fractal();	
}

// =======================================================================================================
// ==DRAW
// =======================================================================================================
function draw() {
	styleCursor();
	background(color(color_dialog.color_pickers[0].value()));

	if (fractal.creating_seed){
		if (show_gridlines)
			grid.show();
	}

	fractal.show();

	if (fractal.fractalizing)
		showLoadBar();

	dragTranslateShape();
	dragRotateShape();

	if(!noOpenWindows())
		theaterMode();

	showWindows();

	menu_bar.show();
	
	if (!mouseIsPressed && !keyIsPressed && !fractal.fractalizing)
		ready = true;

	// fill(255);
	// text(mouseX + ", " + mouseY, 50, 50);
	// text(okayToDrag(), 50, 50);
	// text(onScreen(), 50, 50);
}

function styleCursor(){
	if (fractal.maxing_out || fractal.fractalizing)
		canvas.style.cursor = 'wait';
	else if (onScreen() && noOpenWindows() && menu_bar.folderIsOpen() < 0 && drag_mode == 0 && fractal.idle())
		canvas.style.cursor = 'move';
	else 
		canvas.style.cursor = 'default';
}

function showWindows(){
	gallery.show();
	save_dialog.show();
	screenshot_dialog.show();
	load_dialog.show();
	color_dialog.show();
	new_fractal_warning_box.show();
}

function theaterMode(){
	push();
		resetMatrix();
		fill(0, 150);
		noStroke();
		rect(screen_bounds[0], screen_bounds[2], screen_bounds[1] - screen_bounds[0], screen_bounds[3] - screen_bounds[2]);
	pop();
}

// =======================================================================================================
// ==MOUSE AND KEYBOARD EVENTS
// =======================================================================================================
function mousePressed(){
	if (mouseButton === LEFT){
		if (noOpenWindows() && ready && menu_bar.folderIsOpen() < 0)
			// Store click location globally for drag functionality
			prev_click = [mouseX, mouseY];

		if (clickout()){
			closeOpenWindows();
			ready = false;
		}

		fractal.onClick();

		// Menu bar mouse events
		if (!fractal.fractalizing && ready){
			if (menu_bar.onClick())
				ready = false;
		}

		if (menu_bar.folderIsOpen() < 0 && !noOpenWindows()){
			if (save_dialog.onClick() || screenshot_dialog.onClick() || load_dialog.onClick() || color_dialog.onClick() || gallery.onClick() || new_fractal_warning_box.onClick())
				ready = false;
		}
	}
}

function keyPressed(){
	if (noOpenWindows() && ready){
		menu_bar.checkShortcuts();
		ready = false;
	}

	gallery.onKeyPress();
	save_dialog.onKeyPress();
	screenshot_dialog.onKeyPress();
	load_dialog.onKeyPress();
	color_dialog.onKeyPress();
	menu_bar.onKeyPress();
	new_fractal_warning_box.onKeyPress();
}

function shortcutPressed(token){
	var code = tokenToKeyCode(token);
	if (specialCharacter(token))
		return (keyCode == code)
	else
		return (key == code)
}

function tokenToKeyCode(token){
	switch(token){
		case "space" : return 32; break;
		case "enter" : return ENTER; break;
		case "+" : return 187; break;
		case "-" : return 189; break;
		case "?" : return 191; break;	
		case ";" : return 186; break;		
		default : return token;
	}
}

function specialCharacter(token){
	var chars = ["space", "enter", "+", "-", "?", ";"];
	return (chars.indexOf(token) > -1);
}

function mouseWheel(event){
	if (zoom_mode == 1)
		fractal.refreshRotationCenter();
	if (!mouseIsPressed && fractal.idle() && noOpenWindows() && onScreen())
		fractal.zoom(map(constrain(event.delta, -200, 200), -200, 200, 1.3, 0.7), zoom_mode == 0 ? [mouseX, mouseY] : [fractal.rotation_center.x, fractal.rotation_center.y]);
	return false;
}

function withinBounds(x, y, bounds){
	return (x >= bounds[0] && x <= bounds[1] && y >= bounds[2] && y <= bounds[3]);
	// 			left             right           bottom             top
}

function openGallery(){
	if (noOpenWindows())
		gallery.open();
}

function openNewFractalWarningBox(){
	if (noOpenWindows())
		new_fractal_warning_box.open();
}

function closeWarningBox(){
	new_fractal_warning_box.close();
	ready = false;
}

function clickout(){
	return (!noOpenWindows() && onScreen() && !withinBounds(mouseX, mouseY, currentOpenWindowBounds()) && menu_bar.folderIsOpen() < 0);
}

function onScreen(){
	return withinBounds(mouseX, mouseY, screen_bounds);
}

function undo(){
	if (fractal.creating_seed && fractal.nodes.length > 1)
		undoPlacedNode();

	if (fractal.creating_generator && fractal.current_index < fractal.edges.length)
		undoGeneratorChoice();
}

function newFractal(){
	setup();
	gallery.close();
}

// =======================================================================================================
// ==WINDOWS
// =======================================================================================================
function noOpenWindows(){
	return (!save_dialog.visible && !screenshot_dialog.visible && !load_dialog.visible && !color_dialog.visible && !gallery.visible && !new_fractal_warning_box.visible);
}

function currentOpenWindowBounds(){
	if (save_dialog.visible)
		return save_dialog.bounds;
	if (screenshot_dialog.visible)
		return screenshot_dialog.bounds;
	if (load_dialog.visible)
		return load_dialog.bounds;
	if (gallery.visible)
		return gallery.bounds;
	if (color_dialog.visible)
		return color_dialog.bounds;
	if (new_fractal_warning_box.visible)
		return new_fractal_warning_box.bounds;
}

function closeOpenWindows(){
	save_dialog.close();
	screenshot_dialog.close();
	load_dialog.close();
	color_dialog.close();
	gallery.close();
	new_fractal_warning_box.close();
	ready = false;
}

function windowResized() {
	print(menu_bar);
	screen_bounds = [0, windowWidth, menu_bar.height, windowHeight];
	resizeCanvas(windowWidth, windowHeight);
	menu_bar.resize(windowWidth);
	var type = grid.type;
	grid = new Grid(windowWidth / 2, windowHeight / 2 + menu_bar.height / 2, max(windowWidth, windowHeight));
	grid.setType(type);
	var dims = galleryDims();
	gallery.resize(dims[0], dims[1]);
	gallery.setPosition(grid.pos.x, grid.pos.y);
	save_dialog.setPosition(grid.pos.x, grid.pos.y);
	screenshot_dialog.setPosition(grid.pos.x, grid.pos.y);
	load_dialog.setPosition(grid.pos.x, grid.pos.y);
	color_dialog.setPosition(grid.pos.x, grid.pos.y);
	new_fractal_warning_box.setPosition(grid.pos.x, grid.pos.y);
	var d = pixelDensity();
	fractal.resize(d * windowWidth, d * windowHeight);
}

// =======================================================================================================
// ==TRANSLATION
// =======================================================================================================
function okayToDrag(){
	return (mouseIsPressed && fractal.idle() && onScreen() && noOpenWindows() && ready);
}

function dragTranslateShape(){
	if (okayToDrag() && drag_mode == 0){
		deltaX = mouseX - prev_click[0];
		deltaY = mouseY - prev_click[1];

		prev_click = [mouseX, mouseY];
		fractal.translate(deltaX, deltaY);
	}
}

function dragModeTranslate(){
	drag_mode = 0;
	menu_bar.checkButton("Drag Mode Translate");
	menu_bar.uncheckButton("Drag Mode Rotate");
}

function centerShape(){
	fractal.center();
}

// =======================================================================================================
// ==ROTATION
// =======================================================================================================
function dragRotateShape(){
	if (okayToDrag() && drag_mode == 1){
		fractal.refreshRotationCenter();
		var prev_angle = polarAngle(prev_click[0] - fractal.rotation_center.x, prev_click[1] - fractal.rotation_center.y);
		var current_angle = polarAngle(mouseX - fractal.rotation_center.x, mouseY - fractal.rotation_center.y);
		var delta = current_angle - prev_angle;
		prev_click = [mouseX, mouseY];
		fractal.rotate(delta);
	}
}

function dragModeRotate(){
	drag_mode = 1;
	menu_bar.uncheckButton("Drag Mode Translate");
	menu_bar.checkButton("Drag Mode Rotate");
}

function rotateLeft90(){
	refreshRotationCenter();
	fractal.rotate(-Math.PI / 2);
}

function rotateRight90(){
	refreshRotationCenter();
	fractal.rotate(Math.PI / 2);
}

// =======================================================================================================
// ==ZOOM
// =======================================================================================================
function zoomModeMouse(){
	zoom_mode = 0;
	menu_bar.checkButton("Zoom Mode Mouse Centered");
	menu_bar.uncheckButton("Zoom Mode Fractal Centered");
}

function zoomModeFractal(){
	zoom_mode = 1;
	menu_bar.checkButton("Zoom Mode Fractal Centered");
	menu_bar.uncheckButton("Zoom Mode Mouse Centered");
}

function shortcutZoomIn(){
	fractal.zoom(1.2, [fractal.rotation_center.x, fractal.rotation_center.y]);
}

function shortcutZoomOut(){
	fractal.zoom(0.8, [fractal.rotation_center.x, fractal.rotation_center.y]);
}

// =======================================================================================================
// ==SEED CREATION
// =======================================================================================================
function undoPlacedNode(){
	fractal.nodes.splice(fractal.nodes.length-1, 1);
	fractal.edges.splice(fractal.nodes.length-1, 1);
}

function toggleGridlines(){
	grid.setType((grid.type + 1) % 3);
	grid.type == 2 ? show_gridlines = false : show_gridlines = true;
}

// function redrawSeed(){
// 	nodes = nodeCopy(nodes_copy);
// 	edges = edgeCopy(edges_copy);
// 	updateSeed();
// 	creating_seed = true;
// 	grid.setType(2);
// 	menu_bar.enableButtons(["About FractalSandbox", "New Fractal", "Open File...", "Undo", "Toggle Gridlines", "Lock Seed", "Sample Gallery"]);
// }

function lockSeed(){
	if (fractal.nodes.length < 3)
		alert("Put down at least 3 nodes to lock your seed.")
	else if (fractal.nodes[0].pos.equals(fractal.nodes[fractal.nodes.length - 2].pos))
		alert("Your seed must start and end at different positions.")
	else{
		fractal.setupForGeneratorCreation();
		menu_bar.enableButtons(["About FractalSandbox", "Skip Edge", "Hide Edge", "Undo", "Open File...", "New Fractal", "Sample Gallery"]);
	}
}

// =======================================================================================================
// ==GENERATOR CREATION
// =======================================================================================================
function undoGeneratorChoice(){
	fractal.edges[idx].setType(0);
	fractal.seed.edges[idx].setType(0);
	fractal.seed.types[idx] = 0;
	fractal.seed.types_r[fractal.seed.types_r.length - idx - 1] = 0;
	var stop = fractal.current_index + 1;
	fractal.edges = edgeCopy(fractal.seed.edges);
	fractal.nodes = nodeCopy(fractal.seed.nodes);
	fractal.current_index = fractal.nodes.length - 1;
	for (var i = fractal.edges.length - 1; i >= stop; i--){
		if (fractal.edges[i].type == 4)
			fractal.updateGenerator(true, false);
		else if (edges[i].type == 5)
			fractal.updateGenerator(false, true);
		else
			fractal.updateGenerator(false, false);
	}
	fractal.refresh();
}

function skipEdge(){
	fractal.updateGenerator(true, false);
}

function hideEdge(){
	fractal.updateGenerator(false, true);
}

function maxOut(){
	fractal.maxOut();
	ready = false;
}

function levelUp(){
	fractal.getReadyToFractalize();
}

function showLoadBar(){
	if (fractal.next_edge_count > 100){
		load_bar.setPercentage((fractal.edges.length - fractal.prev_edge_count) / (fractal.next_edge_count - fractal.prev_edge_count));
		load_bar.show();
	}
}

// =======================================================================================================
// ==AUXILLARY MATH FUNCTIONS
// =======================================================================================================
function angleBetween(v1, v2){
	return polarAngle(v2.x, v2.y) - polarAngle(v1.x, v1.y);
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

// Return the midpoint of the line (x1, y1) --> (x2, y2)
function midpoint(x1, y1, x2, y2){
	return [(x1 + x2) / 2, (y1 + y2) / 2];
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

function scalePoint(x, y, delta, center){
	x = x - center[0];
	y = y - center[1];

	var r = pow(pow(x, 2) +  pow(y, 2), 0.5);
	var theta = polarAngle(x, y);

	var new_x = delta * r * cos(theta) + center[0];
	var new_y = delta * r * sin(theta) + center[1];

	return [new_x, new_y];
}

// =======================================================================================================
// ==LOADING
// =======================================================================================================
function openLoadDialog(){
	if (noOpenWindows())
		load_dialog.open();
}

function handleFile(file){
	loadSeed(split(file.data, '\n'));
}

function loadSeed(loaded_data){
	load_dialog.upload_button.remove();
	load_dialog.drop_area.remove();

	setup();
	fractal.creating_seed = false;
	fractal.edges_drawn = false;
	fractal.nodes = [];

	var colors = split(loaded_data[0], '%');
	for (var i = 0; i < color_dialog.color_pickers.length; i++)
		color_dialog.color_pickers[i].value(colors[i]);

	var specs;
	for (var i = 0; i < loaded_data.length; i++){
		if (loaded_data[i + 1] == "~")
			break;
		specs = split(loaded_data[i + 1], '%');
		fractal.nodes[i] = new FractalNode(parseFloat(specs[0]), parseFloat(specs[1]));
		if (i > 0)
			fractal.edges[i-1] = new FractalEdge(fractal.nodes[i-1].pos, fractal.nodes[i].pos, 1, parseFloat(specs[2]), color(200));
	}

	fractal.seed.recordData(fractal.nodes, fractal.edges);
	for (var i = 0; i < fractal.edges.length; i++){
		fractal.seed.types[i] = fractal.edges[i].type;
		fractal.seed.types_r[fractal.seed.types_r.length - 1 - i] = fractal.edges[i].type;
 	}

	fractal.seed.nodes = fractal.nodeCopy(fractal.nodes);
	fractal.seed.edges = fractal.edgeCopy(fractal.edges);
	fractal.refresh();
	fractal.center();
	fractal.scaleColors();
	menu_bar.enableButtons(["About FractalSandbox", "Level Up", "Max Level Up", "Timed Level Up", "Download as .txt file...", "Capture Screenshot...", "Open File...", 
							"Redraw Seed", "Customize Color Scheme", "New Fractal", "Sample Gallery", "Zoom In", "Zoom Out", "Zoom Mode Mouse Centered", 
							"Zoom Mode Fractal Centered", "Center", "Rotate Left 90°", "Rotate Right 90°", "Drag Mode Rotate", "Drag Mode Translate"]);
	gallery.close();
}

function highlightDropArea(){
	load_dialog.upload_button.style("z-index", "0");
	save_dialog.save_button.style("z-index", "0");
	screenshot_dialog.save_button.style("z-index", "0");
	load_dialog.drop_area.style("background-color", "rgba(186, 234, 236, 0.5)");
}

function unhighlightDropArea(){
	load_dialog.upload_button.style("z-index", "1");
	save_dialog.save_button.style("z-index", "1");
	screenshot_dialog.save_button.style("z-index", "1");
	load_dialog.drop_area.style("background", "none");
}

function initializeSampleGallery(){
	var dims = galleryDims();
	gallery = new SlideViewer("Sample Gallery", grid.pos.x, grid.pos.y, dims[0], dims[1], gallery_images, "Open", loadSample);
	gallery.open();
}

function galleryDims(){
	return [constrain(0.65*windowHeight*1.2, 0, windowWidth * 0.9), 0.65*windowHeight];
}

function loadSample(){
	loadStrings("samples/" + samples[gallery.current_image] + ".txt", loadSeed);
}

// =======================================================================================================
// ==SAVING
// =======================================================================================================
function openSaveDialog(){
	if (noOpenWindows())
		save_dialog.open();
}

function openScreenshotDialog(){
	if (noOpenWindows())
		screenshot_dialog.open();
}

function saveSeed(){
	var save_data = [];
	save_data = append(save_data, color_dialog.color_pickers[0].value() + '%' + color_dialog.color_pickers[1].value() + '%' 
		+ color_dialog.color_pickers[2].value() + '%' + color_dialog.color_pickers[3].value());
	for (var i = 0; i < nodes_copy.length; i++)
		if (i == 0)
			save_data = append(save_data, str(nodes_copy[i].pos.x) + "%" + str(nodes_copy[i].pos.y));
		else
			save_data = append(save_data, str(nodes_copy[i].pos.x) + "%" + str(nodes_copy[i].pos.y) + "%" + str(edges_copy[i-1].type));
	save_data = append(save_data, "~");
	saveStrings(save_data, save_file_name);
}

function saveScreenshot(){
	redrawFractalOnly();
	var image = screenPixels();
	if (image.width > 1024)
		image.resize(1024, 0);
	image.save(save_file_name);
}

function screenPixels(){
	var d = pixelDensity();
	var screenshot = createImage(d * (screen_bounds[1] - screen_bounds[0]), d * (screen_bounds[3] - screen_bounds[2]));
	loadPixels();
	screenshot.loadPixels();
	for (var i = 0; i < (1/d) * screenshot.width; i++){
		for (var j = 0; j < (1/d) * screenshot.height; j++){
			for (var m = 0; m < d; m++) {
				for (var n = 0; n < d; n++) {
				    var image_index = 4 * ((j * d + n) * width * d + (i * d + m));
				    var canvas_index = 4 * (((j + screen_bounds[2]) * d + n) * width * d + (i * d + m));
					screenshot.pixels[image_index] = pixels[canvas_index];
				    screenshot.pixels[image_index + 1] = pixels[canvas_index + 1];
				    screenshot.pixels[image_index + 2] = pixels[canvas_index + 2];
				    screenshot.pixels[image_index + 3] = 255;
				}
			}
		}	
	}
	screenshot.updatePixels();
	return screenshot;
}

function redrawFractalOnly(){
	// Redraw the screen with only the fractal showing
	fractal.edges_drawn = false;
	screenshot_dialog.close();
	draw();

	// Reopen screenshot dialog box, won't be shown until the next draw loop
	screenshot_dialog.open();
}

function updateSaveFileName(){
	save_file_name = this.value();
}

// =======================================================================================================
// ==Menu Bar
// =======================================================================================================
function initializeMenuBar(){
	menu_bar = new MenuBar();

	menu_bar.addFolder("FractalSandbox");
	menu_bar.addButton("About FractalSandbox", "", null);
	menu_bar.addButton("Sample Gallery", "W", openGallery);

	menu_bar.addFolder("File");
	menu_bar.addButton("New Fractal", "N", openNewFractalWarningBox);
	menu_bar.addButton("Open File...", "O", openLoadDialog);
	menu_bar.addButton("Download as .txt file...", "S", openSaveDialog);
	menu_bar.addButton("Capture Screenshot...", "D", openScreenshotDialog);
	menu_bar.addButton("Redraw Seed", "R", null);

	menu_bar.addFolder("Edit");
	menu_bar.addButton("Undo", "Z", undo);
	menu_bar.addButton("Hide Edge", "H", hideEdge);
	menu_bar.addButton("Skip Edge", "J", skipEdge);
	
	menu_bar.addFolder("View");
	menu_bar.addButton("Zoom In", "+", shortcutZoomIn);
	menu_bar.addButton("Zoom Out", "-", shortcutZoomOut);
	menu_bar.addButton("Zoom Mode Mouse Centered", "1", zoomModeMouse);
	menu_bar.checkButton("Zoom Mode Mouse Centered");
	menu_bar.addButton("Zoom Mode Fractal Centered", "2", zoomModeFractal);
	menu_bar.addButton("Toggle Gridlines", "G", toggleGridlines);
	menu_bar.addButton("Center", "space", centerShape);
	menu_bar.addButton("Rotate Left 90°", "L", rotateLeft90);
	menu_bar.addButton("Rotate Right 90°", ";", rotateRight90);
	menu_bar.addButton("Drag Mode Translate", "3", dragModeTranslate);
	menu_bar.checkButton("Drag Mode Translate");
	menu_bar.addButton("Drag Mode Rotate", "4", dragModeRotate);

	menu_bar.addFolder("Fractalization");
	menu_bar.addButton("Lock Seed", "enter", lockSeed);
	menu_bar.addButton("Level Up", "enter", levelUp);
	menu_bar.addButton("Max Level Up", "M", maxOut);
	menu_bar.addButton("Timed Level Up", ", ", null);
	menu_bar.addButton("Customize Color Scheme", "C", openColorDialog);

	menu_bar.addFolder("Help");
	menu_bar.addButton("Tutorial", "T", null);
	menu_bar.addButton("Learn More", "", null);

	menu_bar.initialize();

	menu_bar.enableButtons(["About FractalSandbox", "New Fractal", "Open File...", "Undo", "Toggle Gridlines", "Lock Seed", "Sample Gallery"]);
}

function mouseOnMenuBar(){
	var open_folder = menu_bar.folderIsOpen();
	if (open_folder >= 0){
		var folder = menu_bar.folders[open_folder];
		for (var i = 0; i < folder.buttons.length; i++){
			if (folder.buttons[i].mouseOver())
				return true;
		}
	}
	return false;
}

// =======================================================================================================
// ==COLOR SCHEMES
// =======================================================================================================
function openColorDialog(){
	if (noOpenWindows())
		color_dialog.open();
}

// takes input x in [0, 1]
function colorMap(x){
	var from = x <= 0.5 ? color(color_dialog.color_pickers[1].value()) : color(color_dialog.color_pickers[2].value());
	var to = x <= 0.5 ? color(color_dialog.color_pickers[2].value()) : color(color_dialog.color_pickers[3].value());

	x = x <= 0.5 ? map(x, 0, 0.5, 0, 1) : map(x, 0.5, 1, 0, 1);

	colorMode(HSB);
	var my_color = lerpColor(from, to, x);
	colorMode(RGB);
	my_color.levels[3] = constrain(my_color.levels[3], 0, 210);
	return my_color;
}