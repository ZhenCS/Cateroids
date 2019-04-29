export const LOADKEY = 'ls';
export const SPLASHKEY = 'ss';
export const STARTMENUKEY = 'sms';
export const GAMEKEY = 'sm';
export const LEVELSKEY = 'lss';
export const HELPKEY = 'hs';
export const PAUSEKEY = 'ps';
export const GAMEOVERKEY = 'gos';
export const CHEATKEY = 'cm';

export const LOGOKEY = 'logo';
export const NAMEKEY = 'name';
export const BGKEY = 'bg';
export const CONTROLS1KEY = 'controls1';

export const ASTEROID0KEY = 'asteroid0';
export const ASTEROID1KEY = 'asteroid1';
export const ASTEROID2KEY = 'asteroid2';
export const ASTEROID3KEY = 'asteroid3';

export const LEVELICON = 'levelIcon';
export const LIFEICON = 'lifeIcon';
export const BACKKEY = 'back';
export const STARKEY = 'star';

export const CATKEY = 'cat';
export const DOG1KEY = 'dog';
export const DOG2KEY = 'dog2';
export const DOG3KEY = 'dog3';

export const BULLETKEY = 'bullet';
export const PIXELKEY = 'pixels';
export const DOGLASERKEY = 'dogLaser';

export const CATATLASKEY = 'catAtlas';
export const DOG1ATLASKEY = 'dogAtlas';
export const DOG2ATLASKEY = 'dog2Atlas';
export const DOG3ATLASKEY = 'dog3Atlas';

export const SPRITEPREFIXKEY = 'sprite';
export const IDLEKEY = 'idle';
export const ATTACKKEY = 'attack';
export const DAMAGEKEY = 'damage';
export const DYINGKEY = 'dying';
export const DEADKEY = 'dead';

export const dogKeys = ['DOG1', 'DOG2', 'DOG3'];
export const animationKeys = ['idle', 'attack', 'damage', 'dying', 'dead'];
export const dogAnimationKeys = generateDogAnimationKeys();

export const LEVEL1KEY = 'lvl1';
export const LEVEL2KEY = 'lvl2';
export const LEVEL3KEY = 'lvl3';
export const LEVEL4KEY = 'lvl4';
export const LEVEL5KEY = 'lvl5';
export const LEVEL6KEY = 'lvl6';

export const COLLISION_CAT = Math.pow(2, 0);
export const COLLISION_ANTI_CAT = Math.pow(2, 1);
export const COLLISION_GROUP_GROUND = Math.pow(2, 2);

export const CATWEAPONAUDIO = 'catDefaultWeapon';
export const EXPLOSION1AUDIO = 'explosion1';
export const EXPLOSION2AUDIO = 'explosion2';
export const ASTRCOLLISION = 'asteroidCollision';
export const LASERHIT = 'laserHit';
export const RAYSTARTUP = 'rayStartup';
export const RAYFIRING = 'rayFiring';
export const MENUMOVE = 'menuMove';
export const MENUSELECT = 'menuSelect';
export const SPOOKY = 'spooky';
export const WEIRDAUDIO1 = 'weird-noise-1';
export const WEIRDAUDIO2 = 'weird-noise-2';
export const WEIRDAUDIO3 = 'weird-noise-3';
export const LEVELMUSIC1 = 'music1';
export const LEVELMUSIC2 = 'music2';
export const LEVELMUSIC3 = 'music3';
export const LEVELMUSIC4 = 'music4';
export const LEVELMUSIC5 = 'music5';
export const LEVELMUSIC6 = 'music6';

function generateDogAnimationKeys() {
  let dogAnimationKeys = new Array();
  dogKeys.forEach(function(dogStr) {
    animationKeys.forEach(function(anim) {
      dogAnimationKeys[
        `${dogStr}${anim.toUpperCase()}KEY`
      ] = `${anim}${dogStr}`;
    });
  });

  return dogAnimationKeys;
}
