const setBG = scene => {
  let gameWidth = scene.sys.game.config.width;
  let gameHeight = scene.sys.game.config.height;

  scene.bg = scene.add.sprite(gameWidth / 2, gameHeight / 2, keys.BGKEY);
  scene.bg.setScale(5.5 * gameScale.scale);
};

function setGameName(scene) {
  let gameWidth = scene.sys.game.config.width;

  scene.gameName = scene.add.sprite(
    gameWidth / 2,
    160 * gameScale.scale,
    keys.NAMEKEY
  );
  scene.gameName.setScale(1.7 * gameScale.scale);
}

//takes the property: backButton
function setBackButton(fromScene, fromSceneString, toSceneString) {
  let gameHeight = fromScene.sys.game.config.height;

  fromScene.backButton = fromScene.add
    .sprite(
      200 * gameScale.scale,
      gameHeight - 80 * gameScale.scale,
      keys.BACKKEY
    )
    .setInteractive({ cursor: 'pointer' });

  fromScene.backButton.on('pointerover', function() {
    this.tint = 0xa51237;
  });

  fromScene.backButton.on('pointerout', function() {
    this.clearTint();
  });
  fromScene.backButton.setScale(gameScale.scale);
  if (fromSceneString != null && toSceneString != null) {
    fromScene.backButton.on('pointerdown', function() {
      fromScene.game.scene.switch(fromSceneString, toSceneString);
    });
  }
}

function centerX(scene, object) {
  let gameWidth = scene.sys.game.config.width;
  object.x = gameWidth / 2 - object.displayWidth / 2;
}

function getPropertyValue(object, name){
  return object.properties.find(x => x.name == name).value;
}