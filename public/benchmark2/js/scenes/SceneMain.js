class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMain' });
  }
  init(data) {
    this.passingData = data;
  }
  preload() {}

  create() {
    
    const map = this.make.tilemap({
      key: 'map'
    });

    const tileset = map.addTilesetImage('cateroidsTileset', 'tiles');

    this.initAnimations();
    this.uiContainer = this.initUI();
    this.uiContainer.setScrollFactor(0);

    if (
      Object.getOwnPropertyNames(this.passingData).length == 0 &&
      this.passingData.constructor === Object
    ) {
      this.passingData = {
        maxLives: 5,
        lives: 5,
        score: 0
      };
    }

    this.player = new Leo(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5
    );
    this.player.play(keys.IDLEKEY);
    this.physics.world.setBounds(0, 0, 10000, this.game.config.height);
    this.bullets = this.add.group();
    this.asteroids = this.add.group();
    this.dogs = this.add.group();
    this.iconLives = this.add.group();

    this.maxLives = 3;
    this.lives = this.maxLives;
    this.score = 0;
    this.textScore = this.add.text(32, 32, this.score, {
      fontFamily: 'monospace',
      fontSize: 32,
      align: 'left'
    });

    this.createLivesIcons();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Shoot on click
    this.input.on(
      'pointerdown',
      function(pointer) {
        if (this.player.active) {
          this.player.shoot(pointer.worldX, pointer.worldY);
          //this.player.play(keys.ATTACKKEY);
        }
      },
      this
    );

    this.time.addEvent({
      delay: 5000,
      callback: function() {
        let oxygen = this.player.getData('oxygen');
        if(oxygen > 0)
          this.player.setData('oxygen', this.player.getData('oxygen') - 1);
      },
      callbackScope: this,
      loop: true,
    });

    // Asteroid Spawner
    this.time.addEvent({
      delay: 2000,
      callback: function() {
        this.spawnAsteroid();

        if (Phaser.Math.Between(0, 100) > 70) {
          this.spawnDog();
        }
      },
      callbackScope: this,
      loop: true
    });

    // Check for collisions between player and asteroids
    this.physics.add.collider(
      this.player,
      this.asteroids,
      function(player, asteroids) {
        this.createExplosion(player.x, player.y, asteroids.displayWidth);

        if (this.player) {
          this.onLifeDown();
          asteroids.destroy();
          //this.player.destroy();
        }
      },
      null,
      this
    );

    // Check for collisions between player and enemies
    this.physics.add.collider(
      this.player,
      this.dogs,
      function(player, dog) {
        this.createExplosion(player.x, player.y, player.displayWidth);

        if (player) {
          this.onLifeDown();
          dog.onDestroy();
          dog.destroy();
          //player.destroy();
        }
      },
      null,
      this
    );

    // Check for collisions between player and bullets
    this.physics.add.collider(
      this.player,
      this.bullets,
      function(player, bullet) {
        if (!bullet.getData('isFriendly')) {
          this.createExplosion(player.x, player.y, player.displayWidth);

          if (player) {
            this.onLifeDown();
            bullet.destroy();
            //player.destroy();
          }
        }
      },
      null,
      this
    );

    // Check for collisions between bullets and astroids
    this.physics.add.overlap(
      this.bullets,
      this.asteroids,
      function(bullet, asteroid) {
        if (bullet.getData('isFriendly')) {
          this.createExplosion(bullet.x, bullet.y, asteroid.displayWidth);

          const oldAsteroidPos = new Phaser.Math.Vector2(
            asteroid.x,
            asteroid.y
          );
          const oldAsteroidKey = asteroid.texture.key;
          const oldAsteroidLevel = asteroid.getData('level');
          if (asteroid) {
            asteroid.destroy();
          }

          // Give points for desroying asteroids
          switch (oldAsteroidLevel) {
            case 0: {
              this.addScore(20);
              break;
            }

            case 1: {
              this.addScore(50);
              break;
            }

            case 2: {
              this.addScore(100);
              break;
            }
          }

          // Break apart large asteroid
          if (oldAsteroidLevel < 2) {
            for (let i = 0; i < 2; i++) {
              let key = '';
              let newLevel = Phaser.Math.Between(1, 2);
              if ( oldAsteroidKey == keys.ASTEROID0KEY) {
                key = keys[`ASTEROID${newLevel}KEY`];

              }else if(oldAsteroidKey == keys.ASTEROID1KEY){
                key = keys.ASTEROID2KEY;
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

          if (bullet) {
            bullet.destroy();
          }
        }
      },
      null,
      this
    );

    // Check for collision between bullets and enemies
    this.physics.add.overlap(
      this.bullets,
      this.dogs,
      function(bullet, dog) {
        if (bullet.getData('isFriendly')) {
          this.createExplosion(bullet.x, bullet.y, dog.displayWidth);

          // Add to score for destroying enemy
          if (dog.texture.key == keys.DOGKEY) {
            this.addScore(1000);
          }

          if (dog.texture.key == keys.DOGKEY) {
            this.addScore(200);
          }

          if (bullet) {
            bullet.destroy();
          }

          if (dog) {
            dog.onDestroy();
            dog.destroy();
          }
        }
      },
      null,
      this
    );

    /*const camera = this.cameras.main;
    camera.startFollow(this.player);

    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);*/

    //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player); 
  }






  update() {
    if (this.player.active) {
      this.player.update();
      this.updateUI();
      let moved = false;
      let boost = 0;
      // Check for boost
      if (this.keySpace.isDown) {
        boost = 20;
      }

      // Check for vertical movement
      if (this.keyW.isDown) {
        this.player.moveUp(boost);
        moved = true;
      } else if (this.keyS.isDown) {
        this.player.moveDown(boost);
        moved = true;
      }

      // Check for horizontal movement
      if (this.keyA.isDown) {
        this.player.moveLeft(boost);
        moved = true;
      } else if (this.keyD.isDown) {
        this.player.moveRight(boost);
        moved = true;
      }

      if (moved) {
        const gas = this.add.particles(keys.PIXELKEY).createEmitter({
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
      }

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

  createLivesIcons() {
    for (let i = 0; i < this.passingData.lives; i++) {
      const icon = this.add.sprite(
        this.textScore.x + i * 16 + 12,
        this.textScore.y + 42,
        keys.LIFEICON
      );
      icon.setOrigin(0.5);
      this.iconLives.add(icon);
    }
  }

  createExplosion(x, y, amount) {
    const explosion = this.add.particles(keys.PIXELKEY).createEmitter({
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

  onLifeDown() {
    if(this.player.getData('health') > 0){
      this.player.setData('health', this.player.getData('health') - 20);
      this.updateUI();
    }else{
      this.player.play(keys.DEADKEY);
      this.scene.pause(keys.GAMEKEY);
      this.scene.start(keys.GAMEOVERKEY);
    }
  }

  getSpawnPosition() {
    let buffer = 16;
    const sides = ['top', 'right', 'bottom', 'left', 'right', 'right', 'right'];
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
      keys[`ASTEROID${level}KEY`]
    );
    asteroid.setData('level', level);

    this.asteroids.add(asteroid);
  }

  spawnDog() {
    const position = this.getSpawnPosition();

    let imageKey = '';
    let rand = Phaser.Math.Between(0, 50);
    if (rand < 25) {
      imageKey = keys.DOGKEY;
    } else if (rand < 40) {
      imageKey = keys.DOG2KEY;
    } else {
      imageKey = keys.DOG3KEY;
    }
    const dog = new Dog(this, position.x, position.y, imageKey);
    this.dogs.add(dog);
  }

  addScore(amount) {
    this.score += amount;
    this.textScore.setText(this.score);
  }

  initAnimations() {
    var self = this;
    var animCounter = 0;
    var catIndices = [[1, 7], [8, 9], [10, 12], [13, 16], [16, 16]];
    var dogIndices = [[1, 7], [8, 8], [9, 11], [12, 15], [15, 15]];
    var animData = [[2, -1], [4, 1], [4, 1], [4, 1], [4, 1]];


    keys.animationKeys.forEach(function(anim) {
      self.anims.create({
        key: keys[`${anim.toUpperCase()}KEY`],
        frames: self.anims.generateFrameNames(keys.CATATLASKEY, {
          prefix: keys.SPRITEPREFIXKEY,
          start: catIndices[animCounter][0],
          end: catIndices[animCounter][1],
          zeroPad: 0
        }),
        frameRate: animData[animCounter][0],
        repeat: animData[animCounter][1]
      });
      animCounter++;
    });
    

    keys.dogKeys.forEach(function(dogStr) {
      animCounter = 0;
      keys.animationKeys.forEach(function(anim) {
        self.anims.create({
          key: keys[`${dogStr}${anim.toUpperCase()}KEY`],
          frames: self.anims.generateFrameNames(keys[`${dogStr}ATLASKEY`], {
            prefix: keys.SPRITEPREFIXKEY,
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

  }

  initUI() {
    let uiContainer = this.add.container();
    let gameHeight = this.sys.game.config.height;

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



    this.pauseButton = this.add
      .text(0, gameHeight - 100 * gameScale.scale, 'ESC', {
        font: `${80 * gameScale.scale}px impact`,
        fill: '#ffffff',
        stroke: 'black',
        strokeThickness: 5
      })
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', function() {
        this.scene.game.scene.pause(keys.GAMEKEY);
        this.scene.game.scene.start(keys.PAUSEKEY);
      });

    uiContainer.add([hpBG, this.hpBar, oxygenBG, this.oxygenBar, this.pauseButton]);
    return uiContainer;
  } 

  updateUI(){
    this.hpBar.clear().fillStyle(gameStyles.healthColor).setDepth(gameDepths.uiDepth);
    this.hpBar.fillRect(
      gameStyles.padding, 
      gameStyles.padding, 
      gameStyles.healthWidth * (this.player.getData('health')/playerData.maxHealth), 
      gameStyles.barHeight);

    this.oxygenBar.clear().fillStyle(gameStyles.oxygenColor).setDepth(gameDepths.uiDepth);
    this.oxygenBar.fillRect(
      gameStyles.padding, 
      gameStyles.padding * 2 + gameStyles.barHeight,
      gameStyles.oxygenWidth * (this.player.getData('oxygen')/playerData.maxOxygen), 
      gameStyles.barHeight);
  }
}
