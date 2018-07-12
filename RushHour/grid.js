function Grid(){
	this.reinitialize = function(){
		this.pos = createVector(windowWidth / 2, windowHeight / 2);
		this.cols = 32;
		this.rows = this.cols / 2;
		var wide = windowHeight < windowWidth / 2;
		if (wide){
			this.height = windowHeight * 0.95;
			this.r = this.height / this.rows;
			this.width = this.r * this.cols;
		} else {
			this.width = windowWidth * 0.95;
			this.r = this.width / this.cols;
			this.height = this.r * this.rows;
		}
		this.x_start = this.pos.x - this.width / 2;
		this.y_start = this.pos.y - this.height / 2;
		this.redraw = true;
		this.bounds = [this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.pos.x + this.width / 2, this.pos.y + this.height / 2];
	
		// Create main graphics object
		var d = pixelDensity();
		if (typeof this.graphic === 'undefined')
			delete this.graphic
		this.graphic = createGraphics(windowWidth * d, windowHeight * d);

		// Create highlight object
		if (typeof this.highlight === 'undefined')
			delete this.highlight
		this.highlight = createGraphics(windowWidth * d, windowHeight * d);
	}

	this.initializeTiles = function(){
		this.tiles = [];
		for (var j = 0; j < this.rows; j++){
			for (var i = 0; i < this.cols; i++){
				this.tiles = append(this.tiles, new Tile(this.r, this.x_start + i * this.r, this.y_start + j * this.r, this));
			}
		}
	}

	this.reinitialize();
	this.initializeTiles();
	
	this.show = function(){
		if (this.redraw){
			this.graphic.clear();
			this.drawTiles();
			this.graphic.push();
				this.graphic.fill(0, 100);
				this.graphic.rectMode(CENTER);
				this.graphic.rect(this.pos.x, this.pos.y, this.width + this.height * 0.02, this.height * 1.02, 5);
			this.graphic.pop();
			this.redraw = false;
		}
		this.refreshHighlighting();
		image(this.graphic, 0, 0, windowWidth, windowHeight);
		image(this.highlight, 0, 0, windowWidth, windowHeight);
	}

	this.mousePressedEvents = function(){
		if (this.mouseIsOverMe()){
			this.mouseTile().onClick();
			this.redraw = true;
		}
	}

	this.resize = function(){
		this.reinitialize();
		this.resizeTiles();
	}

	this.drawTiles = function(){
		for (var j = 0; j < this.rows; j++){
			for (var i = 0; i < this.cols; i++){
				this.tiles[i + j * this.cols].show();			
			}
		}
	}

	this.resizeTiles = function(){
		for (var j = 0; j < this.rows; j++){
			for (var i = 0; i < this.cols; i++){
				this.tiles[i + j * this.cols].setSize(this.r);
				this.tiles[i + j * this.cols].setPosition(this.x_start + i * this.r, this.y_start + j * this.r);			
			}
		}
	}

	this.mapToTile = function(x, y){
		var i = int((x - this.x_start) / this.r);
		var j = int((y - this.y_start) / this.r);
		return constrain(i, 0, this.cols - 1) + constrain(j, 0, this.rows - 1) * this.cols;
	}

	this.mouseTile = function(){
		return this.tiles[this.mapToTile(mouseX, mouseY)];
	}

	this.mouseIsOverMe = function(){
		return (withinBounds(mouseX, mouseY, this.bounds) && !(withinBounds(mouseX, mouseY, tilebox.bounds) && tilebox.visible) &&!tilebox.being_dragged);
	}

	this.refreshHighlighting = function(){
		this.highlight.clear();
		this.mouseTile().highlight();
	}
}