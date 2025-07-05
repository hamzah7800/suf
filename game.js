// BASIC THREE.JS SETUP
let scene, camera, renderer;
let player, playerSpeed = 0.2;
let lanes = [-2, 0, 2]; // three lanes
let currentLane = 1; // center lane
let obstacles = [];
let groundSpeed = 0.1;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  camera.position.y = 3;
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // ground
  const groundGeometry = new THREE.PlaneGeometry(10, 200);
  const groundMaterial = new THREE.MeshBasicMaterial({color: 0x555555});
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI/2;
  ground.position.z = -100;
  scene.add(ground);

  // player
  const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
  const playerMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
  player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.y = 1;
  player.position.x = lanes[currentLane];
  scene.add(player);

  // sample obstacle
  const obsGeometry = new THREE.BoxGeometry(1, 2, 1);
  const obsMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
  const obstacle = new THREE.Mesh(obsGeometry, obsMaterial);
  obstacle.position.set(0, 1, -20);
  scene.add(obstacle);
  obstacles.push(obstacle);

  // controls
  document.addEventListener('keydown', onKeyDown);
}

function onKeyDown(event) {
  if(event.key === 'ArrowLeft' && currentLane > 0){
    currentLane--;
    player.position.x = lanes[currentLane];
  }
  if(event.key === 'ArrowRight' && currentLane < 2){
    currentLane++;
    player.position.x = lanes[currentLane];
  }
}

function animate() {
  requestAnimationFrame(animate);

  // move obstacles towards player
  obstacles.forEach(obs => {
    obs.position.z += groundSpeed * 5;
    if(obs.position.z > 5) {
      obs.position.z = -50; // respawn far away
      obs.position.x = lanes[Math.floor(Math.random()*3)];
    }

    // collision check
    if(Math.abs(obs.position.z - player.position.z) < 1.5 && 
       Math.abs(obs.position.x - player.position.x) < 1) {
      console.log("Collision!");
    }
  });

  renderer.render(scene, camera);
}
