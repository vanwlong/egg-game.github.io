const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

// ===== PLAYER =====
let player = {
  x: 100,
  y: 200,
  speed: 4,
  dir: 1,
  punch: false,
  kick: false
};

// ===== INPUT =====
let keys = {};

document.onkeydown = (e) => {
  let k = e.key.toLowerCase();
  keys[k] = true;

  if (k === "j") player.punch = true;
  if (k === "k") player.kick = true;
};

document.onkeyup = (e) => {
  let k = e.key.toLowerCase();
  keys[k] = false;

  if (k === "j") player.punch = false;
  if (k === "k") player.kick = false;
};

// ===== ENEMY =====
let enemies = [
  { x: 500, y: 220, hp: 50 },
  { x: 750, y: 220, hp: 50 }
];

// ===== UPDATE =====
function update() {
  // DI CHUYỂN 4 HƯỚNG (KHÔNG RƠI)
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

  // KHÓA TRONG MAP
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - 40) player.x = canvas.width - 40;

  if (player.y < 0) player.y = 0;
  if (player.y > canvas.height - 60) player.y = canvas.height - 60;

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

// ===== VẼ PLAYER (CÓ TAY CHÂN + SKILL) =====
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

  // ===== TAY =====
  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;

  ctx.beginPath();

  if (player.punch) {
    // ĐẤM
    if (player.dir === 1) {
      ctx.moveTo(x + 35, y + 25);
      ctx.lineTo(x + 70, y + 25);
    } else {
      ctx.moveTo(x + 5, y + 25);
      ctx.lineTo(x - 30, y + 25);
    }
  } else {
    // tay bình thường
    ctx.moveTo(x + 5, y + 25);
    ctx.lineTo(x - 10, y + 30);

    ctx.moveTo(x + 35, y + 25);
    ctx.lineTo(x + 50, y + 30);
  }

  ctx.stroke();

  // ===== CHÂN =====
  ctx.beginPath();

  if (player.kick) {
    // ĐÁ
    if (player.dir === 1) {
      ctx.moveTo(x + 20, y + 50);
      ctx.lineTo(x + 60, y + 70);
    } else {
      ctx.moveTo(x + 20, y + 50);
      ctx.lineTo(x - 20, y + 70);
    }
  } else {
    ctx.moveTo(x + 15, y + 50);
    ctx.lineTo(x + 10, y + 70);

    ctx.moveTo(x + 25, y + 50);
    ctx.lineTo(x + 30, y + 70);
  }

  ctx.stroke();
}

// ===== VẼ QUÁI =====
function drawEnemy(e) {
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.ellipse(e.x + 20, e.y + 25, 20, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "red";
  ctx.fillRect(e.x + 10, e.y + 18, 5, 5);
  ctx.fillRect(e.x + 25, e.y + 18, 5, 5);

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
}

// ===== LOOP =====
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
