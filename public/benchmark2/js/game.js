const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  autoResize: true,
  background: 'black',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [LoadScene, SplashScene, SceneMainMenu, SceneMain],
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

  this.cameras.resize(width, height);

  this.bg.setSize(width, height);
  this.logo.setPosition(width / 2, height / 2);
}

window.addEventListener(
  'resize',
  function(event) {
    this.resize(window.innerWidth, window.innerHeight);
  },
  false
);

window.addEventListener('click', function(event) {
  if (game.scene.isActive(keys.SPLASHKEY)) {
    game.scene.switch(keys.SPLASHKEY, keys.GAMEKEY);
  }
});

window.addEventListener('keydown', function(event) {
  if (game.scene.isActive(keys.STARTKEY) && event.key == 'Escape') {
    game.scene.switch(keys.STARTKEY, keys.SPLASHKEY);
  }

  if (game.scene.isActive(keys.GAMEKEY) && event.key == 'Escape') {
    game.scene.getScene(keys.GAMEKEY).showPauseMenu();
  }
});
const game = new Phaser.Game(config);
