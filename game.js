const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let x = 50;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(x, 200, 50, 50);

  x += 2;

  requestAnimationFrame(gameLoop);
}

gameLoop();