"use strict";

 //incorporating this 'expression' tells the browser to enable 'strict mode' - this mode helps ensure you write better code, for example, it prevents the use of undeclared variables.


//task 1 --------------
//task 1.1 - download and setup the starter code (this project) from GitHub to a suitable (and remembered) location
//task 1.2 - open the project (from its location) using a suitable editor (e.g., vscode or replit, etc)
//task 1.3 - generally review the html and css code/files (for quick reference; should be fairly clear based on work done to date) 
//task 1.4 - review the js code to help ensure you understand what each line is and does (recapped from the earlier group review to help reenforce your own learning and understanding)
//task 1.5 - reflect on the terms 'abstraction' and 'decomposition' and create a general flow diagram (covered in week 1) to illustrate the codebase use of sequence, conditional (branching), looping (iteration) and function; ideally on paper – awareness of this will be highly useful as you progress through the week

//task 2 -------------- use the ideas of 'abstraction' and 'decomposition' when reflecting on the challenges of the following tasks 
//task 2.1 - open and check the project (in this case the 'index.html' file) using the preferred browser, i.e., Chrome
//task 2.2 - implement the paint functions and debug any issue/s found; as suggested (in the brief) you will need to enable the developer tools – n.b., there are likely several layers of different problems; useful note: you can ignore any 'AudioContext' warning for the time being as we will discuss this later - however, in interested now please ask :)
//task 2.3 - expand the paint_assets function so that it draws a rectangle utilising the get_random function to position it dynamically at random positions within the defined canvas; start your research by searching “js random numbers”.  Once you developed and tested your ‘get_random’ function you will likely need to research (or recall) how to draw a rectangle with the p5 library; start your research by searching “p5 draw rectangle” - to complete this task you will likely need to combine your research and test your ideas
//task 2.4 - update the paint_background function so that the colour format uses 'integer' rgb values rather than 'hex'; start your research by searching "p5 set background color" *note ‘us’ spelling although it shouldn't make too much of a difference research-wise!

//task 3 (extended challenge) --------------
//task 3.1 - expand your 2.3 task so that your rectangle changes colour during each frame update; reflect on what you have done so far and consider and test ways this could be achieved and implemented as simply as possible 
//task 3.2 - continue to expand your 2.3 (and now 3.1) task so that your rectangle cycles through all shades of the same colour (e.g., from the darkest to the lightest shade); reflect on what you have already completed and consider and test ways this could be achieved and implemented as simply as possible; for your recall and ease of reference, colour values start from 00 (darkest, i.e., no white added) to FF (lightest, i.e., full white added) in hex or 00 - 255 in decimal



const vp_width = 1000, vp_height = 900; //defined global const variables to hold the (vp) details (e.g., size, etc.)
var engine, world, body; //defined global variables to hold the game's viewport and the 'matter' engine components
var viewport;
let ground = null;
let ball;
let platform1 = null;
let platform2 = null;
let platform3 = null;
let platform4 = null;
let platform5 = null;
let platformWin = null;
let princessPeach = null;
let bowser = null;
let score = 0;
let mColour = "#ff0000";

let balls = [];
const land = [];
const barrierThickness = 5;
const notinteractable = 0x0001;
const test = 0x0002;
let rightWall = null;
let removeBall = null;
let leftWall = null;
let ladderWin = null;
let ladder1 = null;
let ladder2 = null;
let ladder3 = null;
let ladder4 = null;
let ladder5 = null;
let testPlatform = null;
let isMenuActive = true;
let gameRunning = false;
let death = false; 
//object for the background

const environment = {
	_ladders: [],
	_platforms : [],
	get platforms () {
		return this._platforms;
	},
	set platforms (plat) {
		this.addEnvObj(this._platforms, item);		
	},
	get ladders () {
		return this._ladders;
	},
	set ladders (ladder) {
		this.addEnvObj(this._ladders, ladder);
	},
	addEnvObj (obj, item) {
		if (Array.isArray(item)) {
			item.forEach((element, index) => obj.push(element[index]))
		} else {
			obj.push(item);			
		}	
	},
	displayEnvObj () {
		if (this.ladders.length > 0) {
			this.ladders.forEach(ladder => ladder.show())
		}
		if (this.platforms.length > 0) {
			this.platforms.forEach( platform => platform.show())
		}
	},
	paint_background() {
		background(50, 50, 50);
	}
}


class EnvObj {
	constructor(x, y, width, height) {
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
	}
	get x () {
		return this._x;
	}
	get y () {
		return this._y;
	}
	get width () {
		return this._width;
	} 
	get height () {
		return this._height;
	}
}

class Floor extends EnvObj {
	constructor(x, y, width, height) {
		super(x, y, width, height);
		//.boundary = Matter.Bodies.rectangle(x, y, width, height, {isStatic: true});
		let options = {
			isStatic: true,
			restitution: 0,
			friction: 0,
			density: 1
		}
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.body);
	}
	show() {
		let pos = this.body.position; //create an shortcut alias  //switch centre to be centre rather than left, top
		fill('#00ff00'); //set tXhe fill colour
		rectMode(CENTER)
		rect(this.x, this.y, this.width, this.height); //draw the rectangle
	}

	//generates the floor (bottom plaform)
}

/*
class Platform extends EnvObj {
	constructor(x, y, width, height, angle = 0) {
		super(x, y, width, height);
		//.boundary = Matter.Bodies.rectangle(x, y, width, height, {isStatic: true});
		let options = {
			isStatic: true,
			restitution: 0.39,
			friction: 0,
			angle: angle
		}
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.body);
	}
	show() {
		push();
		angleMode(RADIANS)
		translate(this.width / 2, this.height / 2)
		rotate(this.body.angle)
		fill('#00ff00'); //set tXhe fill colour
		noStroke();
		rectMode(CENTER)
		rect(this.x, this.y, this.width, this.height); //draw the rectangle
		pop();
	}	
}
*/

class c_special {
	constructor(x, y, width, height, angle, label) {
		let options = {
			isStatic: true,
			restitution: 0.99,
			friction: 0.0,
			density: 0.99,
			frictionAir: 0.032,
            angle: angle,
			label: label,
		}
		//create the body
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.body); //add to the matter world
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.removeBody = false;
		
		options = {
			isStatic: true,
			isSensor: true,
			label: label,
			angle: angle,
			collisionFilter: { mask: notinteractable}
		}

		this.sensor = Matter.Bodies.rectangle(x,y,width,height,options);
		Matter.World.add(world, this.sensor)
	}

	body() {
		return this.body; //return the created body
	}

	//dont forget bodies are added to the matter world meaning even if not visible the physics engine still manages it
	remove() {
		if(this.removeBody) {
			Matter.World.remove(world, this.body);
			Matter.Body.applyForce(mario.body, mario.body.position, {x: 0, y:3})

			setTimeout(()=> {
				this.addBody()
			}, 400)
		}	
	}
	addBody () {
		Matter.World.add(world, this.body)
		this.removeBody = false;
	}


	show() {
		Matter.Body.setPosition(this.sensor, this.body.position)
		let pos = this.body.position; //create an shortcut alias 
		let angle = this.body.angle;


		push(); //p5 translation 
			noStroke();
			fill('#00ff00');
			rectMode(CENTER); //switch centre to be centre rather than left, top
			translate(pos.x, pos.y);
			rotate(angle);
			rect(0, 0, this.width, this.height);
		pop();
	}
}

class PrincessPeach {
	constructor(x, y, diameter, label) {
		let options = {
			isStatic: true,
			restitution: 0,
			friction: 0.000,
			density: 0.7,
			frictionAir: 0.001,
			label: label,
			collisionFilter: {
				category: notinteractable,
			}
			
		}
		this.body = Matter.Bodies.circle(x, y, diameter/2, options); //matterbody.circle(x, y, Matter.Common.random(10, 20), { friction: 0.00001, restitution: 0.5, density: 0.001 });
		Matter.World.add(world, this.body);
		
		
		this.x = x;
		this.y = y;
		this.diameter = diameter;

	}

	body() {
		return this.body;
	}

	show() {
		fill(255, 255, 0);
        stroke(0);
		strokeWeight(2);
		ellipse(this.x, this.y, this.diameter, this.diameter);
      
        // Smile
		var startAng = .1*PI
		var endAng = .9*PI
        var smileDiam = .6*this.diameter;
        arc(this.x, this.y, smileDiam, smileDiam, startAng, endAng);
      
      // Eyes
        var offset = .2*this.diameter;
        var eyeDiam = .1*this.diameter;
        fill(0);
        ellipse(this.x-offset, this.y-offset, eyeDiam, eyeDiam);
        ellipse(this.x+offset, this.y-offset, eyeDiam, eyeDiam);
	}	
		

}

class Bowser {
	constructor(x, y, diameter, label) {
		let options = {
			isStatic: true,
			restitution: 0,
			friction: 0.000,
			density: 0.7,
			frictionAir: 0.001,
			label: label,
			collisionFilter: {
				category: notinteractable,
			}
			
		}
		this.body = Matter.Bodies.circle(x, y, diameter/2, options); //matterbody.circle(x, y, Matter.Common.random(10, 20), { friction: 0.00001, restitution: 0.5, density: 0.001 });
		Matter.World.add(world, this.body);
		
		
		this.x = x;
		this.y = y;
		this.diameter = diameter;

	}

	body() {
		return this.body;
	}

	show() {
		fill(255, 0, 0);
        stroke(0);
		strokeWeight(2);
		ellipse(this.x, this.y, this.diameter, this.diameter);
      
        // Smile
		var startAng = .1*PI
		var endAng = .9*PI
        var smileDiam = .6*this.diameter;
		arc(this.x, this.y + 0.3 * this.diameter, 0.4 * this.diameter, 0.4 * this.diameter, 210, 330);      
      // Eyes
        var offset = .2*this.diameter;
        var eyeDiam = .1*this.diameter;
        fill(0);
        ellipse(this.x-offset, this.y-offset, eyeDiam, eyeDiam);
        ellipse(this.x+offset, this.y-offset, eyeDiam, eyeDiam);
	}	
}


class c_fuzzball {
	constructor(x, y, diameter, label) {
		let options = {
			restitution: 0,
			friction: 0.000,
			density: 0.7,
			frictionAir: 0.001,
			label: label,
			collisionFilter: {
				category: notinteractable
			}
			
		}
		this.body = Matter.Bodies.circle(x, y, diameter/2, options); //matterbody.circle(x, y, Matter.Common.random(10, 20), { friction: 0.00001, restitution: 0.5, density: 0.001 });
		Matter.World.add(world, this.body);
		
		
		this.x = x;
		this.y = y;
		this.diameter = diameter;
		this.start = true;
		this.endReached = true;
	}

	body() {
		return this.body;
	}

	show() {
		if(this.endReached) {
			let pos = this.body.position;
		    let angle = this.body.angle;
			if (this.start) {
				Matter.Body.applyForce(this.body, this.body.position, {x: 7, y:0})
			    this.start = false;
		    }	
		    push(); //p5 translation 
			  translate(pos.x, pos.y);
			  rotate(angle);
			  fill('#ff0000');
			  ellipseMode(CENTER); //switch centre to be centre rather than left, top
			  circle(0, 0, this.diameter);
		      pop();  
	    }
	}	
	collisionRightWall () {
		Matter.Body.setVelocity(this.body, {x: -4, y:0})
	}
	collisionLeftWall () {
		Matter.Body.setVelocity(this.body, {x: 4, y:0})
	}
	remove() {
		Matter.World.remove(world, this.body);
		this.endReached = false;
	}
}

class Ladders {
	constructor(x, y, width, height, label) {
		let options = {
			isStatic: true,
			isSensor: true,
			restitution: 0,
			friction: 0,
			density: 1,
			label,
			collisionFilter: {
				category: 0x0008
			}
		}
		//create the body
		this.sensor = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.sensor); //add to the matter world
		
		this.x = x; //store the passed variables in the object
		this.y = y;
		this.width = width;
		this.height = height;
		this.addedToScore = false;
	}

	body() {
		return this.body; //return the created body
	}
	increaseScore () {
		if(this.addedToScore === false) {
			score += 200;
			this.addedToScore = true;
		}
	}

	show() {
		let pos = this.sensor.position; //create an shortcut alias 
		rectMode(CENTER); //switch centre to be centre rather than left, top
		noStroke()
		fill('#0000ff'); //set the fill colour
		rect(pos.x, pos.y, this.width, this.height); //draw the rectangle
	}

}

class Barrier {
	constructor(x, y, width, height, label) {
		let options = {
			isStatic: true,
			restitution: 1,
			friction: 0,
			density: 0.5,
			label,
			collisionFilter: { //used with mouse constraints to allow/not allow iteration
				category: notinteractable,
			}
		}
		//create the body
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.body); //add to the matter world
		
		this.x = x; //store the passed variables in the object
		this.y = y;
		this.width = width;
		this.height = height;
	}

	body() {
		return this.body; //return the created body
	}

	show() {
		let pos = this.body.position; //create an shortcut alias 
		noStroke()
		rectMode(CENTER); //switch centre to be centre rather than left, top
		fill('#00ff00'); //set the fill colour
		rect(pos.x, pos.y, this.width, this.height); //draw the rectangle
	}
}


function apply_velocity() {
};


function apply_angularvelocity() {
};


function apply_force() {
};


function get_random(min, max) {
}


function preload() {
	//a 'p5' defined function runs automatically and used to handle asynchronous loading of external files in a blocking way; once complete
	//the 'setup' function is called (automatically)
}

function removeAllBalls(arr){
	//foreach
	//remove from matter
	// clear the array
	arr.forEach(element => {
		element.remove();
	})
	balls = [];
}


function setup() {
	//a 'p5' defined function runs automatically once the preload function is complete
	viewport = createCanvas(vp_width, vp_height); //set the viewport (canvas) size
	viewport.parent("viewport_container"); //attach the created canvas to the target div
	
	//enable the matter engine
	engine = Matter.Engine.create(); //the 'engine' is a controller that manages updating the 'simulation' of the world
	world = engine.world; //the instance of the world (contains all bodies, constraints, etc) to be simulated by the engine
	body = Matter.Body; //the module that contains all 'matter' methods for creating and manipulating 'body' models a 'matter' body 
	//is a 'rigid' body that can be simulated by the Matter.Engine; generally defined as rectangles, circles and other polygons)
	// Matter.Engine.run(engine);
	frameRate(60); //specifies the number of (refresh) frames displayed every second
	ground = new c_special(538, 885, 745, 45, -0.02, "ground");
	//ball = new c_fuzzball(0, 40, 40);
	platform1 = [new c_special(408, 180, 645, 15, 0.015, "platform1"), new c_special(780, 185.5, 100, 15, 0.015, "platformladderbeam1")]	
	platform2 = [new c_special(215, 334.5, 100, 15, -0.012, "platformladderbeam2"), new c_special(587, 330, 645, 15, -0.012, "platform2")]
	platform3 = [new c_special(408, 460, 645, 15, 0.012, "platform3"), new c_special(780, 464.5, 100, 15, 0.012, "platformladderbeam3")]	
	platform4 = [new c_special(215, 594.5, 100, 15, -0.012, "platformladderbeam4"), new c_special(587, 590, 645, 15, -0.012, "platform4")]
	platform5 = [new c_special(408, 730, 645, 15, 0.012, "platform5"), new c_special(780, 734.5, 100, 15, 0.012, "platformladderbeam5")]
	
	rightWall = new Barrier(vp_width / 100 * 97, vp_height / 2, vp_width / 100 * 12, vp_height, "rightwall");
	leftWall = new Barrier(0, vp_height / 2, vp_width / 100 * 17, vp_height, "leftwall")
	//bowser = new Bowser(vp_width / 100 * 47, 171, vp_width / 100 * 2.3, "bowser")
	princessPeach = new PrincessPeach(380, 40, 40, "princesspeach")
	platformWin = new c_special(415, 75, 115, 18, 0, "platformladderbeamwin")
	ladderWin = new Ladders(440, 123, 55, 100, "ladderwin")
	ladder1 = new Ladders(770, 253, 75, 135, "ladder1")
	ladder2 = new Ladders(225, 393, 60, 115, "ladder2")
	ladder3 = new Ladders(770, 523, 60, 115, "ladder3")
	ladder4 = new Ladders(225, 657, 60, 125, "ladder4")
	ladder5 = new Ladders(770, 797, 60, 123, "ladder5")
	//mario = new c_player(vp_width / 100 * 20, vp_height/100 * 90, 40, 40, "mario");
	mario = new c_player(340, 835, 30, 30, "mario");
	dk = new standstill( 130, 138, 40, 40);

	


	Matter.Events.on(engine, 'collisionEnd', collisions)
	Matter.Events.on(engine, 'collisionStart', collisionLadder)


	
	
	/*const row1 = [(new Platform(vp_width / 100 * 3, 170, vp_width / 100 * 50, vp_height / 100 * 2, 0))], (new Platform(vp_width / 100 * 53, 153.75, vp_width / 100 * 35, vp_height / 100 * 2, 0.025))];  
	const row2 = [(new Platform(vp_width -(vp_width / 100 * 88.5), 318, vp_width / 100 * 29, vp_height / 100 * 2, -0.010)), (new Platform(vp_width -(vp_width / 100 * 60.5), 315.5, vp_width / 100 * 29, vp_height / 100 * 2, -0.005)), (new Platform(vp_width - (vp_width / 100 * 32), 325, vp_width / 100 * 29, vp_height / 100 * 2, -0.015))];
	const row3 = [(new Platform(vp_width / 100 * 3, 465, vp_width / 100 * 29, vp_height / 100 * 2, 0.04)), (new Platform(vp_width -(vp_width / 100 * 68.25), 465, vp_width / 100 * 29, vp_height / 100 * 2, 0.04)), (new Platform(vp_width -(vp_width / 100 * 39.25), 465, vp_width / 100 * 29, vp_height / 100 * 2, 0.04))]
	const row4 = [(new Platform(vp_width -(vp_width / 100 * 89.5), 647.5, vp_width / 100 * 29, vp_height / 100 * 2, -0.010)), (new Platform(vp_width -(vp_width / 100 * 60.5), 645, vp_width / 100 * 29, vp_height / 100 * 2, -0.005)), (new Platform(vp_width - (vp_width / 100 * 32), 655, vp_width / 100 * 29, vp_height / 100 * 2, -0.015))];
	const row5 = [(new Platform(vp_width / 100 * 3, 800, vp_width / 100 * 29, vp_height / 100 * 2, 0.01)), (new Platform(vp_width -(vp_width / 100 * 68.25), 800, vp_width / 100 * 29, vp_height / 100 * 2, 0.01)), (new Platform(vp_width -(vp_width / 100 * 39.25), 800, vp_width / 100 * 29, vp_height / 100 * 2, 0.01))]
	*/
	//land.push(row1)
		//, row2, row3, row4, row5);
	
	//Matter.Body.applyForce(ball.body, ball.body.position, {x: 12, y:0});

	

}

setInterval(() => {
	if(!isMenuActive) {
		if (removeBall != null) {
			balls[removeBall] = new c_fuzzball(50, 10, 33, "ball" + (removeBall + 1))
			removeBall = null;
		} else {
			balls.push(new c_fuzzball(90, 10, 33, "ball" + (balls.length + 1)))}
}}, 3000);

function ladderConfirmation (label) {
	switch(label) {
		case "1":
			platform1[1].removeBody = true;
			break;
		case "2":
			platform2[0].removeBody = true;
			break;
		case "3":
			platform3[1].removeBody = true;
			break;
		case "4":
			platform4[0].removeBody = true;
			break;
		case "5":
			platform5[1].removeBody = true;
			break;
		default:
			platformWin.removeBody = true;	
	}

}

function removePlatform(labelId) {
	switch(labelId) {
		case "1":
			platform1[1].remove();
			ladder1.increaseScore()
			break;
		case "2":
			ladder2.increaseScore()
			platform2[0].remove();
			break;
		case "3":
			ladder3.increaseScore()
			platform3[1].remove();
			break;
		case "4":
			ladder4.increaseScore()
			platform4[0].remove();
			break;
		case "5":
			ladder5.increaseScore()
			platform5[1].remove();
			break;
		default:
			ladderWin.increaseScore()
			platformWin.remove();
	}

}

function gameDeath () {
	isMenuActive = true;
	let startMenu = document.getElementById("start")
	let menu = document.getElementById("menu")
	let loseText = document.getElementById("losetext")
	const scoreToDisplay = document.getElementById("score");
	scoreToDisplay.innerHTML = "Score: " + score;
	scoreToDisplay.style.display = "block";	
	startMenu.innerHTML = "Restart"
	loseText.style.display = "block"
	menu.style.display = "block" 		
}

function collisionLadder(event) {
	//runs as part of the matter engine after the engine update, provides access to a list of all pairs that have ended collision in the current frame (if any)
	event.pairs.forEach((collide) => { //event.pairs[0].bodyA.label

		if(
			(collide.bodyA.label == "mario" && collide.bodyB.label == "princesspeach") ||
			(collide.bodyA.label == "princesspeach" && collide.bodyB.label == "mario")
		) {
			score += 800;
			isMenuActive = true;
			let start = document.getElementById("start");
			let menu = document.getElementById("menu");
			let winText = document.getElementById("wintext");
			const scoreToDisplay = document.getElementById("score");
			scoreToDisplay.innerHTML = "Score: " + score;
			scoreToDisplay.style.display = "block";		
			start.innerHTML = "Restart";
			menu.style.display = "block";
			winText.style.display = "block";
 
		}	 
	
		if(
			(collide.bodyA.label === "mario" && collide.bodyB.label.slice(0,6) === "ladder") ||
			(collide.bodyA.label.slice(0,6) === "ladder" && collide.bodyB.label === "mario")
		) {
			if (collide.bodyA.label.slice(0,6) == "ladder") {

				ladderConfirmation(collide.bodyA.label.slice(6))

			} else {

				ladderConfirmation(collide.bodyB.label.slice(6)) 

			}
			mario.ladderCollision = true;				
		};
		

		if(
			(collide.bodyA.label == "mario" && collide.bodyB.label.slice(0, 18) == "platformladderbeam") ||
			(collide.bodyA.label.slice(0,18) == "platformladderbeam" && collide.bodyB.label == "mario")
		) {
			if (collide.bodyA.label.slice(0,18) == "platformladderbeam") {
				removePlatform(collide.bodyA.label.slice(18))
			} else {
				removePlatform(collide.bodyB.label.slice(18))
			}
			//setTimeout(platform1[1].addBody, 100)
		};


		if(
			(collide.bodyA.label == "mario" && collide.bodyB.label.slice(0, 4) == "ball") ||
			(collide.bodyA.label.slice(0, 4) == "ball" && collide.bodyB.label == "mario")
		) {
			gameDeath();					
		};
		if(
			(collide.bodyA.label == "mario" && collide.bodyB.label == "villain") ||
			(collide.bodyA.label == "villain" && collide.bodyB.label == "mario")
		) {
			gameDeath();					
		};
	});
}

function collisions(event) {
	//runs as part of the matter engine after the engine update, provides access to a list of all pairs that have ended collision in the current frame (if any)
	event.pairs.forEach((collide) => { //event.pairs[0].bodyA.label
	

		// if(


		// ){


		// }


		if(
			(collide.bodyA.label.slice(0, 4) == "ball" && collide.bodyB.label == "rightwall") ||
			(collide.bodyA.label == "rightwall" && collide.bodyB.label.slice(0, 4) == "ball")
		) {
			if (collide.bodyA.label.slice(0, 4) === "ball") {
				balls[parseInt(collide.bodyA.label.slice(4)) - 1].collisionRightWall()
			} else {			
				balls[parseInt(collide.bodyB.label.slice(4)) - 1].collisionRightWall()
			}

		}

		if(
			(collide.bodyA.label.slice(0, 4) == "ball" && collide.bodyB.label == "leftwall") ||
			(collide.bodyA.label == "leftwall" && collide.bodyB.label.slice(0, 4) == "ball")
		) {
			if (collide.bodyA.label.slice(0, 4) === "ball") {
				balls[parseInt(collide.bodyA.label.slice(4)) - 1].collisionLeftWall()
			} else {
				balls[parseInt(collide.bodyB.label.slice(4)) - 1].collisionLeftWall()
			}
		}


		if(
			(collide.bodyA.label == "mario" && collide.bodyB.label.slice(0,6) == "ladder") ||
			(collide.bodyA.label.slice(0,6) == "ladder" && collide.bodyB.label == "mario")
		) {
			mario.ladderCollision = false;

	
		}

		if(
			(collide.bodyA.label == "mario" && collide.bodyB.label.slice(0, 18) == "platformladderbeam") ||
			(collide.bodyA.label.slice(0, 18) == "platformladderbeam" && collide.bodyB.label == "mario") && platform1.removeBody === true
		) {
			
		}

				




	});
}

function marioColour (e) {
	switch(e.target.id) {
		case "black":
			mColour = "#000000";
			break;
		case "white":
			mColour = "#ffffff";
			break;
		case "red":
			mColour = "ff0000"	
	}
}

function paint_assets() {
	//a defined function to 'paint' assets to the canvas
	textSize(30);
	fill('#ff0000')
	text("Score: " + score, 700, 25)//INCLUDE WITHIN THE PAINT ASSESTS FUNCTION 

}

environment.addEnvObj(environment._platforms, land);

function keyPressed() {                            //PUT KEYPRESSES FUCNTION AFTER SETUP FUNCTION, DO NOT PUT WITHIN DRAW FUNCTION
	if (keyCode === 32 && canjump == true) {
		mario.space()
		canjump = false
		setTimeout(
			()=>{
				canjump = true //Creating a timeout so the block can only jump once ever seconf
			},1000
		)
	}	
}


function start () {
	balls.push(new c_fuzzball(50, 10, 30, "ball1"))
	isMenuActive = false;
	setup();
	mario.colour = mColour;
	// balls.length = 0;
	removeAllBalls(balls);
	balls = [];
	setTimeout(() => {
		mario.gameStarted = true;
		Matter.World.add(world, mario.body)


	}, 11000)
	const menu = document.getElementById("menu")
	menu.style.display = "none";
	const gameHeading = document.getElementById("gameHeading");
	gameHeading.style.display = "none";
	score = 0

}


function draw() {
	//a 'p5' defined function that runs automatically and continously (up to your system's hardware/os limit) and based on any specified frame rate
	environment.paint_background();
	paint_assets();
	ground.show();
	platform1[0].show()
	platform1[1].show()
	platform2[0].show()
	platform2[1].show()
	platform3[0].show()
	platform3[1].show()
	platform4[0].show()
	platform4[1].show()
	platform5[0].show()
	platform5[1].show()
	platformWin.show()
	ladderWin.show()
	ladder1.show()
	ladder2.show()
	ladder3.show()
	ladder4.show()
	ladder5.show()

	princessPeach.show()
	//bowser.show()
	if (!isMenuActive) {
		mario.show()
	}
	dk.show()
	//mario.body.angle = 0;
	var isPressed = false;
	if (keyManager[37]){ //left arrow
		isPressed = true;
		mario.left();
		direction = DIR_LEFT;
	}    
	if (keyManager[39]) { //right arrow
		isPressed = true;
		mario.right();
		direction = DIR_RIGHT;
	}

	if (mario.ladderCollision) {
		if (keyManager[38]) {
			isPressed = true;
			mario.up();
			direction = DIR_NONE;
		}	
	}	
	
	if(!isPressed){
		mario.stop();
	}
	rightWall.show()
	leftWall.show()
	if(!isMenuActive) {
		for(let x = 0; x < balls.length; x++) {
			try {
				balls[x].show();
			} catch (e) {
				start()
			}	
			if (balls[x].body.position.y > vp_height) {
				removeBall = x;
			}
		}

	}
	//checks if mario fell of the map!
	mario.offMap()

    //the engine for the game will only run when is active is false
	if(!isMenuActive){
		Matter.Engine.update(engine);
	}else{

	}
} 
var keyManager = {};       //PUT THIS RIGHT AT THE END OF THE CODE- ALLOWS KEYS TO WORK
window.addEventListener("keydown", (event) => { keyManager[event.keyCode] = true; });
window.addEventListener("keyup", (event) => { keyManager[event.keyCode] = false; });
