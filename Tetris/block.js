function Block(block_types, random){
	var rand = floor(Math.random() * block_types.length)
	this.type = block_types[rand];
	this.dim = this.type.length;
	this.frozen = false;
	this.pos = createVector(floor(Math.random() * (grid_size[0] - this.dim)), -this.dim);

	switch (rand){
		case 0 : this.fill = [222, 104,  66]; break;
		case 1 : this.fill = [ 91, 223, 235]; break;
		case 2 : this.fill = [110, 144, 250]; break;
		case 3 : this.fill = [232, 205,  54]; break;
		case 4 : this.fill = [113, 209, 109]; break;
		case 5 : this.fill = [160,  88, 201]; break;
		case 6 : this.fill = [240, 161, 233]; break;
	}

	this.show = function(tiles){
		for (var a = 0; a < this.dim; a++){
			for (var b = 0; b < this.dim; b++){
				try{
					if (this.type[a][b]){
						var tile = tiles[this.pos.x + a][this.pos.y + b];
						tile.is_occupied = true;
						tile.fill = this.fill;
					}
				}
				catch(err){}
			}
		}
	}

	this.update = function(tiles, grid_size){
		if (this.canMoveDown(tiles, grid_size))
			this.pos.y++;
		else
			this.frozen = true;
	}

	this.shift = function(dir, tiles, grid_size){
		if (this.canShift(dir, tiles, grid_size))
			this.pos.x += dir;
	}

	this.canMoveDown = function(tiles, grid_size){
		this.setUnoccupied(tiles);

		for (var a = 0; a < this.dim; a++){
			for (var b = 0; b < this.dim; b++){
				if (this.type[a][b]){
					// Check for bottom border
					if (this.pos.y + b + 1 >= grid_size[1])
						return false;
					try{
						// Check for neighbouring occupied tiles
						var neighbour = tiles[this.pos.x + a][this.pos.y + b + 1];
						if (neighbour.is_occupied)
							return false;
					}
					catch(err){}
				}
			}
		}
		return true;
	}

	this.canShift = function(dir, tiles, grid_size){
		this.setUnoccupied(tiles);

		for (var a = 0; a < this.dim; a++){
			for (var b = 0; b < this.dim; b++){
				if (this.type[a][b]){
					// Check left and right borders
					if (this.pos.x + a + dir < 0 || this.pos.x + a + dir >= grid_size[0])
						return false;
					try{
						// Check for neighbouring occupied tiles
						var neighbour = tiles[this.pos.x + a + dir][this.pos.y + b];
						if (neighbour.is_occupied)
							return false;
					}
					catch(err){}
				}
			}
		}
		return true;
	}

	this.setUnoccupied = function(tiles){
		// Set current block's tiles to unoccupied
		for (var a = 0; a < this.dim; a++){
			for (var b = 0; b < this.dim; b++){
				try{
					if (this.type[a][b])
						tiles[this.pos.x + a][this.pos.y + b].is_occupied = false;
				}
				catch(err){}
			}
		}
	}

	this.rotate = function(tiles, grid_size){
		var new_type = [];

		for (var i = 0; i < this.dim; i++){
			new_type[i] = [];
			for (var j = 0; j < this.dim; j++)
				new_type[i][j] = this.type[this.dim - j - 1][i];
		}

		this.setUnoccupied(tiles);

		if (this.canRotate(tiles, grid_size, new_type)){
			this.type = new_type;
			this.show(tiles);
		}
	}

	this.canRotate = function(tiles, grid_size, new_type){
		// Check borders
		for (var a = 0; a < this.dim; a++){
			for (var b = 0; b < this.dim; b++){
				if (new_type[a][b]){
					// Check bottom border
					if (this.pos.y + b >= grid_size[1]){
						return false;
					}
					// Check left and right borders
					if (this.pos.x + a < 0 || this.pos.x + a >= grid_size[0]){
						return false;
					}
					try{
						// Check for neighbouring occupied tiles
						var neighbour = tiles[this.pos.x + a][this.pos.y + b];
						if (neighbour.is_occupied)
							return false;
					}
					catch(err){}
				}
			}
		}
		return true;
	}
}