function FractalEdge(start, end, w, t, s){
	this.start = createVector(start.x, start.y);
	this.end = createVector(end.x, end.y);
	this.weight = w;
	this.type = t;
	this.stroke = s;

	this.show = function(){
		push();
			stroke(this.stroke[0], this.stroke[1], this.stroke[2], 210);
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

}