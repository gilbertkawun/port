class Sprites {
  constructor({ position, imgSrc }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image()
    this.image.src = imgSrc
  }

  draw() {
      ce.drawImage(this.image, this.position.x, this.position.y)
  }

  update() {
    this.draw();
  }
}

class Fighters {
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
    this.health = 100;
  }

  draw() {
    ce.fillStyle = this.color;
    ce.fillRect(this.position.x, this.position.y, this.width, this.height);

    // attack
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
    this.position.x += this.velocity.x;

    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 35) {
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
