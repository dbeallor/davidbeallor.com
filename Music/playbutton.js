function PlayButton(playbar){
	this.pos = createVector(0, 0);
	this.r = 35;
	this.playbar = playbar;
	this.state = 1;
	
	this.show = function(){
		var g = this.playbar.graphic;
		g.push();
			g.fill(this.playbar.fill);
			g.stroke(this.mouseWithinBounds() ? 255 : 180);
			g.ellipse(this.pos.x, this.pos.y, this.r, this.r);
			g.fill(this.mouseWithinBounds() ? 255 : 180);
			g.noStroke();
			if (current_state.paused)
				g.triangle(this.pos.x + this.r * 0.2, this.pos.y, this.pos.x - this.r * 0.1, this.pos.y - this.r * 0.2, this.pos.x - this.r * 0.1, this.pos.y + this.r * 0.2);
			else {
				g.rectMode(CENTER);
				g.rect(this.pos.x, this.pos.y, this.r * 0.3, this.r * 0.3);
				g.fill(this.playbar.fill);
				g.rect(this.pos.x, this.pos.y, this.r * 0.15, this.r * 0.3);
			}
		g.pop();
	}

	this.mouseWithinBounds = function(){
		var x2 = pow(mouseX - this.pos.x, 2);
		var y2 = pow(mouseY - this.pos.y, 2);
		var d = sqrt(x2 + y2);
		return d < this.r;
	}

	this.onClick = function(){
		this.playbar.player.togglePlay();
		this.state = (this.state + 1) % 2;
	}
}