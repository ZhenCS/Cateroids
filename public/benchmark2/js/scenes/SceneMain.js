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

    this.initAnimations();
    this.initUI();
    this.gameOverContainer = this.initGameOverMenu();
    this.controlContainer = this.initControls();

    const spawnTile = map.findObject('objectLayer', obj => obj.gid === 4);

    this.player = new Leo(
      this,
      spawnTile.x,
      spawnTile.y
    );

    map.filterTiles(obj => obj.gid === 2).forEach((ast) => {
      this.spawnAsteroid(ast.x, ast.y);
    }, this);

    map.filterTile(obj => obj.gid === 1).forEach((dog) => {
      this.spawnDog(dog.x, dog.y);
    }, this);
    
    this.player.play(keys.IDLEKEY);

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

    if (this.dataFromLevelSelect.lives === 0) {
      this.textGameOver = this.add.text(
        this.game.config.width * 0.5,
        64,
        'GAME OVER',
        {
          fontFamily: 'monospace',
          fontSize: 72,
          align: 'left'
        }
      );
      this.textGameOver.setOrigin(0.5);

      this.time.addEvent({
        delay: 3000,
        callback: function() {
          this.scene.start(keys.GAMEKEY, {});
        },
        callbackScope: this,
        loop: false
      });
    }
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
          this.player.shoot(pointer.x, pointer.y);
          //this.player.play(keys.ATTACKKEY);
        }
      },
      this
    );

    // Check for collisions between player and asteroids
    this.physics.add.collider(
      this.player,
      this.asteroids,
      function(player, asteroids) {
        this.createExplosion(player.x, player.y, asteroids.displayWidth);

        if (this.player) {
          this.onLifeDown();
          this.player.destroy();
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
          player.destroy();
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

            player.destroy();
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
              let scale = 1;
              let key = '';
              if (
                oldAsteroidKey == 'sprAsteroid0' ||
                oldAsteroidKey == 'sprAsteroid1'
              ) {
                scale = 0.5;
                key = 'sprAsteroid' + Phaser.Math.Between(0, 1);
              } else if (oldAsteroidKey == 'sprAsteroid2') {
                key = 'sprAsteroid' + Phaser.Math.Between(0, 1);
              }

              const newAsteroid = new Asteroid(
                this,
                oldAsteroidPos.x,
                oldAsteroidPos.y,
                'sprAsteroid' + Phaser.Math.Between(0, 2)
              );
              newAsteroid.setScale(scale);
              newAsteroid.setTexture(key);
              newAsteroid.setData('level', oldAsteroidLevel + 1);
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

    const camera = this.cameras.main;
    camera.startFollow(this.player);

    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update() {
    if (this.player.active) {
      this.player.update();
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
      // Frustum culling for bullets to prevent offscreen rendering
      for (let i = 0; i < this.bullets.getChildren().length; i++) {
        const bullet = this.bullets.getChildren(i);

        if (
          Phaser.Math.Distance.Between(
            bullet.x,
            bullet.y,
            this.game.config.width * 0.5,
            this.game.config.height * 0.5
          ) > 500
        ) {
          if (bullet) {
            bullet.destroy();
          }
        }
      }
      // // Frustum culling for asteroids to prevent offscreen rendering
      // for (let i = 0; i < this.asteroids.getChildren().length; i++) {
      //   const asteroid = this.asteroids.getChildren(i);

      //   if (
      //     Phaser.Math.Distance.Between(
      //       asteroid.x,
      //       asteroid.y,
      //       this.game.config.width * 0.5,
      //       this.game.config.height * 0.5
      //     ) > 500
      //   ) {
      //     if (asteroid) {
      //       asteroid.destroy();
      //     }
      //   }
      // }
      // // Frustum culling for dogs to prevent offscreen rendering
      // for (let i = 0; i < this.dogs.getChildren().length; i++) {
      //   const dog = this.dogs.getChildren(i);

      //   if (
      //     Phaser.Math.Distance.Between(
      //       dog.x,
      //       dog.y,
      //       this.game.config.width * 0.5,
      //       this.game.config.height * 0.5
      //     ) > 500
      //   ) {
      //     if (dog) {
      //       dog.onDestroy();
      //       dog.destroy();
      //     }
      //   }
      // }
    }
  }

  createLivesIcons() {
    for (let i = 0; i < this.dataFromLevelSelect.lives; i++) {
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
    if (this.dataFromLevelSelect.lives > 0) {
      this.dataFromLevelSelect.lives--;

      this.time.addEvent({
        delay: 1000,
        callback: function() {
          this.scene.start(keys.GAMEKEY, this.dataFromLevelSelect);
        },
        callbackScope: this,
        loop: false
      });
    } else {
      this.dataFromLevelSelect.lives = 0;
    }
  }

  getSpawnPosition() {
    const sides = ['top', 'right', 'bottom', 'left'];
    const side = sides[Phaser.Math.Between(0, sides.length - 1)];

    let position = new Phaser.Math.Vector2(0, 0);
    switch (side) {
      case 'top': {
        position = new Phaser.Math.Vector2(
          Phaser.Math.Between(0, this.game.config.width),
          -128
        );
        break;
      }

      case 'right': {
        position = new Phaser.Math.Vector2(
          this.game.config.width + 128,
          Phaser.Math.Between(0, this.game.config.height)
        );
        break;
      }

      case 'bottom': {
        position = new Phaser.Math.Vector2(
          Phaser.Math.Between(0, this.game.config.width),
          this.game.config.height + 128
        );
      }

      case 'left': {
        position = new Phaser.Math.Vector2(
          0,
          Phaser.Math.Between(-120, this.game.config.height)
        );
      }
    }

    return position;
  }

  spawnAsteroid(x, y) {
    const asteroid = new Asteroid(
      this,
      x,
      y,
      'sprAsteroid' + Phaser.Math.Between(0, 3)
    );

    if (
      asteroid.texture.key == 'sprAsteroid0' ||
      asteroid.texture.key == 'sprAsteroid1'
    ) {
      asteroid.setData('level', 1);
    }

    this.asteroids.add(asteroid);
  }

  spawnDog(x, y) {
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
    const dog = new Dog(this, x, y, imageKey);
    this.dogs.add(dog);
  }

  addScore(amount) {
    this.score += amount;
    this.textScore.setText(this.score);
  }

  initAnimations() {
    this.anims.create({
      key: keys.IDLEKEY,
      frames: this.anims.generateFrameNames(keys.CATATLASKEY, {
        prefix: keys.SPRITEPREFIXKEY,
        start: 1,
        end: 7,
        zeroPad: 0
      }),
      frameRate: 2,
      repeat: -1
    });

    this.anims.create({
      key: keys.ATTACKKEY,
      frames: this.anims.generateFrameNames(keys.CATATLASKEY, {
        prefix: keys.SPRITEPREFIXKEY,
        start: 8,
        end: 9,
        zeroPad: 0
      }),
      frameRate: 4,
      repeat: 1
    });

    this.anims.create({
      key: keys.DAMAGEKEY,
      frames: this.anims.generateFrameNames(keys.CATATLASKEY, {
        prefix: keys.SPRITEPREFIXKEY,
        start: 10,
        end: 12,
        zeroPad: 0
      }),
      frameRate: 4,
      repeat: 1
    });

    this.anims.create({
      key: keys.DYINGKEY,
      frames: this.anims.generateFrameNames(keys.CATATLASKEY, {
        prefix: keys.SPRITEPREFIXKEY,
        start: 13,
        end: 16,
        zeroPad: 0
      }),
      frameRate: 4,
      repeat: 1
    });

    this.anims.create({
      key: keys.DEADKEY,
      frames: this.anims.generateFrameNames(keys.CATATLASKEY, {
        prefix: keys.SPRITEPREFIXKEY,
        start: 16,
        end: 16,
        zeroPad: 0
      }),
      frameRate: 4,
      repeat: -1
    });

    var self = this;
    var dogCounter = 0;
    var dogIndices = [[1, 7], [8, 8], [9, 11], [12, 15], [15, 15]];
    var animData = [[2, -1], [4, 1], [4, 1], [4, 1], [4, 1]];
    keys.dogKeys.forEach(function(dogStr) {
      dogCounter = 0;
      keys.animationKeys.forEach(function(anim) {
        self.anims.create({
          key: keys[`${dogStr}${anim.toUpperCase()}KEY`],
          frames: self.anims.generateFrameNames(keys[`${dogStr}ATLASKEY`], {
            prefix: keys.SPRITEPREFIXKEY,
            start: dogIndices[dogCounter][0],
            end: dogIndices[dogCounter][1],
            zeroPad: 0
          }),
          frameRate: animData[dogCounter][0],
          repeat: animData[dogCounter][1]
        });

        dogCounter++;
      });
    });
  }

  initGameOverMenu() {
    let gameOverContainer = this.add.container();
    let gameOverHeader = this.add.text(0, 100 * gameScale.scale, 'Game Over', {
      font: `${100 * gameScale.scale}px impact`,
      fill: '#ffffff',
      stroke: 'black',
      strokeThickness: 5
    });

    centerX(this, gameOverHeader);
    let restartButton = this.createButton(
      200 * gameScale.scale,
      'Restart Game'
    );

    gameOverContainer.depth = gameDepths.menuDepth;
    gameOverContainer.visible = false;
    gameOverContainer.add([gameOverHeader, restartButton]);

    return gameOverContainer;
  }

  initUI() {
    let gameHeight = this.sys.game.config.height;
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
  }

  createButton(yPosition, text) {
    let button = this.add
      .text(0, yPosition, text, {
        font: `${100 * gameScale.scale}px impact`,
        fill: '#ffffff',
        stroke: 'black',
        strokeThickness: 5
      })
      .setInteractive({ cursor: 'pointer' });

    centerX(this, button);
    button.depth = gameDepths.uiDepth;

    button.on('pointerover', function() {
      this.alpha = 0.5;
    });

    button.on('pointerout', function() {
      this.alpha = 1;
    });

    return button;
  }

  showGameOverMenu() {
    this.gameOverContainer.visible = true;

    //stop game
  }

  hideGameOverMenu() {
    this.gameOverContainer.visible = false;
  }
}
