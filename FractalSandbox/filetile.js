function FileTile(name, alias, num, browser){
	this.browser = browser;
	this.name = name;
	this.alias = alias;
	this.num = num;
	this.height = this.browser.tile_height;
	this.width = this.browser.width;
	this.fill = [200, 200, 200];

	var x_offset = this.browser.pos.x - this.browser.width / 2;
	var y_offset = this.browser.pos.y - (this.browser.height - this.browser.vert_gap) / 2;
	this.bounds = [x_offset, x_offset + this.width, y_offset + this.num * this.height, y_offset + (this.num + 1) * this.height];

	this.show = function(){
		push();
			translate(this.browser.pos.x - this.browser.width / 2, this.browser.pos.y - (this.browser.height - this.browser.vert_gap) / 2);
			fill(this.fill);
			stroke(0);
			rect(0, this.num * this.height, this.width, this.height);
			fill(0);
			noStroke();
			textAlign(CENTER, CENTER);
			textSize(14);
			text(alias, this.width / 2, this.num * this.height + this.height / 2);
		pop();
	}

	this.setFill = function(f){
		this.fill = f;
	}
}