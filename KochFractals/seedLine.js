function SeedLine(start, end, a, b, c, d, e){
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
	this.e = e;
	this.start = start;
	this.end = end;
	
	this.show = function(){
		stroke(255);
		line(this.start.x, this.start.y, this.end.x, this.end.y);
	}

	this.lineA = function(){
		return this.start;
	}

	this.lineB = function(){
		var v1 = createVector(this.b.x-this.a.x, this.b.y-this.a.y);
		var v2 = createVector(this.e.x-this.a.x, this.e.y-this.a.y);
		var v1_mag = dist(this.b.x,this.b.y, this.a.x, this.a.y);
		var v2_mag = dist(this.e.x,this.e.y, this.a.x, this.a.y);
		var dot = v1.x*v2.x + v1.y*v2.y;
		if (abs(dot/(v1_mag*v2_mag)-1)>0.0001)
			var theta = -acos(dot/(v1_mag*v2_mag));
		else
			var theta = 0;

		var scale = v1_mag/v2_mag;		
		
		var v = createVector(this.end.x-this.start.x, this.end.y-this.start.y);
		v.mult(scale);
		v.rotate(theta);
		v.add(this.start);
		return v;
	}

	this.lineC = function(){
		var v1 = createVector(this.c.x-this.a.x, this.c.y-this.a.y);
		var v2 = createVector(this.e.x-this.a.x, this.e.y-this.a.y);
		var v1_mag = dist(this.c.x,this.c.y, this.a.x, this.a.y);
		var v2_mag = dist(this.e.x,this.e.y, this.a.x, this.a.y);
		var dot = v1.x*v2.x + v1.y*v2.y;
		var theta = -acos(dot/(v1_mag*v2_mag));

		var scale = v1_mag/v2_mag;		
		
		var v = createVector(this.end.x-this.start.x, this.end.y-this.start.y);
		v.mult(scale);
		v.rotate(theta);
		v.add(this.start);
		return v;
	}

	this.lineD = function(){
		var v1 = createVector(this.d.x-this.a.x, this.d.y-this.a.y);
		var v2 = createVector(this.e.x-this.a.x, this.e.y-this.a.y);
		var v1_mag = dist(this.d.x,this.d.y, this.a.x, this.a.y);
		var v2_mag = dist(this.e.x,this.e.y, this.a.x, this.a.y);
		var dot = v1.x*v2.x + v1.y*v2.y;
		if (abs(dot/(v1_mag*v2_mag)-1)>0.0001)
			var theta = -acos(dot/(v1_mag*v2_mag));
		else
			var theta = 0;

		var scale = v1_mag/v2_mag;		
		
		var v = createVector(this.end.x-this.start.x, this.end.y-this.start.y);
		v.mult(scale);
		v.rotate(theta);
		v.add(this.start);
		return v;
	}

	this.lineE = function(){
		return this.end;
	}
}