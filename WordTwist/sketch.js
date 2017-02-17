var interval;
var counter = 0;

var game_loading = false;
var game_loaded = false;
var game_started = false;
var game_over = false;
var game_won = false;

var dictionary = [];
var three_words = [];
var four_words = [];
var five_words = [];
var six_words = [];
var words = [];
var guessed = [];

var three_guesses = [];
var four_guesses = [];
var five_guesses = [];
var six_guesses = [];

var slot_x = [34, 109, 184, 259, 334, 409];
var slot_y = 415;
var slot_l = 60;

var num_letters = 6;
var letters = [];
var letter_y = 345;

var next_open = 0;
var last_left = [];

var speed = 50;

var keysEnabled = true;

var seconds_left = 181;
var minutes, seconds;

function preload(){
	loadStrings('assets/new_dictionary.txt', loadDictionary);
}

function loadDictionary(result){
	dictionary = result;
}

function setup() {
	createCanvas(500,500);
}

function draw() {
	backgroundSetup();
	if (!game_loading && !game_started && !game_over && !game_loaded && !game_won){
		push();
		fill(200);
		rectMode(CENTER);
		rect(width/2,height/2,230,65);
		pop();
		push();
		fill(161,212,144);
		rectMode(CENTER);
		rect(width/2,height/2,225,60);
		pop();
		push();
		fill(0);
		textSize(24);
		textAlign(CENTER,CENTER);
		text("< click to load >",width/2,height/2);
		pop();
	}
	if(game_loading){
		counter++;
		push();
		fill(200);
		rectMode(CENTER);
		rect(width/2,height/2,230,65);
		pop();
		push();
		fill(161,212,144);
		rectMode(CENTER);
		rect(width/2,height/2,225,60);
		pop();
		push();
		fill(0);
		textSize(24);
		textAlign(CENTER,CENTER);
		text("loading...",width/2,height/2);
		pop();
		if(counter>2){
			do{
				getLetters();
				shuffleLetters();
				generateWordList();
				var num_words = three_words.length+four_words.length+five_words.length+six_words.length;
			}while(num_words<20 || num_words >50 || six_words.length<1);
			
			words = words.concat(three_words);
			words = words.concat(four_words);
			words = words.concat(five_words);
			words = words.concat(six_words);
			console.log(words);

			for (var i=0; i<words.length; i++){
				guessed[i] = false;
			}
			updateTimer();
			game_loading=false;
			game_loaded=true;
		}
	}
	if(game_loaded){
		checkList();
		if (!game_started){
			drawTimer();
			displayStart();
		}
		else if (game_over){
			keysEnabled = false;
			displayEnd();
		}
		else if (game_won){
			keysEnabled = false;
			displayWon();
		}
		else {
			drawTimer();
			for (var i=0; i<letters.length; i++){
				letters[i].show();
				for (var j=0; j<speed; j++){
					if (letters[i].reachedTarget() && letters[i].isMoving()){
						letters[i].stopMoving();
						keysEnabled = true;
					}
					else if (!letters[i].reachedTarget()){
						if (letters[i].beingUsed)
							letters[i].hitBottom(slot_y);
						else
							letters[i].hitTop(letter_y);
						letters[i].move();
						keysEnabled = false;
					}
				}
			}
		}
	}
}

function keyPressed(){
	for (var i=0; i<letters.length; i++){
		if (key == letters[i].l.toUpperCase()){
			if (!letters[i].beingUsed){
				keysEnabled = false;
				letters[i].setTarget(slot_x[next_open++], slot_y);
				letters[i].beingUsed = true;
				append(last_left, i);
				break;
			}
		}
	}
	if (keyCode == BACKSPACE && keysEnabled){
		for (var i=0; i<letters.length; i++){
			if (letters[i].pos.x == slot_x[next_open-1] && letters[i].pos.y == slot_y){
				keysEnabled = false;
				letters[i].setTarget(slot_x[last_left[last_left.length-1]],letter_y);
				letters[i].beingUsed = false;
				last_left.splice(last_left.length-1,1);
				next_open--;
				break;
			}
		}
	}
	if (keyCode == ENTER && keysEnabled){
		if (!game_started){
			game_started = true;
			interval = setInterval(updateTimer, 1000);
		}
		else {
			var word_array = [];
			last_left = reverseList(last_left);
			for (var j=0; j<next_open; j++){
				for (var i=0; i<letters.length; i++){
					if (letters[i].pos.y == slot_y && letters[i].pos.x == slot_x[j]){
						keysEnabled = false;
						append(word_array, letters[i].l);
						letters[i].setTarget(slot_x[last_left[last_left.length-1]],letter_y);
						letters[i].beingUsed = false;
						last_left.splice(last_left.length-1,1);
					}
				}
			}
			var word = join(word_array,"");
			console.log(word);
			var flag = true;
			for (var i=0; i<words.length; i++){
				if (words[i] === word){
					guessed[i] = true;
				}
				if (!guessed[i]){
					flag = false;
				}
			}
			if(flag){
				game_won = true;
				clearInterval(interval);
			}
			next_open = 0;
			console.log(guessed);
		}	
	}
	if (key == ' ' && keysEnabled && last_left.length==0){
		shuffleLetters();
	}
	if (key == 'R' && game_over){
		game_over=false;
		game_started=false;
		game_won=false;
		game_loading=false;
		game_loaded=false;
		letters = [];
		three_words = [];
		four_words = [];
		five_words = [];
		six_words = [];
		words = [];
		guessed = [];
		clearInterval(interval);
		seconds_left = 181;
		counter = 0;
		keysEnabled = true;
	}
}

function mousePressed(){
	if (!game_loading && !game_loaded && !game_started && !game_over && !game_won && mouseX<=width && mouseY<=height){
		game_loading = true;
	}
}

function backgroundSetup(){
	background(51);
	push();
		stroke(150);
		noFill();
		rectMode(CENTER);
		rect(width/2, height/2, 480, 480);
	pop();
	push();
		fill(100);
		noStroke();
		for (var i = 0; i<letters.length; i++){
			rect(slot_x[i], slot_y, slot_l, slot_l, 7);
		}
	pop();
}

function getLetters(){
	var num_vowels = floor(Math.random()*2)+2;
	var letter;
	for (var i=0; i<num_letters-num_vowels; i++){
		do{
			letter = new Letter(slot_x[i], letter_y);
		}while (letter.isVowel());
		letters[i] = letter;
	}
	for (var i=num_letters-num_vowels; i<num_letters; i++){
		do{
			letter = new Letter(slot_x[i], letter_y);
		}while (!letter.isVowel());
		letters[i] = letter;
	}
}

function shuffleLetters(){
	var chars = [];
	for (var i=0; i<letters.length; i++){
		chars[i] = letters[i].l;
	}
	var rands = [];
	for (var i=0; i<letters.length; i++){
		if (i==0){
			append(rands,floor(Math.random()*letters.length));
		}
		else{
			do{
				used = false;
				rand = floor(Math.random()*letters.length);
				for (var j=0; j<rands.length; j++){
					if (rands[j] == rand)
						used = true;
				}
			}while(used)
			append(rands,rand);
		}
	}
	for (var k=0; k<rands.length; k++){
		letters[k].l = chars[rands[k]];
	}
}

function generateWordList(){
	var word_array = [];
	var word;

	three_words = [];
	four_words = [];
	five_words = [];
	six_words = [];

	//1st letter
	for (var i=0; i<letters.length; i++){
		//2nd letter
		for (var j=0; j<letters.length; j++){
			if (!(j==i)){
				//3rd letter
				for (var k=0; k<letters.length; k++){
					if (!(k==i||k==j)){
						//check for 3 letter words
						var word_array = [letters[i].l, letters[j].l, letters[k].l];
						var word = join(word_array,"");
						if(inList(word,dictionary) && !inList(word, three_words)){
							append(three_words,word);
						}
						//4th letter
						for (var l=0; l<letters.length; l++){
							if (!(l==i||l==j||l==k)){
								//check for 4 letter words
								var word_array = [letters[i].l, letters[j].l, letters[k].l,
												  letters[l].l];
								var word = join(word_array,"");
								if(inList(word,dictionary) && !inList(word, four_words)){
									append(four_words,word);
								}
								//5th letter
								for (var m=0; m<letters.length; m++){
									if (!(m==i||m==j||m==k||m==l)){
										//check for 5 letter words
										var word_array = [letters[i].l, letters[j].l, letters[k].l,
														  letters[l].l, letters[m].l];
										var word = join(word_array,"");
										if(inList(word,dictionary) && !inList(word, five_words)){
											append(five_words,word);
										}
										//6th letter
										for (var n=0; n<letters.length; n++){
											if (!(n==i||n==j||n==k||n==l||n==m)){
												//check for 6 letter words
												var word_array = [letters[i].l, letters[j].l, letters[k].l, 
											                      letters[l].l, letters[m].l, letters[n].l];
												var word = join(word_array,"");
												if(inList(word,dictionary) && !inList(word, six_words)){
													append(six_words,word);
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	three_words.sort();
	four_words.sort();
	five_words.sort();
	six_words.sort();
}

function inList(word, list){
	for (var i=0; i<list.length; i++){
		if (list[i] === word){
			return true;
		}
	}
	return false;
}

function checkList(){
	var word, col, row, size;

	var words_per_col = 15;
	var size = 18;
	var column_distance = 110;
	var left_offset = 43;
	var top_offset = 35;

	for (var i=0; i<words.length; i++){
		for (var j=0; j<words[i].length; j++){
			col = left_offset + floor(i/words_per_col)*column_distance + (size+2)*j;
			row = top_offset + (size+2)*(i%words_per_col);
			push();
				fill(180);
				stroke(0);
				rectMode(CENTER);
				rect(col, row, size, size);
			pop();
			if (guessed[i]){
				push();
					textAlign(CENTER,CENTER);
					textSize(12);
					textStyle(BOLD);
					text(words[i].charAt(j).toUpperCase(), col, row+1);
				pop();
			}
			if (game_over && !guessed[i]){
				push();
					fill(189,17,17);
					textAlign(CENTER,CENTER);
					textSize(12);
					textStyle(BOLD);
					text(words[i].charAt(j).toUpperCase(), col, row+1);
				pop();
			}
		}
	}
}

function reverseList(list){
	var left = 0;
	var right = list.length-1;
	var temp;

	while (left<right && left!=right){
		temp = list[left];
		list[left] = list[right];
		list[right] = temp;
		left++;
		right--;
	}

	return list;
}

function drawTimer(){
	var height = 320;
	var offset = 58;

	push();
		fill(255,0,0);
		textStyle(BOLD);
		textAlign(CENTER,CENTER);
		textSize(24);
		if(seconds!=0 && seconds>9)
			text(minutes + ":" + seconds, width-offset,height);
		else if (seconds!=0 && seconds<=9)
			text(minutes + ":0" + seconds, width-offset,height);
		else
			text(minutes + ":00", width-offset,height);
	pop();
}

function updateTimer(){
	minutes = floor(--seconds_left/60);
	seconds = seconds_left%60;
	if (seconds_left==0)
		game_over = true;
}
function displayStart(){
	push();
	fill(135,232,157);
	rectMode(CENTER);
	rect(width/2,370,230,65);
	pop();

	push();
	fill(180);
	rectMode(CENTER);
	rect(width/2,370,225,60);
	pop();

	push();
	fill(0);
	textAlign(CENTER,CENTER);
	textSize(18);
	text("<ENTER>", width/2, 360);
	text("TO START", width/2, 380);
	pop();

}

function displayEnd(){
	push();
	fill(200);
	rectMode(CENTER);
	rect(width/2,370,230,65);
	pop();

	push();
	fill(204,129,129);
	rectMode(CENTER);
	rect(width/2,370,225,60);
	pop();

	push();
	fill(0);
	textAlign(CENTER,CENTER);
	textSize(24);
	text("GAME OVER", width/2, 360);
	textSize(14);
	text("press < r > to restart", width/2, 385);
	pop();
}

function displayWon(){
	push();
	fill(200);
	rectMode(CENTER);
	rect(width/2,370,230,65);
	pop();

	push();
	fill(135,232,157);
	rectMode(CENTER);
	rect(width/2,370,225,60);
	pop();

	push();
	fill(0);
	textAlign(CENTER,CENTER);
	textSize(32);
	text("WINNER!", width/2, 370);
	pop();
}


