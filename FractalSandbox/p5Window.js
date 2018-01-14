function p5Window(title, x, y, width, height){
	this.pos = createVector(x, y);
	this.title = title;
	this.width = width;
	this.height = height;
	this.fill = color(220);
	this.accent = color(180);
	this.header_height = max(this.height * 0.08, 20);
	this.bounds = [this.pos.x - this.width / 2, this.pos.x + this.width / 2, this.pos.y - this.height / 2, this.pos.y + this.height / 2];
	this.exit_button = new ExitButton(this.pos.x + this.width / 2 - this.header_height / 2, this.pos.y - this.height / 2 + this.header_height / 2);
	this.visible = false;
	this.buttons = [];
	this.text = "";
	this.image = image || createImage(this.width, this.height);

	this.show = function(){
		if (this.visible){
			push();
				resetMatrix();
				translate(this.pos.x, this.pos.y);
				rectMode(CENTER);
				fill(this.accent);
				rect(0, -this.height / 2 + this.header_height / 2, this.width, this.header_height, 5, 5, 0, 0);
				fill(0);
				noStroke();
				textFont("Arial");
				textStyle(BOLD);
				textAlign(CENTER, CENTER);
				text(this.title, 0, -this.height / 2 + this.header_height / 2 + 1);
				stroke(0);
				fill(this.fill);
				rect(0, 0, this.width, this.height - 2 * this.header_height);
				fill(this.accent);
				rect(0, this.height / 2 - this.header_height / 2, this.width, this.header_height, 0, 0, 5, 5);
				this.exit_button.show();
				fill(0);
				noStroke();
				text(this.text, 0, (-this.height / 2 + this.header_height)/2);
			pop();
			if (this.buttons.length > 0){
				for (var i = 0; i < this.buttons.length; i++)
					this.buttons[i].show();
			}
		}
	}

	this.onClick = function(){
		if (this.exit_button.clicked()){
			this.close();
			return true;
		}
		if (this.buttons.length > 0){
			for (var i = 0; i < this.buttons.length; i++)
				this.buttons[i].onClick();
		}
		return false;
	}

	this.open = function(){
		this.visible = true;
		this.openButtons();
	}

	this.close = function(){
		this.visible = false;
		this.closeButtons();
	}

	this.openButtons = function(){
		if (this.buttons.length > 0){
			for (var i = 0; i < this.buttons.length; i++)
				this.buttons[i].open();
		}
	}

	this.closeButtons = function(){
		if (this.buttons.length > 0){
			for (var i = 0; i < this.buttons.length; i++)
				this.buttons[i].close();
		}
	}

	this.withinBounds = function(x, y, bounds){
		return (x >= bounds[0] && x <= bounds[1] && y >= bounds[2] && y <= bounds[3]);
	}

	this.addButton = function(label, x, y, width, height, listener){
		this.buttons = append(this.buttons, new p5Button(label, x, y, width, height, listener));
	}

	this.setText = function(t){
		this.text = t;
	}

	this.setPosition = function(x, y){
		this.pos.set(x, y);
	}

	this.addImage = function(){
		this.image = image;
	}
}