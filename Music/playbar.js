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
		this.showCurrentTrack();
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

	this.showCurrentTrack = function(){
		var g = this.graphic;
		var play_button = this.buttons[0];
		g.push();
			if (typeof current_state.track_window != 'undefined'){
				var track_data = current_state.track_window.current_track;
				g.fill(200);
				g.noStroke();
				g.textAlign(LEFT, CENTER);
				g.textSize(18);
				g.textStyle(BOLD);
				g.textFont('helvetica')
				g.text(track_data.name, play_button.pos.x + play_button.r * 1.2, play_button.pos.y - 10);
				g.textSize(14);
				g.textStyle(NORMAL);
				g.text(track_data.artists[0].name, play_button.pos.x + play_button.r * 1.2, play_button.pos.y + 10)
			}
		g.pop();
	}
}