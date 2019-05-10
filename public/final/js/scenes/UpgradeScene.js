import * as constants from '../utils/constants.js';
import { centerX, setBackButton } from '../utils/utils.js';

export class UpgradeScene extends Phaser.Scene {
  constructor() {
    super({ key: constants.UPGRADEKEY });
  }
  preload() {}

  init(data){

  }

  create() {
    this. upgradeCounts = new Array();
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
    
    let offsetY = this.game.config.height / 2 - upgradeBG.displayHeight/2 + 20;
    let upgradeHeader = this.add.text(0, offsetY, `Upgrades`, {
      font: `${100 * gameScale.scale}px impact`,
      fill: '#ffffff',
      stroke: 'black',
      strokeThickness: 5
    });
    centerX(this, upgradeHeader);
    
    upgradeContainer.depth = gameDepths.menuDepth;
    upgradeContainer.add([
        upgradeBG,
        upgradeHeader
    ]);

    let x = upgradeBG.x - upgradeBG.displayWidth/2 + 50;
    let y = 140;
    for(var i = 0; i < playerUpgrades.length; i++){
      this.setUpgradeBar(this, upgradeContainer, x, y, i);
      y += 120;

      if(i == playerUpgrades.length/2 - 1){
        y = 140;
        x = upgradeBG.x - upgradeBG.displayWidth/2 + 430;
      }
    }

    let doneButton = this.createButton(x + 430,
      y - 60,
      'Done'
    ).on('pointerdown', function() {
        this.scene.game.scene.switch(constants.UPGRADEKEY, constants.GOALKEY);
        this.scene.game.scene.stop(constants.UPGRADEKEY);
    });

    upgradeContainer.add(doneButton);
    return upgradeContainer;
  }

  setUpgradeBar(scene, container, x, y, upgradeIndex){
    let name = this.add.text(x - 22, y, playerUpgrades[upgradeIndex][0], {
      font: `${70 * gameScale.scale}px impact`,
      fill: '#ffffff',
      stroke: 'black',
      strokeThickness: 5
    });

    y += 64;

    let minus = this.add.sprite(x, y, constants.UPGRADEMINUSKEY)
    .setInteractive({ cursor: 'pointer' })
    .on('pointerdown', function() {
      let count = playerUpgrades[upgradeIndex][1];

      if(count > 0){
        let circle = scene.upgradeCounts[upgradeIndex][count - 1];
        let x = circle.getData('x');
        let y = circle.getData('y');
        circle.clear().fillStyle(gameStyles.upgradeBGColor).fillCircle(x, y, gameStyles.upgradeRadius);
        playerUpgrades[upgradeIndex][1]--;
      }

      console.log(playerUpgrades[upgradeIndex][1]);
    });

    let upgradeCount = new Array();
    let offsetX = 50;
    for(var i = 0; i < gameConfig.maxUpgrades; i++){
      let count = playerUpgrades[upgradeIndex][1];

      let circle = scene.add
      .graphics()
      .fillStyle((i + 1 <= count) ? gameStyles.upgradeColor : gameStyles.upgradeBGColor);

      circle.fillCircle(x + offsetX, y, gameStyles.upgradeRadius);
      circle.setData('x', x + offsetX);
      circle.setData('y', y);

      upgradeCount.push(circle);
      container.add(circle);
      offsetX += 50;
    }
    this.upgradeCounts.push(upgradeCount);
    let plus = this.add.sprite(x + offsetX, y, constants.UPGRADEPLUSKEY)
    .setInteractive({ cursor: 'pointer' })
    .on('pointerdown', function() {
      let count = playerUpgrades[upgradeIndex][1];

      if(count < gameConfig.maxUpgrades){
        let circle = scene.upgradeCounts[upgradeIndex][count];
        let x = circle.getData('x');
        let y = circle.getData('y');
        circle.clear().fillStyle(gameStyles.upgradeColor).fillCircle(x, y, gameStyles.upgradeRadius);
        playerUpgrades[upgradeIndex][1]++;
      }

      console.log(playerUpgrades[upgradeIndex][1]);
    });
    
    container.add([
      name,
      minus,
      plus
  ]);

  }

  setText(scene, y, text, completed){
    let displayText = scene.add
    .text(0, y, text, {
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
