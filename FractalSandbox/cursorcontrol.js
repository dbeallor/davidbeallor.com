function CursorControl(x, y){
	this.pos = createVector(x, y);
	this.fill = [180, 180, 180];
	this.highlight = [125, 148, 223];
	this.width = 20;
	this.height = 45;
	this.bounds = [this.pos.x, this.pos.x + this.width, this.pos.y, this.pos.y + this.height];
	this.drag_bounds = [this.pos.x, this.pos.x + this.width, this.pos.y, this.pos.y + 5];
	this.cursor_bounds = [this.pos.x, this.pos.x + this.width, this.pos.y + 5, this.pos.y + 25];
	this.zoom_bounds = [this.pos.x, this.pos.x + this.width, this.pos.y + 25, this.pos.y + 45];

	this.show = function(){
		push();
			resetMatrix();
			imageMode(CORNER);
			stroke(0);
			fill(130);
			rect(this.pos.x, this.pos.y, this.width, 5);
			if (zoom_mode)
				fill(this.fill);
			else
				fill(this.highlight);
			rect(this.pos.x, this.pos.y + 5, this.width, 20);
			image(cursor_image, this.pos.x + 2, this.pos.y + 6, 18, 18);
			if (zoom_mode)
				fill(this.highlight);
			else
				fill(this.fill);
			rect(this.pos.x, this.pos.y + 25, this.width, 20);
			image(zoom_image, this.pos.x + 3, this.pos.y + 27, 16, 16);
		pop();
	}

	this.setPosition = function(x, y){
		this.pos.x = x;
		this.pos.y = y;
	}

	this.resetBounds = function(x, y){
		this.drag_bounds = [this.pos.x, this.pos.x + this.width, this.pos.y, this.pos.y + 5];
		this.cursor_bounds = [this.pos.x, this.pos.x + this.width, this.pos.y + 5, this.pos.y + 25];
		this.zoom_bounds = [this.pos.x, this.pos.x + this.width, this.pos.y + 25, this.pos.y + 45];
	}
}