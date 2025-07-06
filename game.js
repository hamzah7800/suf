let scene, camera, renderer;
let player;
let lanes = [-2, 0, 2];
let currentLane = 1;
let targetX = 0;
let obstacles = [];
let groundSpeed = 0.1;
let isJumping = false;
let jumpSpeed = 0;
let gravity = -0.01;
let score = 0;
let isGameOver = false;

let scoreDisplay = document.getElementById("score");
let menu = document.getElementById("menu");
let startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", startGame);

let manager = nipplejs.create({
  zone: document.body,
  mode: 'static',
  position: { left: '50%', bottom: '20%' },
  color: 'white'
});

manager.on('dir', function(evt, data) {
  if(isGameOver) return;

  if(data.direction.angle === "left" && currentLane > 0) {
    currentLane--;
    targetX = lanes[currentLane];
  }
  if(data.direction.angle === "right" && currentLane < 2) {
    currentLane++;
    targetX = lanes[currentLane];
  }
  if(data.direction.angle === "up" && !isJumping) {
    isJumping = true;
    jumpSpeed = 0.2;
  }
});

function startGame() {
  menu.style.display = "none";
  score = 0;
  isGameOver = false;
  obstacles = [];
  scene = null;
  init();
  animate();
}

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

  const groundGeometry = new THREE.PlaneGeometry(10, 200);
  const groundMaterial = new THREE.MeshBasicMaterial({color: 0x555555});
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI/2;
  ground.position.z = -100;
  scene.add(ground);

  const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
  const playerMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
  player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.y = 1;
  player.position.x = lanes[currentLane];
  targetX = lanes[currentLane];
  scene.add(player);

  for (let i = 0; i < 3; i++) {
    spawnTrain();
  }

  document.addEventListener('keydown', onKeyDown);
}

function spawnTrain() {
  const trainGeometry = new THREE.BoxGeometry(1.5, 2, 4);
  const trainMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
  const train = new THREE.Mesh(trainGeometry, trainMaterial);
  train.position.set(
    lanes[Math.floor(Math.random() * 3)],
    1,
    -Math.random() * 50 - 10
  );
  scene.add(train);
  obstacles.push(train);
}

function onKeyDown(event) {
  if(isGameOver) return;

  if(event.key === 'ArrowLeft' && currentLane > 0){
    currentLane--;
    targetX = lanes[currentLane];
  }
  if(event.key === 'ArrowRight' && currentLane < 2){
    currentLane++;
    targetX = lanes[currentLane];
  }
  if(event.key === ' ' && !isJumping) {
    isJumping = true;
    jumpSpeed = 0.2;
  }
}

function animate() {
  if(isGameOver) return;

  requestAnimationFrame(animate);

  // smooth lane movement
  player.position.x += (targetX - player.position.x) * 0.1;

  // jump physics
  if (isJumping) {
    player.position.y += jumpSpeed;
    jumpSpeed += gravity;
    if (player.position.y <= 1) {
      player.position.y = 1;
      isJumping = false;
    }
  }

  // move trains
  obstacles.forEach(obs => {
    obs.position.z += groundSpeed * 5;
    if(obs.position.z > 5) {
      obs.position.z = -Math.random() * 50 - 10;
      obs.position.x = lanes[Math.floor(Math.random() * 3)];
    }

    // collision detection
    if (
      Math.abs(obs.position.z - player.position.z) < 2 &&
      Math.abs(obs.position.x - player.position.x) < 1 &&
      player.position.y < 2
    ) {
      endGame();
    }
  });

  // update score
  score += 1;
  scoreDisplay.textContent = `Score: ${score}`;

  renderer.render(scene, camera);
}

function endGame() {
  isGameOver = true;
  menu.style.display = "flex";
  menu.innerHTML = `<h1>Game Over</h1><p>Score: ${score}</p><button id="restartBtn">Play Again</button>`;
  document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload();
  });
}
