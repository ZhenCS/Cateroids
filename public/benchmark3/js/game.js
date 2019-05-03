import * as constants from './utils/constants.js';
import { LoadScene } from './scenes/LoadScene.js';
import { SplashScene } from './scenes/SplashScene.js';
import { StartMenuScene } from './scenes/StartMenuScene.js';
import { LevelSelectScene } from './scenes/LevelSelectScene.js';
import { HelpScene } from './scenes/HelpScene.js';
import { SceneMain } from './scenes/SceneMain.js';
import { PauseScene } from './scenes/PauseScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { CheatMenuScene } from './scenes/CheatMenuScene.js';

const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  autoResize: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [
    LoadScene,
    SplashScene,
    StartMenuScene,
    LevelSelectScene,
    HelpScene,
    SceneMain,
    PauseScene,
    CheatMenuScene,
    GameOverScene
  ],
  disableContextMenu: true,
  pixelArt: true,
  roundPixels: true
};
function resize(width, height) {
  if (width === undefined) {
    width = this.sys.game.config.width;
  }
  if (height === undefined) {
    height = this.sys.game.config.height;
  }
}

window.addEventListener(
  'resize',
  function(event) {
    //this.resize(window.innerWidth, window.innerHeight);
  },
  false
);

const game = new Phaser.Game(config);
