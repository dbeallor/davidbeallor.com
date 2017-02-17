function SeedCopy(a,b,c,d,e){
	this.a = a.copy();
	this.b = b.copy();
	this.c = c.copy();
	this.d = d.copy();
	this.e = e.copy();

	this.lines = [];
	this.lines.push(new SeedLine(this.a,this.b, this.a, this.b, this.c, this.d, this.e));
	this.lines.push(new SeedLine(this.b,this.c, this.a, this.b, this.c, this.d, this.e));
	this.lines.push(new SeedLine(this.c,this.d, this.a, this.b, this.c, this.d, this.e));
	this.lines.push(new SeedLine(this.d,this.e, this.a, this.b, this.c, this.d, this.e));

	this.level_number = 0;

	this.show = function(){
		for (var i=0; i<this.lines.length; i++){
			this.lines[i].show();
		}
	}

	this.update = function(){
		this.lines = this.recurse(this.lines);
		this.level_number++;
	}

	this.recurse = function(lines){
		var new_lines = [];
		
		for (var i=0; i<lines.length; i++){
			var aa = lines[i].lineA();
			var bb = lines[i].lineB();
			var cc = lines[i].lineC();
			var dd = lines[i].lineD();
			var ee = lines[i].lineE();

			new_lines.push(new SeedLine(aa,bb, aa,bb,cc,dd,ee));
			new_lines.push(new SeedLine(bb,cc, aa,bb,cc,dd,ee));
			new_lines.push(new SeedLine(cc,dd, aa,bb,cc,dd,ee));
			new_lines.push(new SeedLine(dd,ee, aa,bb,cc,dd,ee));
		}
		return new_lines;
	}

	this.restart = function(){
		this.lines = [];
		this.lines.push(new SeedLine(this.a,this.b, this.a, this.b, this.c, this.d, this.e));
		this.lines.push(new SeedLine(this.b,this.c, this.a, this.b, this.c, this.d, this.e));
		this.lines.push(new SeedLine(this.c,this.d, this.a, this.b, this.c, this.d, this.e));
		this.lines.push(new SeedLine(this.d,this.e, this.a, this.b, this.c, this.d, this.e));
		this.level_number = 0; 
	}
}