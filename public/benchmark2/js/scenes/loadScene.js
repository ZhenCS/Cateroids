let loadScene = new Phaser.Scene(keys.LOADKEY);

loadScene.preload = function() {
    this.load.image(keys.LOGOKEY, 'assets/logo.png');
    this.load.image(keys.BGKEY, 'assets/bg.jpg');
    this.load.image(keys.NAMEKEY, 'assets/gameName.png');
    this.load.image(keys.CONTROLS1KEY, 'assets/controls1.png');
    this.load.image(keys.ASTEROIDKEY, 'assets/asteroidBig.png');
    this.load.image(keys.LEVELICON, 'assets/levelicon.png');
    this.load.image(keys.BACKKEY, 'assets/back.png');
    this.load.image(keys.STARKEY, 'assets/star.png');
    this.load.image(keys.CATKEY, 'assets/cat.png');
    this.load.image(keys.DOGKEY, 'assets/dog.png');
};

loadScene.create = function(){
    this.scene.start(keys.SPLASHKEY);
};