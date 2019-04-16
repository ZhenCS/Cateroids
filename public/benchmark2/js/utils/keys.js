const keys = {
  LOADKEY: 'LoadScene',
  SPLASHKEY: 'SplashScene',
  STARTMENUKEY: 'StartMenuScene',
  GAMEKEY: 'SceneMain',
  LEVELSKEY: 'LevelSelectScene',
  HELPKEY: 'HelpScene',
  PAUSEKEY: 'PauseScene',

  LOGOKEY: 'logo',
  NAMEKEY: 'name',
  BGKEY: 'bg',
  CONTROLS1KEY: 'controls1',

  ASTEROIDKEY: 'asteroid',
  LEVELICON: 'levelIcon',
  LIFEICON: 'lifeIcon',
  BACKKEY: 'back',
  STARKEY: 'star',

  CATKEY: 'cat',
  DOGKEY: 'dog',
  DOG2KEY: 'dog2',
  DOG3KEY: 'dog3',

  BULLETKEY: 'bullet',
  PIXELKEY: 'pixels',

  CATATLASKEY: 'catAtlas',
  DOG1ATLASKEY: 'dogAtlas',
  DOG2ATLASKEY: 'dog2Atlas',
  DOG3ATLASKEY: 'dog3Atlas',

  SPRITEPREFIXKEY: 'sprite',
  IDLEKEY: 'idle',
  ATTACKKEY: 'attack',
  DAMAGEKEY: 'damage',
  DYINGKEY: 'dying',
  DEADKEY: 'dead',

  dogKeys: ['DOG1', 'DOG2', 'DOG3'],
  animationKeys: ['idle', 'attack', 'damage', 'dying', 'dead']
};

keys.dogKeys.forEach(function(dogStr) {
  keys.animationKeys.forEach(function(anim) {
    keys[`${dogStr}${anim.toUpperCase()}KEY`] = `${anim}${dogStr}`;
  });
});
