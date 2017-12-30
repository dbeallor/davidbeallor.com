function ControlBox(x, y, w, h, num_buttons, labels){
	this.pos = createVector(x, y);
	this.buttons = [];
	this.width = w;
	this.height = h;
	this.fill = [100, 100, 100];
	this.bounds = [this.pos.x - this.width / 2, this.pos.x + this.width / 2, this.pos.y - this.height / 2, this.pos.y + this.height / 2];
	this.button_fill = [180, 180, 180];
	this.button_highlight = [160, 180, 160];

	var offset = this.width / (num_buttons + 1);
	var gap = 0.05 * offset;
	for (var i = 0; i < num_buttons; i++){
		this.buttons[i] = new ControlButton(this, labels[i], offset - 2*gap, 0.7*this.height);
		this.buttons[i].setPosition(offset * (i+1), this.height / 2);
	}

	this.show = function(){
		push();
			stroke(30);
			strokeWeight(3);
			fill(this.fill[0], this.fill[1], this.fill[2]);
			rectMode(CENTER);
			rect(this.pos.x, this.pos.y, this.width, this.height);
			for (var i = 0; i < this.buttons.length; i++){
				if (withinBounds(mouseX, mouseY, this.buttons[i].bounds) && noOpenWindows())
					this.buttons[i].setFill(this.button_highlight);
				else
					this.buttons[i].setFill(this.button_fill);
				this.buttons[i].show();
			}
		pop();
	}

	this.setFill = function(f){
		this.fill = f;
	}

	this.setButtonFull = function(f){
		this.button_fill = f;
	}

	this.setButtonHighlight = function(h){
		this.button_highlight = h;
	}
}