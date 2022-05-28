const canvas = document.querySelector("canvas");

const ce = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

ce.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprites({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: './sprites/PNG/cyberpunk-street-resize.png'
})

const players = new Fighters({
  position: {  
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

const enemies = new Fighters({
  position: {
    x: 576,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  color: "blue",
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};


timedownTimer();

function animate() {
  window.requestAnimationFrame(animate);
  ce.fillStyle = "black";
  ce.fillRect(0, 0, canvas.width, canvas.height);
  background.update()
  players.update();
  enemies.update();

  players.velocity.x = 0;
  enemies.velocity.x = 0;

  if (keys.a.pressed && players.lastKey === "a") {
    players.velocity.x = -5;
  } else if (keys.d.pressed && players.lastKey === "d") {
    players.velocity.x = 5;
  }

  //enemy
  if (keys.ArrowLeft.pressed && enemies.lastKey === "ArrowLeft") {
    enemies.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemies.lastKey === "ArrowRight") {
    enemies.velocity.x = 5;
  }

  // collision
  if (
    collisionDetecting({
      obj1: players,
      obj2: enemies,
    }) &&
    players.onAttack
  ) {
    players.onAttack = false;
    enemies.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemies.health + "%";
  }

  if (
    collisionDetecting({
      obj1: enemies,
      obj2: players,
    }) &&
    enemies.onAttack
  ) {
    enemies.onAttack = false;
    players.health -= 20;
    document.querySelector("#playerHealth").style.width = players.health + "%";
  }

  // result
  if (enemies.health <= 0 || players.health <= 0) {
    battleResult({ players, enemies, timerId });
  }
}

animate();

window.addEventListener("keydown", (click) => {
  switch (click.key) {
    case "d":
      keys.d.pressed = true;
      players.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      players.lastKey = "a";
      break;
    case "w":
      players.velocity.y = -18;
      break;
    case " ":
      players.attacking();
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemies.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemies.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemies.velocity.y = -18;
      break;
    case "ArrowDown":
      enemies.onAttack = true;
      break;
  }
});

window.addEventListener("keyup", (click) => {
  switch (click.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
  }

  //enemy
  switch (click.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
