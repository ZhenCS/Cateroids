import * as constants from '../../../shared/constants.js';
import { centerX, setBackButton } from '../utils/utils.js';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: constants.PAUSEKEY });
  }
  preload() {}

  create() {
    this.controlContainer = this.initControls();
    this.pauseContainer = this.initPauseMenu();
  }

  initPauseMenu() {
    let pauseContainer = this.add.container();
    let pauseHeader = this.add.text(0, 100 * gameScale.scale, 'Paused', {
      font: `${100 * gameScale.scale}px impact`,
      fill: '#ffffff',
      stroke: 'black',
      strokeThickness: 5
    });
    centerX(this, pauseHeader);
    
    let resumeButton = this.createButton(
      500 * gameScale.scale,
      'Resume Game'
    ).on('pointerdown', function() {
      this.scene.hidePauseMenu();
    });
    let controlButton = this.createButton(700 * gameScale.scale, 'Controls').on(
      'pointerdown',
      function() {
        this.scene.showControls();
      }
    );
    let cheatButton = this.createButton(900 * gameScale.scale, 'Cheats').on(
      'pointerdown',
      function() {
        this.scene.game.scene.switch(constants.PAUSEKEY, constants.CHEATKEY);
      }
    );
    let exitGameButton = this.createButton(
      1100 * gameScale.scale,
      'Exit Game'
    ).on('pointerdown', function() {
      this.scene.game.scene.switch(constants.PAUSEKEY, constants.STARTMENUKEY);
      this.scene.game.scene.stop(constants.GAMEKEY);
    });

    pauseContainer.depth = gameDepths.menuDepth;
    pauseContainer.add([
      pauseHeader,
      resumeButton,
      controlButton,
      cheatButton,
      exitGameButton
    ]);
    pauseContainer.gameButtons = [
      resumeButton,
      controlButton,
      cheatButton,
      exitGameButton
    ];
    return pauseContainer;
  }

  initControls() {
    let gameWidth = this.sys.game.config.width;
    let gameHeight = this.sys.game.config.height;

    setBackButton(this);
    this.backButton.visible = false;

    this.backButton.on('pointerdown', function() {
      this.scene.hideControls();
    });

    let controlContainer = this.add.sprite(
      gameWidth / 2,
      gameHeight / 2,
      constants.CONTROLS1KEY
    );
    controlContainer.depth = gameDepths.menuDepth + 1;
    controlContainer.visible = false;
    controlContainer.setScale(gameScale.scale);
    return controlContainer;
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

  hidePauseMenu() {
    this.scene.stop(constants.PAUSEKEY);
    this.scene.resume(constants.GAMEKEY);
  }

  showControls() {
    this.controlContainer.visible = true;
    this.backButton.visible = true;
    this.pauseContainer.gameButtons.forEach(button => {
      button.removeInteractive();
    });
  }

  hideControls() {
    this.controlContainer.visible = false;
    this.backButton.visible = false;
    this.pauseContainer.gameButtons.forEach(button => {
      button.setInteractive();
    });
  }
}
