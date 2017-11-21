function Edge(node1, node2, weight, threshold, cmap){
	this.end1 = createVector(node1.pos.x, node1.pos.y)
	this.end2 = createVector(node2.pos.x, node2.pos.y)
	this.fill = cmap[Math.floor(map(Math.pow(map(weight, threshold, 34, 0, 1), 1/2), 0, 1, 0, cmap.length - 1))]

	this.show = function(){
		push();
			stroke(this.fill[0], this.fill[1], this.fill[2]);
			strokeWeight(1);
			translate(width / 2, height / 2);
			line(this.end1.x, this.end1.y, this.end2.x, this.end2.y);
		pop();
	}

	this.refresh = function(end1, end2){
		this.end1 = end1
		this.end2 = end2
	}
}