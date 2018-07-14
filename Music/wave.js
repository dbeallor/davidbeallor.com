function Wave(uri){
	this.granularity = 200;
	this.reinitialize = function(){
		this.width = windowWidth * 0.8;
		this.height = windowHeight * 0.05;
		this.pos = createVector(windowWidth / 2, (windowHeight - playbar.height) / 2 + windowWidth * (650 / 1800) * 0.4);
	}
	this.reinitialize();

	this.track_data;

	this.show = function(){
		push();
		var w = this.width / this.granularity;
		rectMode(CORNER);
		fill(200);
		noStroke();
		rectMode(CORNERS);
		for (var i = 0; i < this.granularity; i++){
			rect(this.pos.x - this.width / 2 + i * w, this.pos.y - this.height / 2, this.pos.x - this.width / 2 + (i + 1) * w - 1, this.pos.y + this.height / 2);
		}
		pop();
	}

}