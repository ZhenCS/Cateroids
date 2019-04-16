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
            200 * gameScale.scale,
            'Restart Game'
        );

        gameOverContainer.depth = gameDepths.menuDepth;
        gameOverContainer.visible = false;
        gameOverContainer.add([gameOverHeader, restartButton]);

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
    }
  }
  