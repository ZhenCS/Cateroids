import * as constants from '../utils/constants.js';
import {setBG, centerX, setBackButton} from '../utils/utils.js';

export class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: constants.ENDKEY});
  }

  create() {
    setBG(this);

    this.end1 = this.addText(endText1);
    this.end2 = this.addText(endText2);
    this.end3 = this.addText(endText3);


    this.tween1 = this.addTween(this.end1);
    this.tween2 = this.addTween(this.end2);
    this.tween3 = this.addTween(this.end3);


    this.ends = [this.end1, this.end2, this.end3];
    this.endTweens = [
      this.tween1,
      this.tween2,
      this.tween3,
    ];
    this.endCounter = 0;

    this.ends[this.endCounter].visible = true;
    this.endTweens[this.endCounter].restart();
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
        this.endCounter++;

        if (this.endCounter < this.ends.length) {
          this.ends[this.endCounter].visible = true;
          this.endTweens[this.endCounter].restart();
        } else {
          this.game.scene.switch(constants.ENDKEY, constants.SPLASHKEY);
          this.game.scene.stop(constants.ENDKEY);
        }
      }
    });

    tween.pause();
    return tween;
  }
}
