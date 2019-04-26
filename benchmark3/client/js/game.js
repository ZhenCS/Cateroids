import * as constants from '../../shared/constants.js';
import {LoadScene} from './scenes/LoadScene.js';
import {SplashScene} from './scenes/SplashScene.js';
import {StartMenuScene} from './scenes/StartMenuScene.js';
import {LevelSelectScene} from './scenes/LevelSelectScene.js';
import {HelpScene} from './scenes/HelpScene.js';
import {SceneMain} from './scenes/SceneMain.js';
import {PauseScene} from './scenes/PauseScene.js';
import {GameOverScene} from './scenes/GameOverScene.js';

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
    GameOverScene
  ],
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

// SplashScene to Start Menu
window.addEventListener('click', function(event) {
  if (game.scene.isActive(constants.SPLASHKEY)) {
    game.scene.switch(constants.SPLASHKEY, constants.STARTMENUKEY);
  }
});

// StartMenu to Game
window.addEventListener('keydown', function(event) {
  if (game.scene.isActive(constants.STARTMENUKEY) && event.key == 'Escape') {
    game.scene.switch(constants.STARTMENUKEY, constants.GAMEKEY);
  }

  if (game.scene.isActive(constants.GAMEKEY) && event.key == 'Escape') {
    game.scene.start(constants.PAUSEKEY);
    game.scene.pause(constants.GAMEKEY);
    
  }
});

const game = new Phaser.Game(config);
