function withinBounds(x, y, bounds){
	return (x >= bounds[0] && y >= bounds[1] && x <= bounds[2] && y <= bounds[3]);
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
		playSpotifyURI('spotify:track:6HbYFGNEpivQ49kDCD0uIs');
	});

	// Not Ready
	player.addListener('not_ready', ({ device_id }) => {
		console.log('Device ID has gone offline', device_id);
	});

	// Connect to the player!
	player.connect();
}