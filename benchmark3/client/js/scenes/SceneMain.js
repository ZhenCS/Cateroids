import * as constants from '../../../shared/constants';

class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMain' });
  }
  init(data) {
    this.dataFromLevelSelect = data;
  }
  preload() {}

  create() {
    
    const map = this.make.tilemap({
      key: this.dataFromLevelSelect.levelKey
    });

    const tileset = map.addTilesetImage('cateroidsTileset', 'tiles');
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
    
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, gameConfig.worldWidth, this.game.config.height);
    this.cameras.main.setBounds(0, 0, gameConfig.worldWidth, this.game.config.height);
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
    this.player.once('animationcomplete', function(){
      this.play(constants.IDLEKEY);
    });
    this.updateUI();

    if(this.player.getData('health') <= 0){
      this.gameOver = true;
      this.player.play(constants.DYINGKEY);
      
      this.time.addEvent({
      delay: 2000,
      callback: function() {
        this.scene.pause(constants.GAMEKEY);
        this.scene.start(constants.GAMEOVERKEY);
      },
      callbackScope: this,
      loop: false
      });
    }
    
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
    const sides = ['top', 'right', 'bottom', 'left', 'right', 'right', 'right', 'right', 'right'];
    const side = sides[Phaser.Math.Between(0, sides.length - 1)];
    let width = this.game.config.width;
    let height = this.game.config.height;
    let position = new Phaser.Math.Vector2(0, 0);
    switch (side) {
      case 'top': {
        position = new Phaser.Math.Vector2(
          Phaser.Math.Between(this.player.x - width/2, this.player.x + width/2),
          -1 * buffer
        );
        break;
      }

      case 'right': {
        position = new Phaser.Math.Vector2(
          this.player.x + this.game.config.width/2 + buffer,
          Phaser.Math.Between(this.player.y - height/2, this.player.y + height/2),
        );
        break;
      }

      case 'bottom': {
        position = new Phaser.Math.Vector2(
          Phaser.Math.Between(this.player.x - width/2, this.player.x + width/2),
          this.game.config.height + buffer
        );
      }

      case 'left': {
        position = new Phaser.Math.Vector2(
          this.player.x - this.game.config.width/2 - buffer,
          Phaser.Math.Between(this.player.y - height/2, this.player.y + height/2),
        );
      }
    }

    return position;
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

  spawnOxygenAsteroid(){
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

    let imageKey = '';
    let rand = Phaser.Math.Between(0, 100);
    let {dog1SpawnRate, dog2SpawnRate, dog3SpawnRate} = gameConfig;
    if (rand < dog1SpawnRate) {
      imageKey = constants.DOG1KEY;
    } else if (rand < dog1SpawnRate + dog2SpawnRate) {
      imageKey = constants.DOG2KEY;
    } else if(rand < dog1SpawnRate + dog2SpawnRate + dog3SpawnRate){
      imageKey = constants.DOG3KEY;
    }

    if(imageKey != ''){
      const dog = new Dog(this, position.x, position.y, imageKey);
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
    var catIndices =  [[1, 7], [8, 9], [10, 12], [13, 16], [16, 16]];
    var dogIndices =  [[1, 7], [8, 8], [9, 11], [12, 15], [15, 15]];
    var animData =    [[2, -1], [4, 0], [4, 0], [4, 0], [4, 0]];


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
          key: constants[`${dogStr}${anim.toUpperCase()}KEY`],
          frames: self.anims.generateFrameNames(constants[`${dogStr}ATLASKEY`], {
            prefix: constants.SPRITEPREFIXKEY,
            start: dogIndices[animCounter][0],
            end: dogIndices[animCounter][1],
            zeroPad: 0
          }),
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
    let hpBG = this.add.graphics().fillStyle(gameStyles.barColor).setDepth(gameDepths.uiDepth);
    this.hpBar = this.add.graphics().fillStyle(gameStyles.healthColor).setDepth(gameDepths.uiDepth);

    hpBG.fillRect(
      gameStyles.padding, 
      gameStyles.padding, 
      gameStyles.healthWidth, 
      gameStyles.barHeight);

    this.hpBar.fillRect(
      gameStyles.padding, 
      gameStyles.padding, 
      gameStyles.healthWidth, 
      gameStyles.barHeight);

    let oxygenBG = this.add.graphics().fillStyle(gameStyles.barColor).setDepth(gameDepths.uiDepth);
    this.oxygenBar = this.add.graphics().fillStyle(gameStyles.oxygenColor).setDepth(gameDepths.uiDepth);

    oxygenBG.fillRect(
      gameStyles.padding, 
      gameStyles.padding * 2 + gameStyles.barHeight,
      gameStyles.oxygenWidth, 
      gameStyles.barHeight);
      
    this.oxygenBar.fillRect(
      gameStyles.padding, 
      gameStyles.padding * 2 + gameStyles.barHeight,
      gameStyles.oxygenWidth, 
      gameStyles.barHeight);

    this.score = 0;
    this.textScore = this.add.text(0, gameStyles.padding, this.score, {
      fontFamily: 'monospace',
      fontSize: 32,
      align: 'left'
    });
    this.textScore.setX(gameWidth - this.textScore.displayWidth - gameStyles.padding);

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

    uiContainer.add([hpBG, this.hpBar, oxygenBG, this.oxygenBar, this.pauseButton, this.textScore]);
    this.uiContainer = uiContainer;
    this.uiContainer.setScrollFactor(0);
  } 

  updateUI(){
    this.hpBar.clear().fillStyle(gameStyles.healthColor).setDepth(gameDepths.uiDepth);
    this.hpBar.fillRect(
      gameStyles.padding, 
      gameStyles.padding, 
      gameStyles.healthWidth * (this.player.getData('health')/gameConfig.maxPlayerHealth), 
      gameStyles.barHeight);

    this.oxygenBar.clear().fillStyle(gameStyles.oxygenColor).setDepth(gameDepths.uiDepth);
    this.oxygenBar.fillRect(
      gameStyles.padding, 
      gameStyles.padding * 2 + gameStyles.barHeight,
      gameStyles.oxygenWidth * (this.player.getData('oxygen')/gameConfig.maxPlayerOxygen), 
      gameStyles.barHeight);

      this.textScore.setX(this.sys.game.config.width - this.textScore.displayWidth - gameStyles.padding);
  };

  initControls(){
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    
    this.input.keyboard.on('keydown-SHIFT', function(){
      let mouseX = this.scene.input.mousePointer.worldX;
      let mouseY = this.scene.input.mousePointer.worldY;
      let self = this;
      this.scene.oxygenAsteroids.getChildren().forEach(function(asteroid){
        let distance = Math.sqrt(Math.pow((asteroid.x - mouseX),2) + Math.pow((asteroid.y - mouseY),2));
        if(distance <= asteroid.displayWidth/2){
          self.scene.player.setData("grapplePoint", asteroid);
          self.scene.player.setData('oxygenAsteroid', null);
        }
      });
    });

    this.input.keyboard.on('keyup-SHIFT', function(){
      this.scene.player.setData("grapplePoint", null);
    });


    // Shoot on click
    this.input.on(
      'pointerdown',
      function(pointer) {
        if (this.player.active && !this.gameOver) {
          this.player.shoot(pointer.worldX, pointer.worldY);
          this.player.play(constants.ATTACKKEY);
          this.player.once('animationcomplete', function(){
            this.play(constants.IDLEKEY);
          });
        }
      },
      this
    );
  }

  initEvents(){
    // Oxygen Depletion
    this.oxygenDepletionTimer = this.time.addEvent({
      delay: gameConfig.oxygenDepletionDelay,
      callback: function() {
        this.player.oxygenDamage(gameConfig.oxygenDepletionRate);
      },
      callbackScope: this,
      loop: true,
    });

    // Oxygen Replenish
    this.oxygenReplenishTimer = this.time.addEvent({
      delay: gameConfig.oxygenReplenishDelay,
      callback: function() {
        this.player.oxygenDamage(-1 * gameConfig.oxygenReplenishRate);
      },
      callbackScope: this,
      loop: true,
    });

    this.oxygenReplenishTimer.paused = true;

    // Laser timer
    this.laserTimer = this.time.addEvent({
      delay: gameConfig.laserSpawnRate,
      callback: function() {
        let laser = new Laser(this, this.player.x + Phaser.Math.Between(0, 400), this.player.y, false, Phaser.Math.Between(3,5), -Math.PI/2);
        laser.fire();
        this.lasers.add(laser);
      },
      callbackScope: this,
      loop: true,
    });

    // Asteroid Spawner
    this.spawnTimer = this.time.addEvent({
      delay: 2000,
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
  }

  initCollisions(){
    // Check for collisions between player and asteroids
    this.physics.add.collider(this.player, this.asteroids,
      function(player, asteroids) {
        this.createExplosion(player.x, player.y, asteroids.displayWidth);
        if (this.player) {
          this.onLifeDown(asteroids.getData('damage'));
          asteroids.damage(gameConfig.playerDamage);
        }
      }, null, this);

    // Check for collisions between player and enemies
    this.physics.add.collider(this.player, this.dogs,
      function(player, dog) {
        this.createExplosion(player.x, player.y, player.displayWidth);

        if (player) {
          this.onLifeDown(dog.getData('damage'));
          dog.damage(gameConfig.playerDamage);
        }
      }, null, this);

    // Check for collisions between player and bullets
    this.physics.add.overlap(this.player, this.bullets,
      function(player, bullet) {
        if (!bullet.getData('isFriendly')) {
          this.createExplosion(player.x, player.y, player.displayWidth);

          if (player) {
            this.onLifeDown(bullet.getData('damage'));
            bullet.destroy();
          }
        }
      }, null, this);

    this.physics.add.overlap(this.player, this.laserSegments,
      function(player, segment) {
        this.createExplosion(player.x, player.y, player.displayWidth);

        if (segment) {
          this.onLifeDown(segment.getData('damage'));
        }
        
      }, null, this);

    // Check for collision between bullets and enemies
    this.physics.add.overlap(this.bullets, this.dogs,
      function(bullet, dog) {
        if (bullet.getData('isFriendly')) {
          this.createExplosion(bullet.x, bullet.y, dog.displayWidth);
          let key = dog.texture.key;
          if (dog) {
            if(dog.getData('health') - bullet.getData('damage') <= 0){
              // Add to score for destroying enemy
              if (key == constants.DOG3ATLASKEY) {
                this.addScore(1000);
              }
              if (key == constants.DOG2ATLASKEY) {
                this.addScore(500);
              }
              if (key == constants.DOG1ATLASKEY) {
                this.addScore(200);
              }
            }

            dog.damage(bullet.getData('damage'));
          }

          if (bullet) {
            bullet.destroy();
          }
        }
      }, null, this);

    // Check for collisions between bullets and astroids
    this.physics.add.overlap(this.bullets, this.asteroids,
      function(bullet, asteroid) {
        if (bullet.getData('isFriendly')) {
          this.createExplosion(bullet.x, bullet.y, asteroid.displayWidth);

          const oldAsteroidPos = new Phaser.Math.Vector2(asteroid.x, asteroid.y);
          const oldAsteroidKey = asteroid.texture.key;
          const oldAsteroidLevel = asteroid.getData('level');
          const oldAsteroidHealth = asteroid.getData('health');
        
          if (asteroid) {
            asteroid.damage(bullet.getData('damage'));
          }

          if(oldAsteroidHealth - gameConfig.playerDamage > 0) return;

          // Give points for destroying asteroids
          switch (oldAsteroidLevel) {
            case 0: {
              this.addScore(100);
              break;
            }
            case 1: {
              this.addScore(50);
              break;
            }
            case 2: {
              this.addScore(20);
              break;
            }
          }

          // Break apart large asteroid
          if (oldAsteroidLevel < 2) {
            for (let i = 0; i < 2; i++) {
              let key = '';
              let newLevel = Phaser.Math.Between(1, 2);
              if ( oldAsteroidKey == constants.ASTEROID0KEY) {
                key = constants[`ASTEROID${newLevel}KEY`];

              }else if(oldAsteroidKey == constants.ASTEROID1KEY){
                key = constants.ASTEROID2KEY;
                newLevel = 2;
              }
              
              const newAsteroid = new Asteroid(
                this,
                oldAsteroidPos.x,
                oldAsteroidPos.y,
                key
              );
              newAsteroid.setData('level', newLevel);
              newAsteroid.body.setVelocity(
                Phaser.Math.Between(-200, 200),
                Phaser.Math.Between(-200, 200)
              );
              this.asteroids.add(newAsteroid);
            }
          }
        }

        if (bullet) {
          bullet.destroy();
        }
      }, null, this);


    // Check for collisions between bullets and oxygenAsteroids
    this.physics.add.overlap(this.bullets, this.oxygenAsteroids,
      function(bullet, oxygenAsteroid) {
        if (!bullet.getData('isFriendly')) {
          this.createExplosion(bullet.x, bullet.y, oxygenAsteroid.displayWidth);
          if (oxygenAsteroid) {
            if(oxygenAsteroid == this.player.getData('oxygenAsteroid')){
              if(oxygenAsteroid.getData('health') - bullet.getData('damage') <= 0)
                this.player.setData('oxygenAsteroid', null);
            }

            oxygenAsteroid.damage(bullet.getData('damage'));
          }
          if (bullet) {
            bullet.destroy();
          }          
        }
      }, null, this);

      // Check for collisions between asteroids and oxygenAsteroids
      this.physics.add.overlap(this.asteroids, this.oxygenAsteroids,
        function(asteroid, oxygenAsteroid) {
          this.createExplosion(asteroid.x, asteroid.y, asteroid.displayWidth);
          if (oxygenAsteroid) {
            if(oxygenAsteroid == this.player.getData('oxygenAsteroid')){
              if(oxygenAsteroid.getData('health') - asteroid.getData('damage') <= 0)
                this.player.setData('oxygenAsteroid', null);
            }
            oxygenAsteroid.damage(asteroid.getData('damage'));
          }          

          if (asteroid) {
            asteroid.damage(gameConfig.asteroid3Damage);
          }
        }, null, this);

      // Check for collisions between dogs and oxygenAsteroids
      this.physics.add.overlap(this.dogs, this.oxygenAsteroids,
        function(dog, oxygenAsteroid) {
          this.createExplosion(dog.x, dog.y, dog.displayWidth);
          if (oxygenAsteroid) {
            if(oxygenAsteroid == this.player.getData('oxygenAsteroid')){
              if(oxygenAsteroid.getData('health') - dog.getData('damage') <= 0)
                this.player.setData('oxygenAsteroid', null);
            }
            oxygenAsteroid.damage(dog.getData('damage'));
          }
          
          if (dog) {
            dog.damage(gameConfig.asteroid3Damage);
          }
        }, null, this);

        // Check for collisions between player and oxygenAsteroids
        this.physics.add.overlap(this.player, this.oxygenAsteroids,
          function(player, asteroid) {

            if(!player.getData('oxygenAsteroid') && player.getData('grapplePoint')){
              let point = player.getData('grapplePoint');
              let distance = Math.sqrt(Math.pow((asteroid.x - point.x),2) + Math.pow((asteroid.y - point.y),2));
              if(distance <= asteroid.displayWidth/2){
                player.setData('oxygenAsteroid', asteroid);
              }
            }
          }, null, this);
  }

  movementCheck(){
    if(this.gameOver)
      return;

    let moved = false;
    let boost = 0;
    // Check for boost
    if (this.keySpace.isDown) {
      boost = gameConfig.boost;
      this.player.setData('oxygenAsteroid', null);
    }

    if(this.player.getData('oxygenAsteroid') != null){
      this.oxygenDepletionTimer.paused = true;
      this.oxygenReplenishTimer.paused = false;
    }else{
      this.oxygenDepletionTimer.paused = false;
      this.oxygenReplenishTimer.paused = true;
    }

    if(this.keyShift.isDown && this.player.getData('grapplePoint')){
      this.player.grapple();
    }else{
      this.player.reelGrapple();
      // Check for vertical movement
      if (this.keyW.isDown) {
        if(this.player.getData('oxygenAsteroid') == null){
          this.player.moveUp(boost);
          moved = true;
        }
      } else if (this.keyS.isDown) {
        if(this.player.getData('oxygenAsteroid') == null){
          this.player.moveDown(boost);
          moved = true;
        }
      }

      // Check for horizontal movement
      if (this.keyA.isDown) {
        if(this.player.getData('oxygenAsteroid') != null){
          this.player.followAsteroid(-1 * gameConfig.playerWalkVelocityX);
        }else{
          this.player.moveLeft(boost);
          
        }
        moved = true;
      } else if (this.keyD.isDown) {
        if(this.player.getData('oxygenAsteroid') != null){
          this.player.followAsteroid(gameConfig.playerWalkVelocityX);
        }else{
          this.player.moveRight(boost);
        }
        moved = true;
      }
    }

    if (moved) {
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

      //camera does not move left
      let scroll = this.cameras.main.scrollX;
      if(scroll < gameConfig.worldWidth - this.game.config.width){
        this.physics.world.setBounds(scroll, 0, gameConfig.worldWidth - scroll, this.game.config.height);
        this.cameras.main.setBounds(scroll, 0, gameConfig.worldWidth - scroll, this.game.config.height);
      }
    }else{
      if(this.player.getData('oxygenAsteroid') != null){
        this.player.followAsteroid(0);
      }
    }
  }

  frustumCulling(){
    let maxLength = 2 * (Math.sqrt(Math.pow(this.game.config.width * 0.5, 2) + Math.pow(this.game.config.height * 0.5, 2)));
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
          ) > maxLength
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
          ) > maxLength
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
          ) > maxLength
        ) {
          if (dog) {
            dog.onDestroy();
            dog.destroy();
          }
        }
      }
  }
}
