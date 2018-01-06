function FractalEdge(start, end, w, t, s){
	this.start = createVector(start.x, start.y);
	this.end = createVector(end.x, end.y);
	this.weight = w;
	this.type = t;
	this.stroke = s;

	this.show = function(){
		push();
			stroke(this.stroke);
			strokeWeight(this.weight);
			line(this.start.x, this.start.y, this.end.x, this.end.y);
		pop();
	}

	this.setStart = function(x, y){
		this.start.x = x;
		this.start.y = y;
	}

	this.setEnd = function(x, y){
		this.end.x = x;
		this.end.y = y;
	}

	this.setWeight = function(w){
		this.weight = w;
	}

	this.setStroke = function(s){
		this.stroke = s;
	}

	this.setType = function(t){
		this.type = t;
	}

	this.layer = function(idx){
		var x = map(next_edge_count - (edges.length - idx), 0, next_edge_count - 1, 0, 1);
		this.setStroke(colourMap(x));
		new_layer.stroke(this.stroke);
		new_layer.strokeWeight(this.weight);
		new_layer.line(this.start.x, this.start.y, this.end.x, this.end.y);
	}

	this.onScreen = function(){
		if (withinBounds(this.start.x, this.start.y, screen_bounds) || withinBounds(this.end.x, this.end.y, screen_bounds))
			return true;

		if (collideLineRect(this.start.x, this.start.y, this.end.x, this.end.y, 
			screen_bounds[0], screen_bounds[2], screen_bounds[1] - screen_bounds[0], screen_bounds[3] - screen_bounds[2]))
			return true;

		return false;
	}
}