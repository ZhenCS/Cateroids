class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create() {
    setBG(this);
    setGameName(this);
    setBackButton(this, keys.LEVELSKEY, keys.STARTKEY);

    let { iconY, iconSpace } = levelsStyle;
    this.iconList = [];
    for (var i = 1; i <= 6; i++) {
      this.iconList.push(this.createLevelIcon(i, iconSpace * (i - 1), 0));
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
    iconText.depth = 2;
    let iconBG = this.add
      .sprite(x, y, keys.LEVELICON)
      .setInteractive({ cursor: 'pointer' });
    iconBG.on('pointerdown', function() {
      console.log(`Level ${id} Selected`);
    });
    iconBG.setScale(gameScale.scale);
    let iconMiddle = this.add.sprite(x, y, keys.ASTEROIDKEY);
    iconMiddle.depth = 1;
    iconMiddle.setScale(0.45 * gameScale.scale);
    iconContainer.add([iconBG, iconMiddle, iconText]);
    let { paddingStars } = levelsStyle;
    for (var i = 0; i < 3; i++) {
      let star = this.add.sprite(
        x - iconBG.displayWidth / 2 + paddingStars + 100 * gameScale.scale * i,
        y + paddingStars + iconBG.displayHeight / 2,
        keys.STARKEY
      );
      star.depth = 2;
      star.setScale(gameScale.scale);
      //star.tint = 0xf2ff00;
      iconContainer.add(star);
    }

    return iconContainer;
  }
}
