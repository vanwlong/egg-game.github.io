const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

// ===== MAP =====
const mapWidth = 4000;
let cameraX = 0;

// ===== PLAYER =====
let player = {
  x: 100,
  y: 250,
  speed: 4,
  hp: 100,
  dir: 1,
  punch: 0,
  kick: 0,
  skill: 0
};

// ===== INPUT =====
let keys = {};

document.onkeydown = e => {
  let k = e.key.toLowerCase();
  keys[k] = true;

  if (k === "j" && player.punch <= 0) player.punch = 15;
  if (k === "k" && player.kick <= 0) player.kick = 20;
  if (k === "l" && player.skill <= 0) player.skill = 30;
};

document.onkeyup = e => {
  keys[e.key.toLowerCase()] = false;
};

// ===== ENEMY =====
let enemies = [
  { x: 800, y: 250, hp: 100 },
  { x: 1600, y: 250, hp: 100 },
  { x: 2500, y: 250, hp: 100 }
];

// ===== BULLETS =====
let bullets = [];

// ===== UPDATE =====
function update() {
  // movement
  if (keys["a"]) { player.x -= player.speed; player.dir = -1; }
  if (keys["d"]) { player.x += player.speed; player.dir = 1; }
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;

  // map limit
  player.x = Math.max(0, Math.min(mapWidth, player.x));
  player.y = Math.max(0, Math.min(canvas.height - 60, player.y));

  // camera
  cameraX = player.x - canvas.width / 2;
  cameraX = Math.max(0, Math.min(mapWidth - canvas.width, cameraX));

  // cooldown
  if (player.punch > 0) player.punch--;
  if (player.kick > 0) player.kick--;
  if (player.skill > 0) player.skill--;

  // skill (bắn đạn)
  if (player.skill === 29) {
    bullets.push({
      x: player.x,
      y: player.y + 20,
      dir: player.dir
    });
  }

  // bullets
  bullets.forEach(b => {
    b.x += b.dir * 8;
  });

  // enemy AI
  enemies.forEach(e => {
    let dx = player.x - e.x;

    if (Math.abs(dx) < 300) {
      e.x += dx > 0 ? 1 : -1;
    }

    if (Math.abs(dx) < 40 && Math.abs(player.y - e.y) < 40) {
      player.hp -= 0.2;
    }
  });

  // hit enemy
  enemies.forEach(e => {
    let dx = Math.abs(player.x - e.x);
    let dy = Math.abs(player.y - e.y);

    if (dx < 50 && dy < 50) {
      if (player.punch > 10) e.hp -= 1;
      if (player.kick > 10) e.hp -= 2;
    }
  });

  // bullet hit
  bullets.forEach(b => {
    enemies.forEach(e => {
      if (Math.abs(b.x - e.x) < 30 && Math.abs(b.y - e.y) < 30) {
        e.hp -= 5;
      }
    });
  });

  enemies = enemies.filter(e => e.hp > 0);
}

// ===== DRAW PLAYER =====
function drawPlayer() {
  let x = player.x - cameraX;
  let y = player.y;

  // body
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(x + 20, y + 25, 18, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // mắt
  ctx.fillStyle = "black";
  ctx.fillRect(x + 12, y + 20, 5, 5);
  ctx.fillRect(x + 23, y + 20, 5, 5);

  // animation tay
  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;
  ctx.beginPath();

  let swing = Math.sin(Date.now() / 100) * 5;

  ctx.moveTo(x + 5, y + 25);
  ctx.lineTo(x - 10 + swing, y + 30);

  ctx.moveTo(x + 35, y + 25);
  ctx.lineTo(x + 50 - swing, y + 30);

  ctx.stroke();

  // chân
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 50);
  ctx.lineTo(x + 10 + swing, y + 70);

  ctx.moveTo(x + 25, y + 50);
  ctx.lineTo(x + 30 - swing, y + 70);
  ctx.stroke();
}

// ===== DRAW ENEMY =====
function drawEnemy(e) {
  let x = e.x - cameraX;
  let y = e.y;

  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.ellipse(x + 20, y + 25, 20, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "red";
  ctx.fillRect(x + 10, y + 18, 5, 5);
  ctx.fillRect(x + 25, y + 18, 5, 5);

  ctx.fillRect(x, y - 10, e.hp, 5);
}

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#333";
  ctx.fillRect(-cameraX, 350, mapWidth, 150);

  drawPlayer();
  enemies.forEach(drawEnemy);

  // bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.fillRect(b.x - cameraX, b.y, 10, 5);
  });

  // UI
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, player.hp * 2, 10);

  if (player.hp <= 0) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("YOU DIED", 400, 200);
  }
}

// ===== LOOP =====
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
