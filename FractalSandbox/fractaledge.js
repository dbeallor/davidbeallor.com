function FractalEdge(node1, node2, w, t, s){
	this.start = node1.pos;
	this.end = node2.pos;
	this.weight = w;
	this.type = t;
	this.stroke = s;

	this.show = function(){
		push();
			stroke(this.stroke[0], this.stroke[1], this.stroke[2], 220);
			strokeWeight(this.weight);
			line(this.start.x, this.start.y, this.end.x, this.end.y);
		pop();
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

}