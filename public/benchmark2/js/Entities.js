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
    this.body.setVelocity(
      Phaser.Math.Between(-100, 100),
      Phaser.Math.Between(-100, 100)
    );
    this.setData('level', 0);
  }
}

class Dog extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    this.body.setVelocity(
      Phaser.Math.Between(-100, 100),
      Phaser.Math.Between(-100, 100)
    );
    this.shootTimer = this.scene.time.addEvent({
      delay: 1000,
      callback: function() {
        if (this.scene !== undefined) {
          if (key == keys.DOGKEY) {
            const dx = this.scene.player.x - this.x;
            const dy = this.scene.player.y - this.y;
            const angle = Math.atan2(dy, dx);

            const bullet = new Bullet(this.scene, this.x, this.y, false);
            bullet.setData('isFriendly', false);
            this.setScale(0.3, 0.3);
            bullet.body.setVelocity(
              100 * Math.cos(angle),
              100 * Math.sin(angle)
            );
            this.scene.bullets.add(bullet);
          } else if (key == 'dogLarge') {
            const angle = (Phaser.Math.Between(0, 360) * Math.PI) / 180;

            const bullet = new Bullet(this.scene, this.x, this.y, false);
            bullet.setData('isFriendly', false);
            this.setScale(0.6, 0.6);
            bullet.body.setVelocity(
              100 * Math.cos(angle),
              100 * Math.sin(angle)
            );
            this.scene.bullets.add(bullet);
          }
        }
      },
      callbackScope: this,
      loop: true
    });
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
    super(scene, x, y, 'sprBullet');
    this.setData('isFriendly', isFriendly);
  }
}

class Leo extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, keys.CATKEY);
    this.body.setCollideWorldBounds(true);
    this.setData('isMoving', false);
    this.setScale(0.5, 0.5);
  }

  moveLeft(boost) {
    this.setData('isMoving', true);

    this.body.velocity.x -= 2 - boost;
  }

  moveRight(boost) {
    this.setData('isMoving', true);

    this.body.velocity.x += 2 + boost;
  }

  moveDown(boost) {
    this.setData('isMoving', true);

    this.body.velocity.y += 2 + boost;
  }

  moveUp(boost) {
    this.setData('isMoving', true);

    this.body.velocity.y -= 2 - boost;
  }

  shoot() {
    const bullet = new Bullet(this.scene, this.x, this.y, true);
    bullet.setOrigin(0.5);
    bullet.setData('isFriendly', true);

    const speed = 1000;
    bullet.body.setVelocity(
      // TODO: Set this in the direction of mouse click
      speed * Math.cos(this.rotation) + Phaser.Math.Between(-50, 50),
      speed * Math.sin(this.rotation) + Phaser.Math.Between(-50, 50)
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
