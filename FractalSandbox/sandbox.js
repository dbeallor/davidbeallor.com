function Sandbox(x, y, dims){
	this.pos = createVector(x, y);
	this.dims = dims;
	this.w = dims;
	this.coords = [];
	this.num_gridlines = 49;
	this.offset = ((this.num_gridlines + 1) / 2) - 1;
	this.gap = this.w / (this.num_gridlines + 1);

	for (var i = 0; i < this.num_gridlines; i++){
		this.coords[i] = [];
		for (var j = 0; j < this.num_gridlines; j++){
			this.coords[i][j] = [this.pos.x + (i - this.offset) * this.gap, this.pos.y + (j - this.offset) * this.gap];
		}
	}

	this.show = function() {
		// Gridlines
		push();
			translate(this.pos.x, this.pos.y);
			for (var i = -this.offset * this.gap; i <= this.offset * this.gap; i += this.gap){
				if (i == 0) 
					stroke(150);
				else if ((i / this.gap) % 2 == 0){
					if ((i / this.gap) % 4 == 0) 
						stroke(110);
					else
						stroke(90);
				}
				else 
					stroke(70);
				line(i, -this.w / 2, i, this.w / 2);
				line(-this.w / 2, i, this.w / 2, i);
			}
		pop();

		// Outer border 
		push();
			translate(this.pos.x, this.pos.y);
			noFill();
			stroke(200);
			rectMode(CENTER);
			rect(0, 0, this.w, this.w)
		pop();
	}
}