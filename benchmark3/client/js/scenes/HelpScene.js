import * as constants from '../../../shared/constants.js';
import {setBG, centerX, setBackButton} from '../utils/utils.js';

export class HelpScene extends Phaser.Scene {
  constructor() {
    super({ key: constants.HELPKEY});
  }

  create() {
    setBG(this);
    setBackButton(this);
    this.backButton.on('pointerdown', function() {
      this.scene.game.scene.switch(constants.HELPKEY, constants.STARTMENUKEY);
      this.scene.game.scene.stop(constants.HELPKEY);
    });

    let helpText1 = ["It is a period of uncivil war.", "Feline spaceships, pouncing from a hidden base,", "have won the first victory","against the evil Galactic Pawpire.", "During the battle, Feline spies managed to ", "steal secret plans to the Pawpire’s ultimate weapon, ", "the WOLF STAR, an armored space station", "with enough power to destroy the entire feline race."];
    let helpText2 = ["Leonardo DaCatmeow, races to his home", "LitterBox-380.01", "in the Alpha-Catauri Quadrant with", "the stolen plans in hand that", "can save his people…"];
    let helpText3 = ["Leonardo DaCatmeow’s goal is to find", "his way back home to deliver the stolen plans.", "But through his travels, the Galactic Pawpire", "has sent out troops to stop Leonardo.", "Leonardo must traverse his way through", "an asteroid filled space", "while destroying his enemies."];
    let helpText4 = ["The Galactic Pawpire has to take back", "the stolen plans or they face extinction.", "They will do whatever it takes to get it back.", "However, resources are limited", "and the Galactic Pawpire must strategize on how it will", "how it will send out their limited amount", "of troops to defeat Leonardo."];
    let helpText5 = ["Developers:", "Alex Espinal", "Kyle Simon", "Zheng Lu"];

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
          this.game.scene.switch(constants.HELPKEY, constants.STARTMENUKEY);
          this.game.scene.stop(constants.HELPKEY);
        }
      }
    });

    tween.pause();
    return tween;
  }
}
