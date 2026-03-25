const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

const ground = 400;

// ===== PLAYER =====
let player = {
  x: 100,
  y: 0,
  w: 40,
  h: 60,
  vx: 0,
  vy: 0,
  speed: 4,
  jump: -12,
  gravity: 0.6,
  onGround: false,
  dir: 1,
  canAttack: true
};

// ===== INPUT =====
let keys = {};

document.addEventListener("keydown", e => {
  let k = e.key.toLowerCase();
  keys[k] = true;

  // J = ĐẤM (1 lần)
  if (k === "j" && player.canAttack) {
    attack(1);
    player.canAttack = false;
    setTimeout(() => player.canAttack = true, 300);
  }

  // K = ĐÁ (1 lần)
  if (k === "k" && player.canAttack) {
    attack(2);
    player.canAttack = false;
    setTimeout(() => player.canAttack = true, 400);
  }

  if (k === "w" && player.onGround) {
    player.vy = player.jump;
    player.onGround = false;
  }
});

document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

// ===== ENEMY =====
let enemies = [];
let dead = [];

function spawn(x) {
  enemies.push({ x: x, y: ground - 50, hp: 30 });
}

// tạo nhiều quái
for (let i = 400; i < 1000; i += 200) {
  spawn(i);
}

// ===== PLATFORM =====
let platforms = [
  { x: 300, y: 320, w: 120, h: 10 },
  { x: 600, y: 280, w: 120, h: 10 }
];

// ===== ATTACK =====
function attack(type) {
  enemies.forEach(e => {
    let dx = Math.abs(player.x - e.x);

    if (dx < 50) {
      if (type === 1) e.hp -= 5;
      if (type === 2) e.hp -= 8;
    }
  });
}

// ===== UPDATE =====
function update() {

  // di chuyển ngang
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

  // cập nhật vị trí
  player.x += player.vx;
  player.y += player.vy;

  player.onGround = false;

  // ===== COLLISION GROUND =====
  if (player.y + player.h >= ground) {
    player.y = ground - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  // ===== COLLISION PLATFORM =====
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

  // ===== ENEMY DIE =====
  enemies.forEach((e, i) => {
    if (e.hp <= 0) {
      dead.push({ x: e.x, time: Date.now() });
      enemies.splice(i, 1);
    }
  });

  // ===== RESPAWN 3s =====
  dead.forEach((d, i) => {
    if (Date.now() - d.time > 3000) {
      spawn(d.x);
      dead.splice(i, 1);
    }
  });
}

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // nền
  ctx.fillStyle = "#444";
  ctx.fillRect(0, ground, canvas.width, 100);

  // platform
  ctx.fillStyle = "brown";
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.w, p.h);
  });

  // player (trứng + tay chân đơn giản)
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(player.x + 20, player.y + 30, 18, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // tay
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(player.x + 5, player.y + 30);
  ctx.lineTo(player.x - 10, player.y + 40);
  ctx.moveTo(player.x + 35, player.y + 30);
  ctx.lineTo(player.x + 50, player.y + 40);
  ctx.stroke();

  // chân
  ctx.beginPath();
  ctx.moveTo(player.x + 15, player.y + 58);
  ctx.lineTo(player.x + 10, player.y + 75);
  ctx.moveTo(player.x + 25, player.y + 58);
  ctx.lineTo(player.x + 30, player.y + 75);
  ctx.stroke();

  // enemy
  enemies.forEach(e => {
    ctx.fillStyle = "green";
    ctx.fillRect(e.x, e.y, 40, 50);

    ctx.fillStyle = "red";
    ctx.fillRect(e.x, e.y - 10, e.hp, 5);
  });
}

// LOOP
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
