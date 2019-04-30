import * as constants from './utils/constants.js';
import { getPropertyValue, centerX} from './utils/utils.js';
import { Asteroid, Dog, Laser} from './Entities.js';

export function loadMap(scene, level) {
    const map = scene.make.tilemap(level);
    // const tiles1 = map.addTilesetImage('CateroidsTileset2', 'tiles2');
    // map.createStaticLayer('testLayer', tiles1, 0, 0);

    scene.gameMap = map;
    scene.mapObjects = map.getObjectLayer('Objects').objects;
    
    setLevelProperties(scene, map);
    setCamera(scene, scene.gameConfig.gameMode);
    setBackground(scene, scene.gameConfig.gameMode);
    sortMapObjects(scene, scene.gameConfig.gameMode);

    if(scene.gameConfig.gameMode == 'RUN'){
      setPlayerSpawn(scene);
      setEndPoint(scene);
      loadMapObjectsRUN(scene);
    }else if(scene.gameConfig.gameMode == 'DEFEND'){
      scene.waveNumber = 1;
      scene.waveObjects = new Array();
      setWaveArrays(scene);
      setBase(scene, scene.waveObjects[0]);
    }

    scene.gameConfig.spawnBuffer = scene.game.config.width/2 + 50;
    scene.mapLoaded = true;
}

function setLevelProperties(scene, map){
  scene.gameConfig.worldWidth = map.width * map.tileWidth;
    scene.gameConfig.worldHeight = (map.height) * map.tileHeight;
    scene.gameConfig.worldOffsetX = (scene.game.config.width - scene.gameConfig.worldWidth)/2;
    scene.gameConfig.worldOffsetY = (scene.game.config.height - scene.gameConfig.worldHeight)/2;
    scene.gameConfig.spawnBuffer = scene.game.config.width;
    scene.gameConfig.gameMode = getPropertyValue(map, 'type');

    if(scene.gameConfig.gameMode == 'DEFEND'){
      scene.gameConfig.waveRate = getPropertyValue(map, 'waveRate') || gameConfig.waveRate;
      scene.spawningWaves = false;
    }

    scene.gameConfig.maxPlayerHealth = getPropertyValue(map, 'maxPlayerHealth');
    scene.gameConfig.maxPlayerOxygen = getPropertyValue(map, 'maxPlayerOxygen');
    scene.player.setData('health', scene.gameConfig.maxPlayerHealth);
    scene.player.setData('oxygen', scene.gameConfig.maxPlayerOxygen);

    scene.gameConfig.oxygenDepletionDelay = getPropertyValue(map, 'oxygenDepletionDelay');
    scene.gameConfig.oxygenDepletionRate = getPropertyValue(map, 'oxygenDepletionRate');
    scene.gameConfig.oxygenReplenishDelay = getPropertyValue(map, 'oxygenReplenishDelay') || gameConfig.oxygenReplenishDelay;
    scene.gameConfig.oxygenReplenishRate = getPropertyValue(map, 'oxygenReplenishRate') || gameConfig.oxygenDepletionRate;
    
}

function setCamera(scene, mode){
  if(mode == 'RUN'){
    scene.cameras.main.startFollow(scene.player);
    scene.physics.world.setBounds(0, 0, scene.gameConfig.worldWidth, scene.gameConfig.worldHeight);
    scene.cameras.main.setBounds(
      0,
      0  - scene.gameConfig.worldOffsetY, 
      scene.gameConfig.worldWidth,
      scene.gameConfig.worldHeight + 2 * scene.gameConfig.worldOffsetY
    );

  }else if(mode == 'DEFEND'){
    scene.physics.world.setBounds(0, 0, scene.gameConfig.worldWidth, scene.gameConfig.worldHeight);
    scene.cameras.main.setBounds(
      0 - scene.gameConfig.worldOffsetX,
      0 - scene.gameConfig.worldOffsetY, 
      scene.gameConfig.worldWidth  + scene.gameConfig.worldOffsetX,
      scene.gameConfig.worldHeight + scene.gameConfig.worldOffsetY
    );
  }
}

function setBackground(scene, mode){

  if(mode == 'RUN'){
    let bgWidth = (scene.gameMap.width * 16) * 1.2;
    let bgHeight = scene.gameConfig.worldHeight;
    scene.add
      .tileSprite(
        0,
        0,
        bgWidth,
        bgHeight,
        constants.SPACE_BACKGROUND
      )
      .setDisplayOrigin(0, 0)
      .setScrollFactor(1 / 5, 1)
      .setDepth(-1)
      .setScale(1, 1);
  }else if(mode == 'DEFEND'){
    let bgWidth = scene.gameConfig.worldWidth + 3 *  scene.gameConfig.worldOffsetX;
    let bgHeight = scene.gameConfig.worldHeight;
    scene.add
      .tileSprite(
        0 - scene.gameConfig.worldOffsetX,
        0,
        bgWidth,
        bgHeight,
        constants.SPACE_BACKGROUND
      )
      .setDisplayOrigin(0, 0)
      .setScrollFactor(1 / 5, 1)
      .setDepth(-1)
      .setScale(1, 1);
  }
}

function setWaveArrays(scene){
  var waveNumber = 0;
  let wave = new Array();

  for (var i = scene.mapObjects.length - 1; i >= 0; i--) {
    let obj = scene.mapObjects[i];
    if(obj == undefined) break;
    if(getPropertyValue(obj, 'spawnNumber') == waveNumber){
      wave.push(obj);
    }else{
      scene.waveObjects.push(wave);
      waveNumber++;
      i++;
      wave = new Array();
    }
  }

  scene.waveObjects.push(wave);
}

function sortMapObjects(scene, mode) {

  if(mode == 'RUN'){
    scene.mapObjects.sort(function(a, b) {
      return b.x - a.x;
    });
  }else if(mode == 'DEFEND'){
    scene.mapObjects.sort(function(a, b) {
      return getPropertyValue(b, 'spawnNumber') - getPropertyValue(a, 'spawnNumber');
    });
  }
}

function setPlayerSpawn(scene) {
    for (var i = scene.mapObjects.length - 1; i >= 0; i--) {
      let obj = scene.mapObjects[i];
      if (obj.type == 'spawnPoint') {
        scene.player.x = obj.x;
        scene.player.y = obj.y;
        break;
      }
    }
  }

function setEndPoint(scene){
  for (var i = scene.mapObjects.length - 1; i >= 0; i--) {
    let obj = scene.mapObjects[i];
    if(obj.type == 'endPoint'){
      scene.endPointX = obj.x;
      break;
    }
  }
}

export function loadMapObjects(scene){
  if(scene.gameConfig.gameMode == 'RUN'){
    loadMapObjectsRUN(scene);
  }else if(scene.gameConfig.gameMode == 'DEFEND'){
    if(!scene.spawningWaves)
      loadMapObjectsDEFEND(scene);
  }
}

function loadMapObjectsDEFEND(scene){
  scene.spawningWaves = true;
  scene.endOfWaveCounter = 0;
  scene.waveTimer = scene.time.addEvent({
    delay: scene.gameConfig.waveRate,
    callback: function() {
      if(scene.waveNumber >= scene.waveObjects.length){
        scene.endOfWaveCounter++;
        if(scene.asteroids.getLength() == 0 && scene.dogs.getLength() == 0 || scene.endOfWaveCounter > 6){
          scene.waveTimer.paused = true;
          scene.time.addEvent({
            delay: 5000,
            callback: function(){
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
        if(obj == undefined) break;

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
      if(obj == undefined) break;
      
      if (obj.x - scene.player.x > scene.gameConfig.spawnBuffer) {
        scene.mapObjects.push(obj);
        break;
      }

      let spawnNumber = getPropertyValue(obj, 'spawnNumber');
      if(spawnNumber){
        while(getPropertyValue(obj, 'spawnNumber') == spawnNumber){
          setObjects(scene, obj);
          obj = scene.mapObjects.pop();
        }
        scene.mapObjects.push(obj);
      }else{ //if map is not updated with new tileset
        setObjects(scene, obj);
      }
    }
}

function setObjects(scene, obj){
  if (obj.type == 'asteroid')
    setAsteroid(scene, obj);
  else if (obj.type == 'dog')
    setDog(scene, obj);
  else if (obj.type == 'laser')
    setLasers(scene, obj);
  else if(obj.type == 'text')
    setText(scene, obj);
}

function setBase(scene, wave){
  let obj = null;
  for(var i = 0; i < wave.length; i++){
    if(wave[i].name == 'base'){
      obj = wave[i];
      break;
    }
  }
  if(obj == null) return;

  let health = getPropertyValue(obj, 'health');
  let damage = getPropertyValue(obj, 'damage');
  let level = getPropertyValue(obj, 'level');

  let asteroid = new Asteroid(scene, obj.x, obj.y, constants[`ASTEROID${level}KEY`], 0, 0, health, damage);
  
  asteroid.setScale(15);
  scene.baseAsteroid = asteroid;
  scene.gameConfig.maxBaseHealth = health;
  scene.oxygenAsteroids.add(asteroid);
}

function setText(scene, obj){
    let showX = getPropertyValue(obj, 'showOnDeltaX');
    let hideX = getPropertyValue(obj, 'hideOnDeltaX');
    let text = getPropertyValue(obj, 'text');

    let displayText = scene.add
      .text(0, obj.y, text, {
        font: `${50 * gameScale.scale}px impact`,
        fill: '#ffffff',
        stroke: 'black',
        strokeThickness: 5
      });

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

    if (level == 3){ 
      scene.oxygenAsteroids.add(asteroid);
    }
    else scene.asteroids.add(asteroid);
  }

function setDog(scene, obj) {
    let velX = getPropertyValue(obj, 'velocityX');
    let velY = getPropertyValue(obj, 'velocityY');
    let level = getPropertyValue(obj, 'level');
    let hp = getPropertyValue(obj, 'health');
    let damage = getPropertyValue(obj, 'damage');
    let fireRate = getPropertyValue(obj, 'fireRate');

    let dog = new Dog(scene, obj.x, obj.y, level, velX, velY, hp, damage, fireRate);
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
        fireDelay,
      );
      scene.lasers.add(laser);
    }else if(type == 'HORIZONTAL'){
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
    }else if(type = "ANGLE"){
      let angleFactor = getPropertyValue(obj, 'angleFactor');
      let laser = new Laser(
        scene,
        obj.x,
        obj.y,
        false,
        scale,
        Math.PI/angleFactor,
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