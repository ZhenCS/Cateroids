const gameConsts = {
  menuDepth: 10,
  uiDepth: 5
};

let gameScene = new Phaser.Scene(keys.GAMEKEY);
gameScene.init = function() {
  this.leoSpeed = 250;
};

gameScene.preload = function() {
  this.load.image('leo', 'assets/cat.png');
};
gameScene.create = function() {
  let gameHeight = this.sys.game.config.height;
  setBG(this);

  this.pauseButton = this.add
    .text(0, gameHeight - 100 * gameScale.scale, 'ESC', {
      font: `${80 * gameScale.scale}px impact`,
      fill: '#ffffff',
      stroke: 'black',
      strokeThickness: 5
    })
    .setInteractive({ cursor: 'pointer' })
    .on('pointerdown', function() {
      this.scene.showPauseMenu();
    });

  // Place Leo on Scene
  this.leo = this.add.sprite(180, 400, 'leo');
  this.physics.add.existing(this.leo);

  this.ui = this.initPlayer1UI();
  this.pauseContainer = this.initPauseMenu();
  this.controlContainer = this.initControls();

  this.input.on('pointerdown', function(pointer) {
    console.log('x', pointer.x);
    console.log('y', pointer.y);
  });

  // enable cursor keys
  this.cursors = this.input.keyboard.createCursorKeys();
};

gameScene.update = function() {
  const movingUp = this.cursors.up.isDown;
  const movingRight = this.cursors.right.isDown;
  const movingDown = this.cursors.down.isDown;
  const movingLeft = this.cursors.left.isDown;
  this.leo.body.setVelocity(0);

  let boost = 0;
  if (this.cursors.space.isDown) {
    boost += 200;
  }

  // Horizontal movement
  if (movingLeft) {
    this.leo.body.setVelocityX(-this.leoSpeed - boost);
  } else if (movingRight) {
    this.leo.body.setVelocityX(this.leoSpeed + boost);
  }

  // Vertical movement
  if (movingUp) {
    this.leo.body.setVelocityY(-this.leoSpeed - boost);
  } else if (movingDown) {
    this.leo.body.setVelocityY(this.leoSpeed + boost);
  }

  this.leo.body.velocity.normalize().scale(this.leoSpeed + boost);
};

gameScene.initPlayer1UI = function() {
  let player1Container = this.add.container();
  let {
    padding,
    barHeight,
    healthWidth,
    oxygenWidth,
    healthColor,
    oxygenColor,
    barColor
  } = gameStyles;

  this.health = this.add
    .graphics()
    .fillStyle(healthColor)
    .setDepth(gameConsts.uiDepth + 1);
  this.healthBG = this.add
    .graphics()
    .fillStyle(barColor)
    .setDepth(gameConsts.uiDepth);

  this.health.fillRect(padding, padding, healthWidth / 2, barHeight);
  this.healthBG.fillRect(padding, padding, healthWidth, barHeight);

  this.oxygen = this.add
    .graphics()
    .fillStyle(oxygenColor)
    .setDepth(gameConsts.uiDepth + 1);
  this.oxygenBG = this.add
    .graphics()
    .fillStyle(barColor)
    .setDepth(gameConsts.uiDepth);

  this.oxygen.fillRect(
    padding,
    padding * 2 + barHeight,
    oxygenWidth / 2,
    barHeight
  );
  this.oxygenBG.fillRect(
    padding,
    padding * 2 + barHeight,
    oxygenWidth,
    barHeight
  );

  player1Container.add([
    this.healthBG,
    this.health,
    this.oxygenBG,
    this.oxygen
  ]);

  this.player1 = {
    health: 100,
    oxygen: 100,
    currency: 0,
    weapon1: null,
    weapon2: null
  };

  return player1Container;
};

gameScene.initPlayer2UI = function() {
  this.player2 = {
    currency: 0,
    units1: 0,
    units2: 1,
    units3: 0,
    units4: 0
  };
};

gameScene.initPauseMenu = function() {
  let pauseContainer = this.add.container();
  let pauseHeader = this.add.text(0, 100 * gameScale.scale, 'Paused', {
    font: `${100 * gameScale.scale}px impact`,
    fill: '#ffffff',
    stroke: 'black',
    strokeThickness: 5
  });
  centerX(this, pauseHeader);
  let resumeButton = this.createButton(500 * gameScale.scale, 'Resume Game').on(
    'pointerdown',
    function() {
      this.scene.hidePauseMenu();
    }
  );
  let controlButton = this.createButton(700 * gameScale.scale, 'Controls').on(
    'pointerdown',
    function() {
      this.scene.showControls();
    }
  );
  let exitGameButton = this.createButton(900 * gameScale.scale, 'Exit Game').on(
    'pointerdown',
    function() {
      this.scene.game.scene.switch(keys.GAMEKEY, keys.STARTKEY);
      this.scene.game.scene.stop(keys.GAMEKEY);
    }
  );

  pauseContainer.depth = gameConsts.menuDepth;
  pauseContainer.visible = false;
  pauseContainer.add([
    pauseHeader,
    resumeButton,
    controlButton,
    exitGameButton
  ]);
  pauseContainer.gameButtons = [resumeButton, controlButton, exitGameButton];
  return pauseContainer;
};

gameScene.initGameOverMenu = function() {
  let gameOverContainer = this.add.container();
  let gameOverHeader = this.add.text(0, 100 * gameScale.scale, 'Game Over', {
    font: `${100 * gameScale.scale}px impact`,
    fill: '#ffffff',
    stroke: 'black',
    strokeThickness: 5
  });

  centerX(this, gameOverHeader);
  let restartButton = this.createButton(200 * gameScale.scale, 'Resume Game');

  gameOverContainer.depth = gameConsts.menuDepth;
  gameOverContainer.visible = false;
  gameOverContainer.add([gameOverHeader, restartButton]);

  return gameOverContainer;
};

gameScene.initControls = function() {
  let gameWidth = this.sys.game.config.width;
  let gameHeight = this.sys.game.config.height;

  setBackButton(this);
  this.backButton.visible = false;

  this.backButton.on('pointerdown', function() {
    this.scene.hideControls();
  });

  const shiftKey = this.input.keyboard.addKey('SHIFT');
  shiftKey.on('down', function(event) {
    console.log('x', game.input.mousePointer.x);
    console.log('y', game.input.mousePointer.y);
  });

  let controlContainer = this.add.sprite(
    gameWidth / 2,
    gameHeight / 2,
    keys.CONTROLS1KEY
  );
  controlContainer.depth = gameConsts.menuDepth + 1;
  controlContainer.visible = false;
  controlContainer.setScale(gameScale.scale);
  return controlContainer;
};

gameScene.createButton = function(yPosition, text) {
  let button = this.add
    .text(0, yPosition, text, {
      font: `${100 * gameScale.scale}px impact`,
      fill: '#ffffff',
      stroke: 'black',
      strokeThickness: 5
    })
    .setInteractive({ cursor: 'pointer' });

  centerX(this, button);
  button.depth = gameConsts.uiDepth;

  button.on('pointerover', function() {
    this.alpha = 0.5;
  });

  button.on('pointerout', function() {
    this.alpha = 1;
  });

  return button;
};

gameScene.showPauseMenu = function() {
  this.pauseContainer.visible = true;
  this.pauseButton.removeInteractive().visible = false;

  //pause game
};

gameScene.hidePauseMenu = function() {
  this.pauseContainer.visible = false;
  this.pauseButton.setInteractive().visible = true;
  //resume game
};

gameScene.showGameOverMenu = function() {
  this.gameOverContainer.visible = true;

  //stop game
};

gameScene.hideGameOverMenu = function() {
  this.gameOverContainer.visible = false;
};

gameScene.showControls = function() {
  this.controlContainer.visible = true;
  this.backButton.visible = true;
  this.pauseContainer.gameButtons.forEach(button => {
    button.removeInteractive();
  });
};

gameScene.hideControls = function() {
  this.controlContainer.visible = false;
  this.backButton.visible = false;
  this.pauseContainer.gameButtons.forEach(button => {
    button.setInteractive();
  });
};
