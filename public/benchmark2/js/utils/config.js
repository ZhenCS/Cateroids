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
}

const entityData = {
  maxVelocityX: 100,
  maxVelocityY: 100,
  minVelocityX: 10,
  minVelocityY: 25,

  maxPlayerHealth: 100,
  maxPlayerOxygen: 100,
  playerDamage: 10,

  asteroid0Health: 40,
  asteroid1Health: 20,
  asteroid2Health: 10,

  asteroid0Damage: 20,
  asteroid1Damage: 15,
  asteroid2Damage: 10,

  dog1Health: 30,
  dog2Health: 60,
  dog3Health: 80,

  dog1Damage: 5,
  dog2Damage: 10,
  dog3Damage: 15,

  dog1FireRate: 800,
  dog2FireRate: 1000,
  dog3FireRate: 1500
}
