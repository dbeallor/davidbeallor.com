function FileBrowser(file_names, aliases, header, x, y, w, h){
	this.pos = createVector(x, y);
	this.width = w;
	this.height = h;
	this.header = header;
	this.bounds = [this.pos.x - this.width / 2, this.pos.x + this.width / 2, this.pos.y - this.height / 2, this.pos.y + this.height / 2];
	this.vert_gap = 60;
	this.tile_height = (this.height - this.vert_gap) / file_names.length;
	this.tile_fill = [200, 200, 200];
	this.tile_highlight = [180, 200, 180];
	this.open_button_fill = [255, 255, 255];
	this.open_button_highlight = [125, 148, 223];
	this.open_button_bounds = [this.pos.x - 55, this.pos.x + 55, this.pos.y + 40, this.pos.y + 60];

	this.files = [];
	for (var i = 0; i < file_names.length; i++)
		this.files[i] = new FileTile(file_names[i], aliases[i], i, this);

	this.show = function(){
		push();
			this.showContainer();
			for (var i = 0; i < this.files.length; i++){
				if (withinBounds(mouseX, mouseY, this.files[i].bounds))
					this.files[i].setFill(this.tile_highlight);
				else
					this.files[i].setFill(this.tile_fill);
				this.files[i].show();
			}
		pop();
	}

	this.showContainer = function(){
		push();
			translate(this.pos.x, this.pos.y);
			fill(125,148,223);
			stroke(0);
			rectMode(CENTER);
			rect(0, 0, this.width, this.height, 10);
			fill(0);
			noStroke();
			textAlign(CENTER);
			textSize(16);
			textStyle(BOLD);
			text(this.header, 0, -this.height / 2 + 22);
		pop();
	}

	this.showOpenButton = function(){
		push();
			translate(this.pos.x, this.pos.y);
			if (withinBounds(mouseX, mouseY, this.open_button_bounds))
				fill(this.open_button_highlight);
			else 
				fill(this.open_button_fill);
			noStroke();
			rectMode(CENTER);
			rect(0, 50, 110, 20, 5);
			textAlign(CENTER, CENTER);
			fill(0);
			text("load sample seed", 0, 50);
		pop();
	}
}