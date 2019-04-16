class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
  }
}

class Asteroid extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    this.body.setCircle(this.displayWidth * 0.5);
    let velocity = this.getInitVelocity(scene,x,y);
    this.body.setVelocity(
      velocity[0],
      velocity[1]
    );
    this.setData('level', 0);
  }

  getInitVelocity(scene, x, y){
    let width = scene.game.config.width;
    let height = scene.game.config.height;
    let buffer = 128;
    let velocityX = Phaser.Math.Between(-100, 100);
    if(x < buffer) velocityX = Phaser.Math.Between(1, 100);
    else if(x > width - buffer) velocityX = Phaser.Math.Between(-100, -1);

    let velocityY = Phaser.Math.Between(-100, 100);
    if(y < buffer) velocityY = Phaser.Math.Between(1, 100);
    else if(y > height - buffer) velocityY = Phaser.Math.Between(-100, -1);

    return [velocityX, velocityY];
  }
}

class Dog extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    this.setScale(0.4, 0.4);
    this.play(keys.DOG1IDLEKEY);
    if(key == keys.DOG2KEY){
      this.setScale(0.6, 0.6);
      this.play(keys.DOG2IDLEKEY);
    }else if(key == keys.DOG3KEY){
      this.setScale(0.8, 0.8);
      this.play(keys.DOG3IDLEKEY);
    }
    let velocity = this.getInitVelocity(scene,x,y);
    this.body.setVelocity(
      velocity[0],
      velocity[1]
    );
    this.shootTimer = this.scene.time.addEvent({
      delay: Phaser.Math.Between(1000, 5000),
      callback: function() {
        if (this.scene !== undefined) {

          const bullet = new Bullet(this.scene, this.x, this.y, false);
          bullet.setData('isFriendly', false);

          if (key == keys.DOGKEY) {
            const angle = (Phaser.Math.Between(0, 360) * Math.PI) / 180;
            bullet.setTint(0x142bff);
            bullet.setRotation(angle);
            bullet.body.setVelocity(
              100 * Math.cos(angle),
              100 * Math.sin(angle)
            );
          } else if (key == keys.DOG2KEY) {
            const dx = this.scene.player.x - this.x;
            const dy = this.scene.player.y - this.y;
            const angle = Math.atan2(dy, dx);
            bullet.setTint(0x3dff23);
            bullet.setRotation(angle);
            bullet.body.setVelocity(
              150 * Math.cos(angle),
              150 * Math.sin(angle)
            );
          }else if(key == keys.DOG3KEY){
            const dx = this.scene.player.x - this.x;
            const dy = this.scene.player.y - this.y;
            const angle = Math.atan2(dy, dx);
            bullet.setTint(0xd71fef);
            bullet.setRotation(angle);
            bullet.body.setVelocity(
              200 * Math.cos(angle),
              200 * Math.sin(angle)
            );
          }

          this.scene.bullets.add(bullet);
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  getInitVelocity(scene, x, y){
    let width = scene.game.config.width;
    let height = scene.game.config.height;
    let buffer = 128;
    let velocityX = Phaser.Math.Between(-100, 100);
    if(x < buffer) velocityX = Phaser.Math.Between(1, 100);
    else if(x > width - buffer) velocityX = Phaser.Math.Between(-100, -1);

    let velocityY = Phaser.Math.Between(-100, 100);
    if(y < buffer) velocityY = Phaser.Math.Between(1, 100);
    else if(y > height - buffer) velocityY = Phaser.Math.Between(-100, -1);

    return [velocityX, velocityY];
  }

  onDestroy() {
    if (this.shootTimer !== undefined) {
      if (this.shootTimer) {
        this.shootTimer.remove(false);
      }
    }
  }
}

class Bullet extends Entity {
  constructor(scene, x, y, isFriendly) {
    super(scene, x, y, keys.BULLETKEY);
    this.setData('isFriendly', isFriendly);
  }
}

class Leo extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, keys.CATKEY);
    this.body.setCollideWorldBounds(true);
    this.setData('isMoving', false);
    this.setData('health', playerData.maxHealth);
    this.setData('oxygen', playerData.maxOxygen);
    this.setScale(0.5, 0.5);
  }

  moveLeft(boost) {
    this.setData('isMoving', true);
    if(this.body.velocity.x > 0)
      this.body.velocity.x = 0;
    this.body.velocity.x -= (10 + boost);
  }

  moveRight(boost) {
    this.setData('isMoving', true);
    if(this.body.velocity.x < 0)
      this.body.velocity.x = 0;
    this.body.velocity.x += 10 + boost;
  }

  moveDown(boost) {
    this.setData('isMoving', true);
    if(this.body.velocity.y < 0)
      this.body.velocity.y = 0;
    this.body.velocity.y += 10 + boost;
  }

  moveUp(boost) {
    this.setData('isMoving', true);
    if(this.body.velocity.y > 0)
      this.body.velocity.y = 0;
    this.body.velocity.y -= (10 + boost);
  }

  shoot(pointerX, pointerY) {
    const bullet = new Bullet(this.scene, this.x, this.y, true);
    bullet.setTint(0xf90018);
    bullet.setOrigin(0.5);
    bullet.setData('isFriendly', true);
    let angle = Phaser.Math.Angle.Between(this.x, this.y, pointerX, pointerY);
    bullet.setRotation(angle);
    const speed = 1000;
    bullet.body.setVelocity(
      // TODO: Set this in the direction of mouse click
      speed * Math.cos(angle) + Phaser.Math.Between(-50, 50),
      speed * Math.sin(angle) + Phaser.Math.Between(-50, 50)
    );
    this.scene.bullets.add(bullet);
  }

  update() {
    if (!this.getData('isMoving')) {
      this.body.velocity.x *= 0.95;
      this.body.velocity.y *= 0.95;
    }
    this.setData('isMoving', false);
  }
}
