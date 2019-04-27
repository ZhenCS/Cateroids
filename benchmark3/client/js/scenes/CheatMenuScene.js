import * as constants from '../../../shared/constants.js';
import { setBG, setGameName, centerX, setBackButton } from '../utils/utils.js';

export class CheatMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'cm' });
  }

  create() {
    let gameHeight = this.sys.game.config.height;

    setBG(this);
    setGameName(this);

    this.invulnerability = this.createButton(
      gameHeight / 2 + 0 * gameScale.scale,
      'Enable Invulnerability'
    );

    this.changeLevel = this.createButton(
      gameHeight / 2 + 150 * gameScale.scale,
      'Change Level'
    );

    this.back = this.createButton(
      gameHeight / 2 + 300 * gameScale.scale,
      'Back'
    );

    this.invulnerability.on('pointerdown', function() {
      const isInvulernable = cheats.invulnerable;
      if (isInvulernable) {
        this.setStyle({ fill: '#ffffff' });
      } else {
        this.setStyle({ fill: '#0f0' });
      }

      cheats.invulnerable = !cheats.invulnerable;
    });

    this.changeLevel.on('pointerdown', function() {
      this.scene.game.scene.sleep(constants.GAMEKEY);
      this.scene.game.scene.switch(constants.CHEATKEY, constants.LEVELSKEY);
      this.scene.game.scene.stop(constants.CHEATKEY);
    });

    this.back.on('pointerdown', function() {
      this.scene.game.scene.resume(constants.GAMEKEY);
      this.scene.game.scene.stop(constants.CHEATKEY);
    });

    this.initControls();
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
    button.depth = 1;

    button.on('pointerover', function() {
      this.alpha = 0.5;
    });

    button.on('pointerout', function() {
      this.alpha = 1;
    });

    return button;
  }

  initControls() {
    let gameWidth = this.sys.game.config.width;
    let gameHeight = this.sys.game.config.height;

    this.controlContainer = this.add.sprite(
      gameWidth / 2,
      gameHeight / 2,
      constants.CONTROLS1KEY
    );
    this.controlContainer.depth = 2;
    this.controlContainer.visible = false;
    this.controlContainer.setScale(gameScale.scale);
    setBackButton(this);
    this.backButton.visible = false;
    this.backButton.on('pointerdown', function() {
      this.scene.hideControls();
    });
  }

  showControls() {
    this.controlContainer.visible = true;
    this.backButton.visible = true;
    this.gameStart.removeInteractive().visible = false;
    this.levelSelect.removeInteractive().visible = false;
    this.controls.removeInteractive().visible = false;
    this.help.removeInteractive().visible = false;
    this.cheats.removeInteractive().visible = false;
  }

  hideControls() {
    this.controlContainer.visible = false;
    this.backButton.visible = false;
    this.gameStart.setInteractive().visible = true;
    this.levelSelect.setInteractive().visible = true;
    this.controls.setInteractive().visible = true;
    this.help.setInteractive().visible = true;
    this.cheats.removeInteractive().visible = true;
  }
}
