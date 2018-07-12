function Tile(r, x, y, grid){
	this.grid = grid;
	this.pos = createVector(x, y);
	this.r = r;
	this.type = 0;
	this.rotation = int(random() * 4) * HALF_PI;

	this.show = function(){
		var layer = this.grid.graphic;
		layer.resetMatrix();
		layer.push();
			layer.imageMode(CENTER);
			layer.rectMode(CENTER);
			layer.translate(this.pos.x + this.r / 2, this.pos.y + this.r / 2);
			layer.rotate(this.rotation);
			layer.image(textures[this.type], 0, 0, this.r, this.r);
			layer.noFill();
			layer.stroke(51);
			layer.resetMatrix();
			layer.translate(this.pos.x + this.r / 2, this.pos.y + this.r / 2);
			layer.rect(0, 0, this.r, this.r);
		layer.pop();
	}

	this.highlight = function(){
		if (this.grid.mouseIsOverMe()){
			var layer = this.grid.highlight;
			layer.push();
				layer.noFill();
				layer.stroke(255);
				layer.rect(this.pos.x, this.pos.y, this.r, this.r);
			layer.pop();
		}
	}

	this.setPosition = function(x, y){
		this.pos.set(x, y);
	}

	this.setSize = function(r){
		this.r = r;
	}

	this.onClick = function(){
		if (keyIsDown(SHIFT)){
			this.type = this.type != 2 ? 2 : 0;
			this.rotation = this.type == 0 ? int(random() * 4) * HALF_PI : 0;
		}
		else{
			this.type = this.type < 1 ? 1 : 0;
			this.rotation = this.type == 0 ? int(random() * 4) * HALF_PI : 0;
		}
	}
}