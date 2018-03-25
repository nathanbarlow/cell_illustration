function Vesicle(vesOptions) {
  //(parentObj, targetObj, speed = 4, color = 0xff0000, radius = 25, arc = 75)

  //Input a parent object which will give the vesicle a start location,
  //a target object which the vesicle moves towards, optionally set the
  //speed, color and radius to something different.

  //PROPERTIES
  this.body = null;
  this.tween = null;
  this.status = "active";
  this.target = vesOptions.target;
  this.time = vesOptions.timeToTarget;

  //METHODS
  this.update = function(){
    if(distance(this.body.position, org1.body.position) <= 5){
      this.tween.stop();
      this.remove();
    };
  };

  this.remove = function() {
    //remove from Matter.js engine
    World.remove(engine.world, this.body);
    this.status = "inactive";
    ;
  }

  this.init = function() {
    //Add to vesicles List
    vesicles.push(this);

    //Create Matter.js object and add to world
  	this.body = Bodies.circle(vesOptions.x, vesOptions.y, vesOptions.radius);

    //make this body a sensor
    this.body.isSensor = true;

    //add body to Matter.js Engine
  	World.add(engine.world, this.body);

    //Create a Tween
    this.tween = new TWEEN.Tween(this.body.position);

    //Set destination
    this.tween.to(this.target.body.position, this.time);

    //Start Tween
    this.tween.start();

  };

  //INITIALIZE Vesicle
  this.init();
}

function distance(v1, v2) {
  var distance = 0;
  var dif = Matter.Vector.sub(v2, v1);
  dif = Math.sqrt(dif.x * dif.x + dif.y * dif.y);
  return dif;
}
