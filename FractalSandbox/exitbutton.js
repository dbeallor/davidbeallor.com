function ExitButton(x, y){
	this.pos = createVector(x, y);
	this.r = 8;
	this.bounds = [this.pos.x - this.r / 2, this.pos.x + this.r / 2, this.pos.y - this.r / 2, this.pos.y + this.r / 2];

	this.show = function(){
		push();
			translate(this.pos.x, this.pos.y);
			rectMode(CENTER);
			noFill();
			stroke(0);
			rect(0, 0, this.r, this.r);
			line(-this.r / 2, -this.r / 2, this.r / 2, this.r / 2);
			line(-this.r / 2, this.r / 2, this.r / 2, -this.r / 2);
		pop();
	}

	this.setPosition = function(x, y){
		this.pos.x = x;
		this.pos.y = y;
		this.resetBounds();
	}

	this.resetBounds = function(){
		this.bounds = [this.pos.x - this.r / 2, this.pos.x + this.r / 2, this.pos.y - this.r / 2, this.pos.y + this.r / 2];
	}
}