function LoadBar(x, y, w, h){
	this.pos = createVector(x, y);
	this.percentage = 0;
	this.width = w;
	this.height = h;

	this.show = function(){
		push();
			noStroke();
			fill(150);
			rect(this.pos.x + 0.025 * this.width, this.pos.y + 0.1 * this.height, 0.95 * this.width, 0.8 * this.height, 5);
			fill(50, 50, 200);
			var progress = this.percentage * 0.95 * this.width;
			rect(this.pos.x + 0.025 * this.width, this.pos.y + 0.1 * this.height, progress, 0.8 * this.height, 5);
		pop();
	}

	this.setPercentage = function(p){
		this.percentage = p;
	}
}