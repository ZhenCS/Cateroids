import * as constants from '../utils/constants.js';
import { Leo } from '../Entities.js';
import * as culling from '../FrustumCulling.js';
import * as mapLoading from '../MapLoading.js';
import * as sceneUtils from '../SceneUtils.js';

export class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: constants.GAMEKEY });
  }
  init(data) {
    this.dataFromLevelSelect = data;
  }
  preload() {}

  create() {
    this.gameConfig = gameConfig;
    this.bullets = this.add.group();
    this.asteroids = this.add.group();
    this.oxygenAsteroids = this.add.group();
    this.dogs = this.add.group();
    this.lasers = this.add.group();
    this.laserSegments = this.add.group();
    this.levelText = this.add.group();

    this.endPointX = this.gameConfig.worldWidth;
    this.gameOver = false;
    this.baseAsteroid = null;
    this.player = new Leo(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5
    );

    this.mapLoaded = false;
    let loadMap = true;

    if (loadMap) {
      mapLoading.loadMap(this, currentLevel);
      sceneUtils.initScene(this, this.gameConfig.gameMode);

      if(this.baseAsteroid)
        this.player.setData('oxygenAsteroid', this.baseAsteroid);
    } else {
      sceneUtils.initScene(this);
      this.laserTimer.paused = false;
      this.spawnTimer.paused = false;
    }
    this.debugg = this.add.graphics().lineStyle(2, 0xffffff, 1);

  }

  update() {
    if (this.player.active) {
      this.player.update();
      this.movementCheck();
      this.frustumCulling();
      sceneUtils.updateUI(this, this.gameConfig.gameMode);
      this.fireLasers();
      this.showText();
      this.levelCheck();

      //this.debugg.clear();
      //this.baseAsteroid.body.drawDebug(this.debugg);
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

    sceneUtils.updateUI(this, this.gameConfig.gameMode);
  }

  addScore(amount) {
    this.score += amount;
    this.textScore.setText(this.score);
  }

  fireLasers() {
    let self = this;
    this.lasers.getChildren().forEach(function(laser) {
      if (
        laser.x - self.player.x <= laser.getData('deltaX') &&
        !laser.getData('fired')
      ) {
        laser.fire();
      }
    });
  }

  showText() {
    let self = this;
    this.levelText.getChildren().forEach(function(text) {
      if (
        text.getData('displayX') - self.player.x <=
        text.getData('showOnDeltaX')
      ) {
        text.setVisible(true);
      }

      if (
        text.getData('displayX') - self.player.x <=
        text.getData('hideOnDeltaX')
      ) {
        text.destroy();
      }
    });
  }
  showGameOverMenu(){
    this.player.play(constants.DYINGKEY);

    this.time.addEvent({
      delay: 2000,
      callback: function() {
        this.scene.pause(constants.GAMEKEY);
        this.scene.start(constants.GAMEOVERKEY);
        this.sound.stopAll();
      },
      callbackScope: this,
      loop: false
    });
    
  }

  levelCheck() {
    if(this.gameOver)
      this.showGameOverMenu();

    if (this.player.x >= this.endPointX) {
      this.sound.stopAll();
      if (currentLevel.level > 6) {
        //end of game
      } else {
        //this.scene.restart();
        this.game.scene.start(constants.GOALKEY, {scene: this});
        this.game.scene.pause(constants.GAMEKEY);
      }
    }

    if(this.gameConfig.gameMode == 'DEFEND'){
      if(typeof this.baseAsteroid.getData('health') == 'undefined'){
        this.gameOver = true;
      }
    }
  }

  movementCheck() {
    if (this.gameOver) return;
    let moved = false;
    let boost = 0;
    // Check for boost
    if (this.keySpace.isDown) {
      // this.sound.play(constants.BOOSTAUDIO);
      boost = this.gameConfig.boost;
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
      this.sound.play(constants.GRAPPLING, { volume: 0.1 });
      if (this.mapLoaded) mapLoading.loadMapObjects(this);
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
          this.player.followAsteroid(-1 * this.gameConfig.playerWalkVelocityX);
        } else {
          this.player.moveLeft(boost);
        }
        moved = true;
      } else if (this.keyD.isDown) {
        if (this.player.getData('oxygenAsteroid') != null) {
          this.player.followAsteroid(this.gameConfig.playerWalkVelocityX);
        } else {
          this.player.moveRight(boost);
        }
        moved = true;
      }
    }

    if (moved) {
      this.player.reelGrapple();

      if (this.mapLoaded) mapLoading.loadMapObjects(this);

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
    } else {
      if (this.player.getData('oxygenAsteroid') != null) {
        this.player.followAsteroid(0);
        if (this.mapLoaded) mapLoading.loadMapObjects(this);
      }
    }
  }

  frustumCulling() {
    // Frustum culling for bullets to prevent offscreen rendering
    culling.bulletCulling(this);

    // Frustum culling for asteroids to prevent offscreen rendering
    culling.asteroidCulling(this);

    // Frustum culling for oxygenAsteroids to prevent offscreen rendering
    culling.oxygenAsteroidCulling(this);

    // Frustum culling for dogs to prevent offscreen rendering
    culling.dogCulling(this);
  }
}
