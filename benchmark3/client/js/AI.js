import * as constants from '../../shared/constants.js';

export function random(self, tint, Bullet){
    self.shootTimer = self.scene.time.addEvent({
        delay: self.getData('fireRate'),
        callback: function() {
            if (self.scene !== undefined) {
            const bullet = new Bullet(self.scene, self.x, self.y, false);
            bullet.setData('isFriendly', false);
            let animKey =
                constants.dogAnimationKeys[`DOG${self.getData('dogId')}ATTACKKEY`];

            if (animKey) {
                self.play(animKey);
                self.once('animationcomplete', function() {
                self.play(
                    constants.dogAnimationKeys[`DOG${self.getData('dogId')}IDLEKEY`]
                );
                });
            }
            const angle = (Phaser.Math.Between(0, 360) * Math.PI) / 180;
            bullet.setTint(tint);
            bullet.setRotation(angle);
            bullet.setData('damage', self.getData('damage'));
            bullet.body.setVelocity(
            gameConfig.bulletSpeed * Math.cos(angle),
            gameConfig.bulletSpeed * Math.sin(angle)
            );
            self.scene.bullets.add(bullet);
            }
        },
        callbackScope: self,
        loop: true
    });
}

export function aimBot(self, tint, Bullet){
    self.shootTimer = self.scene.time.addEvent({
        delay: self.getData('fireRate'),
        callback: function() {
            if (self.scene !== undefined) {
            const bullet = new Bullet(self.scene, self.x, self.y, false);
            bullet.setData('isFriendly', false);
            let animKey =
                constants.dogAnimationKeys[`DOG${self.getData('dogId')}ATTACKKEY`];

            if (animKey) {
                self.play(animKey);
                self.once('animationcomplete', function() {
                self.play(
                    constants.dogAnimationKeys[`DOG${self.getData('dogId')}IDLEKEY`]
                );
                });
            }
            const dx = self.scene.player.x - self.x;
            const dy = self.scene.player.y - self.y;
            const angle = Math.atan2(dy, dx);
            bullet.setTint(tint);
            bullet.setRotation(angle);
            bullet.setData('damage', self.getData('damage'));
            bullet.body.setVelocity(
            gameConfig.bulletSpeed * Math.cos(angle),
            gameConfig.bulletSpeed * Math.sin(angle)
            );
            self.scene.bullets.add(bullet);
            }
        },
        callbackScope: self,
        loop: true
    });
}

export function kamikazi(self){
    self.shootTimer = self.scene.time.addEvent({
        delay: 100,
        callback: function() {
            if (self.scene !== undefined) {
            let animKey =
                constants.dogAnimationKeys[`DOG${self.getData('dogId')}ATTACKKEY`];

            if (animKey) {
                self.play(animKey);
                self.once('animationcomplete', function() {
                self.play(
                    constants.dogAnimationKeys[`DOG${self.getData('dogId')}IDLEKEY`]
                );
                });
            }
            const dx = self.scene.player.x - self.x;
            const dy = self.scene.player.y - self.y;
            const angle = Math.atan2(dy, dx);
            self.body.setVelocity(
                gameConfig.bulletSpeed * Math.cos(angle),
                gameConfig.bulletSpeed * Math.sin(angle)
                );
            }
        },
        callbackScope: self,
        loop: true
    });
}

