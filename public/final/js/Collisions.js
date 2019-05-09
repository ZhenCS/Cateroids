import * as constants from './utils/constants.js';
import { Asteroid, Dog, Laser, Leo } from './Entities.js';

export const checkPlayerToAsteroidCollision = scene => {
  scene.physics.add.collider(
    scene.player,
    scene.asteroids,
    function(player, asteroids) {
      scene.createExplosion(player.x, player.y, asteroids.displayWidth);

      if (scene.player) {
        scene.onLifeDown(asteroids.getData('damage'));
        asteroids.damage(gameConfig.playerDamage);
        scene.sound.play(constants.ASTRCOLLISION);
      }
    },
    null,
    scene
  );
};

export const checkPlayerToEnemyCollision = scene => {
  scene.physics.add.collider(
    scene.player,
    scene.dogs,
    function(player, dog) {
      scene.createExplosion(player.x, player.y, player.displayWidth);

      if (player) {
        scene.onLifeDown(dog.getData('damage'));
        dog.damage(gameConfig.playerDamage);

        scene.sound.play(constants.ASTRCOLLISION);
      }
    },
    null,
    scene
  );

  scene.physics.add.overlap(
    scene.player,
    scene.dogs,
    function(player, dog) {
      scene.createExplosion(player.x, player.y, player.displayWidth);

      if (player) {
        scene.onLifeDown(dog.getData('damage'));
        dog.damage(gameConfig.playerDamage);
      }
    },
    null,
    scene
  );
  if (scene.boss){
     scene.physics.add.collider(
      scene.player, 
      scene.boss,
      function(player, boss) {
        scene.createExplosion(player.x, player.y, player.displayWidth);
        if (player) {
          scene.onLifeDown(boss.getData('damage'));
          scene.sound.play(constants.ASTRCOLLISION);
        }
      },
      null,
      scene
    ); 

    scene.physics.add.overlap(
      scene.player,
      scene.boss,
      function(player, boss) {
        scene.createExplosion(player.x, player.y, player.displayWidth);
        if (player) {
          scene.onLifeDown(boss.getData('damage'));
        }
      }
    )
  }
  
};

export const checkPlayerToBulletCollision = scene => {
  scene.physics.add.overlap(
    scene.player,
    scene.bullets,
    function(player, bullet) {
      if (!bullet.getData('isFriendly')) {
        scene.createExplosion(player.x, player.y, player.displayWidth);

        if (player) {
          scene.onLifeDown(bullet.getData('damage'));
          bullet.destroy();
          scene.sound.play(constants.LASERHIT);
        }
      }
    },
    null,
    scene
  );

  scene.physics.add.overlap(
    scene.player,
    scene.laserSegments,
    function(player, segment) {
      scene.createExplosion(player.x, player.y, player.displayWidth);

      if (segment) {
        scene.onLifeDown(segment.getData('damage'));
      }
    },
    null,
    scene
  );
};

export const checkEnemyToBulletCollision = scene => {
  scene.physics.add.overlap(
    scene.bullets,
    scene.dogs,
    function(bullet, dog) {
      if (bullet.getData('isFriendly')) {
        scene.createExplosion(bullet.x, bullet.y, dog.displayWidth);
        let key = dog.texture.key;
        if (dog) {
          if (dog.getData('health') - bullet.getData('damage') <= 0) {
            // Add to score for destroying enemy
            if (key == constants.DOG3ATLASKEY) {
              scene.addScore(1000);
            }
            if (key == constants.DOG2ATLASKEY) {
              scene.addScore(500);
            }
            if (key == constants.DOG1ATLASKEY) {
              scene.addScore(200);
            }
            scene.sound.play(constants.LASERHIT);
          }

          dog.damage(bullet.getData('damage'));
        }

        console.log(bullet.type);

        if (bullet && bullet.type !== 'strongLaser') {
          bullet.destroy();
        }
      }
    },
    null,
    scene
  );

  if (scene.boss){
    scene.physics.add.overlap(
      scene.bullets,
      scene.boss,
      function (bullet, boss){
        if (bullet.getData('isFriendly')){
          if (boss){
            scene.createExplosion(bullet.x, bullet.y, boss.displayWidth);
            boss.damage(bullet.getData('damage'));
          }
        }

        if (bullet && bullet.type !== 'strongLaser'){
          bullet.destroy();
        }
      },
      null,
      scene
    );
  }
}

export const checkAsteroidToBulletCollision = scene => {
  scene.physics.add.overlap(
    scene.bullets,
    scene.asteroids,
    function(bullet, asteroid) {
      if (bullet.getData('isFriendly')) {
        scene.createExplosion(bullet.x, bullet.y, asteroid.displayWidth);

        const oldAsteroidPos = new Phaser.Math.Vector2(asteroid.x, asteroid.y);
        const oldAsteroidKey = asteroid.texture.key;
        const oldAsteroidLevel = asteroid.getData('level');
        const oldAsteroidHealth = asteroid.getData('health');

        if (asteroid) {
          const laserHit = scene.sound.add(constants.LASERHIT);
          laserHit.play();
          asteroid.damage(bullet.getData('damage'));
        }

        if (oldAsteroidHealth - gameConfig.playerDamage > 0) return;

        // Give points for destroying asteroids
        switch (oldAsteroidLevel) {
          case 0: {
            scene.addScore(100);
            break;
          }
          case 1: {
            scene.addScore(50);
            break;
          }
          case 2: {
            scene.addScore(20);
            break;
          }
        }

        // Break apart large asteroid
        if (oldAsteroidLevel < 2) {
          for (let i = 0; i < 2; i++) {
            let key = '';
            let newLevel = Phaser.Math.Between(1, 2);
            if (oldAsteroidKey == constants.ASTEROID0KEY) {
              key = constants[`ASTEROID${newLevel}KEY`];
            } else if (oldAsteroidKey == constants.ASTEROID1KEY) {
              key = constants.ASTEROID2KEY;
              newLevel = 2;
            }

            const newAsteroid = new Asteroid(
              scene,
              oldAsteroidPos.x,
              oldAsteroidPos.y,
              key
            );
            newAsteroid.setData('level', newLevel);
            newAsteroid.body.setVelocity(
              Phaser.Math.Between(-200, 200),
              Phaser.Math.Between(-200, 200)
            );
            scene.asteroids.add(newAsteroid);
          }
        }
      }

      if (bullet) {
        bullet.destroy();
      }
    },
    null,
    scene
  );
};

export const checkOxygenAsteroidToBulletCollision = scene => {
  scene.physics.add.overlap(
    scene.bullets,
    scene.oxygenAsteroids,
    function(bullet, oxygenAsteroid) {
      if (!bullet.getData('isFriendly')) {
        scene.createExplosion(bullet.x, bullet.y, oxygenAsteroid.displayWidth);
        if (oxygenAsteroid) {
          if (oxygenAsteroid == scene.player.getData('oxygenAsteroid')) {
            if (
              oxygenAsteroid.getData('health') - bullet.getData('damage') <=
              0
            )
              scene.player.setData('oxygenAsteroid', null);
          }

          oxygenAsteroid.damage(bullet.getData('damage'));
        }
        if (bullet) {
          bullet.destroy();
        }
      }
    },
    null,
    scene
  );
};

export const checkAsteroidToOxygenAsteroidCollision = scene => {
  scene.physics.add.overlap(
    scene.asteroids,
    scene.oxygenAsteroids,
    function(asteroid, oxygenAsteroid) {
      scene.createExplosion(asteroid.x, asteroid.y, asteroid.displayWidth);
      if (oxygenAsteroid) {
        if (oxygenAsteroid == scene.player.getData('oxygenAsteroid')) {
          if (
            oxygenAsteroid.getData('health') - asteroid.getData('damage') <=
            0
          )
            scene.player.setData('oxygenAsteroid', null);
        }
        oxygenAsteroid.damage(asteroid.getData('damage'));
      }

      if (asteroid) {
        asteroid.damage(gameConfig.asteroid3Damage);
      }
    },
    null,
    scene
  );
};

export const checkEnemyToOxygenAsteriodCollision = scene => {
  scene.physics.add.overlap(
    scene.dogs,
    scene.oxygenAsteroids,
    function(dog, oxygenAsteroid) {
      scene.createExplosion(dog.x, dog.y, dog.displayWidth);
      if (oxygenAsteroid) {
        if (oxygenAsteroid == scene.player.getData('oxygenAsteroid')) {
          if (oxygenAsteroid.getData('health') - dog.getData('damage') <= 0)
            scene.player.setData('oxygenAsteroid', null);
        }
        oxygenAsteroid.damage(dog.getData('damage'));
      }

      if (dog) {
        dog.damage(gameConfig.asteroid3Damage);
      }
    },
    null,
    scene
  );
};

export const checkPlayerToOxygenAsteroidCollision = scene => {
  scene.physics.add.overlap(
    scene.player,
    scene.oxygenAsteroids,
    function(player, asteroid) {
      if (!player.getData('oxygenAsteroid') && player.getData('grapplePoint')) {
        let point = player.getData('grapplePoint');
        let distance = Math.sqrt(
          Math.pow(asteroid.x - point.x, 2) + Math.pow(asteroid.y - point.y, 2)
        );
        if (distance <= asteroid.displayWidth / 2) {
          player.setData('oxygenAsteroid', asteroid);
          player.reelGrapple();
        }
      }
    },
    null,
    scene
  );
};
