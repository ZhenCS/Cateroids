class SplashScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SplashScene' });
  }

  preload() {}

  create() {
    let gameWidth = this.sys.game.config.width;
    let gameHeight = this.sys.game.config.height;

    setBG(this);
    setGameName(this);
    this.logo = this.add.sprite(gameWidth / 2, gameHeight / 2, keys.LOGOKEY);
    this.logo.setScale(1.5 * gameScale.scale);

    this.initText(gameWidth, gameHeight);

    this.tweens.add({
      targets: this.logo,
      duration: 102400,
      angle: 360,
      loop: -1,
      pause: false,
      callbackScope: this
    });
  }

  initText(gameWidth, gameHeight) {
    this.startText = this.add.text(
      0,
      gameHeight - 150 * gameScale.scale,
      '- Click to Start -',
      {
        font: `${45 * gameScale.scale}px verdana`,
        fill: '#ffffff'
      }
    );

    this.startText.x = gameWidth / 2 - this.startText.displayWidth / 2;
    this.startText.depth = 1;

    this.tweens.add({
      targets: this.startText,
      alpha: 0,
      loop: -1,
      duration: 600,
      ease: 'linear'
    });
  }
}
