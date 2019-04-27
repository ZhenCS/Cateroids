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

let currentLevel = { key: 'level0' };

const cheats = {
  invulnerable: false
};

const gameConfig = {
  spawnBuffer: 0,
  worldOffset: 200,
  worldWidth: 0,
  worldHeight: 0,
  //soft cap for just arrow keys. can be exceeded with boost
  softMaxPlayerVelocityX: 300,
  softMaxPlayerVelocityY: 300,

  //radians
  playerWalkVelocityX: Math.PI / 45,
  playerWalkVelocityY: Math.PI / 45,
  //hard cap with boost. will never exceed
  hardMaxPlayerVelocityX: 1000,
  hardMaxPlayerVelocityY: 1000,
  playerSpeedX: 10,
  playerSpeedY: 10,
  boost: 20,
  grappleSpeed: 800,

  //for asteroids and dogs
  maxVelocityX: 100,
  maxVelocityY: 100,
  minVelocityX: 10,
  minVelocityY: 25,

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
  dog1FireRate: 800,
  dog2FireRate: 1000,
  dog3FireRate: 1500,

  // out of 100
  dogSpawnRate: 50,
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
