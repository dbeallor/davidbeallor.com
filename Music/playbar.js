function PlayBar(player){
	this.player;
	this.fill = color(25);
	this.buttons = [new PlayButton(this)];
	this.reinitialize = function(){
		var d = pixelDensity();
		if (typeof this.graphic != 'undefined')
			delete this.graphic;
		this.graphic = createGraphics(windowWidth * d, windowHeight * d);
		this.height = 70;
		this.buttons[0].pos.set(2 * this.buttons[0].r, windowHeight - this.height / 2);
	}
	this.reinitialize();

	

	this.show = function(){
		var g = this.graphic;
		g.clear();
		g.push();
			g.fill(this.fill);
			g.noStroke();
			g.rect(0, windowHeight - this.height, windowWidth, this.height);
		g.pop();
		this.showButtons();
		imageMode(CORNER);
		image(g, 0, 0, windowWidth, windowHeight);
	}

	this.resize = function(){
		this.reinitialize();
	}

	this.mouseEvents = function(){
		this.buttonMouseEvents();
	}

	this.showButtons = function(){
		for (var i = 0; i < this.buttons.length; i++)
			this.buttons[i].show();
	}

	this.buttonMouseEvents = function(){
		for (var i = 0; i < this.buttons.length; i++)
			if (this.buttons[i].mouseWithinBounds())
				this.buttons[i].onClick();
	}
}