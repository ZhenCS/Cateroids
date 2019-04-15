class StartMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartMenuScene' });
  }

  create() {
    let gameHeight = this.sys.game.config.height;

    setBG(this);
    setGameName(this);

    this.gameStart = this.createButton(
      gameHeight / 2 + 150 * gameScale.scale,
      'Start Game'
    );
    this.levelSelect = this.createButton(
      gameHeight / 2 + 300 * gameScale.scale,
      'Level Select'
    );
    this.controls = this.createButton(
      gameHeight / 2 + 450 * gameScale.scale,
      'Controls'
    );
    this.help = this.createButton(
      gameHeight / 2 + 600 * gameScale.scale,
      'Help'
    );

    this.initControls();

    this.gameStart.on('pointerdown', function() {
      this.scene.game.scene.switch(keys.STARTMENUKEY, keys.GAMEKEY);
    });
    this.levelSelect.on('pointerdown', function() {
      this.scene.game.scene.switch(keys.STARTMENUKEY, keys.LEVELSKEY);
    });
    this.controls.on('pointerdown', function() {
      this.scene.showControls();
    });
    this.help.on('pointerdown', function() {
      this.scene.game.scene.start(keys.HELPKEY);
    });
  }

  createButton = function(yPosition, text) {
    let button = this.add
      .text(0, yPosition, text, {
        font: `${100 * gameScale.scale}px impact`,
        fill: '#ffffff',
        stroke: 'black',
        strokeThickness: 5
      })
      .setInteractive({ cursor: 'pointer' });

    centerX(this, button);
    button.depth = 1;

    button.on('pointerover', function() {
      this.alpha = 0.5;
    });

    button.on('pointerout', function() {
      this.alpha = 1;
    });

    return button;
  };

  initControls() {
    let gameWidth = this.sys.game.config.width;
    let gameHeight = this.sys.game.config.height;

    this.controlContainer = this.add.sprite(
      gameWidth / 2,
      gameHeight / 2,
      keys.CONTROLS1KEY
    );
    this.controlContainer.depth = 2;
    this.controlContainer.visible = false;
    this.controlContainer.setScale(gameScale.scale);
    setBackButton(this);
    this.backButton.visible = false;
    this.backButton.on('pointerdown', function() {
      this.scene.hideControls();
    });
  }

  showControls() {
    this.controlContainer.visible = true;
    this.backButton.visible = true;
    this.gameStart.removeInteractive().visible = false;
    this.levelSelect.removeInteractive().visible = false;
    this.controls.removeInteractive().visible = false;
    this.help.removeInteractive().visible = false;
  }

  hideControls() {
    this.controlContainer.visible = false;
    this.backButton.visible = false;
    this.gameStart.setInteractive().visible = true;
    this.levelSelect.setInteractive().visible = true;
    this.controls.setInteractive().visible = true;
    this.help.setInteractive().visible = true;
  }
}
