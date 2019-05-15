import * as constants from '../utils/constants.js';
import { centerX, setBackButton } from '../utils/utils.js';

export class UpgradeScene extends Phaser.Scene {
  constructor() {
    super({ key: constants.UPGRADEKEY });
  }
  preload() {}

  init(data) {}

  create() {
    this.upgradeCounts = new Array();
    this.upgradeContainer = this.initUpgradeMenu();
  }

  initUpgradeMenu() {
    let upgradeContainer = this.add.container();

    let upgradeBG = this.add.sprite(
      this.game.config.width / 2,
      this.game.config.height / 2,
      constants.UPGRADEBGKEY
    );
    upgradeBG.depth = gameDepths.menuDepth + 1;

    let offsetY =
      this.game.config.height / 2 - upgradeBG.displayHeight / 2 + 20;
    let upgradeHeader = this.add.text(0, offsetY, `Upgrades`, {
      font: `${100 * gameScale.scale}px impact`,
      fill: '#ffffff',
      stroke: 'black',
      strokeThickness: 5
    });
    centerX(this, upgradeHeader);

    upgradeContainer.depth = gameDepths.menuDepth;
    upgradeContainer.add([upgradeBG, upgradeHeader]);

    let x = upgradeBG.x - upgradeBG.displayWidth / 2 + 50;
    let y = offsetY + 60;
    for (var i = 0; i < playerUpgrades.length; i++) {
      this.setUpgradeBar(this, upgradeContainer, x, y, i);
      y += 120;

      if (i == playerUpgrades.length / 2 - 1) {
        x = upgradeBG.x - upgradeBG.displayWidth / 2 + 430;
        y = offsetY + 60;
      }
    }
    x += 430;
    let doneButton = this.createButton(x, y - 60, 'Done').on(
      'pointerdown',
      function() {
        if (fromPauseMenu) {
          fromPauseMenu = false;
          this.scene.game.scene.switch(
            constants.UPGRADEKEY,
            constants.PAUSEKEY
          );
          this.scene.game.scene.stop(constants.UPGRADEKEY);
        } else {
          this.scene.game.scene.switch(constants.UPGRADEKEY, constants.GOALKEY);
          this.scene.game.scene.stop(constants.UPGRADEKEY);
        }
      }
    );

    let star = this.add.sprite(x - 40, offsetY + 90, constants.STARKEY);
    star.tint = gameStyles.starTint;
    star.setScale(0.8);

    this.tweens.add({
      targets: star,
      duration: 10240,
      angle: 360,
      loop: -1,
      pause: false,
      callbackScope: this
    });

    let playerStarCount = this.add.text(
      x + 10,
      offsetY + 60,
      `${playerStars}`,
      {
        font: `${100 * gameScale.scale}px impact`,
        fill: '#ffffff',
        stroke: 'black',
        strokeThickness: 5
      }
    );
    this.playerStarCount = playerStarCount;

    const weaponSelectText = this.add.text(
      x - 80,
      offsetY + 160,
      'Select Secondary Fire',
      {
        font: `${(upgradeBG.displayWidth / 25) * gameScale.scale}px impact`,
        fill: '#fdfdfd',
        stroke: 'black',
        strokeThickness: 2
      }
    );

    const defaultStyling = {
      font: `${(upgradeBG.displayWidth / 25) * gameScale.scale}px impact`,
      fill: '#fdfdfd',
      stroke: 'black',
      strokeThickness: 2
    };

    const activeStyling = {
      font: `${(upgradeBG.displayWidth / 23) * gameScale.scale}px impact`,
      color: '#f9e722',
      stroke: 'black',
      strokeThickness: 5
    };

    const plasma = this.add
      .text(
        x - 80,
        offsetY + 220,
        'Plasma Cannon',
        gameConfig.secondaryWeapon == 'plasma' ? activeStyling : defaultStyling
      )
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', function() {
        if (this.active) {
          this.setStyle(defaultStyling);
          gameConfig.secondaryWeapon = '';
        } else {
          this.setStyle(activeStyling);
          gameConfig.secondaryWeapon = 'plasma';
          gameConfig.secondaryWeaponText = 'Plasma Shots: ';
          beam.setStyle(defaultStyling);
          beam.active = false;
        }
        this.active = !this.active;
      });

    const beam = this.add
      .text(
        x - 80,
        offsetY + 270,
        'Ray Gun',
        gameConfig.secondaryWeapon == 'beam' ? activeStyling : defaultStyling
      )
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', function() {
        if (this.active) {
          this.setStyle(defaultStyling);
          gameConfig.secondaryWeapon = '';
        } else {
          this.setStyle(activeStyling);
          gameConfig.secondaryWeapon = 'beam';
          gameConfig.secondaryWeaponText = 'Beam Heat: ';
          plasma.setStyle(defaultStyling);
          plasma.active = false;
        }
        this.active = !this.active;
      });

    plasma.active = false;
    beam.active = false;

    upgradeContainer.add([
      doneButton,
      star,
      playerStarCount,
      weaponSelectText,
      plasma,
      beam
    ]);
    return upgradeContainer;
  }

  setUpgradeBar(scene, container, x, y, upgradeIndex) {
    let name = this.add.text(x - 22, y, playerUpgrades[upgradeIndex][0], {
      font: `${70 * gameScale.scale}px impact`,
      fill: '#ffffff',
      stroke: 'black',
      strokeThickness: 5
    });

    y += 64;

    let minus = this.add
      .sprite(x, y, constants.UPGRADEMINUSKEY)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', function() {
        let count = playerUpgrades[upgradeIndex][1];

        if (count > 0) {
          let circle = scene.upgradeCounts[upgradeIndex][count - 1];
          let x = circle.getData('x');
          let y = circle.getData('y');
          circle
            .clear()
            .fillStyle(gameStyles.upgradeBGColor)
            .fillCircle(x, y, gameStyles.upgradeRadius);
          playerUpgrades[upgradeIndex][1]--;
          playerStars++;
          scene.playerStarCount.setText(playerStars);
        }
      });

    let upgradeCount = new Array();
    let offsetX = 50;
    for (var i = 0; i < gameConfig.maxUpgrades; i++) {
      let count = playerUpgrades[upgradeIndex][1];

      let circle = scene.add
        .graphics()
        .fillStyle(
          i + 1 <= count ? gameStyles.upgradeColor : gameStyles.upgradeBGColor
        );

      circle.fillCircle(x + offsetX, y, gameStyles.upgradeRadius);
      circle.setData('x', x + offsetX);
      circle.setData('y', y);

      upgradeCount.push(circle);
      container.add(circle);
      offsetX += 50;
    }
    this.upgradeCounts.push(upgradeCount);
    let plus = this.add
      .sprite(x + offsetX, y, constants.UPGRADEPLUSKEY)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', function() {
        let count = playerUpgrades[upgradeIndex][1];

        if (count < gameConfig.maxUpgrades && playerStars > 0) {
          let circle = scene.upgradeCounts[upgradeIndex][count];
          let x = circle.getData('x');
          let y = circle.getData('y');
          circle
            .clear()
            .fillStyle(gameStyles.upgradeColor)
            .fillCircle(x, y, gameStyles.upgradeRadius);
          playerUpgrades[upgradeIndex][1]++;
          playerStars--;
          scene.playerStarCount.setText(playerStars);
        }
      });

    container.add([name, minus, plus]);
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
