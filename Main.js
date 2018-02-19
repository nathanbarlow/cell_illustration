
//RENDERER
var renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myCanvas'), antialias: true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor('white');
renderer.localClippingEnabled = true;


//SCENE
scene = new THREE.Scene();


//LIGHTING
var light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

var light1 = new THREE.PointLight(0xffffff, 0.8);
scene.add(light1);
light1.position.set(500, 200, -500);

var light2 = new THREE.PointLight(0xffffff, 0.5);
scene.add(light2);
light2.position.set(-500, 200, -500);


//ADD WALL
var wallGeometry = new THREE.PlaneGeometry(400, 400);
var wallMaterial = new THREE.MeshLambertMaterial({
	color: 0xfffaf,
  side: THREE.DoubleSide,
});

var wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh.rotation.y = degToRad(90);
wallMesh.position.set(200, 0, 0);
scene.add( wallMesh );

//Add Plane at Wall Location
var plane = new THREE.Plane( new THREE.Vector3(-1, 0, 0), wallMesh.position.x)

//ADD LARGE SPHERE
var sphereGeometry = new THREE.SphereGeometry(150, 32, 32);
var sphereMaterial = new THREE.MeshLambertMaterial({
	color: 0x35faa,
});

var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.set(-200, 0, 0);
scene.add( sphereMesh );


//ADD SMALL SPHERE
var smallGeometry = new THREE.SphereGeometry(25, 16, 16);
var smallMaterial = new THREE.MeshLambertMaterial({
	color: 0xff0000,
  clippingPlanes: [ plane ],
});

var smallMesh = new THREE.Mesh(smallGeometry, smallMaterial);
smallMesh.position.set(-75, 0, 0);
scene.add( smallMesh );

//Extending SmallMesh Method and Properties
smallMesh.speed = 2;
smallMesh.update = function(){

  //Reset smallSphere position once past wall
  if (smallMesh.position.x - 25 >= wallMesh.position.x) {
    smallMesh.position.x = -75;
  }

  //Move smallSphere towards Wall
  smallMesh.position.x += smallMesh.speed;
};


//CAMERA
camera = new THREE.PerspectiveCamera( 45.0, window.innerWidth / window.innerHeight, 0.1, 50000 );

camera.position.set( 0, 600, -1000 );

//Extnending Camera Object Properties and Methods
camera.followObj = wallMesh;
// camera.offset = new THREE.Vector3 (0, 600, 2000);

//Set Camera's Initial Facing
camera.lookAt( camera.followObj.position );

// camera.update = function(){
//   camera.lookAt( camera.followObj.position );
// }



//ADD MOVEMENT CONTROLS
controls = new THREE.OrbitControls( camera );
controls.target.set( 0, 0, 0);
controls.update();
controls.enabled = true;


// ADD GUI
var gui = new dat.GUI(),
      	folderLocal = gui.addFolder( 'Speed Control' ),
      	propsLocal = {
      		get 'Speed'() { return smallMesh.speed; },
      		set 'Speed'( v ) { smallMesh.speed = v; },
      	};

folderLocal.add( propsLocal, 'Speed', 0.5, 3 );



//RENDER LOOP
requestAnimationFrame(render);

function render() {

  smallMesh.update();

  //Render scene
	renderer.render(scene, camera);

	//Run Render
  requestAnimationFrame(render);

}

//FUNCTIONS
function degToRad (numb) {
  return numb * Math.PI / 180
}
