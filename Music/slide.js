function Slide(deck, slide){
	this.id = slide.id;
	this.uri = slide.uri;
	this.deck = deck;
	this.track_data;

	this.wave = new Wave();
	
	this.show = function(loc){
		push();
		if (typeof this.background_img == 'undefined'){
			this.loadAssets();
			fill(200);
			noStroke();
			textAlign(CENTER, CENTER);
			text('loading...', this.deck.pos.x, this.deck.pos.y + loc * h);
		}
		else {
			imageMode(CENTER);
			var h = windowWidth * this.background_img.height / this.background_img.width;
			image(this.background_img, this.deck.pos.x, this.deck.pos.y + loc * h, windowWidth, h);
			if (loc == 0){
				fill(0, 80);
				noStroke();
				rectMode(CORNER);
				var s = 100;
				rect(0, this.deck.pos.y - h / 2, windowWidth, windowWidth * (650/1800));
			}
		}
		if (loc == 0 && typeof this.track_data == 'undefined'){
			// deck.getCurrentSlideData();
		}
		this.wave.show();
		pop();
	}

	this.loadAssets = function(){
		loadImage('assets/' + this.id + '.jpg', this, function(img, slide) {
			slide.background_img = img;
		});
	}
}