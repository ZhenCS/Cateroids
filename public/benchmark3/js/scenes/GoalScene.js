import * as constants from '../utils/constants.js';
import { centerX, setBackButton } from '../utils/utils.js';
import { goals } from '../utils/goals.js';

export class GoalScene extends Phaser.Scene {
  constructor() {
    super({ key: constants.GOALKEY });
  }
  preload() {}

  init(data){
    this.mode = data.scene.gameConfig.gameMode;
    this.player = data.scene.player;
    this.score = data.scene.score;
    this.base = data.scene.baseAsteroid;
    //console.log(data);
  }

  create() {
    //this.controlContainer = this.initControls();
    this.goalContainer = this.initGoalMenu();
  }

  initGoalMenu() {
    let level = currentLevel.level;
    let goalContainer = this.add.container();

    let goalBG = this.add
    .graphics()
    .fillStyle(0xffebaf)
    .setDepth(gameDepths.uiDepth);

    let width = 1000;
    let offsetX = this.game.config.width/2 - width/2;
    let offsetY = 100;
    let height = this.game.config.height - 2 * offsetY;
    goalBG.fillRect(
        offsetX,
        offsetY,
        width,
        height
      );

    let goalHeader = this.add.text(0, 100 * gameScale.scale, `Level ${level} Complete`, {
      font: `${100 * gameScale.scale}px impact`,
      fill: '#ffffff',
      stroke: 'black',
      strokeThickness: 5
    });
    centerX(this, goalHeader);
    
    let restartButton = this.createButton(
      1000 * gameScale.scale,
      'Restart'
    ).on('pointerdown', function() {
        this.scene.game.scene.switch(constants.GOALKEY, constants.GAMEKEY);
        this.scene.game.scene.stop(constants.GOALKEY);
    });
    
    let nextButton = this.createButton(1120 * gameScale.scale, 'Next Level').on(
      'pointerdown',
      function() {
        currentLevel.level++;
        currentLevel.key = constants[`LEVEL${currentLevel.level}KEY`];

        this.scene.game.scene.switch(constants.GOALKEY, constants.GAMEKEY);
        this.scene.game.scene.stop(constants.GOALKEY);
      }
    );

    let homeButton = this.createButton(
      1240 * gameScale.scale,
      'Exit Game'
    ).on('pointerdown', function() {
      this.scene.game.scene.switch(constants.GOALKEY, constants.STARTMENUKEY);
      this.scene.game.scene.stop(constants.GAMEKEY);
    });

    goalContainer.depth = gameDepths.menuDepth;
    goalContainer.add([
        goalBG,
        goalHeader,
        restartButton,
        nextButton,
        homeButton
    ]);
    goalContainer.gameButtons = [
        restartButton,
        nextButton,
        homeButton
    ];

    this.stars = new Array();
    for (var i = 0; i < 3; i++) {
      let star = this.add.sprite(0, 200 - (i%2) * 20, constants.STARKEY);
      star.setScale(3 * gameScale.scale);
      goalContainer.add(star);
      this.stars.push(star);
    }
    let padding = 180;
    width = this.stars[0].displayWidth + padding * 2;
    offsetX = this.game.config.width/2 - width/2;
    for (var i = 0; i < 3; i++) {
        this.stars[i].x = offsetX + padding * i + this.stars[i].displayWidth/2;
    }
    this.tintStars();
    return goalContainer;
  }

  tintStars(){
    this.stars[0].tint = gameStyles.starTint;
    if(stars[currentLevel.level][0] == false){
      stars[currentLevel.level][0] = true;
      playerStars++;
    }

    if(this.player.getData('health') > gameConfig.maxPlayerHealth * goals[currentLevel.level][0]/100){
      this.stars[1].tint = gameStyles.starTint;
      if(stars[currentLevel.level][1] == false){
        stars[currentLevel.level][1] = true;
        playerStars++;
      }
    }

    if(this.mode == 'RUN' && this.score >= goals[currentLevel.level][1]){
      this.stars[2].tint = gameStyles.starTint;
      if(stars[currentLevel.level][2] == false){
        stars[currentLevel.level][2] = true;
        playerStars++;
      }
    }else if(this.mode == 'DEFEND' && this.base.getData('health') > gameConfig.maxBaseHealth * goals[currentLevel.level][1]/100){
      this.stars[2].tint = 0xfbff42;
      if(stars[currentLevel.level][2] == false){
        stars[currentLevel.level][2] = true;
        playerStars++;
      }
    }
  }

  setText(scene, text){
    let displayText = scene.add
    .text(0, obj.y, text, {
      font: `${50 * gameScale.scale}px Georgia`,
      fill: '#ffffff',
      stroke: 'black',
      strokeThickness: 5
    });

    return displayText;
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
}
