class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadScene' });
  }

  preload() {
    this.load.image(keys.LOGOKEY, 'assets/logo.png');
    this.load.image(keys.BGKEY, 'assets/bg.jpg');
    this.load.image(keys.NAMEKEY, 'assets/gameName.png');
    this.load.image('sprIconLife', 'content/sprIconLife.png');
    // this.load.image('sprPlayer', 'assets/cat.png');
    this.load.image('sprBullet', 'content/sprBullet.png');
    // this.load.image('dogSmall', 'assets/dog.png');
    // this.load.image('dogLarge', 'assets/dog.png');

    this.load.image(keys.CONTROLS1KEY, 'assets/controls1.png');
    this.load.image(keys.ASTEROIDKEY, 'assets/asteroidBig.png');
    this.load.image(keys.LEVELICON, 'assets/levelicon.png');
    this.load.image(keys.BACKKEY, 'assets/back.png');
    this.load.image(keys.STARKEY, 'assets/star.png');
    this.load.image(keys.CATKEY, 'assets/cat.png');
    this.load.image(keys.DOGKEY, 'assets/dog.png');
    this.load.atlas(keys.CATATLASKEY, 'assets/cat_spritesheet.png', 'json/cat.json');
    // Load asteroids
    // TODO: Create 4 different asteroids then just swap them in
    for (let i = 0; i < 4; i++) {
      this.load.image('sprAsteroid' + i, 'assets/asteroidBig.png');
    }

    this.load.image('sprPixel', 'content/sprPixel.png');
  }

  create() {
    this.scene.stop(this);
    this.scene.start(keys.SPLASHKEY);
  }
}
