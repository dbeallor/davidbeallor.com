function FractalNode(x, y){
	this.pos = createVector(x, y);
	this.r = 10;

	this.show = function(){
		push();
			noStroke();
			fill(30);
			ellipse(this.pos.x, this.pos.y, this.r, this.r);
		pop();
	}

	this.setPosition = function(pos){
		this.pos.x = pos[0];
		this.pos.y = pos[1];
	}
}