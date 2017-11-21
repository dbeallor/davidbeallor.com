function Node(id, num){
	this.r = 280;
	this.id = id;
	this.num = num;
	this.angle = (this.num * 2 * Math.PI) / num_nodes;
	this.pos = createVector(this.r*cos(this.angle), this.r*sin(this.angle));

	this.show = function(){
		push();
			translate(width / 2, height / 2);
			fill(200);
			this.setSize();
			ellipse(this.pos.x, this.pos.y, this.size, this.size);
		pop();
	}

	this.refresh = function(num){
		this.num = num;
		this.angle = (this.num * 2 * Math.PI) / num_nodes;
		this.pos = createVector(this.r*cos(this.angle), this.r*sin(this.angle));
	}

	this.setSize = function(){
		if (threshold <= 29)
			this.size = 5
		else
			this.size = 8
	}
}