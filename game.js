const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

// ===== PLAYER (QUẢ TRỨNG) =====
let player = {
  x: 100,
  y: 280,
  w: 40,
  h: 55,
  speed: 4,
  hp: 100,
  attacking: false,
  dir: 1 // hướng
};

// ===== ENEMY (QUÁI) =====
let enemies = [
  { x: 500, y: 300, w: 40, h: 50, hp: 50, dir: -1 },
  { x: 800, y: 300, w: 40, h: 50, hp: 50, dir: 1 }
];

// ===== INPUT =====
let keys = {};
document.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === " ") player.attacking = true;
});
document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
  if (e.key === " ") player.attacking = false;
});

// ===== UPDATE =====
function update() {
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

  // giới hạn map
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));

  // quái di chuyển qua lại
  enemies.forEach(e => {
    e.x += e.dir * 1.5;
    if (e.x < 400 || e.x > 900) e.dir *= -1;
  });

  // đánh
  if (player.attacking) {
    enemies.forEach(e => {
      if (
        player.x < e.x + e.w &&
        player.x + player.w > e.x &&
        player.y < e.y + e.h &&
        player.y + player.h > e.y
      ) {
        e.hp -= 1;
      }
    });
  }

  enemies = enemies.filter(e => e.hp > 0);
}

// ===== DRAW PLAYER (QUẢ TRỨNG) =====
function drawPlayer() {
  // thân trứng
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(player.x + 20, player.y + 25, 18, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // bóng
  ctx.fillStyle = "#ddd";
  ctx.beginPath();
  ctx.ellipse(player.x + 25, player.y + 30, 10, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // mắt
  ctx.fillStyle = "black";
  ctx.fillRect(player.x + 10, player.y + 20, 5, 5);
  ctx.fillRect(player.x + 23, player.y + 20, 5, 5);

  // miệng
  ctx.fillRect(player.x + 16, player.y + 30, 6, 3);
}

// ===== DRAW ENEMY (QUÁI) =====
function drawEnemy(e) {
  // thân
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.ellipse(e.x + 20, e.y + 25, 20, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // mắt đỏ
  ctx.fillStyle = "red";
  ctx.fillRect(e.x + 10, e.y + 18, 5, 5);
  ctx.fillRect(e.x + 25, e.y + 18, 5, 5);

  // sừng
  ctx.fillStyle = "darkgreen";
  ctx.fillRect(e.x + 5, e.y, 8, 10);
  ctx.fillRect(e.x + 27, e.y, 8, 10);

  // máu
  ctx.fillStyle = "red";
  ctx.fillRect(e.x, e.y - 10, e.hp, 5);
}

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // nền đất
  ctx.fillStyle = "#444";
  ctx.fillRect(0, 350, canvas.width, 150);

  // player
  drawPlayer();

  // quái
  enemies.forEach(e => drawEnemy(e));

  // thanh máu player
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, player.hp * 2, 10);

  // hiệu ứng đánh
  if (player.attacking) {
    ctx.fillStyle = "yellow";
    if (player.dir === 1)
      ctx.fillRect(player.x + 40, player.y + 10, 20, 20);
    else
      ctx.fillRect(player.x - 20, player.y + 10, 20, 20);
  }
}

// ===== LOOP =====
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
