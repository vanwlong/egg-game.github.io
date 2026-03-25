const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

// ===== PLAYER =====
let player = {
  x: 100,
  y: 250,
  speed: 4,
  hp: 100,
  dir: 1,
  punch: false,
  kick: false
};

// ===== INPUT =====
let keys = {};

document.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;

  if (e.key.toLowerCase() === "j") player.punch = true;
  if (e.key.toLowerCase() === "k") player.kick = true;
});

document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;

  if (e.key.toLowerCase() === "j") player.punch = false;
  if (e.key.toLowerCase() === "k") player.kick = false;
});

// ===== ENEMY =====
let enemies = [
  { x: 500, y: 260, hp: 50, dir: -1 },
  { x: 800, y: 260, hp: 50, dir: 1 }
];

// ===== UPDATE =====
function update() {
  // DI CHUYỂN TỰ DO (KHÔNG GRAVITY)
  if (keys["a"]) {
    player.x -= player.speed;
    player.dir = -1;
  }
  if (keys["d"]) {
    player.x += player.speed;
    player.dir = 1;
  }
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;

  // GIỚI HẠN MAP
  player.x = Math.max(0, Math.min(canvas.width - 40, player.x));
  player.y = Math.max(0, Math.min(canvas.height - 60, player.y));

  // QUÁI DI CHUYỂN
  enemies.forEach(e => {
    e.x += e.dir * 1.5;
    if (e.x < 400 || e.x > 900) e.dir *= -1;
  });

  // ĐÁNH
  enemies.forEach(e => {
    let dx = Math.abs(player.x - e.x);
    let dy = Math.abs(player.y - e.y);

    if (dx < 50 && dy < 50) {
      if (player.punch) e.hp -= 1;
      if (player.kick) e.hp -= 2;
    }
  });

  enemies = enemies.filter(e => e.hp > 0);
}

// ===== VẼ PLAYER (CÓ TAY CHÂN) =====
function drawPlayer() {
  let x = player.x;
  let y = player.y;

  // thân trứng
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(x + 20, y + 25, 18, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // mắt
  ctx.fillStyle = "black";
  ctx.fillRect(x + 12, y + 20, 5, 5);
  ctx.fillRect(x + 23, y + 20, 5, 5);

  // tay
  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;
  ctx.beginPath();

  if (player.punch) {
    // tay đấm
    if (player.dir === 1) {
      ctx.moveTo(x + 35, y + 25);
      ctx.lineTo(x + 60, y + 25);
    } else {
      ctx.moveTo(x + 5, y + 25);
      ctx.lineTo(x - 20, y + 25);
    }
  } else {
    ctx.moveTo(x + 5, y + 25);
    ctx.lineTo(x - 10, y + 30);

    ctx.moveTo(x + 35, y + 25);
    ctx.lineTo(x + 50, y + 30);
  }

  ctx.stroke();

  // chân
  ctx.beginPath();

  if (player.kick) {
    // đá
    if (player.dir === 1) {
      ctx.moveTo(x + 20, y + 50);
      ctx.lineTo(x + 50, y + 60);
    } else {
      ctx.moveTo(x + 20, y + 50);
      ctx.lineTo(x - 10, y + 60);
    }
  } else {
    ctx.moveTo(x + 15, y + 50);
    ctx.lineTo(x + 10, y + 65);

    ctx.moveTo(x + 25, y + 50);
    ctx.lineTo(x + 30, y + 65);
  }

  ctx.stroke();
}

// ===== VẼ QUÁI =====
function drawEnemy(e) {
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.ellipse(e.x + 20, e.y + 25, 20, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // mắt đỏ
  ctx.fillStyle = "red";
  ctx.fillRect(e.x + 10, e.y + 18, 5, 5);
  ctx.fillRect(e.x + 25, e.y + 18, 5, 5);

  // máu
  ctx.fillStyle = "red";
  ctx.fillRect(e.x, e.y - 10, e.hp, 5);
}

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // nền
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 350, canvas.width, 150);

  drawPlayer();
  enemies.forEach(drawEnemy);

  // máu player
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, player.hp * 2, 10);
}

// ===== LOOP =====
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
