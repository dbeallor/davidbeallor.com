function FractalEdge(start, end, w, t, s){
	this.start = createVector(start.x, start.y);
	this.end = createVector(end.x, end.y);
	this.weight = w;
	this.type = t;
	this.stroke = s;

	this.show = function(){
		fractal.push();
			if (fractalize){
				var x = map(next_edge_count - (edges.length - current_edge + 1), 0, next_edge_count - 1, 0, 1);
				this.setStroke(colorMap(x));
			}
			fractal.stroke(this.stroke);
			fractal.strokeWeight(this.weight);
			fractal.line(this.start.x, this.start.y, this.end.x, this.end.y);
		fractal.pop();
	}

	this.setStart = function(x, y){
		this.start.set(x, y);
	}

	this.setEnd = function(x, y){
		this.end.set(x, y);
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

	this.rotate = function(angle, center){
		this.start.sub(center).rotate(angle).add(center);
		this.end.sub(center).rotate(angle).add(center);
	}

	this.onScreen = function(){
		if (withinBounds(this.start.x, this.start.y, screen_bounds) || withinBounds(this.end.x, this.end.y, screen_bounds))
			return true;

		else return (collideLineRect(this.start.x, this.start.y, this.end.x, this.end.y, 
			screen_bounds[0], screen_bounds[2], screen_bounds[1] - screen_bounds[0], screen_bounds[3] - screen_bounds[2]));
	}

	this.midpoint = function(){
		return createVector((this.end.x + this.start.x) / 2, (this.end.y + this.start.y) / 2);
	}
}