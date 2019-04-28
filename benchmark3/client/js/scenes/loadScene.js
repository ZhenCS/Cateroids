import * as constants from '../../../shared/constants.js';

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: constants.LOADKEY });
  }

  preload() {
    this.load.image('tiles', 'assets/CateroidsTileSet.png');
    this.load.image('tiles2', 'assets/CateroidsTileset2.png');
    this.load.tilemapTiledJSON('level0', 'json/LevelTemplate.json');
    this.load.tilemapTiledJSON('level1', 'json/tutorial.json');
    this.load.tilemapTiledJSON('level2', 'json/LevelTemplate.json');
    this.load.tilemapTiledJSON('level3', 'json/LevelTemplate.json');
    this.load.tilemapTiledJSON('level4', 'json/LevelTemplate.json');
    this.load.tilemapTiledJSON('level5', 'json/LevelTemplate.json');
    this.load.tilemapTiledJSON('level6', 'json/LevelTemplate.json');

    this.load.image(constants.LOGOKEY, 'assets/logo.png');
    this.load.image(constants.BGKEY, 'assets/bg.jpg');
    this.load.image(constants.NAMEKEY, 'assets/gameName.png');
    this.load.image(constants.LIFEICON, 'assets/iconLife.png');
    this.load.image(constants.PIXELKEY, 'assets/pixel.png');
    this.load.image(constants.BULLETKEY, 'assets/bullet.png');

    this.load.image(constants.CONTROLS1KEY, 'assets/controls1.png');
    this.load.image(constants.LEVELICON, 'assets/levelicon.png');
    this.load.image(constants.BACKKEY, 'assets/back.png');
    this.load.image(constants.STARKEY, 'assets/star.png');
    this.load.image(constants.CATKEY, 'assets/cat.png');
    this.load.image(constants.DOG1KEY, 'assets/dog.png');
    this.load.image(constants.DOG2KEY, 'assets/dog2.png');
    this.load.image(constants.DOG3KEY, 'assets/dog3.png');
    this.load.image(constants.DOGLASERKEY, 'assets/bossBeam.png');
    this.load.atlas(
      constants.CATATLASKEY,
      'assets/cat_spritesheet.png',
      'json/cat.json'
    );
    this.load.atlas(
      constants.DOG1ATLASKEY,
      'assets/dog_spritesheet.png',
      'json/dog.json'
    );
    this.load.atlas(
      constants.DOG2ATLASKEY,
      'assets/dog2_spritesheet.png',
      'json/dog.json'
    );
    this.load.atlas(
      constants.DOG3ATLASKEY,
      'assets/dog3_spritesheet.png',
      'json/dog.json'
    );
    // Load asteroids
    // TODO: Create 4 different asteroids then just swap them in

    for (let i = 0; i < 4; i++) {
      this.load.image(constants[`ASTEROID${i}KEY`], `assets/asteroid${i}.png`);
    }
  }

  create() {
    this.scene.stop(this);
    this.scene.start(constants.SPLASHKEY);
  }
}
