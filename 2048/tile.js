function Tile(x,y,loc_x,loc_y,val){
	this.padding = 5;
	this.pos = createVector(x + this.padding, y + this.padding);
	this.dim = 100-2*this.padding;
	this.val = val;
	this.dir = createVector(0,0);
	this.row = loc_x;
	this.col = loc_y;
	this.tgt = createVector(this.pos.x, this.pos.y);
	this.tgt_row = this.row;
	this.tgt_col = this.col;

	var r = [150, 121,  74,  26,   0,   0,  72,  45,  27,  14,  0];
	var g = [150, 146, 124,  89,  47,  21,   0,   0,   0,   0,  0];
	var b = [150, 181, 240, 237, 255, 255, 255, 158,  97,  51,  0];

	this.show = function(){
		if(Math.log2(this.val)-1<=10)
			var coulour_num = Math.log2(this.val)-1;
		else
			var colour_num = 10;

		push();
		fill(r[coulour_num], g[coulour_num], b[coulour_num]);
		noStroke();
		rect(this.pos.x, this.pos.y, this.dim, this.dim);
		pop();

		push();
		if(this.val == 2)
			fill(0);
		else
			fill(255);
		textSize(32);
		textAlign(CENTER,CENTER);
		text(this.val, this.pos.x+this.dim/2, this.pos.y+this.dim/2);
		pop();
	}

	this.move = function(){
		this.pos.add(this.dir);	
	}

	this.setDirection = function(x2,y2){
		this.dir.x = x2;
		this.dir.y = y2;
	}

	this.setTarget = function(tiles,n,rows,cols){
		var tileInTheWay = false;
		
		//If up, make an array of the tiles above it in the same column
		//(not including this tile)
		if (this.dir.x == 0 && this.dir.y == -1){
			var above = [];
			for (var i = 0; i<tiles.length; i++){
				if (tiles[i].col == this.col && tiles[i].row<this.row && i!=n){
					append(above,tiles[i]);
				}	
			}
			
			//initiate target to the top row
			this.tgt.x = cols[this.col]+this.padding;
			this.tgt.y = rows[0]+this.padding;
			this.tgt_row = 0;
			this.tgt_col = this.col;

			var val = [];
			for (var i = 0; i<tiles.length; i++){
				val[i] = -1;
			}

			//if there are 3 above it
			if(above.length==3){
				//if row 1 and 2 or, 2 and 3, or this and 3 have the same value, set target to row 3,
				//otherwise set target to itself

				//iterate through all the tiles above this one
				for (var i = 0; i<above.length; i++){
					//store values of tiles in order
					for (var j = 0; j<3; j++){
						if (above[i].row == j)
							val[j] = above[i].val;
					}
				}
				if(val[0] == val[1] && val[2] == this.val){
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[1] + this.padding;
					this.tgt_row = 1;
					this.tgt_col = this.col;
				}
				else if (val[2] == this.val && val[2] != val[1]){
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[2] + this.padding;
					this.tgt_row = 2;
					this.tgt_col = this.col;
				}
				else if(val[0] == val[1] || val[1] == val[2] || val[2] == this.val){
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[2] + this.padding;
					this.tgt_row = 2;
					this.tgt_col = this.col;
				}
				else{
					this.tgt.x = this.pos.x;
					this.tgt.y = this.pos.y;
					this.tgt_row = this.row;
					this.tgt_col = this.col;
				}
			}

			//if there are 2 above it
			if(above.length==2){
				//if row 1 and 2 or row 2 and 3 or row 1 and 3, or this and 2 or this and 3
				//have the same value, set target to row 2,
				//otherwise set target to row 3
				for (var i = 0; i<above.length; i++){
					//store values of tiles in order (by row)
					for (var j = 0; j<3; j++){
						if (above[i].row == j)
							val[j] = above[i].val;
					}
				}
				if(val[0] == val[1] || val[1] == val[2] || val[0] == val[2]){
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[1] + this.padding;
					this.tgt_row = 1;
					this.tgt_col = this.col;
				}
				else if (val[2] == this.val || (val[1] ==this.val && val[2] == -1)){
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[1] + this.padding;
					this.tgt_row = 1;
					this.tgt_col = this.col;
				}
				else{
					this.tgt.x = cols[this.col] + this.padding;;
					this.tgt.y = rows[2] + this.padding;
					this.tgt_row = 2;
					this.tgt_col = this.col;
				}
			}

			//if there is 1 above it
			if (above.length==1){
				//if they don't have the same value, set target to row 2
				if (above[0].val != this.val){
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[1] + this.padding;
					this.tgt_row = 1;
					this.tgt_col = this.col;
				}
			}
		}

		//If down, make an array of the tiles above it in the same column
		//(not including this tile)
		if (this.dir.x == 0 && this.dir.y == 1){
			var below = [];
			for (var i = 0; i<tiles.length; i++){
				if (tiles[i].col == this.col && tiles[i].row>this.row && i!=n){
					append(below,tiles[i]);
				}	
			}

			//initiate target to the bottom row
			this.tgt.x = cols[this.col]+this.padding;
			this.tgt.y = rows[3]+this.padding;
			this.tgt_row = 3;
			this.tgt_col = this.col;

			var val = [];
			for (var i = 0; i<tiles.length; i++){
				val[i] = -1;
			}
			//if there are 3 below it
			if(below.length==3){
				//if row 2 and 3 or row 3 and 4 have the same value, set target to row 2,
				//otherwise set target to itself

				//iterate through all the tiles below this one
				for (var i = 0; i<below.length; i++){
					//store values of tiles in order (by row)
					for (var j = 1; j<4; j++){
						if (below[i].row == j)
							val[j] = below[i].val;
					}
				}
				if(val[3] == val[2] && val[1] == this.val){
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[2] + this.padding;
					this.tgt_row = 2;
					this.tgt_col = this.col;
				}
				else if (val[1] == this.val && val[2] != val[1]){
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[1] + this.padding;
					this.tgt_row = 1;
					this.tgt_col = this.col;
				}
				else if(val[1] == val[2] || val[2] == val[3]){
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[1] + this.padding;
					this.tgt_row = 1;
					this.tgt_col = this.col;
				}
				else{
					this.tgt.x = this.pos.x;
					this.tgt.y = this.pos.y;
					this.tgt_row = this.row;
					this.tgt_col = this.col;
				}
			}

			//if there are 2 below it
			if(below.length==2){
				//if row 2 and 3 or row 3 and 4 or row 2 and 4 have the same value, set target to row 3,
				//otherwise set target to row 2
				for (var i = 0; i<below.length; i++){
					//store values of tiles in order (by row)
					for (var j = 1; j<4; j++){
						if (below[i].row == j)
							val[j] = below[i].val;
					}
				}
				if(val[1] == val[2] || val[2] == val[3] || val[1] == val[3]){
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[2] + this.padding;
					this.tgt_row = 2;
					this.tgt_col = this.col;
				}
				else if (val[1] == this.val || (val[2] == this.val && val[1] == -1)){
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[2] + this.padding;
					this.tgt_row = 2;
					this.tgt_col = this.col;
				}
				else{
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[1] + this.padding;
					this.tgt_row = 1;
					this.tgt_col = this.col;
				}	
			}

			//if there is 1 below it
			if (below.length==1){
				//if they don't have the same value, set target to row 3
				if (below[0].val != this.val){
					this.tgt.x = cols[this.col] + this.padding;
					this.tgt.y = rows[2] + this.padding;
					this.tgt_row = 2;
					this.tgt_col = this.col;
				}
			}
		}

		//If left, make an array of the tiles to the left of it in the same row
		//(not including this tile)
		if (this.dir.x == -1 && this.dir.y == 0){
			var left = [];
			for (var i = 0; i<tiles.length; i++){
				if (tiles[i].row == this.row && tiles[i].col<this.col && i!=n){
					append(left,tiles[i]);
				}	
			}

			//initiate target to the leftmost row
			this.tgt.x = cols[0]+this.padding;
			this.tgt.y = rows[this.row]+this.padding;
			this.tgt_row = this.row;
			this.tgt_col = 0;

			var val = [];
			for (var i = 0; i<tiles.length; i++){
				val[i] = -1;
			}
			//if there are 3 to the left of  it
			if(left.length==3){
				//if columns 1 and 2 or columns 2 and 3 have the same value, set target to column 3,
				//otherwise set target to itself

				//iterate through all the tiles to the left of this one
				for (var i = 0; i<left.length; i++){
					//store values of tiles in order (by column)
					for (var j = 0; j<3; j++){
						if (left[i].col == j)
							val[j] = left[i].val;
					}
				}
				if(val[0] == val[1] && val[2] == this.val){
					this.tgt.x = cols[1] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 1;
				}
				else if (val[2] == this.val && val[2] != val[1]){
					this.tgt.x = cols[2] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 2;
				}
				else if(val[0] == val[1] || val[1] == val[2]){
					this.tgt.x = cols[2] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 2;
				}
				else{
					this.tgt.x = this.pos.x;
					this.tgt.y = this.pos.y;
					this.tgt_row = this.row;
					this.tgt_col = this.col;
				}
			}

			//if there are 2 to the left of it
			if(left.length==2){
				//if columns 1 and 2, 2 and 3, or 1 and 3 have the same value, set target to column 2,
				//otherwise set target to column 3
				for (var i = 0; i<left.length; i++){
					//store values of tiles in order (by column)
					for (var j = 0; j<3; j++){
						if (left[i].col == j)
							val[j] = left[i].val;
					}
				}
				if(val[0] == val[1] || val[1] == val[2] || val[0] == val[2]){
					this.tgt.x = cols[1] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 1;
				}
				else if (val[2] == this.val || (val[1] == this.val && val[2] == -1)){
					this.tgt.x = cols[1] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 1;
				}
				else{
					this.tgt.x = cols[2] + this.padding;;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 2;
				}
			}

			//if there is 1 to the left of it
			if (left.length==1){
				//if they don't have the same value, set target to row 2
				if (left[0].val != this.val){
					this.tgt.x = cols[1] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 1;
				}
			}
		}

		//If right, make an array of the tiles to the right of it in the same row
		//(not including this tile)
		if (this.dir.x == 1 && this.dir.y == 0){
			var right = [];
			for (var i = 0; i<tiles.length; i++){
				if (tiles[i].row == this.row && tiles[i].col>this.col && i!=n){
					append(right,tiles[i]);
				}	
			}

			//initiate target to the rightmost row
			this.tgt.x = cols[3]+this.padding;
			this.tgt.y = rows[this.row]+this.padding;
			this.tgt_row = this.row;
			this.tgt_col = 3;

			var val = [];
			for (var i = 0; i<tiles.length; i++){
				val[i] = -1;
			}
			//if there are 3 to the right of it
			if(right.length==3){
				//if columns 2 and 3 or, 3 and 4 have the same value, set target to column 2,
				//otherwise set target to itself

				//iterate through all the tiles to the right of this one
				for (var i = 0; i<right.length; i++){
					//store values of tiles in order (by column)
					for (var j = 1; j<4; j++){
						if (right[i].col == j)
							val[j] = right[i].val;
					}
				}
				if(val[3] == val[2] && val[1] == this.val){
					this.tgt.x = cols[2] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 2;
				}
				else if (val[1] == this.val && val[2] != val[1]){
					this.tgt.x = cols[1] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 1;
				}
				else if(val[1] == val[2] || val[2] == val[3]){
					this.tgt.x = cols[1] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 1;
				}
				else{
					this.tgt.x = this.pos.x;
					this.tgt.y = this.pos.y;
					this.tgt_row = this.row;
					this.tgt_col = this.col;
				}
			}

			//if there are 2 to the right of it
			if(right.length==2){
				//if columns 2 and 3 or, 3 and 4 or, 2 and 4 have the same value, set target to column 3,
				//otherwise set target to column 2
				for (var i = 0; i<right.length; i++){
					//store values of tiles in order (by column)
					for (var j = 1; j<4; j++){
						if (right[i].col == j)
							val[j] = right[i].val;
					}
				}
				if(val[1] == val[2] || val[2] == val[3] || val[1] == val[3]){
					this.tgt.x = cols[2] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 2;
				}
				else if (val[1] == this.val || (val[2] == this.val && val[1] == -1)) {
					this.tgt.x = cols[2] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 2;
				}
				else{
					this.tgt.x = cols[1] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 1;
				}	
			}

			//if there is 1 below it
			if (right.length==1){
				//if they don't have the same value, set target to row 3
				if (right[0].val != this.val){
					this.tgt.x = cols[2] + this.padding;
					this.tgt.y = rows[this.row] + this.padding;
					this.tgt_row = this.row;
					this.tgt_col = 2;
				}
			}
		}
	}

	this.reachedTarget = function(){
		return (this.pos.x == this.tgt.x && this.pos.y == this.tgt.y);
	}

	this.isMoving = function(){
		return (this.dir.x !=0 || this.dir.y !=0);
	}

	this.stopMoving = function(){
		this.dir.x = 0;
		this.dir.y = 0;
		this.row = this.tgt_row;
		this.col = this.tgt_col;
		this.tgt.x = this.pos.x;
		this.tgt.y = this.pos.y;
	}

	this.checkCollisions = function(tiles,n){
		for (var i=0; i<tiles.length; i++){
			if (i!=n){
				if (tiles[i].pos.x == this.pos.x && tiles[i].pos.y == this.pos.y)
					return i;
			}
		}
		return -1;
	}
}