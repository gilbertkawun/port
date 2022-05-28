function collisionDetecting({ obj1, obj2 }) {
  return (
    obj1.attack.position.x + obj1.attack.width >= obj2.position.x &&
    obj1.attack.position.x <= obj2.position.x + obj2.width &&
    obj1.attack.position.y + obj1.attack.height >= obj2.position.y &&
    obj1.attack.position.y <= obj2.position.y + obj2.height
  );
}

function battleResult({ players, enemies, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayDraw").style.display = "flex";
  if (players.health === enemies.health) {
    document.querySelector("#displayDraw").innerHTML = "Draw";
  } else if (players.health > enemies.health) {
    document.querySelector("#displayDraw").innerHTML = "Player 1 Wins";
  } else if (players.health < enemies.health) {
    document.querySelector("#displayDraw").innerHTML = "Player 2 Wins";
  }
}

let timer = 30;
let timerId;
function timedownTimer() {
  if (timer > 0) {
    timerId = setTimeout(timedownTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    battleResult({ players, enemies, timerId });
  }
}
