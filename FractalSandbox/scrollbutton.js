function ScrollButton(x, y, width, height){
	this.pos = createVector(x, y);
	this.left_fill = [150, 150, 150];
	this.right_fill = [150, 150, 150];
	this.width = width;
	this.height = height;
	this.left_bounds = [this.pos.x - this.width / 2, this.pos.x, this.pos.y - this.height / 2, this.pos.y + this.height / 2];
	this.right_bounds = [this.pos.x, this.pos.x + this.width / 2, this.pos.y - this.height / 2, this.pos.y + this.height / 2];


	this.show = function(){
		push();
			translate(this.pos.x, this.pos.y);
			rectMode(CENTER);
			textAlign(CENTER, CENTER);
			textStyle(BOLD);

			// Left Button
			fill(this.left_fill);
			rect(-this.width / 4, 0, this.width / 2, this.height);
			fill(0);
			text("<", -this.width / 4, 0);

			// Right Button
			fill(this.right_fill);
			rect(this.width / 4, 0, this.width / 2, this.height);
			fill(0);
			text(">", this.width / 4, 0);
		pop();
	}

	this.setLeftFill = function(f){
		this.left_fill = f;
	}

	this.setRightFill = function(f){
		this.right_fill = f;
	}
}