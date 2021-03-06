
//RENDERER
var renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myCanvas'), antialias: true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor('white');
renderer.localClippingEnabled = true;


//SCENE
scene = new THREE.Scene();

//ADD FRAME COUNTING VARIABLE
scene.frameCount = 0;

//LIGHTING
var light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

var light1 = new THREE.PointLight(0xffffff, 0.8);
scene.add(light1);
light1.position.set(500, 200, -500);

var light2 = new THREE.PointLight(0xffffff, 0.5);
scene.add(light2);
light2.position.set(-500, 200, -500);


//------- CELL WALL TEMPLATE ---------
function CellWall() {
  var wallGeometry = new THREE.BoxGeometry(10, 300, 1500);
  var wallMaterial = new THREE.MeshLambertMaterial({
    color: 0xfffaf,
    side: THREE.DoubleSide,
  });

  this.mesh = new THREE.Mesh(wallGeometry, wallMaterial);

  this.init = function() {
    this.mesh.position.set(200, 0, 0);

    scene.add( this.mesh );
  };

  this.init();
};

//Add Cell Wall
var cellWall = new CellWall();

//Add Plane at Wall Location
var plane = new THREE.Plane( new THREE.Vector3(-1, 0, 0), cellWall.mesh.position.x)


//ADD Lists for Vesicles and Organelles
var vesicles = [];
var organelles = [];


//------- ORGANELLE TEMPLATE ---------
function Organelle(startPosition = {x:0, y:0, z:0}, radius = 150, color = 0x35faa, transparent = true) {
  //[{target: cellWall, frequency: 400, speed: 4, color: 0xff0000, radius: 25}]
  //VARIABLES
  var organelleGeometry = new THREE.SphereGeometry(radius, 32, 32);
  var organelleMaterial = new THREE.MeshLambertMaterial({
    color: color,
    transparent: transparent,
    opacity: 0.5,
  });

  //PROPERTIES
  this.startPosition = startPosition;
  this.mesh = new THREE.Mesh(organelleGeometry, organelleMaterial);

  //METHODS
  this.update = function() {
    this.move();
  };

  this.move = function() {
      //No movement yet
  };

  this.init = function() {
    this.mesh.position.set(
      this.startPosition.x,
      this.startPosition.y,
      this.startPosition.z
    );

    //Add to vesicles List
    organelles.push(this);

    scene.add( this.mesh );
  };
  //INITIALIZE
  this.init();
}


//-------- VESICLE TEMPLATE ------------
function Vesicle(parentObj, targetObj, speed = 4, color = 0xff0000, radius = 25, arc = 75) {
  //Input a parent object which will give the vesicle a start location,
  //a target object which the vesicle moves towards, optionally set the
  //speed, color and radius to something different.

  //VARIABLES
  var vesicleGeometry = new THREE.SphereGeometry(radius, 12, 12);
  var vesicleMaterial = new THREE.MeshLambertMaterial({
    color: color,
    // clippingPlanes: [ plane ],
  });
  var lineMaterial = new THREE.LineBasicMaterial( { color : 0xff0000 } );

  //PROPERTIES
  this.mesh = new THREE.Mesh(vesicleGeometry, vesicleMaterial);
  this.parent = parentObj;
  this.speed = speed;
  this.targetObj = targetObj;
  this.target = null;
  this.trajectoryMesh = new THREE.Line();
  this.trajectory = new THREE.QuadraticBezierCurve3();
  this.trajectoryPosition = 0;
  this.controlObject = new THREE.Object3D();
  this.controlPoint = new THREE.Vector3(0,0,0);
  this.arc = arc;

  //METHODS
  this.setTarget = function( newTarget ) {
    this.targetObj = newTarget;

    //Special target if cellWall is the targetObj
    if (this.targetObj == cellWall){
      this.target = new THREE.Vector3(
                this.targetObj.mesh.position.x,
                this.parent.mesh.position.y,
                this.parent.mesh.position.z );
    } else {
      this.target = this.targetObj.mesh.position;
    }

    this.mesh.lookAt(this.target);
  };

  this.updateTrajectory = function() {
    // scene.remove(this.trajectoryMesh);

    //set control Point right between parent and target positions
    this.controlPoint.lerpVectors ( this.parent.mesh.position, this.target, .5 );

    //ser controlObject to controlPoint position
    this.controlObject.position.x = this.controlPoint.x;
    this.controlObject.position.y = this.controlPoint.y;
    this.controlObject.position.z = this.controlPoint.z;

    //Transfrom controlObject to
    this.controlObject.lookAt(this.parent.mesh.position);
    this.controlObject.translateX(this.arc);

    //set controlPoint to new controlObject position
    this.controlPoint.x = this.controlObject.position.x ;
    this.controlPoint.y = this.controlObject.position.y ;
    this.controlPoint.z = this.controlObject.position.z ;

    //Create line along trajectory
    this.trajectory.v0 = this.parent.mesh.position;          //start point
    this.trajectory.v1 = this.controlPoint;                  //control point
    this.trajectory.v2 = this.target;                        //end point


    // let points = this.trajectory.getPoints( 20 );
    // let lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
    //
    // //Create the final object to add to the scene
    // this.trajectoryMesh.geometry = lineGeometry;
    // this.trajectoryMesh.material = lineMaterial;
    //
    // scene.add(this.trajectoryMesh);
  };

  this.update = function(){
    //Delete vesicle once distance to target is less than 5 units
    if (this.mesh.position.distanceTo(this.target) < 5) {
      this.delete();
    }

    //Update trajectory
    this.updateTrajectory();

    //calculate position adjustment to make based on this.speed
    let adjustment = this.speed/this.trajectory.getLength();
    this.trajectoryPosition += adjustment;

    //find the vector3 position along the curve trajectory
    let newPosition = this.trajectory.getPoint(this.trajectoryPosition);

    //set vesicle position to this newPosition
    this.mesh.position.x = newPosition.x;
    this.mesh.position.y = newPosition.y;
    this.mesh.position.z = newPosition.z;

  };

  this.delete = function() {
    scene.remove( this.mesh );
    scene.remove( this.trajectoryMesh );
    delete this;
  };

  this.init = function() {
    //set the vesicle's position its parent's current position
    this.mesh.position.set(
      this.parent.mesh.position.x,
      this.parent.mesh.position.y,
      this.parent.mesh.position.z
    );

    //if targetObj is cellWall only use objects x position

    //Set vesicle to point towards target
    this.setTarget(targetObj);

    //Add to vesicles List
    vesicles.push(this);

    //Add the vesicle's mesh to the scene
    scene.add( this.mesh );

    //ADD trajectory
    this.updateTrajectory();
  };

  //INITIALIZE Vesicle
  this.init();
}


//-------- RELATIONSHIPS TEMPLATE ------------
function Relationships(sendList){
  this.sendList = sendList;

  this.sendVesicles = function(){

    //Loop through each object this Organelle sends vesicles to
    for (i = 0; i < this.sendList.length; i++) {

      //if the scene.frameCount is divisable by the frequency rate specified
      //for that relationship then release the vesicle
      if (scene.frameCount % sendList[i].frequency == 0){
        var vesicle = new Vesicle(
          sendList[i].releaseObj,
          sendList[i].targetObj,
          sendList[i].speed,
          sendList[i].color,
          sendList[i].radius,
          sendList[i].arc
        );
      }
    }
  };

  this.update = function() {
    this.sendVesicles();
  };
}


//ADD Organelle (position, radius, color, transparency)
var org1 = new Organelle(new THREE.Vector3(-1000, 0, 200), 200, 0x35faa, false );
var org2 = new Organelle(new THREE.Vector3(-500, 0, -600), 250, 0xffff00);
var org3 = new Organelle(new THREE.Vector3(-500, 0, 600), 300, 0x00ffff);

//DEFINE VESICLES GOING BETWEEN
var relationships = new Relationships(
  [
    //Vesicles coming from org1
    {releaseObj: org1, targetObj: cellWall, frequency: 100, speed: 4, color: 0x0000ff, radius: 30, arc: 0},
    {releaseObj: org1, targetObj: org2, frequency: 100, speed: 6, color: 0x0000ff, radius: 10, arc: 150},

    //Vesicles coming from org2
    {releaseObj: org2, targetObj: org1, frequency: 100, speed: 4, color: 0x00ff00, radius: 25},
    {releaseObj: org2, targetObj: cellWall, frequency: 230, speed: 6, color: 0x00ff00, radius: 15, arc:0},

    //Vesicles coming from org3
    {releaseObj: org3, targetObj: cellWall, frequency: 50, speed: 7, color: 0xff0000, radius: 15, arc: 0},
  ]
);


//CAMERA
camera = new THREE.PerspectiveCamera( 45.0, window.innerWidth / window.innerHeight, 0.1, 50000 );
var width = 4000;
var height = 6000;
// camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 50000 );
camera.position.set( 0, 3000, 0 );

//Extnending Camera Object Properties and Methods
camera.followObj = cellWall.mesh;
// camera.offset = new THREE.Vector3 (0, 600, 2000);

//Set Camera's Initial Facing
camera.lookAt( new THREE.Vector3(0,0,0) );

// camera.update = function(){
//   camera.lookAt( camera.followObj.position );
// }



//ADD MOVEMENT CONTROLS
controls = new THREE.OrbitControls( camera );
controls.target.set( 0, 0, 0);
controls.update();
controls.enabled = true;


// ADD GUI
// var gui = new dat.GUI(),
//       	folderLocal = gui.addFolder( 'Speed Control' ),
//       	propsLocal = {
//       		get 'Speed'() { return vesicle.speed; },
//       		set 'Speed'( v ) { vesicle.speed = v; },
//       	};
//
// folderLocal.add( propsLocal, 'Speed', 0.5, 3 );


//RENDER LOOP
requestAnimationFrame(render);

function render() {
  //Increase frameCount
  scene.frameCount += 1;

  //Update Vesicles and Organelles
  for (k = 0; k < vesicles.length; k++){
    vesicles[k].update();
    // console.log(vesicles[i].mesh.position);
  }

  for (j = 0; j < organelles.length; j++){
    organelles[j].update();
  }

  relationships.sendVesicles();

  //Render scene
	renderer.render(scene, camera);

	//Run Render
  requestAnimationFrame(render);


}

//FUNCTIONS
function degToRad (numb) {
  return numb * Math.PI / 180
}
