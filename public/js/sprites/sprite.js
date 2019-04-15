export default class Sprite {
  constructor(scene, type, unitNumber, x, y) {
    // Set to scene
    this.scene = scene;

    // Set identifiers
    this.type = type;
    this.unitNumber = unitNumber;

    this.type = scene.add.sprite(x, y, type);
    scene.physics.add.existing(this);
  }
}
a;
