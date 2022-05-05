const canvas = document.querySelector("canvas");

const ce = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

ce.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprites {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attack = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.onAttack;
    this.health = 100
  }

  draw() {
    ce.fillStyle = this.color;
    ce.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attack
    if (this.onAttack) {
      ce.fillStyle = "green";
      ce.fillRect(
        this.attack.position.x,
        this.attack.position.y,
        this.attack.width,
        this.attack.height
      );
    }
  }

  update() {
    this.draw();
    this.attack.position.x = this.position.x + this.attack.offset.x;
    this.attack.position.y = this.position.y;
    // this.velocity.y += gravity
    this.position.x += this.velocity.x;

    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attacking() {
    this.onAttack = true;
    setTimeout(() => {
      this.onAttack = false;
    }, 100);
  }
}

const players = new Sprites({
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

const enemies = new Sprites({
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

// players.draw()
// enemies.draw()

// console.log(players);

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

function collisionDetecting({ obj1, obj2 }) {
  return (
    obj1.attack.position.x + obj1.attack.width >= obj2.position.x &&
    obj1.attack.position.x <= obj2.position.x + obj2.width &&
    obj1.attack.position.y + obj1.attack.height >= obj2.position.y &&
    obj1.attack.position.y <= obj2.position.y + obj2.height
  );
}

function battleResult({ players, enemies, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayDraw').style.display = 'flex'
    if (players.health === enemies.health) {
        document.querySelector('#displayDraw').innerHTML = 'Draw'
    } else if (players.health > enemies.health) {
        document.querySelector('#displayDraw').innerHTML = 'Player 1 Wins'
    } else if (players.health < enemies.health) {
        document.querySelector('#displayDraw').innerHTML = 'Player 2 Wins'
    } 
}

let timer = 30
let timerId;
function timedownTimer() {
    if (timer > 0) {
        timerId = setTimeout(timedownTimer, 1000)
        timer--
        document.querySelector("#timer").innerHTML = timer
    }

    if (timer === 0) {
        battleResult({ players, enemies, timerId })
    }
}
timedownTimer()

function animate() {
  window.requestAnimationFrame(animate);
  ce.fillStyle = "black";
  ce.fillRect(0, 0, canvas.width, canvas.height);
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
    enemies.health -= 20
    document.querySelector('#enemyHealth').style.width = enemies.health + '%'
    // console.log("gogo");
  }

  if (
    collisionDetecting({
      obj1: enemies,
      obj2: players,
    }) &&
    enemies.onAttack
  ) {
    enemies.onAttack = false;
    players.health -= 20
    document.querySelector('#playerHealth').style.width = players.health + '%'
    // console.log("enemy attacking");
  }

  // result
  if (enemies.health <= 0 || players.health <= 0) {
    battleResult({ players, enemies, timerId })
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

  //   console.log(click.key);
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
  //   console.log(click.key);
});
