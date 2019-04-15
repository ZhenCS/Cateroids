class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadScene' });
  }

  preload() {
    this.load.image('sprIconLife', 'content/sprIconLife.png');
    this.load.image('sprPlayer', 'assets/cat.png');
    this.load.image('sprBullet', 'content/sprBullet.png');
    this.load.image('dogSmall', 'assets/dog.png');
    this.load.image('dogLarge', 'assets/dog.png');

    // Load asteroids
    // TODO: Create 4 different asteroids then just swap them in
    for (let i = 0; i < 4; i++) {
      this.load.image('sprAsteroid' + i, 'assets/asteroidBig.png');
    }

    this.load.image('sprPixel', 'content/sprPixel.png');
  }

  create() {
    this.scene.stop(this);
    this.scene.start(keys.GAMEKEY);
  }
}
