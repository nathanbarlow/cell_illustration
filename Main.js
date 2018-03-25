
//Matter.js Engine
var Engine = Matter.Engine,
	Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine = Engine.create();

var render = Render.create({
                element: document.body,
                engine: engine,
                options: {
                    width: 800,
                    height: 400,
                    wireframes: false
                }
             });

//SET WORLD GRAVITY
engine.world.gravity.y = 0;

//Add Cell Wall
var cellWall = new CellWall();

//ADD Lists for Vesicles and Organelles
var vesicles = [];
var organelles = [];

//ADD Organelle
var org1 = new Organelle({
			x: 400,
			y: 200,
			radius: 20,
		});

var org2 = new Organelle({
			x: 400,
			y: 300,
			radius: 30,
		});

var ves1 = new Vesicle({
			x: 200,
			y: 200,
			radius: 10,
			timeToTarget: 2000, //milliseconds
			target: org1,
		});

//DEFINE VESICLES GOING BETWEEN
// var relationships = new Relationships(
//   [
//     //Vesicles coming from org1
//     {releaseObj: org1, targetObj: cellWall, frequency: 100, speed: 4, color: 0x0000ff, radius: 30, arc: 0},
//     {releaseObj: org1, targetObj: org2, frequency: 100, speed: 6, color: 0x0000ff, radius: 10, arc: 150},
//
//     //Vesicles coming from org2
//     {releaseObj: org2, targetObj: org1, frequency: 100, speed: 4, color: 0x00ff00, radius: 25},
//     {releaseObj: org2, targetObj: cellWall, frequency: 230, speed: 6, color: 0x00ff00, radius: 15, arc:0},
//
//     //Vesicles coming from org3
//     {releaseObj: org3, targetObj: cellWall, frequency: 50, speed: 7, color: 0xff0000, radius: 15, arc: 0},
//   ]
// );

var now, delta;
var then = new Date().getTime();

Engine.run(engine);
Render.run(render);
animate();


//FUNCTIONS

function animate(){
	now = new Date().getTime();
	delta = now - then;
	// console.log(delta);

	//Update each vesicle
	for (i = 0; i < vesicles.length; i++) {
		vesicles[i].update();

		//remove inactive vesicles from list
		if (vesicles[i].status == "inactive"){
			vesicles.splice(i, 1);
			i -= 1;
		}
	};

	//Update TWEEN - updates all tween animations
	TWEEN.update();

	then = now;
	requestAnimationFrame( animate );
}


function calcSpeed(del, speed) {
	return (speed * del) * (60 / 1000)//frames/millisecond;
}

function degToRad (numb) {
  return numb * Math.PI / 180
}
