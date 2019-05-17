import * as constants from './utils/constants.js';
import * as AI from './AI.js';
import { addBulletCollisions } from './Collisions.js';

class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
  }

  getInitVelocity(scene, x, y) {
    let sceneConfig = scene.gameConfig;

    let width = scene.game.config.width;
    let height = scene.game.config.height;
    let player = scene.player;
    let buffer = 128;
    let velocityX = Phaser.Math.Between(
      -1 * sceneConfig.maxVelocityX,
      sceneConfig.maxVelocityX
    );

    if (x < player.x - width / 2 + buffer)
      velocityX = Phaser.Math.Between(
        sceneConfig.minVelocityX,
        sceneConfig.maxVelocityX
      );
    else if (x > player.x + width / 2 - buffer)
      velocityX = Phaser.Math.Between(
        -1 * sceneConfig.maxVelocityX,
        -1 * sceneConfig.minVelocityX
      );

    let velocityY = Phaser.Math.Between(
      -1 * sceneConfig.maxVelocityY,
      sceneConfig.maxVelocityY
    );

    if (y < 0 + buffer)
      velocityY = Phaser.Math.Between(
        sceneConfig.minVelocityY,
        sceneConfig.maxVelocityY
      );
    else if (y > height - buffer)
      velocityY = Phaser.Math.Between(
        -1 * sceneConfig.maxVelocityX,
        -1 * sceneConfig.minVelocityX
      );

    return [velocityX, velocityY];
  }
}

export class Asteroid extends Entity {
  constructor(scene, x, y, key, velocityX, velocityY, health, damage) {
    super(scene, x, y, key);
    let asteroids = [
      constants.ASTEROID0KEY,
      constants.ASTEROID1KEY,
      constants.ASTEROID2KEY,
      constants.ASTEROID3KEY,
      constants.MOONKEY
    ];
    let level = asteroids.indexOf(key);
    let sceneConfig = scene.gameConfig;

    if (level >= 0) {
      this.setData('health', health || sceneConfig[`asteroid${level}Health`]);
      this.setData('damage', damage || sceneConfig[`asteroid${level}Damage`]);
    }
    if (level == 4) {
      this.body.setMass(100);
    }

    if (level == 3) {
      this.body.setMass(100);
      this.setTint(0xfff572);
      this.setScale(1.5);
      this.body.setCircle(this.displayWidth * 0.3, this.displayWidth * 0.03);
    } else {
      this.body.setCircle(this.displayWidth * 0.5);
    }

    if (Math.random() < 0.5) {
      this.scene.tweens.add({
        targets: this,
        duration: Phaser.Math.Between(80000, 100000),
        angle: Math.random() < 0.5 ? -360 : 360,
        loop: -1,
        paused: false,
        callbackScope: this
      });
    }

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
      if (this.getData('level') == 3) {
        if (!this.anims.isPlaying) {
          this.play(constants.OXYGENBREAKINGKEY);
          let asteroid = this;
          this.once('animationcomplete', function() {
            if (asteroid == asteroid.scene.player.getData('oxygenAsteroid'))
              asteroid.scene.player.setData('oxygenAsteroid', null);
            asteroid.destroy();
          });
        }
      } else this.destroy();
    }
  }
}

export class Dog extends Entity {
  constructor(
    scene,
    x,
    y,
    level,
    velocityX,
    velocityY,
    health,
    damage,
    fireRate
  ) {
    let key = constants[`DOG${level}KEY`];
    super(scene, x, y, key);
    let sceneConfig = scene.gameConfig;

    let dogHealth = sceneConfig[`dog${level}Health`];
    let dogDamage = sceneConfig[`dog${level}Damage`];
    let dogFireRate = sceneConfig[`dog${level}FireRate`];

    if (health && typeof health != 'undefined') dogHealth = health;
    if (damage && typeof damage != 'undefined') dogDamage = damage;
    if (fireRate && typeof fireRate != 'undefined') dogFireRate = fireRate;

    this.setData('dogId', level);
    this.setData('health', dogHealth);
    this.setData('damage', dogDamage);
    this.setData('fireRate', dogFireRate);
    let animKey = constants.dogAnimationKeys[`DOG${level}IDLEKEY`];
    if (animKey) this.play(animKey);

    let self = this;
    if (level == 1) {
      this.setScale(0.4, 0.4);

      AI.setAI(this, function() {
        AI.aimBot(self, 0x142bff, Bullet);
      });
      AI.setMovement(this, function() {
        AI.circle(self);
      });
    }
    if (key == constants.DOG2KEY) {
      this.setScale(0.6, 0.6);

      AI.setAI(this, function() {
        AI.aimBot(self, 0x3dff23, Bullet);
      });
      AI.setMovement(this, function() {
        AI.stayInMap(self, scene);
      });
    }
    if (key == constants.DOG3KEY) {
      this.setScale(0.8, 0.8);

      AI.setMovement(this, function() {
        AI.kamikazi(self);
      });
    }
    if (key == constants.DOG4KEY) {
      this.setScale(0.6, 0.6);
      this.body.setCircle(this.displayWidth * 0.65, 10, 20);
      AI.setAI(this, function() {
        AI.aimBot(self, 0xaa00ff, Bullet);
      });

      AI.setMovement(this, function() {
        AI.rotate(self, -Math.PI / 2);
      });
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
    if (this.movement !== undefined) {
      if (this.movement) {
        this.movement.remove(false);
      }
    }
    let explosion = this.scene.add.sprite(this.x, this.y, constants.EXPLOSION);
    explosion.setScale(0.4);
    this.scene.tweens.add({
      targets: explosion,
      duration: 300,
      alpha: 0,
      callbackScope: this
    });

    this.emit('destroyed');
  }
}

export class Explosion extends Entity{
  constructor(scene, x, y, scale) {
    super(scene, x, y, constants.EXPLOSION);
    if (scale && typeof scale != 'undefined') this.setScale(scale);
    else this.setScale(Math.random());

    this.explode = this.scene.tweens.add({
      targets: this,
      duration: 100,
      alpha: 0,
      callbackScope: this
    });

  }
}

export class Bullet extends Entity {
  constructor(scene, x, y, isFriendly, type) {
    if (type === 'plasma') {
      super(scene, x, y, constants.BULLET2KEY);
      this.capacity = this.scene.gameConfig.ammoCount;
      this.ammoCount = this.scene.gameConfig.ammoCount;
    } else if (type === 'laser') {
      super(scene, x, y, constants.BULLETKEY);
    } else {
      super(scene, x, y, constants.BULLETKEY);
    }

    this.setData('isFriendly', isFriendly);
    this.type = type;
    this.colliders = [];
  }

  removeColliders() {
    for (let i = 0; i < this.colliders.length; i++) {
      this.scene.physics.world.removeCollider(this.colliders[i]);
    }

    this.colliders = [];
  }

  setType(type) {
    if (type === 'plasma') {
      this.setTexture(constants.BULLET2KEY);
      this.capacity = this.scene.gameConfig.ammoCount;
      this.ammoCount = this.scene.gameConfig.ammoCount;
    } else if (type === 'laser') {
      this.setTexture(constants.BULLETKEY);
    } else {
      this.setTexture(constants.BULLETKEY);
    }

    this.type = type;
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
    deltaX,
    fireDelay,
    beginY
  ) {
    super(scene, x, y, constants.DOGLASERKEY);
    this.setData('isFriendly', isFriendly);

    let sceneConfig = scene.gameConfig;
    let laserDelay = sceneConfig.laserDelay;
    let laserDuration = sceneConfig.laserDuration;
    let laserSprites = sceneConfig.laserSprites;
    let laserDamage = sceneConfig.laserDamage;
    let laserDeltaX = 0;
    let laserFireDelay = sceneConfig.laserFireDelay;
    this.firing = false;

    //if (damage && typeof damage != 'undefined') laserDamage = damage;
    if (delay && typeof delay != 'undefined') laserDelay = delay;
    if (duration && typeof duration != 'undefined') laserDuration = duration;
    if (sprites && typeof sprites != 'undefined') laserSprites = sprites;
    if (deltaX && typeof deltaX != 'undefined') laserDeltaX = deltaX;
    if (fireDelay && typeof fireDelay != 'undefined')
      laserFireDelay = fireDelay;

    this.setData('damage', laserDamage);
    this.setData('deltaX', laserDeltaX);
    this.setData('fireDelay', laserFireDelay);
    this.setData('fired', false);

    if (!angle) this.setData('angle', this.randomAngle());
    else this.setData('angle', angle);
    this.visible = false;
    this.segments = new Array(laserSprites);

    let pointx =
      this.scene.game.config.width * 2 * Math.cos(this.getData('angle'));
    let pointy = this.scene.game.config.width * Math.sin(this.getData('angle'));

    if (beginY) {
      this.path = new Phaser.Curves.Path(x - pointx, beginY);
    } else {
      this.path = new Phaser.Curves.Path(x - pointx, y - pointy);
    }
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
    this.alertLine.lineStyle(2, 0xffffff, 1);

    this.alert = this.scene.tweens.add({
      targets: this.alertLine,
      duration: 100,
      alpha: 0,
      yoyo: true,
      loop: -1,
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
        this.emit('laserFired');
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
    this.path.draw(this.alertLine, 8);

    this.scene.sound.play(constants.RAYSTARTUP, { volume: 0.1 });

    this.scene.time.addEvent({
      delay: this.getData('fireDelay'),
      callback: function() {
        this.alertLine.clear();
        this.alert.pause();
        this.shoot.paused = false;
        this.destroyTimer.paused = false;
        this.scene.sound.play(constants.RAYFIRING, { volume: 0.1 });
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

    this.segments = [];
  }
}

class DogWallWeapon extends Entity {
  constructor(scene, x, y, key, parentEntity, moveVelocity) {
    super(scene, x, y, key);
    this.y += this.body.halfHeight;
    this.parentEntity = parentEntity;
    this.isMoving = false;
    this.performingAction = false;
    this.movingLeft = true;
    this.moveVelocity = moveVelocity;
    this.laserFiring = false;
  }

  beginGarbageExpulsion() {
    if (!this.body) return;
    this.performingAction = true;
    this.once('animationcomplete', function() {
      if (!this.body) return;
      this.performingAction = false;
      this.parentEntity.emit('garbageLaunched');
      this.setTexture(constants.DOGWALLWEAPONKEY);
    });
    this.play(constants.BOSSWEAPONCHARGINGKEY);
  }

  beginMovement() {
    // Strafe left to right
    this.isMoving = true;
  }

  fireLaser() {
    if (!this.body) return;
    this.performingAction = true;
    this.laserFiring = true;
    let laserToFire = new Laser(
      this.scene,
      this.x,
      this.y,
      true,
      3,
      Math.PI / 2,
      null,
      0,
      null,
      null,
      null,
      0,
      this.y + 1
    );
    let self = this;
    laserToFire.once('laserFired', function() {
      self.laserFiring = false;
      self.performingAction = false;
      self.setTexture(constants.DOGWALLWEAPONKEY);
    });
    laserToFire.fire();

    this.play(constants.BOSSWEAPONCHARGINGKEY);
  }

  update() {
    if (!this.scene || !this.body) return;

    if (!this.performingAction && this.isMoving) {
      if (
        this.x <
        this.parentEntity.x -
          this.parentEntity.body.halfWidth +
          this.body.halfWidth
      ) {
        this.movingLeft = false;
      } else if (
        this.x >
        this.parentEntity.x +
          this.parentEntity.body.halfWidth -
          this.body.halfWidth
      ) {
        this.movingLeft = true;
      }
      let velocity = this.moveVelocity * (this.movingLeft ? -1 : 1);
      this.x += velocity;
    }
    if (
      Math.abs(this.x - this.scene.player.x) < 75 &&
      Math.random() < 0.01 &&
      !this.laserFiring &&
      !this.parentEntity.bodySlamming
    ) {
      this.fireLaser();
    }
  }
}

export class DogWall extends Entity {
  constructor(scene, x, y, key, health, damage, moveVelocity, slamVelocity) {
    super(scene, x, y, key);
    this.setData('health', health);
    this.maxHealth = health;
    this.setData('damage', damage);
    this.body.immovable = true;
    this.setData('resetX', x);
    this.setData('resetY', y);
    this.setData('moveVelocity', moveVelocity);
    this.setData('slamVelocity', slamVelocity);
    this.garbageExpelled = false;
    this.plannedActions = [];
    this.hardPoints = [];
    this.currentPattern = [];
    this.weapon = new DogWallWeapon(
      scene,
      x,
      y + this.body.halfHeight,
      constants.DOGWALLWEAPONKEY,
      this,
      5
    );
    this.asteroidCircle = new Phaser.Geom.Circle(
      this.weapon.x,
      y + this.body.halfHeight + 100,
      100
    );
    this.body.setOffset(0, -25);
    this.doneExpelling = false;
    this.firstUpdate = true;
    this.activatedMover = false;
    this.actionCooldown = 0;
    this.firstQuarterHardPoints = false;
    this.secondQuarterHardPoints = false;
    this.thirdQuarterHardPoints = false;
    this.bodySlamming = false;
    this.barkSoundPlaying = false;

    this.play(constants.DOGWALLIDLEKEY);
    this.setScale(2);
  }

  damage(damage) {
    if (!this.body) return;
    let health = this.getData('health');

    this.setData('health', health - damage);
    if (health - damage <= 0) {
      this.onDestroy();
      this.destroy();
    }

    // TODO: add damaged animation
  }

  onDestroy() {
    
    this.weapon.destroy();
    let hardPointLength = this.hardPoints.length;
    for (let i = 0; i < hardPointLength; i++) {
      this.hardPoints.pop().destroy();
    }
    this.scene.endPointX = 0;
  }

  /**
   * Method to be called every frame
   */
  update() {
    if (!this.body) return;
    if (this.firstUpdate) {
      this.spawnHardPoints();
      this.firstUpdate = false;
    }
    if (this.plannedActions.length == 0 && this.actionCooldown == 0) {
      this.think();
    } else if (this.plannedActions.length !== 0) {
      if (this.plannedActions[0]()) {
        this.plannedActions.shift();
      }
    } else {
      this.actionCooldown--;
    }
    this.weapon.update();
  }

  /**
   * AI to decide which action's to take/queue up
   */
  think() {
    // think
    if (this.getData('health') < this.maxHealth / 2 && !this.activatedMover) {
      this.plannedActions.push(this.activateLaserMover.bind(this));
      this.activatedMover = true;
    }
    this.actionCooldown = 120;
    if (
      this.hardPoints.length === 0 &&
      Math.random() < 0.16 &&
      ((!this.firstQuarterHardPoints &&
        this.getData('health') < (this.maxHealth * 3) / 4) ||
        (!this.secondQuarterHardPoints &&
          this.getData('health') < this.maxHealth / 2) ||
        (!this.thirdQuarterHardPoints &&
          this.getData('health') < this.maxHealth / 4))
    ) {
      if (!this.firstQuarterHardPoints) this.firstQuarterHardPoints = true;
      else if (!this.secondQuarterHardPoints)
        this.secondQuarterHardPoints = true;
      else if (!this.thirdQuarterHardPoints) this.thirdQuarterHardPoints = true;

      this.spawnHardPoints();
    } else if (
      Math.abs(this.scene.player.x - this.weapon.x) <
        this.scene.gameConfig.worldWidth / 3 &&
      Math.random() < 0.1 &&
      !this.weapon.performingAction
    ) {
      // If weapon and player are in the same third, 5% chance to expel garbage
      this.plannedActions.push(this.expelGarbage.bind(this));
    } else if (Math.random() < 0.1 && !this.weapon.laserFiring) {
      this.bodySlamming = true;
      if (this.scene.player.x < this.scene.gameConfig.worldWidth / 2) {
        this.bodySlam(true);
      } else {
        this.bodySlam(false);
      }
    } else {
      this.actionCooldown = 0;
    }
  }

  playBarkSound() {
    if (!this.barkSoundPlaying && this.scene != undefined) {
      this.scene.sound.play(constants.BARKAUDIO, { volume: 0.2 });
      this.barkSoundPlaying = true;

      setInterval(() => {
        this.barkSoundPlaying = false;
      }, 1000);
    }

    return true;
  }

  /**
   * A body slam attack where the dog wall flies straight down, if the player gets caught in it they die
   * @param {boolean} goLeft If true, body slams on the left side of the screen, otherwise body slam the right
   */
  bodySlam(goLeft) {
    if (!this.body) return;
    let targetX;
    this.scene.sound.play(constants.GROWLAUDIO, { volume: 0.2 });
    if (goLeft) {
      targetX = this.getData('resetX') - this.body.width / 3;
    } else {
      targetX = this.getData('resetX') + this.body.width / 3;
    }
    this.plannedActions.push(
      this.dogWallMoveTo.bind(
        this,
        targetX,
        this.getData('resetY'),
        this.getData('moveVelocity'),
        false
      )
    );
    this.plannedActions.push(this.playBarkSound.bind(this));
    this.plannedActions.push(
      this.dogWallMoveTo.bind(
        this,
        targetX,
        this.scene.gameConfig.worldHeight - this.body.halfHeight,
        this.getData('slamVelocity'),
        false
      )
    );
    this.plannedActions.push(
      this.dogWallMoveTo.bind(
        this,
        targetX,
        this.getData('resetY'),
        this.getData('moveVelocity'),
        false
      )
    );
    this.plannedActions.push(
      this.dogWallMoveTo.bind(
        this,
        this.getData('resetX'),
        this.getData('resetY'),
        this.getData('moveVelocity'),
        true
      )
    );
  }

  /**
   * Moves the dog wall to the specified point with the specified velocity. Returns true if
   * @param {number} x x-coordinate of target movement
   * @param {number} y y-coordinate of target movement
   * @param {number} velocity Velocity to move at, must be positive
   */
  dogWallMoveTo(x, y, velocity, lastMove) {
    if (!this.body) return;
    console.assert(velocity > 0, 'Error, dog wall given an invalid velocity');
    let epsilon = 0.05;
    let deltaX;
    if (Math.abs(this.x - x) >= velocity) {
      let newX = this.x + velocity * Math.sign(x - this.x);
      deltaX = newX - this.x;
      this.x = newX;
    } else {
      deltaX = x - this.x;
      this.body.setVelocityX(0);
      this.x = x;
    }
    let deltaY;
    if (Math.abs(this.y - y) >= velocity) {
      let newY = this.y + velocity * Math.sign(y - this.y);
      deltaY = newY - this.y;
      this.y = newY;
    } else {
      deltaY = y - this.y;
      this.y = y;
    }
    this.hardPoints.forEach(function(hardPoint) {
      hardPoint.x += deltaX;
      hardPoint.y += deltaY;
    });

    this.weapon.x += deltaX;
    this.weapon.y += deltaY;
    let result =
      Math.abs(this.x - x) < epsilon && Math.abs(this.y - y) < epsilon;
    if (result && lastMove) {
      this.bodySlamming = false;
    }
    return result;
  }

  /**
   * Expels a bunch of garbage (asteroids) in front of the dog wall
   */
  expelGarbage() {
    if (!this.body) return;
    if (!this.garbageExpelled) {
      // play an animation, then spawn a bunch of asteroids
      // Start animation on the dog wall weapon
      // weapon will emit the garbageLaunched event, handle it here
      this.once(
        'garbageLaunched',
        function() {
          let { x, y } = this.getWeaponLocation();
          // Spawn 10 med and 3 large asteroids in a circle
          this.asteroidCircle.setPosition(x, this.asteroidCircle.y);
          let point = new Phaser.Geom.Point();
          for (let i = 0; i < 13; i++) {
            this.asteroidCircle.getRandomPoint(point);
            // create asteroid here
            //constructor(scene, x, y, key, velocityX, velocityY, health, damage)
            let asteroid;
            if (i < 10)
              asteroid = new Asteroid(
                this.scene,
                point.x,
                point.y,
                constants.ASTEROID1KEY,
                0,
                40,
                gameConfig.asteroid1Health,
                gameConfig.asteroid1Damage
              );
            else
              asteroid = new Asteroid(
                this.scene,
                point.x,
                point.y,
                constants.ASTEROID0KEY,
                0,
                40,
                gameConfig.asteroid0Health,
                gameConfig.asteroid0Damage
              );
            this.scene.asteroids.add(asteroid);
            this.doneExpelling = true;
          }
        }.bind(this)
      );
      this.weapon.beginGarbageExpulsion();

      this.garbageExpelled = true;
      this.doneExpelling = false;
      return false;
    }

    if (this.doneExpelling) {
      this.garbageExpelled = false;
      return true;
    } else {
      return false;
    }
  }

  getWeaponLocation() {
    if (!this.weapon) return;
    return { x: this.weapon.x, y: this.weapon.y };
  }

  spawnHardPoints() {
    if (!this.body) return;
    // (x = 28 + 44, ymin = 375), (x = 190 + 41, ymin = 359), (x = 943 + 41, ymin = 359), (x = 1099 + 44, ymin = 375)
    let spawnPoints = [
      { x: 72, y: 414 },
      { x: 231, y: 398 },
      { x: 984, y: 398 },
      { x: 1143, y: 414 }
    ];
    for (let i = 0; i < 4; i++) {
      let turret = new Dog(
        this.scene,
        this.x - this.displayWidth / 2 + spawnPoints[i].x,
        this.y - this.displayHeight / 2 + spawnPoints[i].y,
        4,
        0,
        0,
        gameConfig.dog4Health,
        gameConfig.dog4Damage,
        gameConfig.dog4FireRate
      );
      let self = this;
      turret.on('destroyed', function() {
        self.hardPoints.splice(
          self.hardPoints.findIndex(function(elem) {
            return elem === turret;
          }),
          1
        );
      });
      this.hardPoints.push(turret);
      turret.body.immovable = true;
      this.scene.dogs.add(turret);
    }
  }

  activateLaserMover() {
    if (!this.weapon) return;
    // Turn on laser mover
    this.weapon.beginMovement();
    return true;
  }
}

export class Leo extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, constants.CATKEY);
    this.body.setCollideWorldBounds(true);

    let sceneConfig = scene.gameConfig;
    this.setData('isMoving', false);
    this.setData('isMovingX', false);
    this.setData('isMovingY', false);
    this.setData('health', sceneConfig.maxPlayerHealth);
    this.setData('oxygen', sceneConfig.maxPlayerOxygen);
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
    this.ammoCount = scene.gameConfig.maxPlayerAmmo;
    this.heat = 0;
    this.firingBeam = false;
    this.heatCapacity = 1000;
    this.grappleSoundPlaying = false;
    this.oxygenLowSoundPlaying = false;
    this.deadSoundPlaying = false;
    this.boostSoundPlaying = false;

    let bgWidth = scene.game.config.width;
    let bgHeight = scene.game.config.height;
    this.damagedOverlay = scene.add
      .tileSprite(
        0,
        0,
        bgWidth,
        bgHeight,
        constants.DAMAGED
      )
      .setDisplayOrigin(0, 0)
      .setScale(bgWidth/800, bgHeight/600)
      .setScrollFactor(0, 0)
      .setDepth(gameDepths.uiDepth)
      .setTint(0xe00000)
      .setVisible(false);
    
      this.overlayFlash = this.scene.tweens.add({
        targets: this.damagedOverlay,
        duration: 1000,
        alpha: 0,
        loop: -1,
        paused: true,
        callbackScope: this
      });
      

    this.ammoRefil(scene);
  }

  ammoRefil(scene) {
    // Plasma Replenish
    setInterval(() => {
      if (this.ammoCount < scene.gameConfig.maxPlayerAmmo) {
        this.ammoCount++;

        if(this.scene != undefined)
          this.scene.updateAmmo(this.ammoCount);
      }
    }, 2500);

    // Heat dissipate
    setInterval(() => {
      if (this.heat <= this.heatCapacity && this.heat > 0) {
        this.heat -= 100;
        if(this.scene != undefined)
          this.scene.updateAmmo(this.heat);
      }
    }, 500);
  }

  playDyingSound() {
    if (!this.deadSoundPlaying) {
      this.scene.sound.play(constants.DYINGAUDIO, { volume: 0.5 });
      this.deadSoundPlaying = true;

      setInterval(() => {
        this.deadSoundPlaying = false;
      }, 2500);
    }
  }

  playBoostSound() {
    if (!this.boostSoundPlaying) {
      this.scene.sound.play(constants.BOOSTAUDIO, { volume: 0.2 });
    }
  }

  playGrappleSound() {
    if (!this.grappleSoundPlaying) {
      this.scene.sound.play(constants.GRAPPLING, { volume: 0.3 });
      this.grappleSoundPlaying = true;

      setInterval(() => {
        this.grappleSoundPlaying = false;
      }, 1250);
    }
  }

  playOxygenLowSound() {
    if (!this.oxygenLowSoundPlaying) {
      this.scene.sound.play(constants.OXYGENLOWAUDIO, { volume: 0.2 });
      this.oxygenLowSoundPlaying = true;

      setInterval(() => {
        this.oxygenLowSoundPlaying = false;
      }, 1000);
    }
  }

  moveLeft(boost) {
    let sceneConfig = this.scene.gameConfig;
    this.setData('isMoving', true);
    this.setData('isMovingX', true);
    if (this.body.velocity.x > 0) this.body.velocity.x = 0;

    if (this.body.velocity.x > -1 * sceneConfig.softMaxPlayerVelocityX)
      this.body.velocity.x -= sceneConfig.playerAccelerationX;

    if (this.body.velocity.x > -1 * sceneConfig.hardMaxPlayerVelocityX)
      this.body.velocity.x -= boost;
    else this.body.velocity.x = -1 * sceneConfig.hardMaxPlayerVelocityX;
  }

  moveRight(boost) {
    let sceneConfig = this.scene.gameConfig;
    this.setData('isMoving', true);
    this.setData('isMovingX', true);
    if (this.body.velocity.x < 0) this.body.velocity.x = 0;

    if (this.body.velocity.x < sceneConfig.softMaxPlayerVelocityX)
      this.body.velocity.x += sceneConfig.playerAccelerationX;

    if (this.body.velocity.x < sceneConfig.hardMaxPlayerVelocityX)
      this.body.velocity.x += boost;
    else this.body.velocity.x = sceneConfig.hardMaxPlayerVelocityX;
  }

  moveDown(boost) {
    let sceneConfig = this.scene.gameConfig;
    this.setData('isMoving', true);
    this.setData('isMovingY', true);
    if (this.body.velocity.y < 0) this.body.velocity.y = 0;

    if (this.body.velocity.y < sceneConfig.softMaxPlayerVelocityY)
      this.body.velocity.y += sceneConfig.playerAccelerationY;

    if (this.body.velocity.y < sceneConfig.hardMaxPlayerVelocityY)
      this.body.velocity.y += boost;
    else this.body.velocity.y = sceneConfig.hardMaxPlayerVelocityY;
  }

  moveUp(boost) {
    let sceneConfig = this.scene.gameConfig;
    this.setData('isMoving', true);
    this.setData('isMovingY', true);
    if (this.body.velocity.y > 0) this.body.velocity.y = 0;

    if (this.body.velocity.y > -1 * sceneConfig.softMaxPlayerVelocityY)
      this.body.velocity.y -= sceneConfig.playerAccelerationY;
    if (this.body.velocity.y > -1 * sceneConfig.hardMaxPlayerVelocityY)
      this.body.velocity.y -= boost;
    else this.body.velocity.y = -1 * sceneConfig.hardMaxPlayerVelocityY;
  }

  moveTo(x, y, speed) {
    let sceneConfig = this.scene.gameConfig;
    if (speed > sceneConfig.hardMaxPlayerVelocityX)
      speed = sceneConfig.hardMaxPlayerVelocityX;
    this.scene.physics.velocityFromAngle(
      Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, x, y)),
      speed,
      this.scene.player.body.velocity
    );
  }

  shoot(pointerX, pointerY, type) {
    if (type === 'plasma' && this.ammoCount == 0) {
      return;
    }

    if (type === 'beam' && this.heat == this.heatCapacity) {
      return;
    }
    let playerDamage = this.scene.gameConfig.playerDamage;
    let scale = this.scene.gameConfig.playerBulletSize;

    let bullet = this.scene.bullets.getFirstDead(false, this.x, this.y);
    if (bullet) {
      bullet.setType(type);
      bullet.colliders = addBulletCollisions(this.scene, bullet);
      bullet.setData('isFriendly', true);
    } else {
      bullet = new Bullet(this.scene, this.x, this.y, true, type);
    }

    bullet.setActive(true);
    bullet.setVisible(true);
    let angle = Phaser.Math.Angle.Between(
      this.x - this.scene.cameras.main.scrollX,
      this.y - this.scene.cameras.main.scrollY,
      pointerX,
      pointerY
    );
    let speed = 2000;
    if (type === 'plasma') speed = 350;
    if (type === 'beam') speed = 1000;

    let xVelocity = speed * Math.cos(angle) + Phaser.Math.Between(-20, 20);
    let yVelocity = speed * Math.sin(angle) + Phaser.Math.Between(-20, 20);

    if (type === 'primary') {
      this.shootPrimary(
        bullet,
        angle,
        playerDamage,
        xVelocity,
        yVelocity,
        scale
      );
    } else if (type === 'plasma') {
      const plasmaMultiplier = playerDamage * 2.5;
      this.shootPlasma(bullet, angle, plasmaMultiplier, xVelocity, yVelocity);
    } else if (type === 'beam' && this.heat < this.heatCapacity) {
      const beamMultiplier = playerDamage * 1.5;
      this.shootBeam(bullet, angle, beamMultiplier, xVelocity, yVelocity);
      this.firingBeam = true;
    }
  }

  shootBeam(bullet, angle, playerDamage, xVelocity, yVelocity) {
    if (this.heat < 1000) {
      const initX = 0.2;
      const initY = 1.5;
      let scaleMultiplier = 2.0;
      bullet
        .setTint(0xc43205)
        .setOrigin(0.5)
        .setData('damage', playerDamage)
        .setScale(initX, initY)
        .setRotation(angle);

      setInterval(() => {
        bullet.setScale(initX * scaleMultiplier, initY * scaleMultiplier);
        scaleMultiplier += 1;
      }, 75);

      setInterval(() => {
        bullet.destroy();
      }, 350);
      this.heat += 100;
      this.scene.updateAmmo(this.heat);
      bullet.body.setVelocity(xVelocity, yVelocity);
      this.scene.bullets.add(bullet);
      this.scene.sound.play(constants.SECONDARYWEAPONAUDIO, { volume: 0.5 });
    }
  }

  shootPlasma(bullet, angle, playerDamage, xVelocity, yVelocity) {
    bullet
      .setTint(0x7cfc00)
      .setOrigin(0.5)
      .setData('damage', playerDamage)
      .setRotation(angle);

    this.ammoCount--;
    this.scene.updateAmmo(this.ammoCount);
    bullet.body.setVelocity(xVelocity, yVelocity);
    bullet.body.setCircle(bullet.displayWidth * 0.5);
    this.scene.bullets.add(bullet);
    this.scene.sound.play(constants.SECONDARYWEAPONAUDIO, { volume: 0.3 });
  }

  shootPrimary(bullet, angle, playerDamage, xVelocity, yVelocity, scale) {
    bullet
      .setTint(0xf90018)
      .setOrigin(0.5)
      .setData('damage', playerDamage)
      .setRotation(angle)
      .setScale(scale);

    bullet.body.setVelocity(xVelocity, yVelocity);
    bullet.body.setCircle(bullet.displayWidth * 0.5);
    this.scene.bullets.add(bullet);
    this.scene.sound.play(constants.CATWEAPONAUDIO, { volume: 0.5 });
  }

  damage(damage) {
    let sceneConfig = this.scene.gameConfig;
    const isInvulnerable = cheats.invulnerable;
    if (!isInvulnerable) {
      this.setData('health', this.getData('health') - damage);
      if (this.getData('health') < 0) {
        this.setData('health', 0);
        // dead
        this.play(constants.DYINGKEY);
        this.scene.sound.play(constants.EXPLOSION2AUDIO, { volume: 0.2 });
      } else if (this.getData('health') > sceneConfig.maxPlayerHealth) {
        this.setData('health', sceneConfig.maxPlayerHealth);
      }

      if(Math.random() > 0.9){
        this.scene.sound.play(constants.MEOWAUDIO, { volume: 0.2 });
      }
    }

    if (this.getData('health') <= 0) {
      this.scene.gameOver = true;
    }
  }

  oxygenDamage(damage) {
    let sceneConfig = this.scene.gameConfig;
    this.setData('oxygen', this.getData('oxygen') - damage);

    const oxygenWarningConditions =
      (this.getData('oxygen') < 20 && this.getData('oxygen') > 19) ||
      (this.getData('oxygen') < 10 && this.getData('oxygen') > 9) ||
      (this.getData('oxygen') < 5 && this.getData('oxygen') > 4);

    if (oxygenWarningConditions) {
      this.playOxygenLowSound();
    }

    if (this.getData('oxygen') < 0) {
      this.setData('oxygen', 0);
      this.damage(sceneConfig.oxygenDamage);
      this.damagedOverlay.setVisible(true);
      this.overlayFlash.resume();
    } else if (this.getData('oxygen') > sceneConfig.maxPlayerOxygen) {
      this.setData('oxygen', sceneConfig.maxPlayerOxygen);
    }
  }

  grapple() {
    let sceneConfig = this.scene.gameConfig;
    if (!this.getData('oxygenAsteroid')) {
      let point = this.getData('grapplePoint');
      this.deployGrapple(point);
      let distance = Math.sqrt(
        Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2)
      );
      let speed = (sceneConfig.grappleSpeed * distance) / 200;
      this.moveTo(point.x, point.y, speed);
      this.playGrappleSound();
    } else {
      this.setData('grapplePoint', null);
    }
  }
  reelGrapple() {
    this.grappleLine.clear();
  }

  deployGrapple(point) {
    this.grappleLine.clear().lineStyle(2, 0xffffff);
    this.grappleLine.strokeLineShape({
      x1: this.x,
      y1: this.y,
      x2: point.x,
      y2: point.y
    });
  }

  followAsteroid(rad) {
    let asteroid = this.getData('oxygenAsteroid');
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    let radius = asteroid.displayWidth / 2;
    let angle =
      Phaser.Math.Angle.Between(
        asteroid.x - asteroid.body.deltaX(),
        asteroid.y - asteroid.body.deltaY(),
        this.x,
        this.y
      ) +
      rad / (radius / 48);
    this.setRotation(angle + Math.PI / 2);
    this.x = asteroid.x + radius * Math.cos(angle);
    this.y = asteroid.y + radius * Math.sin(angle);

    let sceneConfig = this.scene.gameConfig;

    if (this.y < 0 + this.displayHeight / 2) {
      this.y = this.displayHeight / 2;
      this.setData('oxygenAsteroid', null);
    } else if (this.y > sceneConfig.worldHeight - this.displayHeight / 2) {
      this.y = sceneConfig.worldHeight - this.displayHeight / 2;

      if (asteroid != this.scene.baseAsteroid)
        this.setData('oxygenAsteroid', null);
    }

    let camera = this.scene.cameras.main;
    let offset = sceneConfig.worldOffsetX < 0 ? 0 : sceneConfig.worldOffsetX;

    if (this.x < camera.scrollX + this.displayWidth / 2) {
      this.x = camera.scrollX + this.displayWidth / 2;
      this.setData('oxygenAsteroid', null);
    } else if (
      this.x >
      camera.scrollX + sceneConfig.worldWidth - this.displayWidth / 2 + offset
    ) {
      this.x =
        camera.scrollX +
        sceneConfig.worldWidth -
        this.displayWidth / 2 +
        offset;
      this.setData('oxygenAsteroid', null);
    }
  }

  update() {
    if (!this.getData('isMoving')) {
      this.body.velocity.x *= 0.95;
      this.body.velocity.y *= 0.95;
    } else {
      if (!this.getData('isMovingX')) {
        this.body.velocity.x *= 0.95;
      }
      if (!this.getData('isMovingY')) {
        this.body.velocity.y *= 0.95;
      }

      let sceneConfig = this.scene.gameConfig;
      if (this.body.velocity.x > sceneConfig.softMaxPlayerVelocityX)
        this.body.velocity.x *= 0.995;
      if (this.body.velocity.y > sceneConfig.softMaxPlayerVelocityY)
        this.body.velocity.y *= 0.995;
    }

    this.setData('isMoving', false);
    this.setData('isMovingX', false);
    this.setData('isMovingY', false);

    if (!this.getData('oxygenAsteroid')) {
      this.setRotation(this.rotation * 0.8);
      this.setData('oxygenAsteroid', null);
    } else {
      this.damagedOverlay.setVisible(false);
      this.overlayFlash.pause();
      let oxygenAsteroid = this.getData('oxygenAsteroid');

      if (oxygenAsteroid && oxygenAsteroid.getData('level') !== 4)
        oxygenAsteroid.damage(gameConfig.oxygenAsteroidDamage / 4);
    }
  }
}
