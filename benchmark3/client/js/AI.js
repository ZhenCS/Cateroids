function random(tint){
    const angle = (Phaser.Math.Between(0, 360) * Math.PI) / 180;
    bullet.setTint(tint);
    bullet.setRotation(angle);
    bullet.setData('damage', this.getData('damage'));
    bullet.body.setVelocity(
    100 * Math.cos(angle),
    100 * Math.sin(angle)
    );
}

function aimBot(tint){
    const dx = this.scene.player.x - this.x;
    const dy = this.scene.player.y - this.y;
    const angle = Math.atan2(dy, dx);
    bullet.setTint(tint);
    bullet.setRotation(angle);
    bullet.setData('damage', this.getData('damage'));
    bullet.body.setVelocity(
    200 * Math.cos(angle),
    200 * Math.sin(angle)
    );
}