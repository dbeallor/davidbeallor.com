function Grid(grid_size, grid_coords, tile_size, speed){
	this.size = grid_size;
	this.grid_coords = grid_coords;
	this.tiles = [];
	this.tile_size = tile_size;
	this.block;
	this.speed = speed;
	this.time;
	this.prev_time = -1;

	this.initialize = function(){		
		for (var i = 0; i < this.size[0]; i++){
			this.tiles[i] = [];
			for (var j = 0; j < this.size[1]; j++)
				this.tiles[i][j] = new Tile(i, j, this.grid_coords, this.tile_size);
		}
	}

	this.update = function(){
		for (var i = 0; i < this.size[0]; i++){
			for (var j = 0; j < this.size[1]; j++)
				this.tiles[i][j].show();
		}

		this.time = Math.floor(millis() / this.speed) * this.speed;

		if (typeof(this.block) != 'undefined' && !this.block.frozen && this.time != this.prev_time){
			this.prev_time = this.time;
			this.block.update(this.tiles, this.size);
		}

		if (typeof(this.block) != 'undefined')
			this.block.show(this.tiles);
	}

	this.addBlock = function(block){
		this.block = block;
	}

	this.clearLines = function(){
		var complete;
		var counter = 0;
		for (var j = 0; j < grid_size[1]; j++){
			complete = true;
			for (var i = 0; i < this.size[0]; i++){
				if (!this.tiles[i][j].is_occupied)
					complete = false;
			}
			if (complete){
				this.clearRow(j);
				counter++;
			}
		}
		return counter;
	}

	this.clearRow = function(start){
		for (var b = start; b > 0; b--){
			for (var a = 0; a < this.size[0]; a++){
				this.tiles[a][b] = this.tiles[a][b - 1];
				this.tiles[a][b].pos.y++;
			}
		}

		for (var i = 0; i < this.size[0]; i++)
			this.tiles[i][0] = new Tile(i, 0, this.grid_coords, this.tile_size);
	}

	this.checkEndGame = function(){
		return (this.block.pos.y < 0);
	}
}