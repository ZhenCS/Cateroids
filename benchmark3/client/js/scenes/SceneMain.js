import * as constants from '../../../shared/constants.js';
import { Asteroid, Dog, Laser, Leo } from '../Entities.js';
import { getPropertyValue } from '../utils/utils.js';
import * as collisions from '../Collisions.js';

export class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: constants.GAMEKEY });
  }
  init(data) {
    this.dataFromLevelSelect = data;
  }
  preload() {}

  create() {
    this.debug = this.add.graphics();
    this.bullets = this.add.group();
    this.asteroids = this.add.group();
    this.oxygenAsteroids = this.add.group();
    this.dogs = this.add.group();
    this.lasers = this.add.group();
    this.laserSegments = this.add.group();
    this.gameOver = false;
    this.player = new Leo(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5
    );

    //init player before calling these functions
    this.initAnimations();
    this.initUI();
    this.initControls();
    this.initEvents();
    this.initCollisions();
    this.mapLoaded = false;
    let loadMap = true;

    if(loadMap)
      this.loadMap();
    else{
      this.laserTimer.paused = false;
      this.spawnTimer.paused = false;
    }
    this.cameras.main.startFollow(this.player);
  }

  update() {
    if (this.player.active) {
      this.player.update();
      this.updateUI();
      this.movementCheck();
      this.frustumCulling();
      //this.debug.clear()
      //this.player.body.drawDebug(this.debug);
    }
  }

  loadMap(level) {
    const map = this.make.tilemap(currentLevel);
    this.gameMap = map;
    this.mapObjects = map.getObjectLayer('Objects').objects;
    gameConfig.worldWidth = map.width * map.tileWidth;
    gameConfig.worldHeight = (map.height + 1) * map.tileHeight;
    gameConfig.worldOffset =
      (this.game.config.height - gameConfig.worldHeight) / 2;
    gameConfig.spawnBuffer = this.game.config.width / 2 + 50;

    this.sortMapObjects();
    this.setPlayerSpawn();
    this.loadMapObjects();

    this.physics.world.setBounds(
      0,
      0,
      gameConfig.worldWidth,
      gameConfig.worldHeight
    );
    this.cameras.main.setBounds(
      0,
      -1 * gameConfig.worldOffset,
      gameConfig.worldWidth,
      gameConfig.worldHeight * gameConfig.worldOffset
    );

    this.mapLoaded = true;
  }

  sortMapObjects() {
    this.mapObjects.sort(function(a, b) {
      return b.x - a.x;
    });
  }

  setPlayerSpawn() {
    for (var i = this.mapObjects.length - 1; i >= 0; i--) {
      let obj = this.mapObjects[i];
      if (obj.type == 'spawnPoint') {
        this.player.x = obj.x;
        this.player.y = obj.y;
        break;
      }
    }
  }

  loadMapObjects() {
    let self = this;
    for (var i = this.mapObjects.length - 1; i >= 0; i++) {
      let obj = this.mapObjects.pop();
      if (obj.x - this.player.x > gameConfig.spawnBuffer) {
        this.mapObjects.push(obj);
        break;
      }

      if (obj.type == 'asteroid') {
        let velX = getPropertyValue(obj, 'velocityX');
        let velY = getPropertyValue(obj, 'velocityY');
        let level = getPropertyValue(obj, 'level');
        self.setAsteroid(obj.x, obj.y, velX, velY, level);
      }
      if (obj.type == 'dog') {
        let velX = getPropertyValue(obj, 'velocityX');
        let velY = getPropertyValue(obj, 'velocityY');
        let level = getPropertyValue(obj, 'level');
        let hp = getPropertyValue(obj, 'health');
        let damage = getPropertyValue(obj, 'damage');
        let fireRate = getPropertyValue(obj, 'fireRate');
        self.setDog(obj.x, obj.y, velX, velY, level, hp, damage, fireRate);
      }
      if (obj.type == 'laser') {
        let damage = getPropertyValue(obj, 'laserDamage');
        let delay = getPropertyValue(obj, 'laserDelay');
        let duration = getPropertyValue(obj, 'laserDuration');
        let sprites = getPropertyValue(obj, 'laserSprites');
        let deltaX = getPropertyValue(obj, 'playerDeltaX');
        let scale = getPropertyValue(obj, 'scale');
        let type = getPropertyValue(obj, 'type');
        self.setLasers(
          obj.x,
          obj.y,
          scale,
          type,
          damage,
          delay,
          duration,
          sprites,
          deltaX
        );
      }
    }
  }

  createExplosion(x, y, amount) {
    const explosion = this.add.particles(constants.PIXELKEY).createEmitter({
      x: x,
      y: y,
      speed: { min: -500, max: 500 },
      scale: { start: 1, end: 0 },
      blendMode: 'SCREEN',
      lifespan: 600
    });

    for (let i = 0; i < amount; i++) {
      explosion.explode();
    }
  }

  onLifeDown(damage) {
    this.player.damage(damage);
    this.player.play(constants.DAMAGEKEY);
    this.player.once('animationcomplete', function() {
      this.play(constants.IDLEKEY);
    });
    this.updateUI();
  }

  getLaserPosition() {
    let width = this.game.config.width;
    let height = this.game.config.height;

    return new Phaser.Math.Vector2(
      Phaser.Math.Between(0, width),
      Phaser.Math.Between(0, height)
    );
  }

  getSpawnPosition() {
    let buffer = 16;
    const sides = [
      'top',
      'right',
      'bottom',
      'left',
      'right',
      'right',
      'right',
      'right',
      'right'
    ];
    const side = sides[Phaser.Math.Between(0, sides.length - 1)];
    let width = this.game.config.width;
    let height = this.game.config.height;
    let position = new Phaser.Math.Vector2(0, 0);
    switch (side) {
      case 'top': {
        position = new Phaser.Math.Vector2(
          Phaser.Math.Between(
            this.player.x - width / 2,
            this.player.x + width / 2
          ),
          -1 * buffer
        );
        break;
      }

      case 'right': {
        position = new Phaser.Math.Vector2(
          this.player.x + this.game.config.width / 2 + buffer,
          Phaser.Math.Between(
            this.player.y - height / 2,
            this.player.y + height / 2
          )
        );
        break;
      }

      case 'bottom': {
        position = new Phaser.Math.Vector2(
          Phaser.Math.Between(
            this.player.x - width / 2,
            this.player.x + width / 2
          ),
          this.game.config.height + buffer
        );
      }

      case 'left': {
        position = new Phaser.Math.Vector2(
          this.player.x - this.game.config.width / 2 - buffer,
          Phaser.Math.Between(
            this.player.y - height / 2,
            this.player.y + height / 2
          )
        );
      }
    }

    return position;
  }

  setAsteroid(x, y, vX, vY, level) {
    let asteroid = new Asteroid(
      this,
      x,
      y,
      constants[`ASTEROID${level}KEY`],
      vX,
      vY
    );

    if (level == 3) this.oxygenAsteroids.add(asteroid);
    else this.asteroids.add(asteroid);
  }

  setDog(x, y, vX, vY, level, hp, damage, fireRate) {
    
    let dog = new Dog(this, x, y, level, vX, vY, hp, damage, fireRate);
    this.dogs.add(dog);
  }

  setLasers(x, y, scale, type, damage, delay, duration, sprites, deltaX) {
    if (type == 'VERTICAL') {
      let laser = new Laser(
        this,
        x,
        y,
        false,
        scale,
        -Math.PI / 2,
        damage,
        delay,
        duration,
        sprites,
        deltaX
      );
      this.lasers.add(laser);
    }
  }

  spawnAsteroid() {
    const position = this.getSpawnPosition();
    const level = Phaser.Math.Between(0, 2);
    const asteroid = new Asteroid(
      this,
      position.x,
      position.y,
      constants[`ASTEROID${level}KEY`]
    );

    this.asteroids.add(asteroid);
  }

  spawnOxygenAsteroid() {
    const position = this.getSpawnPosition();
    const asteroid = new Asteroid(
      this,
      position.x,
      position.y,
      constants.ASTEROID3KEY
    );
    asteroid.setTint(0xfff572);
    asteroid.setScale(1.5);

    this.oxygenAsteroids.add(asteroid);
  }

  spawnDog() {
    const position = this.getSpawnPosition();

    let key = 0;
    
    let rand = Phaser.Math.Between(0, 100);
    let { dog1SpawnRate, dog2SpawnRate, dog3SpawnRate } = gameConfig;
    if (rand < dog1SpawnRate) {
      key = 1;
    } else if (rand < dog1SpawnRate + dog2SpawnRate) {
      key = 2;
    } else if (rand < dog1SpawnRate + dog2SpawnRate + dog3SpawnRate) {
      key = 3;
    }

    if (key > 0) {
      let health = gameConfig[`dog${key}Health`];
      let damage = gameConfig[`dog${key}Damage`];;
      let fireRate = gameConfig[`dog${key}FireRate`];

      const dog = new Dog(this, position.x, position.y, key, undefined, undefined, health, damage, fireRate);
      this.dogs.add(dog);
    }
  }

  addScore(amount) {
    this.score += amount;
    this.textScore.setText(this.score);
  }

  initAnimations() {
    var self = this;
    var animCounter = 0;
    //animationKeys: ['idle', 'attack', 'damage', 'dying', 'dead']
    var catIndices = [[1, 7], [8, 9], [10, 12], [13, 16], [16, 16]];
    var dogIndices = [[1, 7], [8, 8], [9, 11], [12, 15], [15, 15]];
    var animData = [[2, -1], [4, 0], [4, 0], [4, 0], [4, 0]];

    constants.animationKeys.forEach(function(anim) {
      self.anims.create({
        key: constants[`${anim.toUpperCase()}KEY`],
        frames: self.anims.generateFrameNames(constants.CATATLASKEY, {
          prefix: constants.SPRITEPREFIXKEY,
          start: catIndices[animCounter][0],
          end: catIndices[animCounter][1],
          zeroPad: 0
        }),
        frameRate: animData[animCounter][0],
        repeat: animData[animCounter][1]
      });
      animCounter++;
    });

    constants.dogKeys.forEach(function(dogStr) {
      animCounter = 0;
      constants.animationKeys.forEach(function(anim) {
        self.anims.create({
          key: constants.dogAnimationKeys[`${dogStr}${anim.toUpperCase()}KEY`],
          frames: self.anims.generateFrameNames(
            constants[`${dogStr}ATLASKEY`],
            {
              prefix: constants.SPRITEPREFIXKEY,
              start: dogIndices[animCounter][0],
              end: dogIndices[animCounter][1],
              zeroPad: 0
            }
          ),
          frameRate: animData[animCounter][0],
          repeat: animData[animCounter][1]
        });
        animCounter++;
      });
    });

    this.player.play(constants.IDLEKEY);
  }

  initUI() {
    let uiContainer = this.add.container();
    let gameHeight = this.sys.game.config.height;
    let gameWidth = this.sys.game.config.width;
    let hpBG = this.add
      .graphics()
      .fillStyle(gameStyles.barColor)
      .setDepth(gameDepths.uiDepth);
    this.hpBar = this.add
      .graphics()
      .fillStyle(gameStyles.healthColor)
      .setDepth(gameDepths.uiDepth);

    hpBG.fillRect(
      gameStyles.padding,
      gameStyles.padding,
      gameStyles.healthWidth,
      gameStyles.barHeight
    );

    this.hpBar.fillRect(
      gameStyles.padding,
      gameStyles.padding,
      gameStyles.healthWidth,
      gameStyles.barHeight
    );

    let oxygenBG = this.add
      .graphics()
      .fillStyle(gameStyles.barColor)
      .setDepth(gameDepths.uiDepth);
    this.oxygenBar = this.add
      .graphics()
      .fillStyle(gameStyles.oxygenColor)
      .setDepth(gameDepths.uiDepth);

    oxygenBG.fillRect(
      gameStyles.padding,
      gameStyles.padding * 2 + gameStyles.barHeight,
      gameStyles.oxygenWidth,
      gameStyles.barHeight
    );

    this.oxygenBar.fillRect(
      gameStyles.padding,
      gameStyles.padding * 2 + gameStyles.barHeight,
      gameStyles.oxygenWidth,
      gameStyles.barHeight
    );

    this.score = 0;
    this.textScore = this.add.text(0, gameStyles.padding, this.score, {
      fontFamily: 'monospace',
      fontSize: 32,
      align: 'left'
    });
    this.textScore.setX(
      gameWidth - this.textScore.displayWidth - gameStyles.padding
    );

    this.pauseButton = this.add
      .text(0, gameHeight - 100 * gameScale.scale, 'ESC', {
        font: `${80 * gameScale.scale}px impact`,
        fill: '#ffffff',
        stroke: 'black',
        strokeThickness: 5
      })
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', function() {
        this.scene.game.scene.pause(constants.GAMEKEY);
        this.scene.game.scene.start(constants.PAUSEKEY);
      });

    uiContainer.add([
      hpBG,
      this.hpBar,
      oxygenBG,
      this.oxygenBar,
      this.pauseButton,
      this.textScore
    ]);
    this.uiContainer = uiContainer;
    this.uiContainer.setScrollFactor(0);
  }

  updateUI() {
    this.hpBar
      .clear()
      .fillStyle(gameStyles.healthColor)
      .setDepth(gameDepths.uiDepth);
    this.hpBar.fillRect(
      gameStyles.padding,
      gameStyles.padding,
      gameStyles.healthWidth *
        (this.player.getData('health') / gameConfig.maxPlayerHealth),
      gameStyles.barHeight
    );

    this.oxygenBar
      .clear()
      .fillStyle(gameStyles.oxygenColor)
      .setDepth(gameDepths.uiDepth);
    this.oxygenBar.fillRect(
      gameStyles.padding,
      gameStyles.padding * 2 + gameStyles.barHeight,
      gameStyles.oxygenWidth *
        (this.player.getData('oxygen') / gameConfig.maxPlayerOxygen),
      gameStyles.barHeight
    );

    this.textScore.setX(
      this.sys.game.config.width -
        this.textScore.displayWidth -
        gameStyles.padding
    );
  }

  initControls() {
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.keyShift = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );

    this.input.keyboard.on('keydown-SHIFT', function() {
      let mouseX = this.scene.input.mousePointer.worldX;
      let mouseY = this.scene.input.mousePointer.worldY;
      let self = this;
      let point = new Phaser.Math.Vector2(mouseX, mouseY);
      this.scene.player.deployGrapple(point);
      this.scene.oxygenAsteroids.getChildren().forEach(function(asteroid) {
        let distance = Math.sqrt(
          Math.pow(asteroid.x - mouseX, 2) + Math.pow(asteroid.y - mouseY, 2)
        );
        if (distance <= asteroid.displayWidth / 2) {
          self.scene.player.setData('grapplePoint', asteroid);
          self.scene.player.setData('oxygenAsteroid', null);
        }
      });
    });

    this.input.keyboard.on('keyup-SHIFT', function() {
      this.scene.player.setData('grapplePoint', null);
      this.scene.player.reelGrapple();
    });

    // Shoot on click
    this.input.on(
      'pointerdown',
      function(pointer) {
        if (this.player.active && !this.gameOver) {
          this.player.shoot(pointer.worldX, pointer.worldY);
          this.player.play(constants.ATTACKKEY);
          this.player.once('animationcomplete', function() {
            this.play(constants.IDLEKEY);
          });
        }
      },
      this
    );
  }

  initEvents() {
    // Oxygen Depletion
    this.oxygenDepletionTimer = this.time.addEvent({
      delay: gameConfig.oxygenDepletionDelay,
      callback: function() {
        this.player.oxygenDamage(gameConfig.oxygenDepletionRate);
      },
      callbackScope: this,
      loop: true
    });

    // Oxygen Replenish
    this.oxygenReplenishTimer = this.time.addEvent({
      delay: gameConfig.oxygenReplenishDelay,
      callback: function() {
        this.player.oxygenDamage(-1 * gameConfig.oxygenReplenishRate);
      },
      callbackScope: this,
      loop: true
    });

    // Laser timer
    this.laserTimer = this.time.addEvent({
      delay: gameConfig.laserSpawnRate,
      callback: function() {
        let laser = new Laser(
          this,
          this.player.x + Phaser.Math.Between(0, 400),
          this.player.y,
          false,
          Phaser.Math.Between(3, 5),
          -Math.PI / 2
        );
        laser.fire();
        this.lasers.add(laser);
      },
      callbackScope: this,
      loop: true
    });

    // Asteroid Spawner
    this.spawnTimer = this.time.addEvent({
      delay: 1000,
      callback: function() {
        this.spawnAsteroid();

        if (Phaser.Math.Between(0, 100) < gameConfig.dogSpawnRate) {
          this.spawnDog();
        }
        if (Phaser.Math.Between(0, 100) < gameConfig.oxygenAsteroidSpawnRate) {
          this.spawnOxygenAsteroid();
        }
      },
      callbackScope: this,
      loop: true
    });

    this.oxygenDepletionTimer.paused = true;
    this.oxygenReplenishTimer.paused = true;
    this.laserTimer.paused = true;
    this.spawnTimer.paused = true;
  }

  initCollisions() {
    // Check for collisions between player and asteroids
    collisions.checkPlayerToAsteroidCollision(this);

    // Check for collisions between player and enemies
    collisions.checkPlayerToEnemyCollision(this);

    // Check for collisions between player and bullets
    collisions.checkPlayerToBulletCollision(this);

    // Check for collision between bullets and enemies
    collisions.checkEnemyToBulletCollision(this);

    // Check for collisions between bullets and astroids
    collisions.checkAsteroidToBulletCollision(this);

    // Check for collisions between bullets and oxygenAsteroids
    collisions.checkOxygenAsteroidToBulletCollision(this);

    // Check for collisions between asteroids and oxygenAsteroids
    collisions.checkAsteroidToOxygenAsteroidCollision(this);

    // Check for collisions between dogs and oxygenAsteroids
    collisions.checkEnemyToOxygenAsteriodCollision(this);

    // Check for collisions between player and oxygenAsteroids
    collisions.checkPlayerToOxygenAsteroidCollision(this);
  }

  movementCheck() {
    if (this.gameOver) return;

    let moved = false;
    let boost = 0;
    // Check for boost
    if (this.keySpace.isDown) {
      boost = gameConfig.boost;
      this.player.setData('oxygenAsteroid', null);
    }

    if (this.player.getData('oxygenAsteroid') != null) {
      this.oxygenDepletionTimer.paused = true;
      this.oxygenReplenishTimer.paused = false;
    } else {
      this.oxygenDepletionTimer.paused = false;
      this.oxygenReplenishTimer.paused = true;
    }

    if (this.keyShift.isDown && this.player.getData('grapplePoint')) {
      this.player.grapple();
    } else {
      // Check for vertical movement
      if (this.keyW.isDown) {
        if (this.player.getData('oxygenAsteroid') == null) {
          this.player.moveUp(boost);
          moved = true;
        }
      } else if (this.keyS.isDown) {
        if (this.player.getData('oxygenAsteroid') == null) {
          this.player.moveDown(boost);
          moved = true;
        }
      }

      // Check for horizontal movement
      if (this.keyA.isDown) {
        if (this.player.getData('oxygenAsteroid') != null) {
          this.player.followAsteroid(-1 * gameConfig.playerWalkVelocityX);
        } else {
          this.player.moveLeft(boost);
        }
        moved = true;
      } else if (this.keyD.isDown) {
        if (this.player.getData('oxygenAsteroid') != null) {
          this.player.followAsteroid(gameConfig.playerWalkVelocityX);
        } else {
          this.player.moveRight(boost);
        }
        moved = true;
      }
    }

    if (moved) {
      this.player.reelGrapple();

      if(this.mapLoaded)
        this.loadMapObjects();
      const gas = this.add.particles(constants.PIXELKEY).createEmitter({
        x: this.player.x + Phaser.Math.Between(-2, 2),
        y: this.player.y + Phaser.Math.Between(-2, 2),
        speed: { min: -200, max: 200 },
        scale: { start: 1, end: 0 },
        angle: {
          min: this.player.angle + (180 - 5),
          max: this.player.angle + (180 + 5)
        },
        blendMode: 'SCREEN',
        lifespan: { min: 60, max: 320 }
      });

      for (let i = 0; i < 5; i++) {
        gas.explode();
      }
      let self = this;
      this.lasers.getChildren().forEach(function(laser) {
        if (
          laser.x - self.player.x <= laser.getData('deltaX') &&
          !laser.getData('fired')
        ) {
          laser.fire();
        }
      });

      //camera does not move left
      let scroll = this.cameras.main.scrollX;
      if (scroll < gameConfig.worldWidth - this.game.config.width) {
        this.physics.world.setBounds(
          scroll,
          0,
          gameConfig.worldWidth - scroll,
          gameConfig.worldHeight
        );
        this.cameras.main.setBounds(
          scroll,
          -1 * gameConfig.worldOffset,
          gameConfig.worldWidth - scroll,
          gameConfig.worldHeight + gameConfig.worldOffset
        );
      }
    } else {
      if (this.player.getData('oxygenAsteroid') != null) {
        this.player.followAsteroid(0);
      }
    }
  }

  frustumCulling() {
    let maxLength =
      2 *
      Math.sqrt(
        Math.pow(this.game.config.width * 0.5, 2) +
          Math.pow(this.game.config.height * 0.5, 2)
      );
    // Frustum culling for bullets to prevent offscreen rendering
    for (let i = 0; i < this.bullets.getChildren().length; i++) {
      const bullet = this.bullets.getChildren()[i];

      if (
        Phaser.Math.Distance.Between(
          bullet.x,
          bullet.y,
          this.player.x,
          this.player.y
        ) > maxLength
      ) {
        if (bullet) {
          bullet.destroy();
        }
      }
    }
    // Frustum culling for asteroids to prevent offscreen rendering
    for (let i = 0; i < this.asteroids.getChildren().length; i++) {
      const asteroid = this.asteroids.getChildren()[i];

      if (
        Phaser.Math.Distance.Between(
          asteroid.x,
          asteroid.y,
          this.player.x,
          this.player.y
        ) > maxLength &&
        asteroid.x < this.player.x
      ) {
        if (asteroid) {
          asteroid.destroy();
        }
      }
    }
    // Frustum culling for oxygenAsteroids to prevent offscreen rendering
    for (let i = 0; i < this.oxygenAsteroids.getChildren().length; i++) {
      const asteroid = this.oxygenAsteroids.getChildren()[i];
      if (
        Phaser.Math.Distance.Between(
          asteroid.x,
          asteroid.y,
          this.player.x,
          this.player.y
        ) > maxLength &&
        asteroid.x < this.player.x
      ) {
        if (asteroid) {
          asteroid.destroy();
        }
      }
    }

    // Frustum culling for dogs to prevent offscreen rendering
    for (let i = 0; i < this.dogs.getChildren().length; i++) {
      const dog = this.dogs.getChildren()[i];
      if (
        Phaser.Math.Distance.Between(
          dog.x,
          dog.y,
          this.player.x,
          this.player.y
        ) > maxLength &&
        dog.x < this.player.x
      ) {
        if (dog) {
          dog.onDestroy();
          dog.destroy();
        }
      }
    }
  }
}
