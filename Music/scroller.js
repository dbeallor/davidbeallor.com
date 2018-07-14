function Scroller(deck){
	this.deck = deck;
	this.arrow_image

	this.reinitialize = function(){
		var h = windowWidth * (650 / 1800);
		var c = (windowHeight - playbar.height) / 2;

		this.height = c - h / 2;

		var cUp = (c - h / 2) / 2;
		var cDown = windowHeight - (c - h / 2) / 2;

		this.upBounds = [0, 0, windowWidth, this.height];
		this.downBounds = [0, windowHeight - playbar.height - this.height, windowWidth, windowHeight - playbar.height];
	}
	this.reinitialize();

	this.show = function(){
		push();
			this.showArrows();
			this.shadow();
			this.showMessages();
		pop();
	}

	this.mouseOverUp = function(){
		return withinBounds(mouseX, mouseY, this.upBounds);
	}

	this.onClick = function(){
		if (withinBounds(mouseX, mouseY, this.upBounds)){
			this.deck.up();
		}
		if (withinBounds(mouseX, mouseY, this.downBounds)){
			this.deck.down();
		}
	}

	this.mouseOverDown = function(){
		return withinBounds(mouseX, mouseY, this.downBounds);
	}

	this.loadArrowImage = function(){
		loadImage('assets/arrow.png', this, function(img, scroller){
			scroller.arrow_image = img;
		});
	}

	this.shadow = function(){
		noStroke();
		rectMode(CORNER);
		resetMatrix();
		var opacity = 180;
		if (this.deck.current_slide > 0)
			fill(this.mouseOverUp() ? 100 : 0, opacity);
		else
			fill(0, opacity);
		rect(0, 0, windowWidth, this.height);
		if (this.deck.current_slide < this.deck.slides.length - 1)
			fill(this.mouseOverDown() ? 100 : 0, opacity);
		else
			fill(0, opacity);
		rect(0, this.downBounds[1], windowWidth, this.height);
	}

	this.showArrows = function(){
		imageMode(CENTER);
		if (typeof this.arrow_image == 'undefined')
			this.loadArrowImage()
		else {
			var r = 0.3;

			if (this.deck.current_slide > 0){
				translate(windowWidth / 2, this.height / 2);
				image(this.arrow_image, 0, 0, this.height * r, this.height * r);
			}

			if (this.deck.current_slide < this.deck.slides.length - 1){
				resetMatrix();
				translate(windowWidth / 2, windowHeight - playbar.height - this.height / 2);
				rotate(PI);
				image(this.arrow_image, 0, 0, this.height * r, this.height * r);
			}
		}
	}

	this.showMessages = function(){
		resetMatrix();
		textFont('helvetica');
		textSize(28);
		textAlign(CENTER, CENTER);
		fill(220);
		noStroke();
		var c = (windowHeight - playbar.height) / 2;
		if (this.deck.current_slide == 0)
			text('My curated list...', windowWidth / 2, (c - windowWidth * (650/1800) / 2) / 2);
		if (this.deck.current_slide == this.deck.slides.length - 1)
			text('This is where it ends...', windowWidth / 2, windowHeight - playbar.height - (c - windowWidth * (650/1800) / 2) / 2);
	}
}
