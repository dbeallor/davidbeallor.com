function Tile(i, j, grid_coords, size){
	this.pos = createVector(i, j);
	this.fill;
	this.grid_coords = grid_coords;
	this.size = size;
	this.is_occupied = false;

	this.show = function(){
		push();
			if (this.is_occupied)
				fill(this.fill);
			else
				fill(100, 100, 100);
			noStroke();
			rectMode(CENTER);
			rect(this.grid_coords[this.pos.x][this.pos.y][0], this.grid_coords[this.pos.x][this.pos.y][1], this.size, this.size, 2);
		pop();
	}
}