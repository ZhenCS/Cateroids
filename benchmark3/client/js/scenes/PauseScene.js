import * as constants from '../../../shared/constants';

class PauseScene extends Phaser.Scene {
    constructor() {
      super({ key: 'PauseScene' });
    }  
    preload() {}

    create() {
      this.controlContainer = this.initControls();
      this.pauseContainer = this.initPauseMenu();

      this.showPauseMenu();
    }

    
    initPauseMenu() {
      let pauseContainer = this.add.container();
      let pauseHeader = this.add.text(0, 100 * gameScale.scale, 'Paused', {
        font: `${100 * gameScale.scale}px impact`,
        fill: '#ffffff',
        stroke: 'black',
        strokeThickness: 5
      });
      centerX(this, pauseHeader);
      let resumeButton = this.createButton(
        500 * gameScale.scale,
        'Resume Game'
      ).on('pointerdown', function() {
        this.scene.hidePauseMenu();
      });
      let controlButton = this.createButton(700 * gameScale.scale, 'Controls').on(
        'pointerdown',
        function() {
          this.scene.showControls();
        }
      );
      let exitGameButton = this.createButton(
        900 * gameScale.scale,
        'Exit Game'
      ).on('pointerdown', function() {
        this.scene.game.scene.switch(constants.PAUSEKEY, constants.STARTMENUKEY);
        this.scene.game.scene.stop(constants.GAMEKEY);
      });

      pauseContainer.depth = gameDepths.menuDepth;
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

    initControls() {
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
        constants.CONTROLS1KEY
      );
      controlContainer.depth = gameDepths.menuDepth + 1;
      controlContainer.visible = false;
      controlContainer.setScale(gameScale.scale);
      return controlContainer;
    };

    createButton(yPosition, text) {
      let button = this.add
        .text(0, yPosition, text, {
          font: `${100 * gameScale.scale}px impact`,
          fill: '#ffffff',
          stroke: 'black',
          strokeThickness: 5
        })
        .setInteractive({ cursor: 'pointer' });
  
      centerX(this, button);
      button.depth = gameDepths.uiDepth;
  
      button.on('pointerover', function() {
        this.alpha = 0.5;
      });
  
      button.on('pointerout', function() {
        this.alpha = 1;
      });
  
      return button;
    };

    showPauseMenu() {
      this.pauseContainer.visible = true;
      
      //pause game
    };
    
    hidePauseMenu() {
      this.pauseContainer.visible = false;
      this.scene.pause(constants.PAUSEKEY);
      this.scene.resume(constants.GAMEKEY);
      //resume game
    };

      
    showControls() {
      this.controlContainer.visible = true;
      this.backButton.visible = true;
      this.pauseContainer.gameButtons.forEach(button => {
        button.removeInteractive();
      });
    };
    
    hideControls() {
      this.controlContainer.visible = false;
      this.backButton.visible = false;
      this.pauseContainer.gameButtons.forEach(button => {
        button.setInteractive();
      });
    };
  }
  