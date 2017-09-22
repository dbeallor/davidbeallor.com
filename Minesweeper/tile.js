function Tile(x, y, size, bomb){
	this.pos = createVector(x, y);
	this.size = size;
	this.type = bomb ? -1 : 0; 
	this.clicked = false;
	this.flagged = false;
	this.rippled = false;
	this.style = [];
	this.game_ender = false;

	this.show = function(game_over){
		push();
			this.setStyle(game_over);
			fill(this.style[0], this.style[1], this.style[2]);
			noStroke();
			rectMode(CENTER);
			textAlign(CENTER, CENTER);
			rect(this.pos.x, this.pos.y, this.size, this.size);
			push();
				if (this.style[3]){
					if (this.type > 0){
						textStyle(BOLD);
						fill(0);
						text(this.type, this.pos.x, this.pos.y);
					}
					else{
						fill(255);
						text('x', this.pos.x, this.pos.y);
					}
				}
			pop();
		pop();
	}

	this.setStyle = function(game_over){
		// Flagged tile
		if (this.flagged && !game_over[0] && !game_over[1])
			this.style = [255, 143, 0, 0];
		// Clicked zero
		else if (this.type == 0 && this.clicked)
			this.style = [125, 125, 125, 0];
		// Clicked number
		else if (this.type > 0 && this.clicked)
			this.style = [181, 206, 219, 1];
		// Bomb (game won)
		else if (this.type < 0 && game_over[0])
			this.style = [0, 225, 0, 0];
		// Game ending bomb click
		else if (this.game_ender)
			this.style = [255, 0, 0, 1];
		// Bomb (game lost, not flagged)
		else if (this.type < 0 && game_over[1] && !this.flagged)
			this.style = [255, 0, 0, 0];
		// Bomb (game lost, flagged)
		else if (this.type < 0 && game_over[1] && this.flagged)
			this.style = [0, 225, 0, 0];
		// Unclicked and unflagged number (game lost)
		else if (this.type > 0 && game_over[1] && !this.clicked && !this.flagged)
			this.style = [255, 221, 221, 1];
		// Unclicked and unflagged zero (game lost)
		else if (this.type == 0 && game_over[1] && !this.clicked && !this.flagged)
			this.style = [245, 171, 171, 0];
		// Incorrectly flagged number (game lost)
		else if (this.type > 0 && game_over[1] && this.flagged)
			this.style = [255, 143, 0, 1];
		// Incorrectly flagged zero (game lost)
		else if (this.type == 0 && game_over[1] && this.flagged)
			this.style = [255, 143, 0, 0];
		// Unclicked tile
		else
			this.style = [200, 200, 200, 0];
	}

	this.setType = function(type){
		this.type = type;
	}

	this.onClick = function(mouse_x, mouse_y, flag_mode, tiles, i, j, grid_size, num_bombs){
		if (mouse_x > this.pos.x - 9 && mouse_x < this.pos.x + 9){
			if (mouse_y > this.pos.y - 9 && mouse_y < this.pos.y + 9){
				if (!flag_mode && !this.flagged)
					this.clicked = true;
				if (this.type < 0 && !flag_mode && !this.flagged){
					this.game_ender = true;
					return 1;
				}
				if (flag_mode && !this.clicked)
					this.flagged ? this.flagged = false : this.flagged = true;
				if (this.type == 0 && !flag_mode)
					this.ripple(tiles, i, j, grid_size);
			}
		}
		return 0;
	}

	this.ripple = function(tiles, i, j, grid_size){
		this.rippled = true;
		this.clicked = true;
		for (var a =  i - 1; a <= i + 1; a++){
			for (var b = j - 1; b <= j + 1; b++){
				if (!(a == i && b == j) && a >= 0 && b >= 0 && a < grid_size && b < grid_size){
					(tiles[a][b].type == 0 && !tiles[a][b].rippled) ? tiles[a][b].ripple(tiles, a, b, grid_size) : null;
					(tiles[a][b].type > 0) ? tiles[a][b].clicked = true : null;
				}
			}
		}
	}
}