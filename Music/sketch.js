var player;
var playbar;
var ready = false;
var current_state = {paused: false};
var token = 'BQDsOzVQ8TAIv3kfa2XXStyHQc8wIzU8Y7pe6J9LN0JnAFhl3dSE-TlrXLL6M02Ro3QVaBEO_ERlmt1E9csrP7AI2dfR7I_gDZqZIPS4QfDdj5gGHVRWxdcIAwwJV63YzilcH82vU4kHzcQZ58krK1yqSjIrMacoUWTd';
function setup(){
	createCanvas(windowWidth, windowHeight);
	playbar = new PlayBar();
}

function keyPressed(){
	if (key == ' ' && ready){
		player.pause();
	}
}

function draw(){
	background(51);
	playbar.show();
}

function windowResized(){
	playbar.resize();
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
	playbar.mouseEvents();
}

function playSpotifyURI(uri){
	console.log(player._options)
    fetch('https://api.spotify.com/v1/me/player/play?device_id=' + player._options.id, {
      method: 'PUT',
      body: JSON.stringify({ uris: [uri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
}

window.onSpotifyWebPlaybackSDKReady = () => {
	spotifySDKready = true;
	
	player = new Spotify.Player({
		name: 'Web Playback SDK Quick Start Player',
		getOAuthToken: cb => { cb(token); }
	});

	console.log(player);

	// Error handling
	player.addListener('initialization_error', ({ message }) => { console.error(message); });
	player.addListener('authentication_error', ({ message }) => { console.error(message); });
	player.addListener('account_error', ({ message }) => { console.error(message); });
	player.addListener('playback_error', ({ message }) => { console.error(message); });

	// Playback status updates
	player.addListener('player_state_changed', state => { current_state = state; console.log(state); });

	// Ready
	player.addListener('ready', ({ device_id }) => {
		console.log('Ready with Device ID', device_id);
		ready = true;
		playbar.player = player;
		playSpotifyURI('spotify:track:3Hm5r8d43K8PwA1xivMvzw');
	});

	// Not Ready
	player.addListener('not_ready', ({ device_id }) => {
		console.log('Device ID has gone offline', device_id);
	});

	// Connect to the player!
	player.connect();
}