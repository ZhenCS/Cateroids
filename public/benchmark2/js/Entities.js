class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
  }

  getInitVelocity(scene, x, y){
    let width = scene.game.config.width;
    let height = scene.game.config.height;
    let player = scene.player;
    let buffer = 128;
    let velocityX = Phaser.Math.Between(
      -1 * gameConfig.maxVelocityX, 
      gameConfig.maxVelocityX);

    if(x < player.x - width/2 + buffer) 
      velocityX = Phaser.Math.Between(gameConfig.minVelocityX, gameConfig.maxVelocityX);
    else if(x > player.x + width/2 - buffer) 
      velocityX = Phaser.Math.Between(-1 * gameConfig.maxVelocityX, -1 * gameConfig.minVelocityX);

    let velocityY = Phaser.Math.Between(
      -1 * gameConfig.maxVelocityY, 
      gameConfig.maxVelocityY);

    if(y < 0 + buffer) 
      velocityY = Phaser.Math.Between(gameConfig.minVelocityY, gameConfig.maxVelocityY);
    else if(y > height - buffer) 
      velocityY = Phaser.Math.Between(-1 * gameConfig.maxVelocityX, -1 * gameConfig.minVelocityX);

    return [velocityX, velocityY];
  }
}

class Asteroid extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    let asteroids = [keys.ASTEROID0KEY, keys.ASTEROID1KEY, keys.ASTEROID2KEY, keys.ASTEROID3KEY];
    let level = asteroids.indexOf(key);
    
    if(level >= 0){
      this.setData('health', gameConfig[`asteroid${level}Health`]);
      this.setData('damage', gameConfig[`asteroid${level}Damage`]);
    }
    
    if(level == 3){
      this.body.setMass(100);
    }
    this.body.setCircle(this.displayWidth * 0.5);
    let velocity = this.getInitVelocity(scene,x,y);
    this.body.setVelocity(
      velocity[0],
      velocity[1]
    );
    this.setData('level', level);
  }

  damage(damage){
    let health = this.getData('health');

    this.setData('health', health - damage);
    if(health - damage <= 0){
      this.destroy();
    }
  }
  
}

class Dog extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    let fireRate = '';
    if(key == keys.DOG1KEY){
      this.setScale(0.4, 0.4);
      this.play(keys.DOG1IDLEKEY);
      this.setData('dogId', 1);
      this.setData('health', gameConfig.dog1Health);
      this.setData('damage', gameConfig.dog1Damage);

      fireRate = gameConfig.dog1FireRate;
    }
    if(key == keys.DOG2KEY){
      this.setScale(0.6, 0.6);
      this.play(keys.DOG2IDLEKEY);
      this.setData('dogId', 2);
      this.setData('health', gameConfig.dog2Health);
      this.setData('damage', gameConfig.dog2Damage);

      fireRate = gameConfig.dog2FireRate;
    }
    if(key == keys.DOG3KEY){
      this.setScale(0.8, 0.8);
      this.play(keys.DOG3IDLEKEY);
      this.setData('dogId', 3);
      this.setData('health', gameConfig.dog3Health);
      this.setData('damage', gameConfig.dog3Damage);

      fireRate = gameConfig.dog3FireRate;
    }

    let velocity = this.getInitVelocity(scene,x,y);
    this.body.setVelocity(velocity[0], velocity[1]);

    this.shootTimer = this.scene.time.addEvent({
      delay: fireRate,
      callback: function() {
        if (this.scene !== undefined) {
          const bullet = new Bullet(this.scene, this.x, this.y, false);
          bullet.setData('isFriendly', false);
          let animKey = keys[`DOG${this.getData('dogId')}ATTACKKEY`];

          if(animKey){
            this.play(animKey);
            this.once('animationcomplete', function(){
              this.play(keys[`DOG${this.getData('dogId')}IDLEKEY`]);
            });
          }
          if (key == keys.DOG1KEY) {
            const angle = (Phaser.Math.Between(0, 360) * Math.PI) / 180;
            bullet.setTint(0x142bff);
            bullet.setRotation(angle);
            bullet.setData('damage', gameConfig.dog1Damage);
            bullet.body.setVelocity(
              100 * Math.cos(angle),
              100 * Math.sin(angle)
            );
          } else if (key == keys.DOG2KEY) {
            const dx = this.scene.player.x - this.x;
            const dy = this.scene.player.y - this.y;
            const angle = Math.atan2(dy, dx);
            bullet.setTint(0x3dff23);
            bullet.setRotation(angle);
            bullet.setData('damage', gameConfig.dog2Damage);
            bullet.body.setVelocity(
              150 * Math.cos(angle),
              150 * Math.sin(angle)
            );
          }else if(key == keys.DOG3KEY){
            const dx = this.scene.player.x - this.x;
            const dy = this.scene.player.y - this.y;
            const angle = Math.atan2(dy, dx);
            bullet.setTint(0xd71fef);
            bullet.setRotation(angle);
            bullet.setData('damage', gameConfig.dog3Damage);
            bullet.body.setVelocity(
              200 * Math.cos(angle),
              200 * Math.sin(angle)
            );
          }

          this.scene.bullets.add(bullet);
        }
      },
      callbackScope: this,
      loop: true
    });
  }
  
  damage(damage){
    let health = this.getData('health');
    
    this.setData('health', health - damage);
    if(health - damage <= 0){
        this.onDestroy();
        this.destroy();
    }else{
      let animKey = keys[`DOG${this.getData('dogId')}DAMAGEKEY`];

      if(animKey)
        this.play(animKey);
      this.once('animationcomplete', function(){
        this.play(keys[`DOG${this.getData('dogId')}IDLEKEY`]);
      });
    }
  }

  onDestroy() {
    if (this.shootTimer !== undefined) {
      if (this.shootTimer) {
        this.shootTimer.remove(false);
      }
    }
  }
}

class Bullet extends Entity {
  constructor(scene, x, y, isFriendly) {
    super(scene, x, y, keys.BULLETKEY);
    this.setData('isFriendly', isFriendly);
  }
}

class Laser extends Entity {
  constructor(scene, x, y, isFriendly){
    super(scene, x, y, keys.BULLETKEY);
    this.setData('isFriendly', isFriendly);
    this.setData('angle', this.randomAngle());
    //use paths instead for interesting laser patterns
  }

  randomAngle(){
    return Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
  }
}

//use paths for grappling
class Leo extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, keys.CATKEY);
    this.body.setCollideWorldBounds(true);
    this.setData('isMoving', false);
    this.setData('health', gameConfig.maxPlayerHealth);
    this.setData('oxygen', gameConfig.maxPlayerOxygen);
    this.setData('oxygenAsteroid', null);
    this.setData('grapplePoint', null);
    this.grappleLine = this.scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 0xffffff,
      }
    });
    this.setScale(0.5, 0.5);
    this.setDepth(gameDepths.uiDepth - 1);
  }

  moveLeft(boost) {
    this.setData('isMoving', true);
    if(this.body.velocity.x > 0)
      this.body.velocity.x = 0;
    
    if(this.body.velocity.x > -1 * gameConfig.softMaxPlayerVelocityX)
      this.body.velocity.x -= gameConfig.playerSpeedX;

    if(this.body.velocity.x > -1 * gameConfig.hardMaxPlayerVelocityX)
      this.body.velocity.x -= boost;
    else this.body.velocity.x = -1 * gameConfig.hardMaxPlayerVelocityX;
  }

  moveRight(boost) {
    this.setData('isMoving', true);
    if(this.body.velocity.x < 0)
      this.body.velocity.x = 0;

    if(this.body.velocity.x < gameConfig.softMaxPlayerVelocityX)
      this.body.velocity.x += gameConfig.playerSpeedX;
    
    if(this.body.velocity.x < gameConfig.hardMaxPlayerVelocityX)
      this.body.velocity.x += boost;
    else this.body.velocity.x = gameConfig.hardMaxPlayerVelocityX;
  }

  moveDown(boost) {
    this.setData('isMoving', true);
    if(this.body.velocity.y < 0)
      this.body.velocity.y = 0;

    if(this.body.velocity.y < gameConfig.softMaxPlayerVelocityY)
      this.body.velocity.y += gameConfig.playerSpeedY;

    if(this.body.velocity.y < gameConfig.hardMaxPlayerVelocityY)
      this.body.velocity.y += boost;
    else this.body.velocity.y = gameConfig.hardMaxPlayerVelocityY;
  }

  moveUp(boost) {
    this.setData('isMoving', true);
    if(this.body.velocity.y > 0)
      this.body.velocity.y = 0;

    if(this.body.velocity.y > -1 * gameConfig.softMaxPlayerVelocityY) 
      this.body.velocity.y -= gameConfig.playerSpeedY;
    if(this.body.velocity.y > -1 * gameConfig.hardMaxPlayerVelocityY)
      this.body.velocity.y -= boost;
    else this.body.velocity.y = -1 * gameConfig.hardMaxPlayerVelocityY;
  }

  moveTo(x, y, speed){
    if(speed > gameConfig.hardMaxPlayerVelocityX)
      speed = gameConfig.hardMaxPlayerVelocityX;
    this.scene.physics.velocityFromAngle(
      Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, x, y)),
      speed,
      this.scene.player.body.velocity
    );
  }

  shoot(pointerX, pointerY) {
    const bullet = new Bullet(this.scene, this.x, this.y, true);
    bullet.setTint(0xf90018);
    bullet.setOrigin(0.5);
    bullet.setData('damage', gameConfig.playerDamage);
    let angle = Phaser.Math.Angle.Between(this.x, this.y, pointerX, pointerY);
    bullet.setRotation(angle);
    const speed = 1000;
    bullet.body.setVelocity(
      speed * Math.cos(angle) + Phaser.Math.Between(-50, 50),
      speed * Math.sin(angle) + Phaser.Math.Between(-50, 50)
    );
    this.scene.bullets.add(bullet);
  }
  damage(damage){
      this.setData('health', this.getData('health') - damage);
      if(this.getData('health') < 0){
        this.setData('health', 0);
      }else if(this.getData('health') > gameConfig.maxPlayerHealth){
        this.setData('health', gameConfig.maxPlayerHealth);
      }
  }

  oxygenDamage(damage){
    this.setData('oxygen', this.getData('oxygen') - damage);
    if(this.getData('oxygen') < 0){
      this.setData('oxygen', 0);
      this.damage(gameConfig.oxygenDamage);
    }else if(this.getData('oxygen') > gameConfig.maxPlayerOxygen){
      this.setData('oxygen', gameConfig.maxPlayerOxygen);
      //play oxygen replenished sound
    }
  }

  grapple(){
    if(!this.getData('oxygenAsteroid')){
      let point = this.getData('grapplePoint');
      this.deployGrapple(point);
      let distance = Math.sqrt(Math.pow((point.x - this.x),2) + Math.pow((point.y - this.y),2));
      let speed = gameConfig.grappleSpeed * distance/200;
      this.moveTo(point.x, point.y, speed);
    }else{
      this.setData('grapplePoint', null);
    }
  }
  reelGrapple(){
    this.grappleLine.clear();
  }

  deployGrapple(point){
    //create a line from player to point
    this.grappleLine.clear().lineStyle(1, 0xffffff);

    this.grappleLine.strokeLineShape({
      x1: this.x,
      y1: this.y,
      x2: point.x,
      y2: point.y
    });
  }

  followAsteroid(rad){
    let asteroid = this.getData('oxygenAsteroid');
    let radius = asteroid.displayWidth/2;
    let angle = Phaser.Math.Angle.Between(
      asteroid.x - asteroid.body.deltaX(), 
      asteroid.y - asteroid.body.deltaY(), 
      this.x, 
      this.y) + rad;
    this.setRotation(angle + Math.PI/2);
    this.x = asteroid.x + radius * Math.cos(angle) ;
    this.y = asteroid.y + radius * Math.sin(angle);

    if(this.y < 0 + this.displayHeight/2){
      this.y = this.displayHeight/2;
      this.setData('oxygenAsteroid', null);
    }else if(this.y > this.scene.game.config.height - this.displayHeight/2){
      this.y = this.scene.game.config.height - this.displayHeight/2;
      this.setData('oxygenAsteroid', null);
    }

    if(this.x < 0 + this.displayWidth/2){
      this.x = this.displayWidth/2;
      this.setData('oxygenAsteroid', null);
    }else if(this.x > this.scene.physics.world.bounds.width - this.displayWidth/2){
      this.x = this.scene.physics.world.bounds.width - this.displayWidth/2;
      this.setData('oxygenAsteroid', null);
    }



  }

  update() {
    if (!this.getData('isMoving')) {
      this.body.velocity.x *= 0.95;
      this.body.velocity.y *= 0.95;
    }
    this.setData('isMoving', false);
    
    if(!this.getData('oxygenAsteroid'))
      this.setRotation(this.rotation * 0.80);
  }
}
