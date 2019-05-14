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
        scene.sound.play(constants.ASTRCOLLISION, { volume: 0.2 });
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
        if (dog.getData('dogId') !== 4) {
          dog.damage(gameConfig.playerDamage);
        }

        scene.sound.play(constants.ASTRCOLLISION, { volume: 0.2 });
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
        if (dog.getData('dogId') !== 4) {
          dog.damage(gameConfig.playerDamage);
        }
      }
    },
    null,
    scene
  );
  if (scene.boss) {
    scene.physics.add.collider(
      scene.player,
      scene.boss,
      function(player, boss) {
        scene.createExplosion(player.x, player.y, player.displayWidth);
        if (player) {
          scene.onLifeDown(boss.getData('damage'));
          scene.sound.play(constants.ASTRCOLLISION, { volume: 0.2 });
        }
      },
      null,
      scene
    );

    scene.physics.add.overlap(scene.player, scene.boss, function(player, boss) {
      scene.createExplosion(player.x, player.y, player.displayWidth);
      if (player) {
        scene.onLifeDown(boss.getData('damage'));
      }
    });
  }
};

export function addBulletCollisions(scene, bullet) {
  let result = [];
  result.push(checkPlayerToBulletCollision(scene, bullet));
  result.push(checkEnemyToBulletCollision(scene, bullet));
  result.push(checkAsteroidToBulletCollision(scene, bullet));
  result.push(checkOxygenAsteroidToBulletCollision(scene, bullet));
  return result.flat();
}

function playerToBulletCollision(player, bullet) {
  if (!bullet.getData('isFriendly')) {
    this.createExplosion(player.x, player.y, player.displayWidth);

    if (player) {
      this.onLifeDown(bullet.getData('damage'));
      bullet.removeColliders();
      this.bullets.killAndHide(bullet);
      this.sound.play(constants.LASERHIT, { volume: 0.3 });
    }
  }
}

export const checkPlayerToBulletCollision = (scene, bullet) => {
  let result = scene.physics.add.overlap(
    scene.player,
    bullet,
    playerToBulletCollision,
    null,
    scene
  );

  return result;
};

export const checkPlayerToLaserSegments = scene => {
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

function enemyBulletCollisionCallback(bullet, dog) {
  if (bullet.getData('isFriendly')) {
    this.createExplosion(bullet.x, bullet.y, dog.displayWidth);
    let key = dog.texture.key;
    if (dog) {
      if (dog.getData('health') - bullet.getData('damage') <= 0) {
        // Add to score for destroying enemy
        if (key == constants.DOG3ATLASKEY) {
          this.addScore(1000);
        }
        if (key == constants.DOG2ATLASKEY) {
          this.addScore(500);
        }
        if (key == constants.DOG1ATLASKEY) {
          this.addScore(200);
        }
        this.sound.play(constants.LASERHIT, { volume: 0.5 });
      }

      dog.damage(bullet.getData('damage'));
    }

    console.log(bullet.type);

    if (bullet && bullet.type !== 'strongLaser') {
      bullet.removeColliders();
      this.bullets.killAndHide(bullet);
    }
  }
}

export const checkEnemyToBulletCollision = (scene, bullet) => {
  let result = [];

  result.push(
    scene.physics.add.overlap(
      bullet,
      scene.dogs,
      enemyBulletCollisionCallback,
      null,
      scene
    )
  );

  if (scene.boss) {
    result.push(
      scene.physics.add.overlap(
        bullet,
        scene.boss,
        function(bullet, boss) {
          if (bullet.getData('isFriendly')) {
            if (boss) {
              scene.createExplosion(bullet.x, bullet.y, boss.displayWidth);
              boss.damage(bullet.getData('damage'));
            }
          }

          if (bullet && bullet.type !== 'strongLaser') {
            bullet.removeColliders();
            this.bullets.killAndHide(bullet);
          }
        },
        null,
        scene
      )
    );
  }

  return result;
};

function asteroidToBulletCollision(bullet, asteroid) {
  if (bullet.getData('isFriendly')) {
    this.createExplosion(bullet.x, bullet.y, asteroid.displayWidth);

    const oldAsteroidPos = new Phaser.Math.Vector2(asteroid.x, asteroid.y);
    const oldAsteroidKey = asteroid.texture.key;
    const oldAsteroidLevel = asteroid.getData('level');
    const oldAsteroidHealth = asteroid.getData('health');

    if (asteroid) {
      this.sound.play(constants.LASERHIT, { volume: 0.2 });
      asteroid.damage(bullet.getData('damage'));
    }

    if (oldAsteroidHealth - gameConfig.playerDamage > 0) return;

    // Give points for destroying asteroids
    switch (oldAsteroidLevel) {
      case 0: {
        this.addScore(100);
        break;
      }
      case 1: {
        this.addScore(50);
        break;
      }
      case 2: {
        this.addScore(20);
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
          this,
          oldAsteroidPos.x,
          oldAsteroidPos.y,
          key
        );
        newAsteroid.setData('level', newLevel);
        newAsteroid.body.setVelocity(
          Phaser.Math.Between(-200, 200),
          Phaser.Math.Between(-200, 200)
        );
        this.asteroids.add(newAsteroid);
      }
    }
  }

  if (bullet) {
    bullet.removeColliders();
    this.bullets.killAndHide(bullet);
    console.log('hit');
  }
}

export const checkAsteroidToBulletCollision = (scene, bullet) => {
  return scene.physics.add.overlap(
    bullet,
    scene.asteroids,
    asteroidToBulletCollision,
    null,
    scene
  );
};

function oxygenAsteroidToBulletCollision(bullet, oxygenAsteroid) {
  if (!bullet.getData('isFriendly')) {
    this.createExplosion(bullet.x, bullet.y, oxygenAsteroid.displayWidth);
    if (oxygenAsteroid) {
      if (oxygenAsteroid == this.player.getData('oxygenAsteroid')) {
        if (oxygenAsteroid.getData('health') - bullet.getData('damage') <= 0)
          this.player.setData('oxygenAsteroid', null);
      }

      oxygenAsteroid.damage(bullet.getData('damage'));
    }
    if (bullet) {
      bullet.removeColliders();
      this.bullets.killAndHide(bullet);
    }
  }
}

export const checkOxygenAsteroidToBulletCollision = (scene, bullet) => {
  return scene.physics.add.overlap(
    bullet,
    scene.oxygenAsteroids,
    oxygenAsteroidToBulletCollision,
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
