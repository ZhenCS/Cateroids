import * as constants from './utils/constants.js';
import * as collisions from './Collisions.js';
import { Asteroid, Dog, Laser } from './Entities.js';
import { centerX } from './utils/utils.js';

export function initScene(scene, mode) {
  initAnimations(scene);
  initUI(scene, mode);
  initEvents(scene);
  initControls(scene);
  initCollisions(scene);
  initSound(scene);
  initUpgrades(scene);
}

export function updateUI(scene, mode) {
  updateCamera(scene, mode);

  if (mode == 'DEFEND') {
    scene.baseBar
      .clear()
      .fillStyle(gameStyles.baseColor)
      .setDepth(gameDepths.uiDepth);
    let offset = scene.game.config.width / 2 - gameStyles.healthWidth / 2;

    scene.baseBar.fillRect(
      offset,
      scene.game.config.height - gameStyles.basePadding,
      gameStyles.healthWidth *
        (scene.baseAsteroid.getData('health') / scene.gameConfig.maxBaseHealth),
      gameStyles.barHeight
    );

    //centerX(scene, scene.baseBar);
  } else if (mode == 'BOSS') {
    scene.bossBar
      .clear()
      .fillStyle(gameStyles.bossColor)
      .setDepth(gameDepths.uiDepth);
    let offset = scene.game.config.width / 2 - gameStyles.healthWidth / 2;

    scene.bossBar.fillRect(
      offset,
      gameStyles.bossPadding,
      gameStyles.healthWidth *
        (scene.boss.getData('health') / scene.gameConfig.maxBossHealth),
      gameStyles.barHeight
    );
  }

  scene.hpBar
    .clear()
    .fillStyle(gameStyles.healthColor)
    .setDepth(gameDepths.uiDepth);
  scene.hpBar.fillRect(
    gameStyles.padding,
    gameStyles.padding,
    gameStyles.healthWidth *
      (scene.player.getData('health') / scene.gameConfig.maxPlayerHealth),
    gameStyles.barHeight
  );

  scene.oxygenBar
    .clear()
    .fillStyle(gameStyles.oxygenColor)
    .setDepth(gameDepths.uiDepth);
  scene.oxygenBar.fillRect(
    gameStyles.padding,
    gameStyles.padding * 2 + gameStyles.barHeight,
    gameStyles.oxygenWidth *
      (scene.player.getData('oxygen') / scene.gameConfig.maxPlayerOxygen),
    gameStyles.barHeight
  );

  scene.textScore.setX(
    scene.sys.game.config.width -
      scene.textScore.displayWidth -
      gameStyles.padding
  );
}

function updateCamera(scene, mode) {
  //player cannot move left after moving right
  let scroll = scene.cameras.main.scrollX;
  if (scroll < scene.gameConfig.worldWidth - scene.game.config.width) {
    scene.physics.world.setBounds(
      scroll,
      0,
      scene.gameConfig.worldWidth - scroll,
      scene.gameConfig.worldHeight
    );

    if (mode == 'RUN') {
      let sceneConfig = scene.gameConfig;
      let offsetY = sceneConfig.worldOffsetY;
      if (offsetY < 0) {
        offsetY = 0;
      }

      scene.cameras.main.setBounds(
        scroll,
        0 - offsetY,
        sceneConfig.worldWidth - scroll,
        sceneConfig.worldHeight + 2 * offsetY
      );

      scene.spaceBackground.tilePositionX = scroll/5;
    }
  }
}

function initUpgrades(scene) {
  scene.gameConfig.maxPlayerHealth =
    gameConfig.maxPlayerHealth + upgradeRates.Health * playerUpgrades[0][1];
  scene.player.setData('health', scene.gameConfig.maxPlayerHealth);

  scene.gameConfig.playerDamage =
    gameConfig.playerDamage + upgradeRates.Damage * playerUpgrades[1][1];
  scene.gameConfig.oxygenDepletionRate =
    gameConfig.oxygenDepletionRate -
    upgradeRates.OxygenDepletion * playerUpgrades[2][1];
  scene.gameConfig.oxygenReplenishDelay =
    gameConfig.oxygenReplenishDelay -
    upgradeRates.OxygenReplenish * playerUpgrades[3][1];
  scene.gameConfig.playerBulletSize =
    gameConfig.playerBulletSize +
    upgradeRates.BulletSize * playerUpgrades[4][1];

  scene.gameConfig.maxPlayerAmmo =
    gameConfig.maxPlayerAmmo + upgradeRates.ExtraAmmo * playerUpgrades[5][1];
  scene.player.ammoCount = scene.gameConfig.maxPlayerAmmo;

  scene.gameConfig.playerFireRate =
    gameConfig.playerFireRate - upgradeRates.FireRate * playerUpgrades[6][1];
  resetShootTimer(scene);

  scene.gameConfig.softMaxPlayerVelocityX =
    gameConfig.softMaxPlayerVelocityX +
    upgradeRates.Speed * playerUpgrades[7][1];
  scene.gameConfig.softMaxPlayerVelocityY =
    gameConfig.softMaxPlayerVelocityY +
    upgradeRates.Speed * playerUpgrades[7][1];
  scene.gameConfig.hardMaxPlayerVelocityX =
    gameConfig.hardMaxPlayerVelocityX +
    upgradeRates.Speed * playerUpgrades[7][1];
  scene.gameConfig.hardMaxPlayerVelocityY =
    gameConfig.hardMaxPlayerVelocityY +
    upgradeRates.Speed * playerUpgrades[7][1];
}

function initSound(scene) {
  scene.sound.stopAll();
  scene.sound.add(constants[`LEVELMUSIC${currentLevel.level}`]);
  scene.levelMusic = scene.sound.play(
    constants[`LEVELMUSIC${currentLevel.level}`],
    {
      volume: 0.05,
      loop: true,
      delay: 1
    }
  );

  scene.sound.add(constants.MENUSELECT);
  scene.sound.add(constants.MENUMOVE);

  scene.sound.add(constants.RAYSTARTUP);
  scene.sound.add(constants.RAYFIRING);

  scene.sound.add(constants.ASTRCOLLISION);
  scene.sound.add(constants.LASERHIT);

  scene.sound.add(constants.CATWEAPONAUDIO);
  scene.sound.add(constants.SECONDARYWEAPONAUDIO);
  scene.sound.add(constants.EXPLOSION2AUDIO);
  scene.sound.add(constants.DYINGAUDIO);

  scene.sound.add(constants.GRAPPLEAWAYAUDIO);
  scene.sound.add(constants.GRAPPLING);
  scene.sound.add(constants.BOOSTAUDIO);
  scene.sound.add(constants.OXYGENLOWAUDIO);

  scene.sound.add(constants.MEOWAUDIO);
  scene.sound.add(constants.BARKAUDIO);
  scene.sound.add(constants.BARK2AUDIO);
  scene.sound.add(constants.GROWLAUDIO);
}

function getLaserPosition(scene) {
  let width = scene.game.config.width;
  let height = scene.game.config.height;

  return new Phaser.Math.Vector2(
    Phaser.Math.Between(0, width),
    Phaser.Math.Between(0, height)
  );
}

function getSpawnPosition(scene) {
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
  let width = scene.game.config.width;
  let height = scene.game.config.height;
  let position = new Phaser.Math.Vector2(0, 0);
  switch (side) {
    case 'top': {
      position = new Phaser.Math.Vector2(
        Phaser.Math.Between(
          scene.player.x - width / 2,
          scene.player.x + width / 2
        ),
        -1 * buffer
      );
      break;
    }

    case 'right': {
      position = new Phaser.Math.Vector2(
        scene.player.x + scene.game.config.width / 2 + buffer,
        Phaser.Math.Between(
          scene.player.y - height / 2,
          scene.player.y + height / 2
        )
      );
      break;
    }

    case 'bottom': {
      position = new Phaser.Math.Vector2(
        Phaser.Math.Between(
          scene.player.x - width / 2,
          scene.player.x + width / 2
        ),
        scene.game.config.height + buffer
      );
    }

    case 'left': {
      position = new Phaser.Math.Vector2(
        scene.player.x - scene.game.config.width / 2 - buffer,
        Phaser.Math.Between(
          scene.player.y - height / 2,
          scene.player.y + height / 2
        )
      );
    }
  }

  return position;
}

function spawnAsteroid(scene) {
  const position = getSpawnPosition();
  const level = Phaser.Math.Between(0, 2);
  const asteroid = new Asteroid(
    scene,
    position.x,
    position.y,
    constants[`ASTEROID${level}KEY`]
  );

  scene.asteroids.add(asteroid);
}

function spawnOxygenAsteroid(scene) {
  const position = scene.getSpawnPosition();
  const asteroid = new Asteroid(
    scene,
    position.x,
    position.y,
    constants.ASTEROID3KEY
  );
  asteroid.setTint(0xfff572);
  asteroid.setScale(1.5);

  scene.oxygenAsteroids.add(asteroid);
}

function spawnDog(scene) {
  const position = getSpawnPosition();

  let key = 0;

  let rand = Phaser.Math.Between(0, 100);
  let { dog1SpawnRate, dog2SpawnRate, dog3SpawnRate } = scene.gameConfig;
  if (rand < dog1SpawnRate) {
    key = 1;
  } else if (rand < dog1SpawnRate + dog2SpawnRate) {
    key = 2;
  } else if (rand < dog1SpawnRate + dog2SpawnRate + dog3SpawnRate) {
    key = 3;
  }

  if (key > 0) {
    let health = scene.gameConfig[`dog${key}Health`];
    let damage = scene.gameConfig[`dog${key}Damage`];
    let fireRate = scene.gameConfig[`dog${key}FireRate`];

    const dog = new Dog(
      scene,
      position.x,
      position.y,
      key,
      undefined,
      undefined,
      health,
      damage,
      fireRate
    );
    scene.dogs.add(dog);
  }
}

function initAnimations(scene) {
  var animCounter = 0;
  //animationKeys: ['idle', 'attack', 'damage', 'dying', 'dead']
  var catIndices = [[1, 7], [8, 9], [10, 12], [13, 16], [16, 16]];
  var dogIndices = [[1, 7], [8, 8], [9, 11], [12, 15], [15, 15]];
  var animData = [[2, -1], [4, 0], [4, 0], [4, 0], [4, 0]];
  var weaponKeys = [1, 5];
  
  scene.anims.create({
    key: constants.DOGWALLIDLEKEY,
    frames: scene.anims.generateFrameNames(constants.DOGWALLATLASKEY, {
      prefix: constants.SPRITEPREFIXKEY,
      start: 1,
      end: 8,
      zeroPad: 0
    }),
    repeat: -1,
    frameRate: 8
  });
  scene.anims.create({
    key: constants.OXYGENBREAKINGKEY,
    frames: scene.anims.generateFrameNames(constants.OXYGENATLASKEY, {
      prefix: constants.SPRITEPREFIXKEY,
      start: 1,
      end: 3,
      zeroPad: 0
    }),
    frameRate: 1
  });
  scene.anims.create({
    key: constants.BOSSWEAPONCHARGINGKEY,
    frames: scene.anims.generateFrameNames(constants.BOSSWEAPONATLASKEY, {
      prefix: constants.SPRITEPREFIXKEY,
      start: weaponKeys[0],
      end: weaponKeys[1],
      zeroPad: 0
    }),
    frameRate: 15,
    repeat: 2
  });
  constants.animationKeys.forEach(function(anim) {
    scene.anims.create({
      key: constants[`${anim.toUpperCase()}KEY`],
      frames: scene.anims.generateFrameNames(constants.CATATLASKEY, {
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
      scene.anims.create({
        key: constants.dogAnimationKeys[`${dogStr}${anim.toUpperCase()}KEY`],
        frames: scene.anims.generateFrameNames(constants[`${dogStr}ATLASKEY`], {
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
  scene.player.play(constants.IDLEKEY);
}

function initUI(scene, mode) {
  let uiContainer = scene.add.container().setDepth(gameDepths.uiDepth);
  let gameHeight = scene.sys.game.config.height;
  let gameWidth = scene.sys.game.config.width;

  if (mode == 'DEFEND') {
    let baseBG = scene.add
      .graphics()
      .fillStyle(gameStyles.barColor)
      .setDepth(gameDepths.uiDepth);
    scene.baseBar = scene.add
      .graphics()
      .fillStyle(gameStyles.baseColor)
      .setDepth(gameDepths.uiDepth);

    let offset = scene.game.config.width / 2 - gameStyles.healthWidth / 2;
    baseBG.fillRect(
      offset,
      scene.game.config.height - gameStyles.basePadding,
      gameStyles.healthWidth,
      gameStyles.barHeight
    );

    scene.baseBar.fillRect(
      offset,
      scene.game.config.height - gameStyles.basePadding,
      gameStyles.healthWidth,
      gameStyles.barHeight
    );
    uiContainer.add([baseBG, scene.baseBar]);
  } else if (mode == 'BOSS') {
    let bossBG = scene.add
      .graphics()
      .fillStyle(gameStyles.barColor)
      .setDepth(gameDepths.uiDepth);

    scene.bossBar = scene.add
      .graphics()
      .fillStyle(gameStyles.bossColor)
      .setDepth(gameDepths.uiDepth);

    let offset = scene.game.config.width / 2 - gameStyles.healthWidth / 2;

    bossBG.fillRect(
      offset,
      gameStyles.bossPadding,
      gameStyles.healthWidth,
      gameStyles.barHeight
    );

    scene.bossBar.fillRect(
      offset,
      gameStyles.bossPadding,
      gameStyles.healthWidth,
      gameStyles.barHeight
    );
    uiContainer.add([bossBG, scene.bossBar]);
  }
  let hpText = scene.add
    .text(gameStyles.padding + 2, gameStyles.padding - 2, 'Health', {
      font: `${32 * gameScale.scale}px Georgia`,
      fill: '#ffffff'
    })
    .setDepth(gameDepths.uiDepth + 1);

  let hpBG = scene.add
    .graphics()
    .fillStyle(gameStyles.barColor)
    .setDepth(gameDepths.uiDepth);
  scene.hpBar = scene.add
    .graphics()
    .fillStyle(gameStyles.healthColor)
    .setDepth(gameDepths.uiDepth);

  hpBG.fillRect(
    gameStyles.padding,
    gameStyles.padding,
    gameStyles.healthWidth,
    gameStyles.barHeight
  );

  scene.hpBar.fillRect(
    gameStyles.padding,
    gameStyles.padding,
    gameStyles.healthWidth,
    gameStyles.barHeight
  );

  let oxygenText = scene.add
    .text(
      gameStyles.padding + 2,
      gameStyles.padding * 2 + gameStyles.barHeight - 2,
      'Oxygen',
      {
        font: `${32 * gameScale.scale}px Georgia`,
        fill: '#ffffff'
      }
    )
    .setDepth(gameDepths.uiDepth + 1);

  scene.ammo = (scene.gameConfig.secondaryWeapon == 'plasma') ? scene.gameConfig.maxPlayerAmmo : '0';
  scene.ammoCounter = scene.add
    .text(
      gameStyles.padding + 2,
      gameStyles.padding * 4 + gameStyles.barHeight,
      `${gameConfig.secondaryWeaponText}${scene.ammo}`,
      {
        font: `${38 * gameScale.scale}px Georgia`,
        fill: '#ffffff'
      }
    )
    .setDepth(gameDepths.uiDepth + 1);

  let oxygenBG = scene.add
    .graphics()
    .fillStyle(gameStyles.barColor)
    .setDepth(gameDepths.uiDepth);
  scene.oxygenBar = scene.add
    .graphics()
    .fillStyle(gameStyles.oxygenColor)
    .setDepth(gameDepths.uiDepth);

  oxygenBG.fillRect(
    gameStyles.padding,
    gameStyles.padding * 2 + gameStyles.barHeight,
    gameStyles.oxygenWidth,
    gameStyles.barHeight
  );

  scene.oxygenBar.fillRect(
    gameStyles.padding,
    gameStyles.padding * 2 + gameStyles.barHeight,
    gameStyles.oxygenWidth,
    gameStyles.barHeight
  );

  scene.score = 0;
  scene.textScore = scene.add.text(0, gameStyles.padding, scene.score, {
    fontFamily: 'monospace',
    fontSize: 32,
    align: 'left'
  });
  scene.textScore.setX(
    gameWidth - scene.textScore.displayWidth - gameStyles.padding
  );

  scene.pauseButton = scene.add
    .text(0, gameHeight - 100 * gameScale.scale, 'ESC', {
      font: `${80 * gameScale.scale}px impact`,
      fill: '#ffffff',
      stroke: 'black',
      strokeThickness: 5
    })
    .setInteractive({ cursor: 'pointer' })
    .on('pointerdown', function() {
      scene.game.scene.start(constants.PAUSEKEY);
      scene.game.scene.pause(constants.GAMEKEY);
    });

  uiContainer.add([
    hpBG,
    scene.hpBar,
    hpText,
    oxygenBG,
    scene.oxygenBar,
    oxygenText,
    scene.pauseButton,
    scene.textScore,
    scene.ammoCounter
  ]);

  scene.uiContainer = uiContainer;
  scene.uiContainer.setScrollFactor(0);
}

function initControls(scene) {
  scene.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  scene.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  scene.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  scene.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  scene.keySpace = scene.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );
  scene.keyShift = scene.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SHIFT
  );
  scene.keyEsc = scene.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.ESC
  );

  scene.input.keyboard.on('keydown-SHIFT', function() {
    let mouseX = scene.input.mousePointer.worldX;
    let mouseY = scene.input.mousePointer.worldY;

    let point = new Phaser.Math.Vector2(mouseX, mouseY);
    scene.player.deployGrapple(point);
    scene.oxygenAsteroids.getChildren().forEach(function(asteroid) {
      let distance = Math.sqrt(
        Math.pow(asteroid.x - mouseX, 2) + Math.pow(asteroid.y - mouseY, 2)
      );
      if (distance <= asteroid.displayWidth / 2) {
        scene.player.setData('grapplePoint', asteroid);
        scene.player.setData('oxygenAsteroid', null);
      }
    });
  });

  scene.input.keyboard.on('keyup-ESC', function() {
    scene.game.scene.start(constants.PAUSEKEY);
    scene.game.scene.pause(constants.GAMEKEY);
  });

  scene.input.keyboard.on('keyup-SHIFT', function() {
    scene.player.setData('grapplePoint', null);
    scene.player.reelGrapple();
  });

  // Shoot on click
  scene.input.on(
    'pointerdown',
    function(pointer) {
      scene.playerShootTimer.paused = false;
    },
    scene
  );

  scene.input.on(
    'pointerup',
    function(pointer) {
      scene.playerShootTimer.paused = true;
    },
    scene
  );
}

function resetShootTimer(scene) {
  scene.playerShootTimer.reset({
    delay: scene.gameConfig.playerFireRate,
    callback: function() {
      if (scene.player.active && !scene.gameOver) {
        let pointer = scene.input.mousePointer;
        if (pointer.rightButtonDown()) {
          // Shoot secondary fire
          scene.player.shoot(pointer.x, pointer.y, gameConfig.secondaryWeapon);
          scene.player.play(constants.ATTACKKEY);
          scene.player.once('animationcomplete', function() {
            scene.player.play(constants.IDLEKEY);
          });
        } else if (pointer.leftButtonDown()) {
          scene.player.shoot(pointer.x, pointer.y, 'primary');
          scene.player.play(constants.ATTACKKEY);
          scene.player.once('animationcomplete', function() {
            scene.player.play(constants.IDLEKEY);
          });
        }
      }
    },
    callbackScope: scene,
    loop: true
  });
}

function initEvents(scene) {
  // Player Shooting
  scene.playerShootTimer = scene.time.addEvent({
    delay: scene.gameConfig.playerFireRate,
    callback: function() {
      if (scene.player.active && !scene.gameOver) {
        let pointer = scene.input.mousePointer;
        if (pointer.rightButtonDown()) {
          // Shoot secondary fire
          scene.player.shoot(pointer.x, pointer.y, 'beam');
          scene.player.play(constants.ATTACKKEY);
          scene.player.once('animationcomplete', function() {
            scene.player.play(constants.IDLEKEY);
          });
        } else {
          scene.player.shoot(pointer.x, pointer.y, 'primary');
          scene.player.play(constants.ATTACKKEY);
          scene.player.once('animationcomplete', function() {
            scene.player.play(constants.IDLEKEY);
          });
        }
      }
    },
    callbackScope: scene,
    loop: true
  });

  // Oxygen Depletion
  scene.oxygenDepletionTimer = scene.time.addEvent({
    delay: scene.gameConfig.oxygenDepletionDelay,
    callback: function() {
      scene.player.oxygenDamage(scene.gameConfig.oxygenDepletionRate);
    },
    callbackScope: scene,
    loop: true
  });

  // Oxygen Replenish
  scene.oxygenReplenishTimer = scene.time.addEvent({
    delay: scene.gameConfig.oxygenReplenishDelay,
    callback: function() {
      scene.player.oxygenDamage(-1 * scene.gameConfig.oxygenReplenishRate);
    },
    callbackScope: scene,
    loop: true
  });

  // Laser timer
  scene.laserTimer = scene.time.addEvent({
    delay: scene.gameConfig.laserSpawnRate,
    callback: function() {
      let laser = new Laser(
        scene,
        scene.player.x + Phaser.Math.Between(0, 400),
        scene.player.y,
        false,
        Phaser.Math.Between(3, 5),
        -Math.PI / 2
      );
      laser.fire();
      scene.lasers.add(laser);
    },
    callbackScope: scene,
    loop: true
  });

  // Asteroid Spawner
  scene.spawnTimer = scene.time.addEvent({
    delay: 1000,
    callback: function() {
      spawnAsteroid(scene);

      if (Phaser.Math.Between(0, 100) < scene.gameConfig.dogSpawnRate) {
        spawnDog(scene);
      }
      if (
        Phaser.Math.Between(0, 100) < scene.gameConfig.oxygenAsteroidSpawnRate
      ) {
        spawnOxygenAsteroid(scene);
      }
    },
    callbackScope: scene,
    loop: true
  });

  scene.oxygenDepletionTimer.paused = true;
  scene.oxygenReplenishTimer.paused = true;
  scene.laserTimer.paused = true;
  scene.spawnTimer.paused = true;
  scene.playerShootTimer.paused = true;
}

function initCollisions(scene) {
  // Check for collisions between player and asteroids
  collisions.checkPlayerToAsteroidCollision(scene);

  // Check for collisions between player and enemies
  collisions.checkPlayerToEnemyCollision(scene);

  // Check for collisions between player and bullets
  //collisions.checkPlayerToBulletCollision(scene);

  // Check for collision between bullets and enemies
  //collisions.checkEnemyToBulletCollision(scene);

  // Check for collisions between bullets and astroids
  //collisions.checkAsteroidToBulletCollision(scene);

  // Check for collisions between bullets and oxygenAsteroids
  //collisions.checkOxygenAsteroidToBulletCollision(scene);

  // Check for collisions between asteroids and oxygenAsteroids
  collisions.checkAsteroidToOxygenAsteroidCollision(scene);

  // Check for collisions between dogs and oxygenAsteroids
  collisions.checkEnemyToOxygenAsteriodCollision(scene);

  // Check for collisions between player and oxygenAsteroids
  collisions.checkPlayerToOxygenAsteroidCollision(scene);

  collisions.checkPlayerToLaserSegments(scene);
}
