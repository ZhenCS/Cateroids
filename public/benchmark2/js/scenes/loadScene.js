class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadScene' });
  }

  preload() {
    this.load.image('tiles', 'assets/CateroidsTileSet.png');

    this.load.tilemapTiledJSON('map', 'json/level1.json');

    this.load.image(keys.LOGOKEY, 'assets/logo.png');
    this.load.image(keys.BGKEY, 'assets/bg.jpg');
    this.load.image(keys.NAMEKEY, 'assets/gameName.png');
    this.load.image(keys.LIFEICON, 'assets/iconLife.png');
    this.load.image(keys.PIXELKEY, 'assets/pixel.png');
    this.load.image(keys.BULLETKEY, 'assets/bullet.png');

    this.load.image(keys.CONTROLS1KEY, 'assets/controls1.png');
    this.load.image(keys.LEVELICON, 'assets/levelicon.png');
    this.load.image(keys.BACKKEY, 'assets/back.png');
    this.load.image(keys.STARKEY, 'assets/star.png');
    this.load.image(keys.CATKEY, 'assets/cat.png');
    this.load.image(keys.DOG1KEY, 'assets/dog.png');
    this.load.image(keys.DOG2KEY, 'assets/dog2.png');
    this.load.image(keys.DOG3KEY, 'assets/dog3.png');
    this.load.atlas(
      keys.CATATLASKEY,
      'assets/cat_spritesheet.png',
      'json/cat.json'
    );
    this.load.atlas(
      keys.DOG1ATLASKEY,
      'assets/dog_spritesheet.png',
      'json/dog.json'
    );
    this.load.atlas(
      keys.DOG2ATLASKEY,
      'assets/dog2_spritesheet.png',
      'json/dog.json'
    );
    this.load.atlas(
      keys.DOG3ATLASKEY,
      'assets/dog3_spritesheet.png',
      'json/dog.json'
    );
    // Load asteroids
    // TODO: Create 4 different asteroids then just swap them in

    for (let i = 0; i < 4; i++) {
      this.load.image(keys[`ASTEROID${i}KEY`], `assets/asteroid${i}.png`);
    }
  }

  create() {
    this.scene.stop(this);
    this.scene.start(keys.SPLASHKEY);
  }
}
