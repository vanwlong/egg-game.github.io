const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// FULL MÀN HÌNH
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ground = canvas.height - 100;
const mapWidth = 4000;

let cameraX = 0;

// ===== PLAYER =====
let player = {
  x: 100,
  y: 0,
  w: 40,
  h: 60,
  vx: 0,
  vy: 0,
  speed: 5,
  jump: -12,
  gravity: 0.6,
  onGround: false,
  hp: 100,
  dir: 1,
  punch: 0,
  kick: 0
};

// ===== INPUT =====
let keys = {};

// PC
document.onkeydown = e => {
  let k = e.key.toLowerCase();
  keys[k] = true;

  if (k === "j") player.punch = 10;
  if (k === "k") player.kick = 15;

  if (k === "w" && player.onGround) {
    player.vy = player.jump;
    player.onGround = false;
  }
};

document.onkeyup = e => {
  keys[e.key.toLowerCase()] = false;
};

// MOBILE BUTTON
function press(key) { keys[key] = true; }
function release(key) { keys[key] = false; }

// ===== ENEMY =====
let enemies = [];
let deadEnemies = [];

function spawnEnemy(x) {
  enemies.push({ x: x, y: ground - 50, hp: 50 });
}

// spawn nhiều quái
for (let i = 500; i < 3500; i += 300) {
  spawnEnemy(i);
}

// ===== PLATFORM =====
let platforms = [
  { x: 600, y: ground - 100, w: 120, h: 10 },
  { x: 1200, y: ground - 150, w: 150, h: 10 },
  { x: 2000, y: ground - 120, w: 150, h: 10 }
];

// ===== UPDATE =====
function update() {
  // DI CHUYỂN
  if (keys["a"]) { player.vx = -player.speed; player.dir = -1; }
  else if (keys["d"]) { player.vx = player.speed; player.dir = 1; }
  else player.vx = 0;

  player.vy += player.gravity;

  player.x += player.vx;
  player.y += player.vy;

  // GROUND
  if (player.y + player.h >= ground) {
    player.y = ground - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  // PLATFORM
  platforms.forEach(p => {
    if (
      player.x + player.w > p.x &&
      player.x < p.x + p.w &&
      player.y + player.h > p.y &&
      player.y + player.h < p.y + 20 &&
      player.vy >= 0
    ) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  });

  // CAMERA
  cameraX = player.x - canvas.width / 2;
  cameraX = Math.max(0, Math.min(mapWidth - canvas.width, cameraX));

  // COOLDOWN
  if (player.punch > 0) player.punch--;
  if (player.kick > 0) player.kick--;

  // ĐÁNH
  enemies.forEach(e => {
    let dx = Math.abs(player.x - e.x);
    if (dx < 50 && player.punch > 5) e.hp -= 1;
    if (dx < 50 && player.kick > 5) e.hp -= 2;
  });

  // CHẾT + HỒI SINH
  enemies.forEach((e, i) => {
    if (e.hp <= 0) {
      deadEnemies.push({ x: e.x, time: Date.now() });
      enemies.splice(i, 1);
    }
  });

  deadEnemies.forEach((d, i) => {
    if (Date.now() - d.time > 3000) {
      spawnEnemy(d.x);
      deadEnemies.splice(i, 1);
    }
  });
}

// ===== DRAW PLAYER =====
function drawPlayer() {
  let x = player.x - cameraX;
  let y = player.y;

  let swing = Math.sin(Date.now() / 100) * 5;

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(x + 20, y + 30, 18, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.fillRect(x + 12, y + 25, 5, 5);
  ctx.fillRect(x + 23, y + 25, 5, 5);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(x + 5, y + 30);
  ctx.lineTo(x - 10 + swing, y + 35);

  ctx.moveTo(x + 35, y + 30);
  ctx.lineTo(x + 50 - swing, y + 35);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 15, y + 58);
  ctx.lineTo(x + 10 + swing, y + 75);

  ctx.moveTo(x + 25, y + 58);
  ctx.lineTo(x + 30 - swing, y + 75);
  ctx.stroke();
}

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // nền
  ctx.fillStyle = "#444";
  ctx.fillRect(-cameraX, ground, mapWidth, 200);

  // platform
  ctx.fillStyle = "brown";
  platforms.forEach(p => {
    ctx.fillRect(p.x - cameraX, p.y, p.w, p.h);
  });

  drawPlayer();

  // quái
  enemies.forEach(e => {
    let x = e.x - cameraX;
    ctx.fillStyle = "green";
    ctx.fillRect(x, e.y, 40, 50);

    ctx.fillStyle = "red";
    ctx.fillRect(x, e.y - 10, e.hp, 5);
  });

  // UI
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, player.hp * 2, 10);

  // TEXT (3s)
  if (Date.now() < startTime + 3000) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("J: Đấm | K: Đá", 20, 60);
  }
}

let startTime = Date.now();

// LOOP
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
