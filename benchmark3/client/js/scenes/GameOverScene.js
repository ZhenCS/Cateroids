import * as constants from '../../../shared/constants';

class GameOverScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameOverScene' });
    }  
    preload() {}

    create() {
        this.gameOverContainer = this.initGameOverMenu();
        this.showGameOverMenu();
    }

    initGameOverMenu() {
        let gameOverContainer = this.add.container();
        let gameOverHeader = this.add.text(0, 100 * gameScale.scale, 'Game Over', {
            font: `${100 * gameScale.scale}px impact`,
            fill: '#ffffff',
            stroke: 'black',
            strokeThickness: 5
        });

        centerX(this, gameOverHeader);
        let restartButton = this.createButton(
            500 * gameScale.scale,
            'Restart Game'
        ).on('pointerdown', function() {
            this.scene.game.scene.switch(constants.GAMEOVERKEY, constants.GAMEKEY);
        });

        let exitGameButton = this.createButton(
            700 * gameScale.scale,
            'Exit Game'
        ).on('pointerdown', function() {
            this.scene.game.scene.switch(constants.GAMEOVERKEY, constants.STARTMENUKEY);
            this.scene.game.scene.stop(constants.GAMEKEY);
        });

        gameOverContainer.depth = gameDepths.menuDepth;
        gameOverContainer.visible = false;
        gameOverContainer.add([gameOverHeader, restartButton, exitGameButton]);

        return gameOverContainer;
    }


    showGameOverMenu() {
        this.gameOverContainer.visible = true;

        //stop game
      }
    
    hideGameOverMenu() {
        this.gameOverContainer.visible = false;
    }

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
  }
  