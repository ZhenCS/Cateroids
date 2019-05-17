import * as constants from '../utils/constants.js';
import { setBG, setGameName, centerX, setBackButton } from '../utils/utils.js';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: constants.LEVELSKEY });
  }

  create() {
    this.starCount = 0;
    this.stars = new Array();
    this.levelTexts = new Array();

    setBG(this);
    setGameName(this);

    if(fromCheatMenu){
      setBackButton(this, constants.LEVELSKEY, constants.CHEATKEY);
    }
    else setBackButton(this, constants.LEVELSKEY, constants.STARTMENUKEY);

    let { iconY, iconSpace } = levelsStyle;
    this.iconList = [];
    let y = 0;
    let x = 0;
    for (var i = 1; i <= constants.LEVELS; i++) {
      const icon = this.createLevelIcon(i, x, y);
      this.iconList.push(icon);
      x += iconSpace;
      if(i%6 == 0){
        y += 100;
        x = 0;
      }
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

  update(){
      this.updateStars();
      this.unlockLevels();
  }

  createLevelIcon(id, x, y) {
    let iconContainer = this.add.container(x, y);
    let iconText = this.add.text(
      x - 25 * gameScale.scale,
      y - 45 * gameScale.scale,
      `${id}`,
      {
        font: `${90 * gameScale.scale}px impact`,
        fill: (id == 1 || stars[id - 1][0]) ? '#000000' : '#8e0000'
      }
    );

    this.levelTexts[id] = iconText;

    const menuSelectSound = this.sound.add(constants.MENUSELECT);
    const menuHoverSound = this.sound.add(constants.MENUMOVE);
    menuSelectSound.setVolume(0.5);
    menuHoverSound.setVolume(0.2);

    iconText.depth = 2;
    let iconBG = this.add
      .sprite(x, y, constants.LEVELICON)
      .setInteractive({ cursor: 'pointer' });

    let scene = this;
    iconBG.on('pointerdown', function() {

      if(id == 1 || fromCheatMenu || stars[id - 1][0]){
        currentLevel.key = constants[`LEVEL${id}KEY`];
        currentLevel.level = id;

        this.scene.game.scene.stop(constants.GAMEKEY);
        this.scene.game.scene.switch(constants.LEVELSKEY, constants.GAMEKEY);
        this.scene.game.scene.stop(constants.LEVELSKEY);

        menuSelectSound.play();
      }
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

    let starGroup = new Array();
    for (var i = 0; i < 3; i++) {
      
      let star = this.add.sprite(
        x - iconBG.displayWidth / 2 + paddingStars + 80 * gameScale.scale * i,
        y + paddingStars + iconBG.displayHeight / 2,
        constants.STARKEY
      );
      star.depth = 2;
      star.setScale(0.8 * gameScale.scale);

      starGroup.push(star);
      iconContainer.add(star);
    }

    this.stars[id] = starGroup;
    return iconContainer;
  }

  unlockLevels(){
    for(var id = 1; id < constants.LEVELS; id++){
      this.levelTexts[id].setFill((id == 1 || stars[id - 1][0]) ? '#000000' : '#8e0000');
    }
  }

  updateStars(){
    for(var i = 1; i <= constants.LEVELS; i++){
      for(var k = 0; k < 3; k++){
        if(stars[i][k]){
          this.stars[i][k].tint = gameStyles.starTint;
        }else if(i > 1 && !stars[i - 1][0]){
          this.stars[i][k].tint = gameStyles.starTintLocked;
        }else{
          this.stars[i][k].clearTint();
        }
      }
    }
  }
}
