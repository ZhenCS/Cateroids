import * as constants from '../utils/constants.js';
import { centerX, setBackButton } from '../utils/utils.js';
import { goals } from '../utils/goals.js';

export class GoalScene extends Phaser.Scene {
  constructor() {
    super({ key: constants.GOALKEY });
  }
  preload() {}

  init(data) {
    this.mode = data.scene.gameConfig.gameMode;
    this.player = data.scene.player;
    this.score = data.scene.score;
    this.base = data.scene.baseAsteroid;
  }

  create() {
    this.levelStars = [false, false, false];

    this.goalContainer = this.initGoalMenu();
  }

  initGoalMenu() {
    let level = currentLevel.level;
    let goalContainer = this.add.container();

    let goalBG = this.add.sprite(
      this.game.config.width / 2,
      this.game.config.height / 2,
      constants.GOALBGKEY
    );
    goalBG.depth = gameDepths.menuDepth + 1;

    let offsetY = this.game.config.height / 2 - goalBG.displayHeight / 2 + 20;
    let goalHeader = this.add.text(0, offsetY, `Level ${level} Complete!`, {
      font: `${100 * gameScale.scale}px impact`,
      fill: '#ffffff',
      stroke: 'black',
      strokeThickness: 5
    });
    centerX(this, goalHeader);

    let starY = offsetY + 150;
    let goalY = starY + 110;
    let buttonY = goalY + 190;

    let restartButton = this.createButton(0, buttonY, 'Restart').on(
      'pointerdown',
      function() {
        this.scene.game.scene.switch(constants.GOALKEY, constants.GAMEKEY);
        this.scene.game.scene.stop(constants.GOALKEY);
      }
    );

    let nextButton = this.createButton(0, buttonY, 'Next Level').on(
      'pointerdown',
      function() {
        currentLevel.level++;
        currentLevel.key = constants[`LEVEL${currentLevel.level}KEY`];

        this.scene.game.scene.switch(constants.GOALKEY, constants.GAMEKEY);
        this.scene.game.scene.stop(constants.GOALKEY);
      }
    );

    let upgradeButton = this.createButton(0, buttonY, 'Upgrade').on(
      'pointerdown',
      function() {
        this.scene.game.scene.switch(constants.GOALKEY, constants.UPGRADEKEY);
      }
    );

    let homeButton = this.createButton(0, buttonY, 'Menu').on(
      'pointerdown',
      function() {
        this.scene.game.scene.switch(constants.GOALKEY, constants.STARTMENUKEY);
        this.scene.game.scene.stop(constants.GAMEKEY);
      }
    );

    let buttonPadding = 50;
    let buttonWidth =
      restartButton.displayWidth +
      nextButton.displayWidth +
      homeButton.displayWidth +
      upgradeButton.displayWidth +
      3 * buttonPadding;
    let buttonOffsetX = this.game.config.width / 2 - buttonWidth / 2;
    restartButton.x = buttonOffsetX;
    homeButton.x = restartButton.x + restartButton.displayWidth + buttonPadding;
    nextButton.x =
      restartButton.x +
      restartButton.displayWidth +
      homeButton.displayWidth +
      2 * buttonPadding;
    upgradeButton.x =
      restartButton.x +
      restartButton.displayWidth +
      homeButton.displayWidth +
      nextButton.displayWidth +
      3 * buttonPadding;

    goalContainer.depth = gameDepths.menuDepth;
    goalContainer.add([
      goalBG,
      goalHeader,
      restartButton,
      nextButton,
      homeButton,
      upgradeButton
    ]);
    goalContainer.gameButtons = [restartButton, nextButton, homeButton];

    this.stars = new Array();
    for (var i = 0; i < 3; i++) {
      let star = this.add.sprite(0, starY - (i % 2) * 20, constants.STARKEY);
      star.setScale(3 * gameScale.scale);
      goalContainer.add(star);
      this.stars.push(star);
    }
    let padding = 180;
    let width = this.stars[0].displayWidth + padding * 2;
    let offsetX = this.game.config.width / 2 - width / 2;
    for (var i = 0; i < 3; i++) {
      this.stars[i].x = offsetX + padding * i + this.stars[i].displayWidth / 2;
    }
    this.tintStars();
    goalContainer.add(this.setGoals(goalY));
    return goalContainer;
  }

  setGoals(y) {
    let offsetY = 45;

    let goal1 = this.setText(this, y, 'Level Completed', this.levelStars[0]);
    let goal2 = this.setText(
      this,
      y + offsetY,
      `Complete Level with ${goals[currentLevel.level][0]}% Health`,
      this.levelStars[1]
    );
    let text;
    if (this.mode == 'RUN') {
      text = `Complete Level with more than ${
        goals[currentLevel.level][1]
      } points`;
    } else if (this.mode == 'DEFEND') {
      text = `Complete Level with ${goals[currentLevel.level][1]}% Moon Health`;
    }
    let goal3 = this.setText(this, y + 2 * offsetY, text, this.levelStars[2]);

    centerX(this, goal1);
    centerX(this, goal2);
    centerX(this, goal3);

    return [goal1, goal2, goal3];
  }

  tintStars() {
    this.stars[0].tint = gameStyles.starTint;
    if (stars[currentLevel.level][0] == false) {
      stars[currentLevel.level][0] = true;
      playerStars++;
    }
    this.levelStars[0] = true;

    if (
      this.player.getData('health') >
      (gameConfig.maxPlayerHealth * goals[currentLevel.level][0]) / 100
    ) {
      this.stars[1].tint = gameStyles.starTint;
      if (stars[currentLevel.level][1] == false) {
        stars[currentLevel.level][1] = true;
        playerStars++;
      }
      this.levelStars[1] = true;
    }

    if (this.mode == 'RUN' && this.score >= goals[currentLevel.level][1]) {
      this.stars[2].tint = gameStyles.starTint;
      if (stars[currentLevel.level][2] == false) {
        stars[currentLevel.level][2] = true;
        playerStars++;
      }
      this.levelStars[2] = true;
    } else if (
      this.mode == 'DEFEND' &&
      this.base.getData('health') >
        (gameConfig.maxBaseHealth * goals[currentLevel.level][1]) / 100
    ) {
      this.stars[2].tint = 0xfbff42;
      if (stars[currentLevel.level][2] == false) {
        stars[currentLevel.level][2] = true;
        playerStars++;
      }
      this.levelStars[2] = true;
    }
  }

  setText(scene, y, text, completed) {
    let displayText = scene.add.text(0, y, text, {
      font: `${50 * gameScale.scale}px Georgia`,
      fill: completed ? '#45f442' : '#000000',
      stroke: completed ? '#45f442' : '#000000',
      strokeThickness: 1
    });

    return displayText;
  }

  createButton(xPosition, yPosition, text) {
    let button = this.add
      .text(xPosition, yPosition, text, {
        font: `${80 * gameScale.scale}px impact`,
        fill: '#ffffff',
        stroke: 'black',
        strokeThickness: 2
      })
      .setInteractive({ cursor: 'pointer' });

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
