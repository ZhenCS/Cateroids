import * as constants from './utils/constants.js';

export function setAI(self, functions){
    self.shootTimer = self.scene.time.addEvent({
        delay: self.getData('fireRate'),
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

                functions();
            }
        },
        callbackScope: self,
        loop: true
    });
}

export function setMovement(self, functions){
    self.movement = self.scene.time.addEvent({
        delay: 10,
        callback: function() {
            if (self.scene !== undefined) {
                functions();
            }
        },
        callbackScope: self,
        loop: true
    });
}

export function stayInMap(self, scene){
    let offsetX = self.displayWidth/2
    let offsetY = self.displayHeight/2;

    if(self.x <= offsetX|| self.y <= offsetY || 
        self.x >= scene.gameConfig.worldWidth - offsetX || self.y >= scene.gameConfig.worldHeight - offsetY){
        let vel = self.body.velocity;
        

        if(self.x < 0 + offsetX) self.x = offsetX;
        if(self.x > scene.gameConfig.worldWidth - offsetX) self.x = scene.gameConfig.worldWidth - offsetX;
        if(self.y < 0 + offsetY) self.y = offsetY;
        if(self.y > scene.gameConfig.worldHeight - offsetY) self.y = scene.gameConfig.worldHeight - offsetY;
        

        self.body.setVelocity(
            -1 * vel.x,
            -1 * vel.y
        );
    }
}

export function rotate(self, offset){
    const dx = self.scene.player.x - self.x;
    const dy = self.scene.player.y - self.y;
    const angle = Math.atan2(dy, dx) + offset;

    self.setRotation(angle);
}

export function circle(self){
    self.body.setVelocity(0, 0);
    let radius = 100;
    let center = self.getData('center');
    if(!center){
        center = {x: self.x - radius, y: self.y};
        self.setData('center', center);
    }

    let angle =
      Phaser.Math.Angle.Between(
        center.x,
        center.y,
        self.x,
        self.y
      ) + self.scene.gameConfig.playerWalkVelocityX/2;

      self.x = center.x + radius * Math.cos(angle);
      self.y = center.y + radius * Math.sin(angle);
}

export function random(self, tint, Bullet){
    let bullet = self.scene.bullets.getFirstDead(false, self.x, self.y);
    if (bullet){
        bullet.setType(null);
        bullet.setData('isFriendly', false);
    }
    else{
        bullet = new Bullet(self.scene, self.x, self.y, false);
        self.scene.bullets.add(bullet);
    }
    bullet.setData('isFriendly', false);
    bullet.setActive(true);
    bullet.setVisible(true);

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

export function aimBot(self, tint, Bullet){
    let bullet = self.scene.bullets.getFirstDead(false, self.x, self.y);
    if (bullet){
        bullet.setTexture(constants.BULLETKEY);
    } else {
        // No free bullets, we'll add one bullet to the group
        bullet = new Bullet(self.scene, self.x, self.y, false);
        self.scene.bullets.add(bullet);
    }
    bullet.setData('isFriendly', false);
    // turn the bullet on
    bullet.setActive(true);
    bullet.setVisible(true);
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
}

export function kamikazi(self){
    const dx = self.scene.player.x - self.x;
    const dy = self.scene.player.y - self.y;
    const angle = Math.atan2(dy, dx);
    self.body.setVelocity(
        gameConfig.bulletSpeed * Math.cos(angle),
        gameConfig.bulletSpeed * Math.sin(angle)
        );
}

