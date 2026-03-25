const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

// ===== PLAYER =====
let player = {
  x: 100,
  y: 300,
  w: 40,
  h: 50,
  speed: 4,
  hp: 100,
  attacking: false
};

// ===== ENEMY =====
let enemies = [
  { x: 500, y: 300, w: 40, h: 50, hp: 50 },
  { x: 800, y: 300, w: 40, h: 50, hp: 50 }
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
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;

  // giới hạn map
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.w) player.x = canvas.width - player.w;

  // đánh quái
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

  // xóa quái chết
  enemies = enemies.filter(e => e.hp > 0);
}

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // nền
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 350, canvas.width, 150);

  // player (quả trứng)
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(player.x + 20, player.y + 25, 20, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // mắt
  ctx.fillStyle = "black";
  ctx.fillRect(player.x + 12, player.y + 20, 5, 5);
  ctx.fillRect(player.x + 23, player.y + 20, 5, 5);

  // máu player
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, player.hp * 2, 10);

  // enemy
  enemies.forEach(e => {
    ctx.fillStyle = "green";
    ctx.fillRect(e.x, e.y, e.w, e.h);

    // máu quái
    ctx.fillStyle = "red";
    ctx.fillRect(e.x, e.y - 10, e.hp, 5);
  });

  // đánh
  if (player.attacking) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(player.x + 40, player.y + 10, 20, 20);
  }
}

// ===== LOOP =====
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
