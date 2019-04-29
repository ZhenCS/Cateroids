import * as constants from '../../../shared/constants.js';

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: constants.LOADKEY });
  }

  preload() {
    let bgBar = this.add.graphics();
    let barW = window.innerWidth / 2;
    let barH = 30;

    bgBar.setPosition(
      this.sys.game.config.width / 2 - barW / 2,
      this.sys.game.config.height / 2 - barH / 2
    );
    bgBar.fillStyle(0xf5f5f5, 1);
    bgBar.fillRect(0, 0, barW, barH);

    let progressBar = this.add.graphics();
    progressBar.setPosition(
      this.sys.game.config.width / 2 - barW / 2,
      this.sys.game.config.height / 2 - barH / 2
    );

    this.load.on(
      'progress',
      function(value) {
        progressBar.clear();
        progressBar.fillStyle(0x9ad98d, 1);
        progressBar.fillRect(0, 0, value * barW, barH);
      },
      this
    );

    this.load.image('tiles', 'assets/CateroidsTileSet.png');
    this.load.image('tiles2', 'assets/CateroidsTileset2.png');

    this.load.tilemapTiledJSON('level1', 'json/tutorial.json');
    this.load.tilemapTiledJSON('level2', 'json/LevelTemplate.json');
    this.load.tilemapTiledJSON('level3', 'json/baseDefenseTemplate.json');
    this.load.tilemapTiledJSON('level4', 'json/level4.json');
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
    for (let i = 0; i < 4; i++) {
      this.load.image(constants[`ASTEROID${i}KEY`], `assets/asteroid${i}.png`);
    }

    // Load audio
    this.loadAudio(constants.CATWEAPONAUDIO, 'Default-Weapon-Cat.wav');
    this.loadAudio(constants.EXPLOSION1AUDIO, 'Exploded.wav');
    this.loadAudio(constants.EXPLOSION2AUDIO, 'Exploded2.wav');
    this.loadAudio(constants.ASTRCOLLISION, 'Hit-By-Asteroid.wav');
    this.loadAudio(constants.LASERHIT, 'Hit-By-Laser.wav');
    this.loadAudio(constants.RAYSTARTUP, 'Laser-Startup.wav');
    this.loadAudio(constants.RAYFIRING, 'Laser-Shot.wav');
    this.loadAudio(constants.MENUMOVE, 'Menu-Move.wav');
    this.loadAudio(constants.MENUSELECT, 'Menu-Select.wav');
    this.loadAudio(constants.SPOOKY, 'Spooky.wav');
    this.loadAudio(constants.WEIRDAUDIO1, 'Weird-Noise-1.wav');
    this.loadAudio(constants.WEIRDAUDIO2, 'Weird-Noise-2.wav');
    this.loadAudio(constants.WEIRDAUDIO3, 'Weird-Noise-3.wav');

    //this.loadMusic(constants.LEVELMUSIC1, 'levelMusic1.mp3');
    //this.loadMusic(constants.LEVELMUSIC2, 'levelMusic2.mp3');
    //this.loadMusic(constants.LEVELMUSIC3, 'levelMusic2.mp3');
    //this.loadMusic(constants.LEVELMUSIC4, 'levelMusic2.mp3');
    //this.loadMusic(constants.LEVELMUSIC5, 'levelMusic2.mp3');
    //this.loadMusic(constants.LEVELMUSIC6, 'levelMusic2.mp3');
  }

  loadMusic(key, fileName) {
    const path = 'assets/music/' + fileName;
    this.load.audio(key, path);
  }

  loadAudio(key, fileName) {
    const path = 'assets/sound-effects/' + fileName;
    this.load.audio(key, path);
  }

  create() {
    this.scene.stop(this);
    this.scene.start(constants.SPLASHKEY);
  }
}
