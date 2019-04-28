import * as constants from '../../../shared/constants.js';

export function setBG(scene) {
  let gameWidth = scene.sys.game.config.width;
  let gameHeight = scene.sys.game.config.height;

  scene.bg = scene.add.sprite(gameWidth / 2, gameHeight / 2, constants.BGKEY);
  scene.bg.setScale(5.5 * gameScale.scale);
}

export function setGameName(scene) {
  let gameWidth = scene.sys.game.config.width;

  scene.gameName = scene.add.sprite(
    gameWidth / 2,
    160 * gameScale.scale,
    constants.NAMEKEY
  );
  scene.gameName.setScale(1.7 * gameScale.scale);
}

//takes the property: backButton
export function setBackButton(fromScene, fromSceneString, toSceneString) {
  let gameHeight = fromScene.sys.game.config.height;

  fromScene.backButton = fromScene.add
    .sprite(
      200 * gameScale.scale,
      gameHeight - 80 * gameScale.scale,
      constants.BACKKEY
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
      if (fromCheatMenu) {
        fromScene.game.scene.switch(fromSceneString, constants.CHEATKEY);
        fromCheatMenu = false;
        return;
      }

      fromScene.game.scene.switch(fromSceneString, toSceneString);
    });
  }
}

export function centerX(scene, object) {
  let gameWidth = scene.sys.game.config.width;
  object.x = gameWidth / 2 - object.displayWidth / 2;
}

export function getPropertyValue(object, name) {
  if(object.properties == undefined)
    return null;

  let property = object.properties.find(x => x.name == name);

  if(property)
    return property.value;
  else return null;
}
