const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

// ===== MAP =====
const ground = 350;
const mapWidth = 3000;
let cameraX = 0;

// ===== PLAYER =====
let player = {
  x: 100,
  y: 0,
  w: 40,
  h: 60,
  vx: 0,
  vy: 0,
  speed: 4,
  jump: -10,
  gravity: 0.5,
  onGround: false,
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

  if (k === "w" && player.onGround) {
    player.vy = player.jump;
    player.onGround = false;
  }
};

document.onkeyup = e => {
  keys[e.key.toLowerCase()] = false;
};

// ===== ENEMY =====
let enemies = [
  { x: 600, y: ground - 50, hp: 100 },
  { x: 1200, y: ground - 50, hp: 100 }
];

// ===== BULLET =====
let bullets = [];

// ===== UPDATE =====
function update() {
  // trái phải
  if (keys["a"]) {
    player.vx = -player.speed;
    player.dir = -1;
  } else if (keys["d"]) {
    player.vx = player.speed;
    player.dir = 1;
  } else {
    player.vx = 0;
  }

  // gravity
  player.vy += player.gravity;

  // update pos
  player.x += player.vx;
  player.y += player.vy;

  // giới hạn map
  player.x = Math.max(0, Math.min(mapWidth, player.x));

  // va chạm mặt đất
  if (player.y + player.h >= ground) {
    player.y = ground - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  // camera
  cameraX = player.x - canvas.width / 2;
  cameraX = Math.max(0, Math.min(mapWidth - canvas.width, cameraX));

  // cooldown
  if (player.punch > 0) player.punch--;
  if (player.kick > 0) player.kick--;
  if (player.skill > 0) player.skill--;

  // bắn chưởng
  if (player.skill === 29) {
    bullets.push({
      x: player.x,
      y: player.y + 20,
      dir: player.dir
    });
  }

  bullets.forEach(b => b.x += b.dir * 8);

  // đánh quái
  enemies.forEach(e => {
    let dx = Math.abs(player.x - e.x);
    if (dx < 50 && player.punch > 10) e.hp -= 1;
    if (dx < 50 && player.kick > 10) e.hp -= 2;
  });

  bullets.forEach(b => {
    enemies.forEach(e => {
      if (Math.abs(b.x - e.x) < 30) e.hp -= 5;
    });
  });

  enemies = enemies.filter(e => e.hp > 0);
}

// ===== VẼ PLAYER (TAY CHÂN XỊN) =====
function drawPlayer() {
  let x = player.x - cameraX;
  let y = player.y;

  let swing = Math.sin(Date.now() / 100) * 6;

  // thân trứng
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(x + 20, y + 30, 18, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // mắt
  ctx.fillStyle = "black";
  ctx.fillRect(x + 12, y + 25, 5, 5);
  ctx.fillRect(x + 23, y + 25, 5, 5);

  // tay
  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;
  ctx.beginPath();

  ctx.moveTo(x + 5, y + 30);
  ctx.lineTo(x - 10 + swing, y + 35);

  ctx.moveTo(x + 35, y + 30);
  ctx.lineTo(x + 50 - swing, y + 35);

  ctx.stroke();

  // chân
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
  ctx.fillRect(-cameraX, ground, mapWidth, 150);

  drawPlayer();

  // quái
  enemies.forEach(e => {
    let x = e.x - cameraX;
    ctx.fillStyle = "green";
    ctx.fillRect(x, ground - 50, 40, 50);

    ctx.fillStyle = "red";
    ctx.fillRect(x, ground - 60, e.hp, 5);
  });

  // đạn
  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.fillRect(b.x - cameraX, b.y, 10, 5);
  });

  // máu
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, player.hp * 2, 10);
}

// ===== LOOP =====
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
