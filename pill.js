/* Adam Christie & Arielle Martinez - Dandy - ( Global Game Jam 2014 ) */

// Define the canvas
var myCanvas = document.getElementById("myCanvas");

// Set the canvas' context to 2d
var ctx = myCanvas.getContext("2d");

// Set the canvas width and height
myCanvas.width = 480;
myCanvas.height = 550;

var pills = new Audio('pills.mp3');
var startScreen = true;
var restart = false;

// welcome Screen
var Welcome = {
	color: "#000000",
	x: 20,
	y: 40,
	drawTitle: function(){
		ctx.fillStyle = this.color;
		ctx.font = "70px Snell Roundhand";
		ctx.textAlign = "center";
		ctx.fillText("~Dandy~", myCanvas.width/2, (myCanvas.height/2) - 50);
	},
	draw: function() {
		ctx.fillStyle = this.color;
		ctx.font = "18px Monaco";
		ctx.textAlign = "center";
		ctx.fillText("Pick flowers! Use pills with caution!", myCanvas.width/2, myCanvas.height/2);
		ctx.fillText("Pursue happiness!", myCanvas.width/2, (myCanvas.height/2) + 25);
		ctx.fillText("Arrows to move, X to start :)", myCanvas.width/2, (myCanvas.height/2) + 50);
	}
};
if (startScreen == true){
	Welcome.draw();
	Welcome.drawTitle();	
};
	
//};
window.onkeydown = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code === 88 && startScreen == true) { //up key
        init();
        pills.play();
    } else if ( code === 88 && restart == true ){
    	location.reload(true);	
    }
};

// The game loop - update and redraw the canvas 30 times in 1000ms (1 second)
function init(){
	startScreen = false;
var gameHasStarted = false;
var gameIsRunning = true;
var gameHasEnded = false;
var gameTimer = 50;
var flowersCollected = 0;
var fastTime = false;

// List of pressed keys
var keysDown = {}; 

// Sprite Images
var playerSprite = new Image();
var flowerSprite = new Image();
var upperSprite = new Image();
var downerSprite = new Image();
var Bg = new Image();
playerSprite.src = 'sprite1.png';
flowerSprite.src = 'dandelion.png';
upperSprite.src = 'upper.png';
downerSprite.src = 'downer.png';
Bg.src = 'bg.jpg';

// Sound Objects
var flowersound = new Audio('flower.wav');
var downersound = new Audio('downpill.wav');
var speed = new Audio('speed.wav');


//Game State 	
	setInterval( function() {
		
			if (gameTimer > 0) {
				update();
				draw();
			}

		// Game Over
		else if (gameTimer < 0) {		
				gameIsRunning = false;	
				restart = true;
				gameTimer = 0;
				timerText.draw();
				ctx.fillStyle = this.color;
				ctx.font = "18px Monaco";
				ctx.textAlign = "center";
				ctx.fillText("Time's up! You collected " + flowersCollected + " flowers!", myCanvas.width/2, myCanvas.height/2);
				ctx.fillText("Press X to restart :)", myCanvas.width/2, (myCanvas.height/2) + 20);
						
		}
	
	}, 1000/60 );

var playerSrc = 1;
setInterval( function() {
	if ( playerSrc == 1 ){
		playerSprite.src = 'sprite1.png';
		playerSrc = 2;
	} else if ( playerSrc == 2 ){
		playerSprite.src = 'sprite2.png';

		playerSrc = 1;
	}

}, 1000/3 );

setInterval( function() {
	if (gameIsRunning == true) {
	gameTimer -= 1;
	}
}, 1000 );

function invert(){
	Bg.src = 'bg-inverted.jpg';
};

function itemDuration(){
	setTimeout(function(){
		tile1.speed = 1;
		tile2.speed = 1;
		tile1.y = 0;
		tile2.y = -550;
		fastTime = false;
		for(var i = 0; flowerInstances.length; i++ ){
			flowerInstances[i].speed = 1;
   		 }
	},3000);

}

function itemDuration2(){
	setTimeout(function(){
		player.speed = 4;
		Bg.src = 'bg.jpg';
	},3000);

}

// This will update the location of the player and flower, as well as the score
var update = function() {

	//Added after the key-pressing eventListeners below -- move the player
	if (38 in keysDown) { // If up is pressed
		if (player.y >= 100) {
			player.y = player.y - player.speed;
		};
	}
	
	if (40 in keysDown) { // If down is pressed
		if (player.y <= 450) {
			player.y = player.y + player.speed;
		};
	}
	
	if (37 in keysDown) { // If left is pressed
		if (player.x >= (player.radius + 10) ) {
			player.x = player.x - player.speed;
		};
	}
	
	if (39 in keysDown) { // If right is pressed
		if (player.x <= myCanvas.width - (player.radius + 10)){
			player.x = player.x + player.speed;
		}
	}
	
	
	// Initializing the speed of everything else
	
	for ( var m = 0; m < flowerInstances.length; m++ ){
		flowerInstances[m].y += flowerInstances[m].speed;
	};
	
	for ( var n = 0; n < pillInstancesDowners.length; n++ ){
		pillInstancesDowners[n].y += pillInstancesDowners[n].speed;
		// var xLog = pillInstancesDowners[n].x;
		// if ( pillInstancesDowners[n].x <= xLog + 5){
		// 	pillInstancesDowners[n].x = pillInstancesDowners[n].x + 1;
		// } else if ( pillInstancesDowners[n].x >= xLog - 5){
		// 	pillInstancesDowners[n].x = pillInstancesDowners[n].x - 1;
		// }
		//console.log(pillInstancesDowners[n].x);
	};
	
	for ( var n = 0; n < pillInstancesUppers.length; n++ ){
		pillInstancesUppers[n].y += pillInstancesUppers[n].speed;
	};
	
	
	
	for (var m = 0; m < flowerInstances.length; m++){
	// if the player's edge touches the flower's edge on any side -- feel free to tinker with this and refine it
			if ( player.x <= (flowerInstances[m].x + player.radius) // player's X is near flower's X
				&& flowerInstances[m].x <= (player.x + player.radius) // flower X is touched by player's edge
				&& player.y <= (flowerInstances[m].y + player.radius) // player's Y is near flower's Y
				&& flowerInstances[m].y <= (player.y + player.radius) // flower's Y is within range of player's edge
		 		) {
 				// Move the flower to a random location
			 	flowerInstances[m].x = Math.floor( ( Math.random() * (myCanvas.width - 20) ) + 10 );
				flowerInstances[m].y = Math.floor( (Math.random() * myCanvas.height) * -1  );
			 	flowersCollected++;
			 	flowersound.play();
			 	// gameTimer += 2;
		 		}
		 	if ( flowerInstances[m].y >= 550) {
		 		flowerInstances[m].y = Math.floor( (Math.random() * myCanvas.height) * -1);
		 		}
	};	
			 	 // Increase the number of enemies caught/eaten by 1 each time
//		 player.radius = player.radius + flowersCollected; // Increase the player's radius by the number of enemies caught
	for (var m = 0; m < pillInstancesDowners.length; m++){
	// if the player's edge touches the item's edge on any side
			if ( player.x <= (pillInstancesDowners[m].x + player.radius) // player's X is near flower's X
				&& pillInstancesDowners[m].x <= (player.x + player.radius) // flower X is touched by player's edge
				&& player.y <= (pillInstancesDowners[m].y + player.radius) // player's Y is near flower's Y
				&& pillInstancesDowners[m].y <= (player.y + player.radius) // flower's Y is within range of player's edge
		 		) {
 				// Move the item to a random location
			 	pillInstancesDowners[m].x = Math.floor( ( Math.random() * (myCanvas.width - 20) ));
				pillInstancesDowners[m].y = Math.floor( (Math.random() * myCanvas.height) * -1  );
				//blue downers PLAYER IS SLOWER
				itemDuration2();
				invert();
				player.speed = 2;
				downersound.play();
		 		}
		 		
		 	if ( pillInstancesDowners[m].y >= 550) {
		 		pillInstancesDowners[m].y = Math.floor( (Math.random() * myCanvas.height) * -1);
		 		}
	};
	
	for (var m = 0; m < pillInstancesUppers.length; m++){
	// if the player's edge touches the item's edge on any side
		if ( player.x <= (pillInstancesUppers[m].x + player.radius) // player's X is near flower's X
			&& pillInstancesUppers[m].x <= (player.x + player.radius) // flower X is touched by player's edge
			&& player.y <= (pillInstancesUppers[m].y + player.radius) // player's Y is near flower's Y
			&& pillInstancesUppers[m].y <= (player.y + player.radius) // Enemy's Y is within range of player's edge
	 		) {
			// Move the item to a random location
	 		pillInstancesUppers[m].x = Math.floor( ( Math.random() * (myCanvas.width - 20) ));
			pillInstancesUppers[m].y = Math.floor( (Math.random() * myCanvas.height) * -1  );

			//Red uppers  GLOBAL SPEED IS FASTER;
			itemDuration();
			tile1.speed = 10;
			tile2.speed = 10;
			fastTime = true;
			speed.play();
	    	for(var i = 0; flowerInstances.length; i++ ){
				flowerInstances[i].speed = 10;
	 		}

	 	} 
		
	 	if ( pillInstancesUppers[m].y >= 550) {
	 			pillInstancesUppers[m].y = Math.floor( (Math.random() * myCanvas.height) * -1);
	 		}
	};	

	if (fastTime == false){
		if ( tile1.y <= 550  ) {
    		tile1.y += tile1.speed;
    		} else {
		tile1.y = -548;
    		};
   		if ( tile2.y <= 550  ) {
    		tile2.y += tile2.speed;
    		} else {
		tile2.y = -548;
    		};
	} else if (fastTime == true){
		if ( tile1.y <= 550  ) {
    		tile1.y += tile1.speed;
    		} else {
		tile1.y = -528;
    		};
   		if ( tile2.y <= 550  ) {
    		tile2.y += tile2.speed;
    		} else {
		tile2.y = -528;
    		};
	}

};

//Listeners for movement
addEventListener("keydown", function(key) {
	keysDown[key.keyCode] = true;
}); // If a key is pressed, add it to the keysDown list

addEventListener("keyup", function(key) {
	delete keysDown[key.keyCode];
}); // If the key is no longer being pressed, delete it from the list

// This will draw our game once all the variables are updated
var draw = function() {

	ctx.fillStyle = "#CCCCCC"; // Set the canvas fill color
	 
	ctx.fillRect(0,0, myCanvas.width, myCanvas.height);
	tile3.draw();
	tile1.draw();
    tile2.draw();

	for ( j = 0; j < flowerInstances.length; j++){
		flowerInstances[j].draw();
	}
	
	for ( j = 0; j < pillInstancesDowners.length; j++){
		pillInstancesDowners[j].draw();
	}
	
	for ( j = 0; j < pillInstancesUppers.length; j++){
		pillInstancesUppers[j].draw();
	}
	

	player.draw();
	
	// Draw the score
	score.draw();
	// Draw life
	timerText.draw();
};


//background function 
function Background() {
   this.x = 0;
   this.y = 0;
    this.speed = 1;
    this.draw = function() { 
		ctx.drawImage(Bg,0,this.y); 
	}

};
var tile1 = new Background();
var tile2 = new Background();
var tile3 = new Background();
tile2.y = tile2.y - myCanvas.height;

// The main player object
var player = {
	color: "#7766ff",
	radius: 22, // Half the width and height of our circle
	x: 30,
	y: 350,
	speed: 4,
	draw: function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); // x, y, width (radius * 2), beginning angle, ending angle (circumference),clockwise		
		ctx.closePath();
		

        ctx.drawImage(playerSprite, player.x - (player.radius ), player.y - player.radius);
		
		 // ctx.fillStyle = this.color; // The fill color for our player
		 // ctx.fill(); // Fill our player with the above color
	}
};

// The flower object
function flower() {
	this.color = "#FFFFFF";
	this.radius =  14;
	this.speed = 1;
	// Enemy appears at random
	this.x = Math.floor( Math.random() * (myCanvas.width - 20) );
	this.y = Math.floor( (Math.random() * myCanvas.height) * -5 );
	this.draw = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.closePath();

		ctx.drawImage(flowerSprite, this.x - (this.radius + 1), this.y - this.radius );

		// ctx.fillStyle = this.color;
		// ctx.fill();
	}
};

var flowerInstances = [];
var pillInstancesDowners = [];
var pillInstancesUppers = [];

function createFlowerInstances(){
  for (var i = 0; i <= 10; i++) {
      flowerInstances[i] = new flower();
  }
  return flowerInstances;
};

function createDownerInstances(){
  for (var i = 0; i <= 5; i++) {
      pillInstancesDowners[i] = new pillDowner();
  }
  return pillInstancesDowners;
};

function createUpperInstances(){
  for (var i = 0; i <= 5; i++) {
      pillInstancesUppers[i] = new pillUpper();
  }
  return pillInstancesUppers;
};

createFlowerInstances();
createDownerInstances();
createUpperInstances();

function pillDowner() {
	this.color = "#FF3C31";
	this.radius = 13;
	this.speed = 2;
	// Item appears at random
	this.x = Math.floor( Math.random() * myCanvas.width ); // Random rounded number between 0 and the circle edge
	this.y = Math.floor( (Math.random() * myCanvas.height) * -5 );
	this.draw = function() {
		//Make item circle
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.closePath();

		ctx.drawImage(downerSprite, this.x - this.radius , this.y - this.radius);

//		 ctx.fillStyle = this.color;
//		 ctx.fill();
	}
};

function pillUpper() {
	this.color = "#59FFC3";
	this.radius = 13;
	this.speed = 2;
	// Item appears at random
	this.x = Math.floor( Math.random() * myCanvas.width ); // Random rounded number between 0 and the circle edge
	this.y = Math.floor( (Math.random() * myCanvas.height) * -5 );
	this.draw = function() {
		//Make item circle
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.closePath();

		ctx.drawImage(upperSprite, this.x - this.radius , this.y - this.radius )

		// ctx.fillStyle = this.color;
		// ctx.fill();
	}
};


// The score object
var score = {
	color: "#E1FFE7",
	x: 20,
	y: 20,
	draw: function() {
		ctx.fillStyle = this.color;
		ctx.font = "18px Monaco";
		ctx.textAlign = "left";
		ctx.fillText("Flowers: " + flowersCollected, score.x, score.y);
	}
};

var timerText = {
	color: "#E1FFE7",
	x: 20,
	y: 40,
	draw: function() {
		ctx.fillStyle = this.color;
		ctx.font = "18px Monaco";
		ctx.textAlign = "left";
		ctx.fillText("Time: " + gameTimer, timerText.x, timerText.y );
	}
};
}; //this closes the game initialize function 

