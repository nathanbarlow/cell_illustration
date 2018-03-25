//This is the function defining the Organelle Object

function Organelle(orgOptions) {
  // (startPosition = {x:0, y:0}, radius = 150, color = 0x35faa, transparent = true)

  //PROPERTIES
  this.body = null;

  //INITIALIZE FUNCTION
  this.init = function() {
    //VARIABLES
  	this.body = Bodies.circle(orgOptions.x, orgOptions.y, orgOptions.radius);
    World.add(engine.world, this.body);

    //Add to vesicles List
    organelles.push(this);
  };

  //METHODS
  this.update = function() {
    this.move();
  };

  //INITIALIZE
  this.init();
}
