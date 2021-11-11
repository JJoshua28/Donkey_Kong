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



const vp_width = window.innerWidth, vp_height = window.innerHeight; //defined global const variables to hold the (vp) details (e.g., size, etc.)
var engine, world, body; //defined global variables to hold the game's viewport and the 'matter' engine components
var viewport;
let ground = null;
let ball;
const land = [];

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
			console.log(true);
			console.log(item)
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
		translate(this.width / 2, this.height / 2)
		rotate(this.body.angle)
		fill('#00ff00'); //set tXhe fill colour
		noStroke();
		rectMode(CENTER)
		rect(this.x, this.y, this.width, this.height); //draw the rectangle
		pop();
	}	
}

class c_fuzzball {
	constructor(x, y, diameter) {
		let options = {
			restitution: 1,
			friction: 0.005,
			density: 0.95,
			frictionAir: 0.005,
		}
		this.body = Matter.Bodies.circle(x, y, diameter/2, options); //matter.js used radius rather than diameter
		Matter.World.add(world, this.body);
		
		this.x = x;
		this.y = y;
		this.diameter = diameter;
	}

	body() {
		return this.body;
	}

	show() {
		let pos = this.body.position;
		let angle = this.body.angle;

		push(); //p5 translation 
			translate(pos.x, pos.y);
			rotate(angle);
			fill('#ff0000');
			ellipseMode(CENTER); //switch centre to be centre rather than left, top
			circle(0, 0, this.diameter);
		pop();
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


function setup() {
	//a 'p5' defined function runs automatically once the preload function is complete
	viewport = createCanvas(vp_width, vp_height); //set the viewport (canvas) size
	viewport.parent("viewport_container"); //attach the created canvas to the target div
	
	//enable the matter engine
	engine = Matter.Engine.create(); //the 'engine' is a controller that manages updating the 'simulation' of the world
	world = engine.world; //the instance of the world (contains all bodies, constraints, etc) to be simulated by the engine
	body = Matter.Body; //the module that contains all 'matter' methods for creating and manipulating 'body' models a 'matter' body 
	//is a 'rigid' body that can be simulated by the Matter.Engine; generally defined as rectangles, circles and other polygons)
	Matter.Engine.run(engine);
	frameRate(60); //specifies the number of (refresh) frames displayed every second
	ground = new Floor(vp_width / 2, vp_height - 25, vp_width, vp_height / 100 * 4);
	ball = new c_fuzzball(vp_width / 100 * 5, 160, 10);
	const row1 = [(new Platform(vp_width / 100 * 3, 170, vp_width / 100 * 50, vp_height / 100 * 2, 0)), (new Platform(vp_width / 100 * 53, 153.75, vp_width / 100 * 35, vp_height / 100 * 2, 0.025))];  
	const row2 = [(new Platform(vp_width -(vp_width / 100 * 88.5), 318, vp_width / 100 * 29, vp_height / 100 * 2, -0.010)), (new Platform(vp_width -(vp_width / 100 * 60.5), 315.5, vp_width / 100 * 29, vp_height / 100 * 2, -0.005)), (new Platform(vp_width - (vp_width / 100 * 32), 325, vp_width / 100 * 29, vp_height / 100 * 2, -0.015))];
	const row3 = [(new Platform(vp_width / 100 * 3, 465, vp_width / 100 * 29, vp_height / 100 * 2, 0.04)), (new Platform(vp_width -(vp_width / 100 * 68.25), 465, vp_width / 100 * 29, vp_height / 100 * 2, 0.04)), (new Platform(vp_width -(vp_width / 100 * 39.25), 465, vp_width / 100 * 29, vp_height / 100 * 2, 0.04))]
	const row4 = [(new Platform(vp_width -(vp_width / 100 * 89.5), 647.5, vp_width / 100 * 29, vp_height / 100 * 2, -0.010)), (new Platform(vp_width -(vp_width / 100 * 60.5), 645, vp_width / 100 * 29, vp_height / 100 * 2, -0.005)), (new Platform(vp_width - (vp_width / 100 * 32), 655, vp_width / 100 * 29, vp_height / 100 * 2, -0.015))];
	const row5 = [(new Platform(vp_width / 100 * 3, 800, vp_width / 100 * 29, vp_height / 100 * 2, 0.01)), (new Platform(vp_width -(vp_width / 100 * 68.25), 800, vp_width / 100 * 29, vp_height / 100 * 2, 0.01)), (new Platform(vp_width -(vp_width / 100 * 39.25), 800, vp_width / 100 * 29, vp_height / 100 * 2, 0.01))]
	land.push(row1, row2, row3, row4, row5);


}

function paint_assets() {
	//a defined function to 'paint' assets to the canvas
}

environment.addEnvObj(environment._platforms, land);

function draw() {
	//a 'p5' defined function that runs automatically and continously (up to your system's hardware/os limit) and based on any specified frame rate
	environment.paint_background();
	ground.show();
	land[0][0].show()
	land[0][1].show()
	land[1][0].show()
	land[1][1].show()
	land[1][2].show()
	land[2][0].show()
	land[2][1].show()
	land[2][2].show()
	land[3][0].show()
	land[3][1].show()
	land[3][2].show()
	land[4][0].show()
	land[4][1].show()
	land[4][2].show()
	ball.show()
} 
