import * as constants from './utils/constants.js';
import { getPropertyValue, centerX } from './utils/utils.js';
import { Asteroid, Dog, Laser, DogWall } from './Entities.js';

export function loadMap(scene, level) {
  const map = scene.make.tilemap(level);
  //const tiles1 = map.addTilesetImage('CateroidsTileset2', 'tiles2');
  //map.createStaticLayer('testLayer', tiles1, 0, 0);

  scene.gameMap = map;
  scene.mapObjects = map.getObjectLayer('Objects').objects;

  setLevelProperties(scene, map);
  setCamera(scene, scene.gameConfig.gameMode);
  setBackground(scene, scene.gameConfig.gameMode);
  sortMapObjects(scene, scene.gameConfig.gameMode);

  if (scene.gameConfig.gameMode == 'RUN') {
    setPlayerSpawn(scene);
    setEndPoint(scene);
  } else if (scene.gameConfig.gameMode == 'DEFEND') {
    scene.waveNumber = 1;
    scene.waveObjects = new Array();
    if (scene.gameConfig.waves == 0) {
      //old map loading
      setWaveArrays(scene);
      setBase(scene, scene.waveObjects[0]);
    } else {
      //new map loading
      scene.waveSpawnNumber = 0;
      setWaves(scene);
      setBase(scene, scene.waveObjects[0]);
    }
  } else if (scene.gameConfig.gameMode == 'BOSS') {
    setPlayerSpawn(scene);
    setBossType(scene);
  }

  scene.gameConfig.spawnBuffer = scene.game.config.width;
  scene.mapLoaded = true;
}

function setLevelProperties(scene, map) {
  scene.gameConfig.worldWidth = map.width * map.tileWidth;
  scene.gameConfig.worldHeight = map.height * map.tileHeight;
  scene.gameConfig.worldOffsetX =
    (scene.game.config.width - scene.gameConfig.worldWidth) / 2;
  scene.gameConfig.worldOffsetY =
    (scene.game.config.height - scene.gameConfig.worldHeight) / 2;
  scene.gameConfig.spawnBuffer = scene.game.config.width;
  scene.gameConfig.gameMode = getPropertyValue(map, 'type');

  if (scene.gameConfig.gameMode == 'DEFEND') {
    scene.gameConfig.waveRate =
      getPropertyValue(map, 'waveRate') || gameConfig.waveRate;
    scene.gameConfig.waves = getPropertyValue(map, 'waves') || 0;
    scene.spawningWaves = false;
  }

  //scene.gameConfig.maxPlayerHealth = getPropertyValue(map, 'maxPlayerHealth');
  scene.gameConfig.maxPlayerOxygen = getPropertyValue(map, 'maxPlayerOxygen');
  scene.player.setData('health', scene.gameConfig.maxPlayerHealth);
  scene.player.setData('oxygen', scene.gameConfig.maxPlayerOxygen);

  /*scene.gameConfig.oxygenDepletionDelay = getPropertyValue(
    map,
    'oxygenDepletionDelay'
  );*/
  /*scene.gameConfig.oxygenDepletionRate = getPropertyValue(
    map,
    'oxygenDepletionRate'
  );*/
  /*scene.gameConfig.oxygenReplenishDelay =
    getPropertyValue(map, 'oxygenReplenishDelay') ||
    gameConfig.oxygenReplenishDelay;
  scene.gameConfig.oxygenReplenishRate =
    getPropertyValue(map, 'oxygenReplenishRate') ||
    gameConfig.oxygenDepletionRate;*/
}

function setCamera(scene, mode) {
  let sceneConfig = scene.gameConfig;
  scene.cameras.main.startFollow(scene.player);
  scene.physics.world.setBounds(
    0,
    0,
    scene.gameConfig.worldWidth,
    scene.gameConfig.worldHeight
  );

  //positive means window is larger than map size
  let offsetX = sceneConfig.worldOffsetX;
  let offsetY = sceneConfig.worldOffsetY;
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;

  scene.cameras.main.setBounds(
    0 - offsetX,
    0 - offsetY,
    sceneConfig.worldWidth + 2 * offsetX,
    sceneConfig.worldHeight + 2 * offsetY
  );
  // let camera = scene.cameras.main;
  // camera.setZoom(Phaser.Math.Clamp(camera.zoom, 0.2, 0.8));
}

function setBackground(scene, mode) {
  if (mode == 'RUN') {
    let bgWidth = scene.game.config.width;
    let bgHeight = scene.game.config.height;
    scene.spaceBackground = scene.add
                                .tileSprite(
                                  0,
                                  0,
                                  bgWidth,
                                  bgHeight,
                                  constants[`SPACE_BACKGROUND${Phaser.Math.Between(1, 3)}`]
                                )
                                .setDisplayOrigin(0, 0)
                                .setScrollFactor(0, 0)
                                .setDepth(-1);
  } else if (mode == 'DEFEND') {
    let bgWidth = scene.gameConfig.worldWidth;
    let bgHeight = scene.gameConfig.worldHeight;
    scene.spaceBackground = scene.add
      .tileSprite(
        0,
        0,
        bgWidth,
        bgHeight,
        constants[`SPACE_BACKGROUND${Phaser.Math.Between(1, 3)}`]
      )
      .setDisplayOrigin(0, 0)
      .setDepth(-1);
  } else if (mode == 'BOSS') {
    let bgWidth = scene.gameConfig.worldWidth;
    let bgHeight = scene.gameConfig.worldHeight;
    // temporary until boss battle background is ready
    scene.spaceBackground = scene.add
      .tileSprite(0, 0, bgWidth, bgHeight, constants.SPACE_BACKGROUND1)
      .setDisplayOrigin(0, 0)
      .setDepth(-1);
  }
}

function setWaves(scene) {
  let waves = scene.gameConfig.waves;
  let waveNumber = 1;
  scene.waveObjects.push(scene.mapObjects);

  while (waveNumber <= waves) {
    let wave = scene.gameMap.getObjectLayer(`${waveNumber}`).objects;
    sortWave(wave);
    scene.waveObjects.push(wave);
    waveNumber++;
  }
}

function setWaveArrays(scene) {
  var waveNumber = 0;
  let wave = new Array();

  for (var i = scene.mapObjects.length - 1; i >= 0; i--) {
    let obj = scene.mapObjects[i];
    if (obj == undefined) break;
    if (getPropertyValue(obj, 'spawnNumber') == waveNumber) {
      wave.push(obj);
    } else {
      scene.waveObjects.push(wave);
      waveNumber++;
      i++;
      wave = new Array();
    }
  }

  scene.waveObjects.push(wave);
}

function sortMapObjects(scene, mode) {
  if (mode == 'RUN') {
    scene.mapObjects.sort(function(a, b) {
      return b.x - a.x;
    });
  } else if (mode == 'DEFEND') {
    scene.mapObjects.sort(function(a, b) {
      return (
        getPropertyValue(b, 'spawnNumber') - getPropertyValue(a, 'spawnNumber')
      );
    });
  }
}

function sortWave(wave) {
  wave.sort(function(a, b) {
    return (
      getPropertyValue(b, 'spawnNumber') - getPropertyValue(a, 'spawnNumber')
    );
  });
}

function setPlayerSpawn(scene) {
  for (var i = scene.mapObjects.length - 1; i >= 0; i--) {
    let obj = scene.mapObjects[i];
    if (obj.type == 'spawnPoint') {
      scene.player.x = obj.x;
      scene.player.y = obj.y;

      let asteroid = new Asteroid(
        scene,
        obj.x,
        obj.y,
        constants.ASTEROID3KEY,
        0,
        0,
        1000,
        0
      );
      scene.oxygenAsteroids.add(asteroid);
      scene.player.setData('oxygenAsteroid', asteroid);
      break;
    }
  }
}

function setBossType(scene) {
  for (var i = scene.mapObjects.length - 1; i >= 0; i--) {
    let obj = scene.mapObjects[i];
    if (obj.type == 'boss') {
      let boss;
      let bossType = getPropertyValue(obj, 'bossType');
      let bossHealth = getPropertyValue(obj, 'health');
      let bossDamage = getPropertyValue(obj, 'damage');
      switch (bossType) {
        case 'dogWall': {
          boss = new DogWall(
            scene,
            obj.x,
            obj.y,
            constants.DOGWALLKEY,
            bossHealth,
            bossDamage,
            5,
            50
          );
          scene.gameConfig.maxBossHealth = boss.getData('health');
          break;
        }
        default: {
          console.log(`Error no boss found for boss type: ${obj.bossType}`);
        }
      }

      scene.boss = boss;
    } else {
      setObjects(scene, obj);
    }
  }
}

function setEndPoint(scene) {
  for (var i = 0; i < scene.mapObjects.length; i++) {
    let obj = scene.mapObjects[i];
    if (obj.type == 'endPoint') {
      scene.endPointX = obj.x;
      let end = scene.add.sprite(obj.x, obj.y, constants.ENDPOINT);
      end.setScale(0.4);
      end.setAlpha(0.5);
      break;
    }
  }
}

export function loadMapObjects(scene) {
  if (scene.gameConfig.gameMode == 'RUN') {
    loadMapObjectsRUN(scene);
  } else if (scene.gameConfig.gameMode == 'DEFEND') {
    if (!scene.spawningWaves) {
      if (scene.gameConfig.waves == 0) {
        loadMapObjectsDEFEND(scene);
      } else if (scene.gameConfig.waves > 0) {
        loadWaves(scene);
      }
    }
  }
}

function loadWaves(scene) {
  scene.spawningWaves = true;
  let rate = 1000;
  let waveRate = scene.gameConfig.waveRate / rate;

  scene.waveTimer = scene.time.addEvent({
    delay: rate,
    callback: function() {
      if (scene.waveNumber >= scene.gameConfig.waves) {
        scene.waveTimer.paused = true;
        scene.time.addEvent({
          delay: scene.gameConfig.waveRate * 4,
          callback: function() {
            scene.endPointX = 0;
          },
          callbackScope: scene,
          loop: false
        });
      }

      let wave = scene.waveObjects[scene.waveNumber];
      for (var i = wave.length; i >= 0; i--) {
        let obj = wave.pop();
        if (obj == undefined) break;

        if (getPropertyValue(obj, 'spawnNumber') == scene.waveSpawnNumber)
          setObjects(scene, obj);
        else wave.push(obj);
      }

      if (scene.waveSpawnNumber >= waveRate) {
        scene.waveNumber++;
        scene.waveSpawnNumber = 0;
      } else {
        scene.waveSpawnNumber++;
      }
    },
    callbackScope: scene,
    loop: true
  });
}

function loadMapObjectsDEFEND(scene) {
  scene.spawningWaves = true;
  scene.endOfWaveCounter = 0;

  scene.waveTimer = scene.time.addEvent({
    delay: scene.gameConfig.waveRate,
    callback: function() {
      if (scene.waveNumber >= scene.waveObjects.length) {
        scene.endOfWaveCounter++;
        if (
          (scene.asteroids.getLength() == 0 && scene.dogs.getLength() == 0) ||
          scene.endOfWaveCounter > 4
        ) {
          scene.waveTimer.paused = true;
          scene.time.addEvent({
            delay: 5000,
            callback: function() {
              scene.endPointX = 0;
            },
            callbackScope: scene,
            loop: false
          });
        }

        return;
      }

      let wave = scene.waveObjects[scene.waveNumber];
      for (var i = wave.length; i >= 0; i--) {
        let obj = wave.pop();
        if (obj == undefined) break;

        setObjects(scene, obj);
      }

      scene.waveNumber++;
    },
    callbackScope: scene,
    loop: true
  });
}

function loadMapObjectsRUN(scene) {
  for (var i = scene.mapObjects.length; i >= 0; i--) {
    let obj = scene.mapObjects.pop();
    if (obj == undefined) break;

    if (obj.x - scene.player.x > scene.gameConfig.spawnBuffer) {
      scene.mapObjects.push(obj);
      break;
    }

    let spawnNumber = getPropertyValue(obj, 'spawnNumber');
    if (spawnNumber) {
      while (getPropertyValue(obj, 'spawnNumber') == spawnNumber) {
        setObjects(scene, obj);
        obj = scene.mapObjects.pop();
      }
      scene.mapObjects.push(obj);
    } else {
      //if map is not updated with new tileset
      setObjects(scene, obj);
    }
  }
}

function setObjects(scene, obj) {
  if (obj.type == 'asteroid') setAsteroid(scene, obj);
  else if (obj.type == 'dog') setDog(scene, obj);
  else if (obj.type == 'laser') setLasers(scene, obj);
  else if (obj.type == 'text') setText(scene, obj);
}

function setBase(scene, wave) {
  let obj = null;
  for (var i = 0; i < wave.length; i++) {
    if (wave[i].name == 'base') {
      obj = wave[i];
      break;
    }
  }
  if (obj == null) return;

  let health = getPropertyValue(obj, 'health');
  let damage = getPropertyValue(obj, 'damage');

  let asteroid = new Asteroid(
    scene,
    obj.x,
    obj.y,
    constants.MOONKEY,
    0,
    0,
    health,
    damage
  );

  asteroid.setScale(0.5);
  scene.baseAsteroid = asteroid;
  scene.gameConfig.maxBaseHealth = health;
  scene.oxygenAsteroids.add(asteroid);
}

function setText(scene, obj) {
  let showX = getPropertyValue(obj, 'showOnDeltaX');
  let hideX = getPropertyValue(obj, 'hideOnDeltaX');
  let duration = getPropertyValue(obj, 'duration');
  let text = getPropertyValue(obj, 'text');
  let type = getPropertyValue(obj, 'type');

  let displayText = scene.add.text(0, obj.y, text, {
    font: `${50 * gameScale.scale}px Georgia`,
    fill: '#ffffff',
    stroke: 'black',
    strokeThickness: 5
  });

  if(type) displayText.setData('type', type);
  else displayText.setData('type', 'LOCATION');

  if(duration) displayText.setData('duration', duration);

  displayText.setData('displayX', obj.x);
  displayText.setData('showOnDeltaX', showX);
  displayText.setData('hideOnDeltaX', hideX);

  centerX(scene, displayText);
  displayText.setScrollFactor(0);
  displayText.depth = gameDepths.uiDepth;
  displayText.setVisible(false);

  scene.levelText.add(displayText);
}

function setAsteroid(scene, obj) {
  let velX = getPropertyValue(obj, 'velocityX');
  let velY = getPropertyValue(obj, 'velocityY');
  let health = getPropertyValue(obj, 'health');
  let damage = getPropertyValue(obj, 'damage');

  let level = getPropertyValue(obj, 'level');

  let asteroid = new Asteroid(
    scene,
    obj.x,
    obj.y,
    constants[`ASTEROID${level}KEY`],
    velX,
    velY,
    health,
    damage
  );

  if (level == 3) {
    scene.oxygenAsteroids.add(asteroid);
  } else scene.asteroids.add(asteroid);
}

function setDog(scene, obj) {
  let velX = getPropertyValue(obj, 'velocityX');
  let velY = getPropertyValue(obj, 'velocityY');
  let level = getPropertyValue(obj, 'level');
  let hp = getPropertyValue(obj, 'health');
  let damage = getPropertyValue(obj, 'damage');
  let fireRate = getPropertyValue(obj, 'fireRate');

  let dog = new Dog(
    scene,
    obj.x,
    obj.y,
    level,
    velX,
    velY,
    hp,
    damage,
    fireRate
  );
  scene.dogs.add(dog);
}

function setLasers(scene, obj) {
  let damage = getPropertyValue(obj, 'laserDamage');
  let delay = getPropertyValue(obj, 'laserDelay');
  let duration = getPropertyValue(obj, 'laserDuration');
  let sprites = getPropertyValue(obj, 'laserSprites');
  let deltaX = getPropertyValue(obj, 'playerDeltaX');
  let scale = getPropertyValue(obj, 'scale');
  let type = getPropertyValue(obj, 'type');
  let fireDelay = getPropertyValue(obj, 'laserFireDelay');

  if (type == 'VERTICAL') {
    let laser = new Laser(
      scene,
      obj.x,
      obj.y,
      false,
      scale,
      -Math.PI / 2,
      damage,
      delay,
      duration,
      sprites,
      deltaX,
      fireDelay
    );
    scene.lasers.add(laser);
  } else if (type == 'HORIZONTAL') {
    let laser = new Laser(
      scene,
      obj.x,
      obj.y,
      false,
      scale,
      -Math.PI,
      damage,
      delay,
      duration,
      sprites,
      deltaX,
      fireDelay
    );
    scene.lasers.add(laser);
  } else if ((type = 'ANGLE')) {
    let angleFactor = getPropertyValue(obj, 'angleFactor');
    let laser = new Laser(
      scene,
      obj.x,
      obj.y,
      false,
      scale,
      Math.PI / angleFactor,
      damage,
      delay,
      duration,
      sprites,
      deltaX,
      fireDelay
    );
    scene.lasers.add(laser);
  }
}
