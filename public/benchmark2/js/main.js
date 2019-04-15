var config = {
    type: Phaser.AUTO,
    title: 'Cateroids Scenes',
    width: 1275,
    height: 600,
    scene: [loadScene, splashScene, startScene, helpScene, levelsScene, gameScene]
  };

var gameScale = {
  scale: config.height/1600
}

var levelsStyle = {
  paddingStars: 50 * gameScale.scale,
  iconY: 600 * gameScale.scale,
  iconSpace: 220 * gameScale.scale
};

var gameStyles = {
  padding: 20 * gameScale.scale,
  barHeight: 50 * gameScale.scale,
  healthWidth: 1000 * gameScale.scale,
  oxygenWidth: 600 * gameScale.scale,
  healthColor: 0xff4d4d,
  oxygenColor: 0x3399ff,
  barColor: 0xf2f2f2

};


var game = new Phaser.Game(config);

window.addEventListener('click', function(event) {
  if(this.game.scene.isActive(keys.SPLASHKEY)){
    this.game.scene.switch(keys.SPLASHKEY, keys.STARTKEY);
  }
});

window.addEventListener('keydown', function(event){
  if(this.game.scene.isActive(keys.STARTKEY) && event.key == "Escape"){
    this.game.scene.switch(keys.STARTKEY, keys.SPLASHKEY);
  }

  if(this.game.scene.isActive(keys.GAMEKEY) && event.key == "Escape"){
    this.game.scene.getScene(keys.GAMEKEY).showPauseMenu();
  }
});
