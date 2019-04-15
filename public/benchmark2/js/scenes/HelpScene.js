class HelpScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HelpScene' });
  }

  create() {
    setBG(this);
    setBackButton(this);
    this.backButton.on('pointerdown', function() {
      this.scene.game.scene.switch(keys.HELPKEY, keys.STARTKEY);
      this.scene.game.scene.stop(keys.HELPKEY);
    });

    this.help1 = this.addText(helpText1);
    this.help2 = this.addText(helpText2);
    this.help3 = this.addText(helpText3);
    this.help4 = this.addText(helpText4);
    this.help5 = this.addText(helpText5);

    this.tween1 = this.addTween(this.help1);
    this.tween2 = this.addTween(this.help2);
    this.tween3 = this.addTween(this.help3);
    this.tween4 = this.addTween(this.help4);
    this.tween5 = this.addTween(this.help5);

    this.helps = [this.help1, this.help2, this.help3, this.help4, this.help5];
    this.helpTweens = [
      this.tween1,
      this.tween2,
      this.tween3,
      this.tween4,
      this.tween5
    ];
    this.helpCounter = 0;

    this.helps[this.helpCounter].visible = true;
    this.helpTweens[this.helpCounter].restart();
  }

  addText(textString) {
    let text = this.add.text(0, this.sys.game.config.height, textString, {
      font: `${70 * gameScale.scale}px verdana`,
      fill: '#ffffff'
    });

    text.setAlign('center');
    centerX(this, text);
    text.visible = false;
    return text;
  }

  addTween(text) {
    let tween = this.tweens.add({
      targets: text,
      duration: 10000,
      y: -1 * text.displayHeight,
      pause: false,
      ease: 'linear',
      callbackScope: this,
      onComplete: function() {
        this.helpCounter++;

        if (this.helpCounter < this.helps.length) {
          this.helps[this.helpCounter].visible = true;
          this.helpTweens[this.helpCounter].restart();
        } else {
          this.game.scene.switch(keys.HELPKEY, keys.STARTKEY);
          this.game.scene.stop(keys.HELPKEY);
        }
      }
    });

    tween.pause();
    return tween;
  }
}
