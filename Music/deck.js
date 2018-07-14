function Deck(slides){
	this.reinitialize = function(){
		this.pos = createVector(windowWidth / 2, (windowHeight - playbar.height) / 2);
	}
	this.reinitialize();
	
	this.current_slide = 0;

	this.slides = [];
	for (var i = 0; i < slides.length; i++)
		this.slides = append(this.slides, new Slide(this, slides[i]));

	this.scroller = new Scroller(this);

	this.getCurrentSlideData = function(){
		var uri = deck.slides[deck.current_slide].uri;
	    $.ajax({
	    	url: 'https://api.spotify.com/v1/tracks/' + uri.substring(14), 
	    	success: function(data) {
		    	deck.slides[deck.current_slide].track_data = data;
		    	console.log(data);
		    }
		});
	}

	this.show = function(){
		this.displaySlides();
		this.scroller.show();
		this.frame();
	}

	this.displaySlides = function(){
		push();
			this.slides[this.current_slide].show(0);
			if (this.current_slide > 0)
				this.slides[this.current_slide - 1].show(-1);
			if (this.current_slide < this.slides.length - 1)
				this.slides[this.current_slide + 1].show(1);
		pop();
	}

	this.frame = function(){
		push();
		noFill();
		stroke(0);
		strokeWeight(3);
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y, windowWidth, windowWidth * (650/1800));
		pop();
	}

	this.onClick = function(){
		this.scroller.onClick();
	}

	this.up = function(){
		if (this.current_slide > 0)
			playSpotifyURI(this.slides[this.current_slide - 1].uri);
		this.current_slide = max(0, this.current_slide - 1);
		this.slides[this.current_slide].track_data = current_state.track_window.current_track;
		this.getCurrentTrackData();
	}

	this.down = function(){
		if (this.current_slide < this.slides.length - 1)
			playSpotifyURI(this.slides[this.current_slide + 1].uri);
		this.current_slide = min(this.slides.length - 1, this.current_slide + 1);
		this.slides[this.current_slide].track_data = current_state.track_window.current_track;
		this.getCurrentTrackData();
	}

	this.keyEvents = function(){
		if (keyCode == DOWN_ARROW){
			this.down();
		}
		if (keyCode == UP_ARROW){
			this.up();
		}
	}

	this.resize = function(){
		this.reinitialize();
		this.scroller.reinitialize();
	}
}