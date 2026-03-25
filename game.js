const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

const ground = 420;
const mapWidth = 1500;

// ===== PLAYER =====
let player = {
  x: 100,
  y: 200,
  w: 40,
  h: 60,
  vx: 0,
  vy: 0,
  speed: 4,
  gravity: 0.4,
  lift: -0.6,
  hp: 100,
  dir: 1
};

// ===== INPUT =====
let keys = {};

// PC
document.onkeydown = e => keys[e.key.toLowerCase()] = true;
document.onkeyup = e => keys[e.key.toLowerCase()] = false;

// ===== JOYSTICK =====
let joystick = {
  active: false,
  x: 80,
  y: 420,
  dx: 0,
  dy: 0
};

canvas.addEventListener("touchstart", e => {
  let t = e.touches[0];
  joystick.active = true;
  joystick.x = t.clientX;
  joystick.y = t.clientY;
});

canvas.addEventListener("touchmove", e => {
  let t = e.touches[0];
  joystick.dx = t.clientX - joystick.x;
  joystick.dy = t.clientY - joystick.y;
});

canvas.addEventListener("touchend", () => {
  joystick.active = false;
  joystick.dx = 0;
  joystick.dy = 0;
});

// ===== ENEMY =====
let enemies = [];
let dead = [];

function spawn(x) {
  enemies.push({ x: x, y: ground - 50, hp: 40 });
}

for (let i = 400; i < 1200; i += 200) spawn(i);

// ===== PLATFORM =====
let platforms = [
  { x: 300, y: 350, w: 150, h: 10 },
  { x: 600, y: 300, w: 150, h: 10 },
  { x: 900, y: 260, w: 150, h: 10 }
];

// ===== UPDATE =====
function update() {

  // joystick control
  if (joystick.active) {
    player.vx = joystick.dx * 0.05;
    player.vy += joystick.dy * 0.01;
  } else {
    // PC control
    if (keys["a"]) { player.vx = -player.speed; player.dir = -1; }
    else if (keys["d"]) { player.vx = player.speed; player.dir = 1; }
    else player.vx = 0;

    // bay
    if (keys["w"]) player.vy += player.lift;
  }

  // gravity (rơi chậm)
  player.vy += player.gravity;

  // update pos
  player.x += player.vx;
  player.y += player.vy;

  // ===== FIX KẸT MAP =====
  if (player.x < 0) player.x = 0;
  if (player.x > mapWidth - player.w) player.x = mapWidth - player.w;

  // ===== GROUND =====
  if (player.y + player.h >= ground) {
    player.y = ground - player.h;
    player.vy = 0;
  }

  // ===== PLATFORM =====
  platforms.forEach(p => {
    if (
      player.x + player.w > p.x &&
      player.x < p.x + p.w &&
      player.y + player.h > p.y &&
      player.y + player.h < p.y + 15 &&
      player.vy >= 0
    ) {
      player.y = p.y - player.h;
      player.vy = 0;
    }
  });

  // ===== ENEMY DIE + RESPAWN =====
  enemies.forEach((e,i)=>{
    if(e.hp<=0){
      dead.push({x:e.x,time:Date.now()});
      enemies.splice(i,1);
    }
  });

  dead.forEach((d,i)=>{
    if(Date.now()-d.time>3000){
      spawn(d.x);
      dead.splice(i,1);
    }
  });
}

// ===== DRAW =====
function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  // nền trời
  ctx.fillStyle="#87CEEB";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // đất
  ctx.fillStyle="#654321";
  ctx.fillRect(0,ground,canvas.width,100);

  // platform
  ctx.fillStyle="#8B4513";
  platforms.forEach(p=>{
    ctx.fillRect(p.x,p.y,p.w,p.h);
  });

  // player (đẹp hơn)
  ctx.fillStyle="white";
  ctx.beginPath();
  ctx.ellipse(player.x+20,player.y+30,18,28,0,0,Math.PI*2);
  ctx.fill();

  // mắt
  ctx.fillStyle="black";
  ctx.fillRect(player.x+12,player.y+25,5,5);
  ctx.fillRect(player.x+23,player.y+25,5,5);

  // tay chân mượt
  let swing = Math.sin(Date.now()/100)*5;

  ctx.strokeStyle="white";
  ctx.lineWidth=3;

  ctx.beginPath();
  ctx.moveTo(player.x+5,player.y+30);
  ctx.lineTo(player.x-10+swing,player.y+35);
  ctx.moveTo(player.x+35,player.y+30);
  ctx.lineTo(player.x+50-swing,player.y+35);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(player.x+15,player.y+58);
  ctx.lineTo(player.x+10+swing,player.y+75);
  ctx.moveTo(player.x+25,player.y+58);
  ctx.lineTo(player.x+30-swing,player.y+75);
  ctx.stroke();

  // enemy
  enemies.forEach(e=>{
    ctx.fillStyle="green";
    ctx.fillRect(e.x,e.y,40,50);

    ctx.fillStyle="red";
    ctx.fillRect(e.x,e.y-10,e.hp,5);
  });

  // joystick vẽ
  if(joystick.active){
    ctx.beginPath();
    ctx.arc(joystick.x,joystick.y,40,0,Math.PI*2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(joystick.x+joystick.dx,joystick.y+joystick.dy,20,0,Math.PI*2);
    ctx.fill();
  }
}

// LOOP
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
