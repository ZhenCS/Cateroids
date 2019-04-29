const gameScale = {
  scale: window.innerHeight / 1600
};

var levelsStyle = {
  paddingStars: 50 * gameScale.scale,
  iconY: 600 * gameScale.scale,
  iconSpace: 180 * gameScale.scale
};

const gameStyles = {
  padding: 20 * gameScale.scale,
  barHeight: 30 * gameScale.scale,
  healthWidth: 1000 * gameScale.scale,
  oxygenWidth: 600 * gameScale.scale,
  healthColor: 0xff4d4d,
  oxygenColor: 0x3399ff,
  barColor: 0xf2f2f2
};

const gameDepths = {
  menuDepth: 10,
  uiDepth: 5
};

let fromCheatMenu = false;

let currentLevel = { 
  key: 'level1',
  level: 1
};

const cheats = {
  invulnerable: false
};

const gameConfig = {
  gameMode: '',
  spawnBuffer: 0,
  worldOffsetX: 0,
  worldOffsetY: 0,
  worldWidth: 10000,
  worldHeight: 0,

  waveRate: 5000,
  //soft cap for just arrow keys. can be exceeded with boost
  softMaxPlayerVelocityX: 500,
  softMaxPlayerVelocityY: 500,

  //radians
  playerWalkVelocityX: Math.PI / 45,
  playerWalkVelocityY: Math.PI / 45,
  //hard cap with boost. will never exceed
  hardMaxPlayerVelocityX: 1000,
  hardMaxPlayerVelocityY: 1000,
  playerAccelerationX: 20,
  playerAccelerationY: 20,
  boost: 30,
  grappleSpeed: 1000,

  //for asteroids and dogs
  maxVelocityX: 500,
  maxVelocityY: 500,
  minVelocityX: 100,
  minVelocityY: 100,

  maxPlayerHealth: 1000,
  maxPlayerOxygen: 100,
  playerDamage: 10,

  asteroid0Health: 40,
  asteroid1Health: 20,
  asteroid2Health: 10,
  asteroid3Health: 100,

  asteroid0Damage: 20,
  asteroid1Damage: 15,
  asteroid2Damage: 10,
  asteroid3Damage: 500,

  dog1Health: 30,
  dog2Health: 60,
  dog3Health: 80,

  dog1Damage: 5,
  dog2Damage: 10,
  dog3Damage: 15,

  //ms
  dog1FireRate: 1000,
  dog2FireRate: 1500,
  dog3FireRate: 2000,
  bulletSpeed: 500,

  // out of 100
  dogSpawnRate: 100,
  dog1SpawnRate: 40,
  dog2SpawnRate: 35,
  dog3SpawnRate: 25,

  oxygenAsteroidSpawnRate: 35,
  //when oxygen is 0, damage to health
  oxygenDamage: 2,
  oxygenDepletionDelay: 50,
  oxygenDepletionRate: 10 / 100,

  oxygenReplenishDelay: 50,
  oxygenReplenishRate: 15 / 100,

  laserDamage: 1,
  laserDuration: 2500,
  laserSprites: 50,
  laserDelay: 50,
  laserSpawnRate: 8000
};
