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

const playerData = {
  maxHealth: 500,
  maxOxygen: 100
}

const entityData = {
  maxVelocityX: 100,
  maxVelocityY: 100,
  minVelocityX: 10,
  minVelocityY: 25
}
