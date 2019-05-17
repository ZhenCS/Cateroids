const gameScale = {
  scale: window.innerHeight / 1600
};

const levelsStyle = {
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
  barColor: 0xf2f2f2,
  baseColor: 0x4ef442,
  basePadding: 50,
  starTint: 0xfbff42,
  starTintLocked: 0x505151,
  bossColor: 0x7851a9,
  bossPadding: 50,
  upgradeColor: 0x99ff99,
  upgradeBGColor: 0x4d4d4d,
  upgradeRadius: 12
};

const gameDepths = {
  menuDepth: 15,
  uiDepth: 10,
  entityDepth: 2
};

let fromCheatMenu = false;
let fromPauseMenu = false;

let currentLevel = {
  key: 'level1',
  level: 1
};

let playerStars = 0;
let stars = initStars();
let endOfGame = false;

function initStars() {
  let stars = new Array();
  for (var i = 1; i <= 12; i++) {
    stars[i] = [false, false, false];
  }

  return stars;
}

const cheats = {
  invulnerable: false
};

const playerUpgrades = [
  ['Health', 0],
  ['Damage', 0],
  ['OxygenDepletion', 0],
  ['OxygenReplenish', 0],

  ['BulletSize', 0],
  ['ExtraAmmo', 0],
  ['FireRate', 0],
  ['Speed', 0]
];

const upgradeRates = {
  Health: 100,
  Damage: 5,
  OxygenDepletion: 5 / 100,
  OxygenReplenish: 10 / 100,
  BulletSize: 0.1,
  ExtraAmmo: 1,
  FireRate: 5,
  Speed: 25
};

const gameConfig = {
  maxUpgrades: 5,
  gameMode: '',
  maxBaseHealth: 0,
  spawnBuffer: 0,
  worldOffsetX: 0,
  worldOffsetY: 0,
  worldWidth: 10000,
  worldHeight: 0,

  waves: 0,
  waveRate: 5000,

  //radians
  playerWalkVelocityX: (Math.PI * 2) / 45,
  playerWalkVelocityY: (Math.PI * 2) / 45,
  //soft cap for just arrow keys. can be exceeded with boost
  softMaxPlayerVelocityX: 500, //changed by upgrades
  softMaxPlayerVelocityY: 500, //changed by upgrades

  //hard cap with boost. will never exceed
  hardMaxPlayerVelocityX: 1000, //changed by upgrades
  hardMaxPlayerVelocityY: 1000, //changed by upgrades
  playerAccelerationX: 20,
  playerAccelerationY: 20,
  boost: 30,
  grappleSpeed: 1000,
  playerFireRate: 100, //changed by upgrades

  //for asteroids and dogs
  maxVelocityX: 500,
  maxVelocityY: 500,
  minVelocityX: 100,
  minVelocityY: 100,

  maxPlayerHealth: 700, //changed by upgrades
  maxPlayerOxygen: 100,
  playerDamage: 50, //changed by upgrades
  playerBulletSize: 1, //changed by upgrades
  maxPlayerAmmo: 3, //changed by upgrades

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
  dog3Health: 160, // Changed from 80 -> 160
  dog4Health: 120,

  dog1Damage: 5,
  dog2Damage: 10,
  dog3Damage: 15,
  dog4Damage: 10,

  //ms
  dog1FireRate: 1000,
  dog2FireRate: 1500,
  dog3FireRate: 2000,
  dog4FireRate: 1200,
  bulletSpeed: 500,

  // out of 100
  dogSpawnRate: 100,
  dog1SpawnRate: 35,
  dog2SpawnRate: 30,
  dog3SpawnRate: 25,
  dog4SpawnRate: 10,

  oxygenAsteroidSpawnRate: 35,
  oxygenAsteroidDamage: 4,
  //when oxygen is 0, damage to health
  oxygenDamage: 2,
  oxygenDepletionDelay: 100,
  oxygenDepletionRate: 50 / 100, //changed by upgrades

  oxygenReplenishDelay: 10,
  oxygenReplenishRate: 40 / 100, //changed by upgrades

  laserDamage: 3,
  laserDuration: 2500,
  laserSprites: 50,
  laserDelay: 50,
  laserSpawnRate: 8000,
  laserFireDelay: 1500,

  // Weapon Selection
  primaryWeapon: 'primary',
  secondaryWeapon: 'plasma',
  secondaryWeaponText: 'Plasma Shots: '
};
