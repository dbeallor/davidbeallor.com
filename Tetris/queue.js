function Queue(block, coords){
	this.block = block;
	this.tiles = [];
	this.size = 4;
	this.tile_size = 10;
	this.coords = coords;

	this.initialize = function(){		
		for (var i = 0; i < this.size; i++){
			this.tiles[i] = [];
			for (var j = 0; j < this.size; j++){
				this.tiles[i][j] = new Tile(i, j, this.coords, this.tile_size);
				if (i < this.block.dim && j < this.block.dim && this.block.type[i][j]){
					this.tiles[i][j].fill = this.block.fill;
					this.tiles[i][j].is_occupied = true;
				}
			}
		}
		this.center();
	}

	this.show = function(){
		for (var i = 0; i < this.size; i++){
			for (var j = 0; j < this.size; j++)
				this.tiles[i][j].show();
		}
	}

	this.center = function(){
		var empty = true;
		for (var i = 0; i < 2; i++){
			for (var j = 0; j < this.size; j++){
				if (this.tiles[i + 2][j].is_occupied)
					empty = false;
			}
		}

		if (empty)
			this.shiftRight();

		empty = true;
		for (var i = 0; i < this.size; i++){
			if (this.tiles[i][this.size - 1].is_occupied)
				empty = false;
		}

		if (empty)
			this.shiftDown();
	}

	

	this.addBlock = function(block){
		this.block = block;
	}

	this.shiftRight = function(){
		for (var a = this.size - 1; a > 0; a--){
			for (var b = 0; b < this.size; b++){
				this.tiles[a][b] = this.tiles[a - 1][b];
				this.tiles[a][b].pos.x++;
			}
		}

		for (var j = 0; j < this.size; j++)
			this.tiles[0][j] = new Tile(0, j, this.coords, this.tile_size);
	}

	this.shiftDown = function(){
		for (var b = this.size - 1; b > 0; b--){
			for (var a = 0; a < this.size; a++){
				this.tiles[a][b] = this.tiles[a][b - 1];
				this.tiles[a][b].pos.y++;
			}
		}

		for (var i = 0; i < this.size; i++)
			this.tiles[i][0] = new Tile(i, 0, this.coords, this.tile_size);
	}
}