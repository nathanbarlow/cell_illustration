function CellWall() {

  //Metter.js rectangle creation
  var cellWallMesh = Bodies.rectangle(50, 200, 20, 350);

  World.add(engine.world, cellWallMesh);
};
