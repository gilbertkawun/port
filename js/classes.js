class Sprites {
  constructor({
    position,
    imgSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imgSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  draw() {
    ce.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  characterAnimation() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.characterAnimation();
  }
}

class Fighters extends Sprites {
  constructor({
    position,
    velocity,
    color = "red",
    imgSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
  }) {
    super({
      position,
      imgSrc,
      scale,
      framesMax,
      offset,
    });

    // this.position = position;
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
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imgSrc;
    }
  }

  // draw() {
  //   ce.fillStyle = this.color;
  //   ce.fillRect(this.position.x, this.position.y, this.width, this.height);

  //   // attack
  //   if (this.onAttack) {
  //     ce.fillStyle = "green";
  //     ce.fillRect(
  //       this.attack.position.x,
  //       this.attack.position.y,
  //       this.attack.width,
  //       this.attack.height
  //     );
  //   }
  // }

  update() {
    this.draw();
    this.characterAnimation();

    this.attack.position.x = this.position.x + this.attack.offset.x;
    this.attack.position.y = this.position.y;
    this.position.x += this.velocity.x;

    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 35) {
      this.velocity.y = 0;
      this.position.y = 391
    } else {
      this.velocity.y += gravity;
    }
  }

  attacking() {
    this.animationSwitch('attack1')
    this.onAttack = true;
    setTimeout(() => {
      this.onAttack = false;
    }, 100);
  }

  animationSwitch(sprite) {
    if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax -1) return
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
        case "attack1":
          if (this.image !== this.sprites.attack1.image) {
            this.image = this.sprites.attack1.image;
            this.framesMax = this.sprites.attack1.framesMax;
            this.framesCurrent = 0;
          }
          break;
    }
  }
}
