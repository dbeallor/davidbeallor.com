function Letter(x,y){
	var letters = "abcdefghijklmnopqrstuvwxyz";
	this.pos = createVector(x,y);
	this.size = 60; 
	this.l = letters.charAt(Math.random()*26);
	this.dir = createVector(0,0);
	this.tgt = createVector(x,y);
	this.beingUsed = false;

	this.show = function(){
		push();
		fill(175);
		rect(this.pos.x, this.pos.y, this.size, this.size, 8);
		pop();

		textSize(32);
		textAlign(CENTER,CENTER);
		text(this.l.toUpperCase(), this.pos.x+this.size/2, this.pos.y+this.size/2);
		pop();
	}

	this.move = function(){
		this.pos.add(this.dir);
	}

	this.setTarget = function(x,y){
		this.tgt.x = x;
		this.tgt.y = y;

		var x_dif = this.tgt.x-this.pos.x;
		if (x_dif>0)
			this.dir.x = 1;
		else if (x_dif<0)
			this.dir.x = -1;
		else 
			this.dir.x = 0;

		var y_dif = this.tgt.y-this.pos.y;
		if (y_dif>0)
			this.dir.y = 1;
		else if (y_dif<0)
			this.dir.y = -1;
		else 
			this.dir.y = 0;
	}

	this.reachedTarget = function(){
		return (this.pos.x == this.tgt.x && this.pos.y == this.tgt.y);
	}

	this.stopMoving = function(){
		this.dir.x = 0;
		this.dir.y = 0;
	}

	this.isMoving = function(){
		return (this.dir.x !=0 || this.dir.y !=0);
	}

	this.hitBottom = function(bottom_y){
		if (this.pos.y == bottom_y){
			if (this.reachedTarget())
				this.stopMoving();
			else
				this.dir.y = 0;
			return true;
		}
		else false;
	}

	this.hitTop = function(top_y){
		if (this.pos.y == top_y){
			if (this.reachedTarget())
				this.stopMoving();
			else
				this.dir.y = 0;
			return true;
		}
		else false;
	}

	this.isVowel = function(){
		return (this.l=="a" || this.l=="e" || this.l=="i" ||
			    this.l=="o" || this.l=="u");
	}
}