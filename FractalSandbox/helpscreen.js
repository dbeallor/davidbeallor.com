function HelpScreen(x, y, width, height, images){
	this.pos = createVector(x, y);
	this.images = images;
	this.fill = [180, 180, 180];
	this.width = width;
	this.height = height;
	this.button_fill = [150, 150, 150];
	this.button_highlight = [125, 148, 223];
	this.scroll_button = new ScrollButton(this.pos.x, this.pos.y + this.height / 2 - 20, 50, 20);
	this.image_pos = createVector(this.pos.x, this.pos.y - 10);
	this.current_image = 0;

	this.show = function(){
		push();
			translate(this.pos.x, this.pos.y);
			fill(this.fill);
			stroke(0);
			rectMode(CENTER);
			rect(0, 0, this.width, this.height, 5);

			if (withinBounds(mouseX, mouseY, this.scroll_button.left_bounds)){
				this.scroll_button.setLeftFill(this.button_highlight);
				this.scroll_button.setRightFill(this.button_fill);
			}
			else if (withinBounds(mouseX, mouseY, this.scroll_button.right_bounds)){
				this.scroll_button.setLeftFill(this.button_fill);
				this.scroll_button.setRightFill(this.button_highlight);
			}
			else{
				this.scroll_button.setLeftFill(this.button_fill);
				this.scroll_button.setRightFill(this.button_fill);
			}
		pop();

		this.scroll_button.show();

		imageMode(CENTER);

		var scale = 0.9;
		var x_dim = this.width * scale;
		var y_dim = (this.images[this.current_image].height * this.width * scale) / this.images[this.current_image].width;
		image(this.images[this.current_image], this.image_pos.x, this.image_pos.y, x_dim, y_dim);
	}

	this.setFill = function(f){
		this.fill = f;
	}

	this.nextImage = function(){
		this.current_image = (this.current_image + 1) % this.images.length;
	}

	this.prevImage = function(){
		this.current_image = this.current_image - 1;
		if (this.current_image < 0)
			this.current_image = this.images.length - 1;
	}
}