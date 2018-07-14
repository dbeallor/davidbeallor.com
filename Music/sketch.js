var player;
var playbar;
var ready = false;
var current_state = {paused: false};
var token = 'BQBhQyg3zbNujuRT_pxgxu8lwo3lqc2JJdue9mTlL1TLPsm1eXelfpFaAWNEufC0RMd_PQq8KZy-dvR9nav1AEVlthpRAhfHJdJS6e0nm0ppDxONRdrYuW95CBNAFRApedo7dYbaKFCrpVHVb3IhPY1mW7uy8cq4LdZ_';
var center;
var deck;
var background_image;

function setup(){
	createCanvas(windowWidth, windowHeight);
	playbar = new PlayBar();
	// CROP TO 1800x650
	deck = new Deck([
				{'id': 'lonelyboogie', 
				 'uri': 'spotify:track:6HbYFGNEpivQ49kDCD0uIs'
				},
				{'id': 'mindmischief', 
				 'uri': 'spotify:track:6ewQE1dNPv9qqlnB1CxrvM'
				}, 
				{'id': 'notinlove', 
				 'uri': 'spotify:track:2GAvCh5XRUcadG2xScude5'
				},
				{'id': 'grandnewspin', 
				 'uri': 'spotify:track:2RD1r9eKDTRs6hiN9RR9UC'
				},
				{'id': 'locket', 
				 'uri': 'spotify:track:26AhgCPP2OKAnF4AyBf2Kg'
				},
				{'id': 'mountainsong', 
				 'uri': 'spotify:track:38mndiq3ea14J9yerMJSvH'
				},
				{'id': 'sherefused', 
				 'uri': 'spotify:track:3ePnpJnNUUmcMOsyMZZH2w'
				},
			]);
} 

function keyPressed(){
	if (key == ' ' && ready){
		player.togglePlay();
	}
	deck.keyEvents();
}

function draw(){
	backgroundImage();
	deck.show();
	playbar.show();
}

function windowResized(){
	playbar.resize();
	deck.resize();
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
	playbar.mouseEvents();
	deck.onClick();
}

function backgroundImage(){
	if (typeof background_image == 'undefined'){
		loadImage('assets/background_image.jpg', this, function(img, obj){
			background_image = img;
		});
	}
	else{
		var wide = windowWidth / windowHeight > background_image.width / background_image.height;
		var ratio = background_image.width / background_image.height;
		imageMode(CENTER);
		image(background_image, windowWidth / 2, windowHeight / 2, wide ? windowWidth : windowHeight * ratio, wide ? windowWidth * (1 / ratio) : windowHeight);
	}
}