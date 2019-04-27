import * as constants from '../../shared/constants.js';
import {random, aimBot, kamikazi} from './AI.js';

class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
  }

  getInitVelocity(scene, x, y) {
    let width = scene.game.config.width;
    let height = scene.game.config.height;
    let player = scene.player;
    let buffer = 128;
    let velocityX = Phaser.Math.Between(
      -1 * gameConfig.maxVelocityX,
      gameConfig.maxVelocityX
    );

    if (x < player.x - width / 2 + buffer)
      velocityX = Phaser.Math.Between(
        gameConfig.minVelocityX,
        gameConfig.maxVelocityX
      );
    else if (x > player.x + width / 2 - buffer)
      velocityX = Phaser.Math.Between(
        -1 * gameConfig.maxVelocityX,
        -1 * gameConfig.minVelocityX
      );

    let velocityY = Phaser.Math.Between(
      -1 * gameConfig.maxVelocityY,
      gameConfig.maxVelocityY
    );

    if (y < 0 + buffer)
      velocityY = Phaser.Math.Between(
        gameConfig.minVelocityY,
        gameConfig.maxVelocityY
      );
    else if (y > height - buffer)
      velocityY = Phaser.Math.Between(
        -1 * gameConfig.maxVelocityX,
        -1 * gameConfig.minVelocityX
      );

    return [velocityX, velocityY];
  }
}

export class Asteroid extends Entity {
  constructor(scene, x, y, key, velocityX, velocityY) {
    super(scene, x, y, key);
    let asteroids = [
      constants.ASTEROID0KEY,
      constants.ASTEROID1KEY,
      constants.ASTEROID2KEY,
      constants.ASTEROID3KEY
    ];
    let level = asteroids.indexOf(key);

    if (level >= 0) {
      this.setData('health', gameConfig[`asteroid${level}Health`]);
      this.setData('damage', gameConfig[`asteroid${level}Damage`]);
    }

    if (level == 3) {
      this.body.setMass(100);
      this.setTint(0xfff572);
      this.setScale(1.5);
    }
    this.body.setCircle(this.displayWidth * 0.5);

    if (typeof velocityX != 'undefined' && typeof velocityY != 'undefined') {
      this.body.setVelocity(velocityX, velocityY);
    } else {
      let velocity = this.getInitVelocity(scene, x, y);
      this.body.setVelocity(velocity[0], velocity[1]);
    }
    this.setData('level', level);
  }

  damage(damage) {
    let health = this.getData('health');

    this.setData('health', health - damage);
    if (health - damage <= 0) {
      this.destroy();
    }
  }
}

export class Dog extends Entity {
  constructor(scene, x, y, level, velocityX, velocityY, health, damage, fireRate) {
    let key = constants[`DOG${level}KEY`];
    super(scene, x, y, key);
    
    this.setData('dogId', level);
    this.setData('health', health);
    this.setData('damage', damage);
    this.setData('fireRate', fireRate);
    this.play(constants.dogAnimationKeys[`DOG${level}IDLEKEY`]);

    if (level == 1) {
      this.setScale(0.4, 0.4);
      aimBot(this, 0x142bff, Bullet);
    }
    if (key == constants.DOG2KEY) {
      this.setScale(0.6, 0.6);
      aimBot(this, 0x3dff23, Bullet);
    }
    if (key == constants.DOG3KEY) {
      this.setScale(0.8, 0.8);
      kamikazi(this);
    }

    if (typeof velocityX != 'undefined' && typeof velocityY != 'undefined')
      this.body.setVelocity(velocityX, velocityY);
    else {
      let velocity = this.getInitVelocity(scene, x, y);
      this.body.setVelocity(velocity[0], velocity[1]);
    }
  }

  damage(damage) {
    let health = this.getData('health');

    this.setData('health', health - damage);
    if (health - damage <= 0) {
      this.onDestroy();
      this.destroy();
    } else {
      let animKey =
        constants.dogAnimationKeys[`DOG${this.getData('dogId')}DAMAGEKEY`];

      if (animKey) this.play(animKey);
      this.once('animationcomplete', function() {
        this.play(
          constants.dogAnimationKeys[`DOG${this.getData('dogId')}IDLEKEY`]
        );
      });
    }
  }

  onDestroy() {
    if (this.shootTimer !== undefined) {
      if (this.shootTimer) {
        this.shootTimer.remove(false);
      }
    }
  }
}

export class Bullet extends Entity {
  constructor(scene, x, y, isFriendly) {
    super(scene, x, y, constants.BULLETKEY);
    this.setData('isFriendly', isFriendly);
  }
}

export class Laser extends Entity {
  constructor(
    scene,
    x,
    y,
    isFriendly,
    scale,
    angle,
    damage,
    delay,
    duration,
    sprites,
    deltaX
  ) {
    super(scene, x, y, constants.DOGLASERKEY);
    this.setData('isFriendly', isFriendly);
    let laserDelay = gameConfig.laserDelay;
    let laserDuration = gameConfig.laserDuration;
    let laserSprites = gameConfig.laserSprites;
    let laserDamage = gameConfig.laserDamage;
    let laserDeltaX = 0;

    if (typeof damage != 'undefined') laserDamage = damage;
    if (typeof delay != 'undefined') laserDelay = delay;
    if (typeof duration != 'undefined') laserDuration = duration;
    if (typeof sprites != 'undefined') laserSprites = sprites;
    if (typeof deltaX != 'undefined') laserDeltaX = deltaX;

    this.setData('damage', laserDamage);
    this.setData('deltaX', laserDeltaX);
    this.setData('fired', false);

    if (!angle) this.setData('angle', this.randomAngle());
    else this.setData('angle', angle);

    this.visible = false;
    this.segments = new Array(laserSprites);

    let pointx = this.scene.game.config.width * Math.cos(this.getData('angle'));
    let pointy = this.scene.game.config.width * Math.sin(this.getData('angle'));

    this.path = new Phaser.Curves.Path(x - pointx, y - pointy);
    this.path.lineTo(x + pointx, y + pointy);

    for (var i = 0; i < this.segments.length; i++) {
      let segment = this.scene.add.follower(
        this.path,
        this.path.getStartPoint().x,
        this.path.getStartPoint().y,
        constants.DOGLASERKEY
      );
      this.scene.physics.world.enableBody(segment, 0);
      segment.setTint(0xed687b);
      segment.setScale(scale);
      segment.setData('damage', this.getData('damage'));
      this.segments[i] = segment;
    }
    this.scene.laserSegments.addMultiple(this.segments);
    this.alertLine = this.scene.add.graphics();
    this.alertLine.lineStyle(1, 0xffffff, 1);

    this.alert = this.scene.tweens.add({
      targets: this.alertLine,
      duration: 100,
      alpha: 0,
      yoyo: true,
      loop: -1,
      pause: true,
      callbackScope: this
    });

    this.shootCounter = 0;
    this.shoot = this.scene.time.addEvent({
      delay: laserDelay,
      callback: function() {
        this.segments[this.shootCounter].startFollow({
          duration: 1000
        });
        this.shootCounter++;

        if (this.shootCounter >= laserSprites) this.shootCounter = 0;
      },
      callbackScope: this,
      loop: true,
      paused: true
    });

    this.destroyTimer = this.scene.time.addEvent({
      delay: laserDuration,
      callback: function() {
        this.onDestroy();
        this.destroy();
      },
      callbackScope: this,
      loop: false,
      paused: true
    });
  }

  randomAngle() {
    return Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
  }

  fire() {
    this.setData('fired', true);
    this.path.draw(this.alertLine);
    this.alert.paused = false;

    this.scene.time.addEvent({
      delay: 1500,
      callback: function() {
        this.alertLine.clear();
        this.alert.pause();
        this.shoot.paused = false;
        this.destroyTimer.paused = false;
      },
      callbackScope: this,
      loop: false
    });
  }

  onDestroy() {
    this.shoot.paused = true;
    let scene = this.scene;
    this.segments.forEach(function(segment) {
      //segment.destroy();
      scene.laserSegments.remove(segment, true, true);
    });
  }
}

export class Leo extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, constants.CATKEY);
    this.body.setCollideWorldBounds(true);
    this.setData('isMoving', false);
    this.setData('health', gameConfig.maxPlayerHealth);
    this.setData('oxygen', gameConfig.maxPlayerOxygen);
    this.setData('oxygenAsteroid', null);
    this.setData('grapplePoint', null);
    this.grappleLine = this.scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 0xffffff
      }
    });
    this.setScale(0.5, 0.5);
    this.setDepth(gameDepths.uiDepth - 1);
  }

  moveLeft(boost) {
    this.setData('isMoving', true);
    if (this.body.velocity.x > 0) this.body.velocity.x = 0;

    if (this.body.velocity.x > -1 * gameConfig.softMaxPlayerVelocityX)
      this.body.velocity.x -= gameConfig.playerSpeedX;

    if (this.body.velocity.x > -1 * gameConfig.hardMaxPlayerVelocityX)
      this.body.velocity.x -= boost;
    else this.body.velocity.x = -1 * gameConfig.hardMaxPlayerVelocityX;
  }

  moveRight(boost) {
    this.setData('isMoving', true);
    if (this.body.velocity.x < 0) this.body.velocity.x = 0;

    if (this.body.velocity.x < gameConfig.softMaxPlayerVelocityX)
      this.body.velocity.x += gameConfig.playerSpeedX;

    if (this.body.velocity.x < gameConfig.hardMaxPlayerVelocityX)
      this.body.velocity.x += boost;
    else this.body.velocity.x = gameConfig.hardMaxPlayerVelocityX;
  }

  moveDown(boost) {
    this.setData('isMoving', true);
    if (this.body.velocity.y < 0) this.body.velocity.y = 0;

    if (this.body.velocity.y < gameConfig.softMaxPlayerVelocityY)
      this.body.velocity.y += gameConfig.playerSpeedY;

    if (this.body.velocity.y < gameConfig.hardMaxPlayerVelocityY)
      this.body.velocity.y += boost;
    else this.body.velocity.y = gameConfig.hardMaxPlayerVelocityY;
  }

  moveUp(boost) {
    this.setData('isMoving', true);
    if (this.body.velocity.y > 0) this.body.velocity.y = 0;

    if (this.body.velocity.y > -1 * gameConfig.softMaxPlayerVelocityY)
      this.body.velocity.y -= gameConfig.playerSpeedY;
    if (this.body.velocity.y > -1 * gameConfig.hardMaxPlayerVelocityY)
      this.body.velocity.y -= boost;
    else this.body.velocity.y = -1 * gameConfig.hardMaxPlayerVelocityY;
  }

  moveTo(x, y, speed) {
    if (speed > gameConfig.hardMaxPlayerVelocityX)
      speed = gameConfig.hardMaxPlayerVelocityX;
    this.scene.physics.velocityFromAngle(
      Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, x, y)),
      speed,
      this.scene.player.body.velocity
    );
  }

  shoot(pointerX, pointerY) {
    const bullet = new Bullet(this.scene, this.x, this.y, true);
    bullet.setTint(0xf90018);
    bullet.setOrigin(0.5);
    bullet.setData('damage', gameConfig.playerDamage);
    let angle = Phaser.Math.Angle.Between(this.x, this.y, pointerX, pointerY);
    bullet.setRotation(angle);
    const speed = 1000;
    bullet.body.setVelocity(
      speed * Math.cos(angle) + Phaser.Math.Between(-50, 50),
      speed * Math.sin(angle) + Phaser.Math.Between(-50, 50)
    );
    this.scene.bullets.add(bullet);
  }
  damage(damage) {
    const isInvulnerable = cheats.invulnerable;
    if (!isInvulnerable) {
      this.setData('health', this.getData('health') - damage);
      if (this.getData('health') < 0) {
        this.setData('health', 0);
      } else if (this.getData('health') > gameConfig.maxPlayerHealth) {
        this.setData('health', gameConfig.maxPlayerHealth);
      }
    }

    if (this.getData('health') <= 0) {
      this.scene.gameOver = true;
      this.play(constants.DYINGKEY);

      this.scene.time.addEvent({
        delay: 2000,
        callback: function() {
          this.scene.scene.pause(constants.GAMEKEY);
          this.scene.scene.start(constants.GAMEOVERKEY);
        },
        callbackScope: this,
        loop: false
      });
    }
  }

  oxygenDamage(damage) {
    this.setData('oxygen', this.getData('oxygen') - damage);
    if (this.getData('oxygen') < 0) {
      this.setData('oxygen', 0);
      this.damage(gameConfig.oxygenDamage);
    } else if (this.getData('oxygen') > gameConfig.maxPlayerOxygen) {
      this.setData('oxygen', gameConfig.maxPlayerOxygen);
      //play oxygen replenished sound
    }
  }

  grapple() {
    if (!this.getData('oxygenAsteroid')) {
      let point = this.getData('grapplePoint');
      this.deployGrapple(point);
      let distance = Math.sqrt(
        Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2)
      );
      let speed = (gameConfig.grappleSpeed * distance) / 200;
      this.moveTo(point.x, point.y, speed);
    } else {
      this.setData('grapplePoint', null);
    }
  }
  reelGrapple() {
    this.grappleLine.clear();
  }

  deployGrapple(point) {
    this.grappleLine.clear().lineStyle(1, 0xffffff);
    this.grappleLine.strokeLineShape({
      x1: this.x,
      y1: this.y,
      x2: point.x,
      y2: point.y
    });
  }

  followAsteroid(rad) {
    let asteroid = this.getData('oxygenAsteroid');
    let radius = asteroid.displayWidth / 2;
    let angle =
      Phaser.Math.Angle.Between(
        asteroid.x - asteroid.body.deltaX(),
        asteroid.y - asteroid.body.deltaY(),
        this.x,
        this.y
      ) + rad;
    this.setRotation(angle + Math.PI / 2);
    this.x = asteroid.x + radius * Math.cos(angle);
    this.y = asteroid.y + radius * Math.sin(angle);

    if (this.y < 0 + this.displayHeight / 2) {
      this.y = this.displayHeight / 2;
      this.setData('oxygenAsteroid', null);
    } else if (
      this.y >
      this.scene.game.config.height - this.displayHeight / 2
    ) {
      this.y = this.scene.game.config.height - this.displayHeight / 2;
      this.setData('oxygenAsteroid', null);
    }
    let camera = this.scene.cameras.main;
    if (this.x < camera.scrollX + this.displayWidth / 2) {
      this.x = camera.scrollX + this.displayWidth / 2;
      this.setData('oxygenAsteroid', null);
    } else if (
      this.x >
      camera.scrollX + this.scene.game.config.width - this.displayWidth / 2
    ) {
      this.x =
        camera.scrollX + this.scene.game.config.width - this.displayWidth / 2;
      this.setData('oxygenAsteroid', null);
    }
  }

  update() {
    if (!this.getData('isMoving')) {
      this.body.velocity.x *= 0.95;
      this.body.velocity.y *= 0.95;
    }
    this.setData('isMoving', false);

    if (!this.getData('oxygenAsteroid')) this.setRotation(this.rotation * 0.8);
  }
}
