import * as constants from '../../../shared/constants.js';
import { setBG, setGameName, centerX, setBackButton } from '../utils/utils.js';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: constants.LEVELSKEY });
  }

  create() {
    setBG(this);
    setGameName(this);

    if(fromCheatMenu){
      setBackButton(this, constants.LEVELSKEY, constants.CHEATKEY);
      fromCheatMenu = false;
    }
    else setBackButton(this, constants.LEVELSKEY, constants.STARTMENUKEY);

    let { iconY, iconSpace } = levelsStyle;
    this.iconList = [];

    for (var i = 1; i <= 6; i++) {
      const icon = this.createLevelIcon(i, iconSpace * (i - 1), 0);
      this.iconList.push(icon);
    }

    this.levelsContainer = this.add.container(0, iconY, this.iconList);
    let rect = this.levelsContainer.getBounds();
    this.levelsContainer.setSize(
      rect.width - 300 * gameScale.scale,
      rect.height
    );

    centerX(this, this.levelsContainer);

    this.tweens.add({
      targets: this.iconList.map(icon => icon.list[1]),
      duration: 51200,
      angle: 360,
      loop: -1,
      pause: false,
      callbackScope: this
    });
  }

  createLevelIcon(id, x, y) {
    let iconContainer = this.add.container(x, y);
    let iconText = this.add.text(
      x - 25 * gameScale.scale,
      y - 45 * gameScale.scale,
      `${id}`,
      {
        font: `${90 * gameScale.scale}px impact`,
        fill: '#000000'
      }
    );

    const menuSelectSound = this.sound.add(constants.MENUSELECT);
    const menuHoverSound = this.sound.add(constants.MENUMOVE);
    menuSelectSound.setVolume(0.5);
    menuHoverSound.setVolume(0.2);

    iconText.depth = 2;
    let iconBG = this.add
      .sprite(x, y, constants.LEVELICON)
      .setInteractive({ cursor: 'pointer' });
    iconBG.on('pointerdown', function() {
      currentLevel.key = `level${id}`;
      currentLevel.level = id;

      this.scene.game.scene.stop(constants.GAMEKEY);
      this.scene.game.scene.switch(constants.LEVELSKEY, constants.GAMEKEY);
      this.scene.game.scene.stop(constants.LEVELSKEY);

      menuSelectSound.play();
    });

    iconBG.on('pointerover', function() {
      menuHoverSound.play();
    });
    iconBG.setScale(0.8 * gameScale.scale);
    let iconMiddle = this.add.sprite(x, y, constants.ASTEROID0KEY);
    iconMiddle.depth = 1;
    iconMiddle.setScale(3.5 * gameScale.scale);
    iconContainer.add([iconBG, iconMiddle, iconText]);
    let { paddingStars } = levelsStyle;
    for (var i = 0; i < 3; i++) {
      let star = this.add.sprite(
        x - iconBG.displayWidth / 2 + paddingStars + 80 * gameScale.scale * i,
        y + paddingStars + iconBG.displayHeight / 2,
        constants.STARKEY
      );
      star.depth = 2;
      star.setScale(0.8 * gameScale.scale);
      //star.tint = 0xf2ff00;
      iconContainer.add(star);
    }

    return iconContainer;
  }
}
