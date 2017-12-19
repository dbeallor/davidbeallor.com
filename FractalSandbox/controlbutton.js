function ControlButton(control_box, label, w, h){
	this.control_box = control_box;
	this.label = label;
	this.pos = createVector(0, 0);
	this.w = w;
	this.h = h;
	this.text_size = 12;
	this.font = "Verdana";
	this.bounds;
	this.fill = [180, 180, 180];

	this.show = function(){
		push();
			fill(this.fill);
			noStroke();
			rectMode(CENTER);
			rect(this.pos.x, this.pos.y, this.w, this.h, 15);
			textAlign(CENTER, CENTER);
			fill(0);
			textSize(this.text_size);
			textFont(this.font);
			textStyle(BOLD);
			text(this.label, this.pos.x, this.pos.y);
		pop();
	}

	this.setPosition = function(x, y){
		this.pos.x = this.control_box.pos.x - this.control_box.width / 2 + x;
		this.pos.y = this.control_box.pos.y - this.control_box.height / 2 + y;
		this.setBounds();
	}

	this.setBounds = function(){
		this.bounds = [this.pos.x - this.w / 2, this.pos.x + this.w / 2, this.pos.y - this.h / 2, this.pos.y + this.h / 2];
	}

	this.setTextSize = function(s){
		this.text_size = s;
	}

	this.setFont = function(f){
		this.font = f;
	}

	this.setFill = function(f){
		this.fill = f;
	}
}