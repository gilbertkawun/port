const canvas = document.querySelector("canvas");

const ce = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

ce.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprites({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: "./sprites/PNG/cyberpunk-street-resize.png",
});

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
  imgSrc: "./sprites/player-1/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 180,
    y: 180,
  },
  sprites: {
    idle: {
      imgSrc: "./sprites/player-1/Idle.png",
      framesMax: 4,
    },
    run: {
      imgSrc: "./sprites/player-1/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./sprites/player-1/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./sprites/player-1/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./sprites/player-1/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imgSrc: "./sprites/player-1/Take hit.png",
      framesMax: 3,
    },
    death: {
      imgSrc: "./sprites/player-1/Death.png",
      framesMax: 7,
    },
  },
  attack: {
    offset: {
      x: 150,
      y: 50,
    },
    width: 150,
    height: 50,
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
  imgSrc: "./sprites/player-2/Idle.png",
  framesMax: 11,
  scale: 2.5,
  offset: {
    x: 200,
    y: 150,
  },
  sprites: {
    idle: {
      imgSrc: "./sprites/player-2/Idle.png",
      framesMax: 11,
    },
    run: {
      imgSrc: "./sprites/player-2/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./sprites/player-2/Jump.png",
      framesMax: 3,
    },
    fall: {
      imgSrc: "./sprites/player-2/Fall.png",
      framesMax: 3,
    },
    attack1: {
      imgSrc: "./sprites/player-2/Attack1.png",
      framesMax: 7,
    },
    takeHit: {
      imgSrc: "./sprites/player-2/Take Hit.png",
      framesMax: 4,
    },
    death: {
      imgSrc: "./sprites/player-2/Death.png",
      framesMax: 11,
    },
  },
  attack: {
    offset: {
      x: -150,
      y: 50,
    },
    width: 150,
    height: 50,
  },
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
  background.update();
  players.update();
  enemies.update();

  players.velocity.x = 0;
  enemies.velocity.x = 0;

  if (keys.a.pressed && players.lastKey === "a") {
    players.velocity.x = -5;
    players.animationSwitch("run");
  } else if (keys.d.pressed && players.lastKey === "d") {
    players.velocity.x = 5;
    players.animationSwitch("run");
  } else {
    players.animationSwitch("idle");
  }

  if (players.velocity.y < 0) {
    players.animationSwitch("jump");
  } else if (players.velocity.y > 0) {
    players.animationSwitch("fall");
  }

  //enemy
  if (keys.ArrowLeft.pressed && enemies.lastKey === "ArrowLeft") {
    enemies.velocity.x = -5;
    enemies.animationSwitch("run");
  } else if (keys.ArrowRight.pressed && enemies.lastKey === "ArrowRight") {
    enemies.velocity.x = 5;
    enemies.animationSwitch("run");
  } else {
    enemies.animationSwitch("idle");
  }

  if (enemies.velocity.y < 0) {
    enemies.animationSwitch("jump");
  } else if (enemies.velocity.y > 0) {
    enemies.animationSwitch("fall");
  }

  // collision
  if (
    collisionDetecting({
      obj1: players,
      obj2: enemies,
    }) &&
    players.onAttack &&
    players.framesCurrent === 2
  ) {
    enemies.takeHit();
    players.onAttack = false;
    // enemies.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemies.health + "%";
  }

  // miss attack
  if (players.onAttack && players.framesCurrent === 2) {
    players.onAttack = false;
  }

  if (
    collisionDetecting({
      obj1: enemies,
      obj2: players,
    }) &&
    enemies.onAttack &&
    enemies.framesCurrent === 1
  ) {
    players.takeHit();
    enemies.onAttack = false;
    // players.health -= 20;
    document.querySelector("#playerHealth").style.width = players.health + "%";
  }

  // miss attack
  if (enemies.onAttack && enemies.framesCurrent === 1) {
    enemies.onAttack = false;
  }

  // result
  if (enemies.health <= 0 || players.health <= 0) {
    battleResult({ players, enemies, timerId });
  }
}

animate();

window.addEventListener("keydown", (click) => {
  if (!players.dead) {
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
    }
  }

  if (!enemies.dead) {
    switch (click.key) {
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
        enemies.attacking();
        break;
    }
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
