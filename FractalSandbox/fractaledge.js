function FractalEdge(node1, node2, w, t, s){
	this.start = createVector(node1.pos.x, node1.pos.y);
	this.end = createVector(node2.pos.x, node2.pos.y);
	this.weight = w;
	this.type = t;
	this.stroke = s;
	this.node1 = nodeCopy([node1]);
	this.node2 = nodeCopy([node2]);

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
		this.node1.setPosition(x, y);
	}

	this.setEnd = function(x, y){
		this.end.x = x;
		this.end.y = y;
		this.node2.setPosition(x, y);
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