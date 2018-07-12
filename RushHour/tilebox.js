function TileBox(){
	this.visible = false;
	this.drag_height = 30;
	this.being_dragged = false;

	this.reinitialize = function(){
		if (typeof this.pos == 'undefined')
			this.pos = createVector(windowWidth / 2, windowHeight / 2);
		else {
			this.pos.x = map(this.pos.x, 0, window_dims.x - 1, 0, windowWidth)
			this.pos.y = map(this.pos.y, 0, window_dims.y - 1, 0, windowHeight)
		}
		this.width = windowWidth * 0.2;
		this.height = windowHeight * 0.2;
		this.bounds = [this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.pos.x + this.width / 2, this.pos.y + this.height / 2];
		this.drag_bounds = [this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.pos.x + this.width / 2, this.pos.y - this.height / 2 + this.drag_height];
	}
	
	this.reinitialize();

	this.show = function(){
		if (this.visible){
			push();
				fill(0, 150);
				noStroke();
				rectMode(CENTER);
				rect(this.pos.x, this.pos.y, this.width, this.height, 5);
				rectMode(CORNER);
				rect(this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.drag_height, 5, 5, 0, 0);
			pop();

			if (mouseIsPressed && this.being_dragged)
				this.snapToMouse();

			if (!mouseIsPressed)
				this.being_dragged = false;
		}
	}

	this.open = function(){
		this.visible = true;
	}

	this.onClick = function(){
		if (this.visible && withinBounds(mouseX, mouseY, this.drag_bounds)){
			this.being_dragged = true;
			this.drag_loc = [mouseX - this.pos.x, mouseY - this.pos.y];
		}
	}

	this.resize = function(){
		this.reinitialize();
	}

	this.setPosition = function(x, y){
		this.pos.set(x, y);
		this.bounds = [this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.pos.x + this.width / 2, this.pos.y + this.height / 2];
		this.drag_bounds = [this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.pos.x + this.width / 2, this.pos.y - this.height / 2 + this.drag_height];
	}

	this.snapToMouse = function(){
		var x = constrain(mouseX - this.drag_loc[0], this.width / 2, windowWidth - this.width / 2 - 1);
		var y = constrain(mouseY - this.drag_loc[1], this.height / 2, windowHeight - this.height / 2 - 1);
		this.setPosition(x, y);
	}

	this.onScreen = function(){
		return (this.bounds[0] >= 0 && this.bounds[1] >= 0 && this.bounds[2] < windowWidth && this.bounds[3] < windowHeight);
	}
}
