import * as constants from './utils/constants.js';
import { LoadScene } from './scenes/PreloadScene.js';
import { SplashScene } from './scenes/splashScene.js';
import { StartMenuScene } from './scenes/StartMenuScene.js';
import { LevelSelectScene } from './scenes/LevelSelectScene.js';
import { HelpScene } from './scenes/HelpScene.js';
import { SceneMain } from './scenes/SceneMain.js';
import { PauseScene } from './scenes/PauseScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { CheatMenuScene } from './scenes/CheatMenuScene.js';
import { GoalScene } from './scenes/GoalScene.js';
import { UpgradeScene } from './scenes/UpgradeScene.js';
import { EndScene } from './scenes/EndScene.js';

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
    GameOverScene,
    GoalScene,
    UpgradeScene,
    EndScene
  ],
  disableContextMenu: true,
  pixelArt: false,
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

const game = new Phaser.Game(config);
