import * as constants from '../../shared/constants.js';
import { getPropertyValue, centerX} from './utils/utils.js';
import { Asteroid, Dog, Laser} from './Entities.js';

export function loadMap(scene, level) {
    const map = scene.make.tilemap(level);
    scene.gameMap = map;
    scene.mapObjects = map.getObjectLayer('Objects').objects;

    scene.gameConfig.worldWidth = map.width * map.tileWidth;
    scene.gameConfig.worldHeight = (map.height + 1) * map.tileHeight;
    scene.gameConfig.worldOffset = (scene.game.config.height - scene.gameConfig.worldHeight)/2;
    scene.gameConfig.spawnBuffer = scene.game.config.width;

    sortMapObjects(scene);
    setPlayerSpawn(scene);
    loadMapObjects(scene);

    scene.gameConfig.spawnBuffer = scene.game.config.width/2 + 50;
    scene.physics.world.setBounds(
      0,
      0,
      scene.gameConfig.worldWidth,
      scene.gameConfig.worldHeight
    );
    scene.cameras.main.setBounds(
      0,
      -1 * scene.gameConfig.worldOffset,
      scene.gameConfig.worldWidth,
      scene.gameConfig.worldHeight * scene.gameConfig.worldOffset
    );

    scene.mapLoaded = true;
  }

function sortMapObjects(scene) {
    scene.mapObjects.sort(function(a, b) {
      return b.x - a.x;
    });
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

export function loadMapObjects(scene) {
    let self = scene;
    for (var i = scene.mapObjects.length - 1; i >= 0; i--) {
      let obj = scene.mapObjects.pop();
      if(obj == undefined) break;
      
      if (obj.x - scene.player.x > scene.gameConfig.spawnBuffer) {
        scene.mapObjects.push(obj);
        break;
      }

      let spawnNumber = getPropertyValue(obj, 'spawnNumber');
      if(spawnNumber){
        while(getPropertyValue(obj, 'spawnNumber') == spawnNumber){
            if (obj.type == 'asteroid')
                setAsteroid(scene, obj);
            if (obj.type == 'dog')
                setDog(scene, obj);
            if (obj.type == 'laser')
                setLasers(scene, obj);
            if(obj.type == 'text')
                setText(scene, obj);
            if(obj.type == 'endPoint')
                scene.endPointX = obj.x;

          obj = scene.mapObjects.pop();
        }
        scene.mapObjects.push(obj);
      }else{ //if map is not updated with new tileset
        if (obj.type == 'asteroid')
          setAsteroid(scene, obj);
        if (obj.type == 'dog')
          setDog(scene, obj);
        if (obj.type == 'laser')
          setLasers(scene, obj);
        if(obj.type == 'endPoint')
            scene.endPointX = obj.x;
      }
    }
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
    //displayText.setVisible(false);

    scene.levelText.add(displayText);
}

function setAsteroid(scene, obj) {
    let velX = getPropertyValue(obj, 'velocityX');
    let velY = getPropertyValue(obj, 'velocityY');
    let level = getPropertyValue(obj, 'level');

    let asteroid = new Asteroid(
      scene,
      obj.x,
      obj.y,
      constants[`ASTEROID${level}KEY`],
      velX,
      velY
    );

    if (level == 3) scene.oxygenAsteroids.add(asteroid);
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
        deltaX
      );
      scene.lasers.add(laser);
    }
  }