function getMaxLength(scene) {
  return (
    1 *
    Math.sqrt(
      Math.pow(scene.game.config.width, 2) +
        Math.pow(scene.game.config.height, 2)
    )
  );
}

export function bulletCulling(scene) {
  for (let i = 0; i < scene.bullets.getChildren().length; i++) {
    const bullet = scene.bullets.getChildren()[i];

    if (
      bullet.active &&
      Phaser.Math.Distance.Between(
        bullet.x,
        bullet.y,
        scene.player.x,
        scene.player.y
      ) > getMaxLength(scene) 
    ) {
      if (bullet) {
        // return the bullet to the pool to be recycled
        bullet.removeColliders();
        scene.bullets.killAndHide(bullet);
      }
    }
  }
}

export function asteroidCulling(scene) {
  for (let i = 0; i < scene.asteroids.getChildren().length; i++) {
    const asteroid = scene.asteroids.getChildren()[i];

    if(scene.gameConfig.gameMode == 'RUN'){
      if (
        Phaser.Math.Distance.Between(
          asteroid.x,
          asteroid.y,
          scene.player.x,
          scene.player.y
        ) > getMaxLength(scene) &&
        asteroid.x < scene.player.x
      ) {
        if (asteroid) {
          asteroid.destroy();
        }
      }
    }else if(scene.gameConfig.gameMode == 'DEFEND'){
      if (
        Phaser.Math.Distance.Between(
          asteroid.x,
          asteroid.y,
          scene.player.x,
          scene.player.y
        ) > getMaxLength(scene)
      ) {
        if (asteroid) {
          asteroid.destroy();
        }
      }
    }


  }
}

export function oxygenAsteroidCulling(scene) {
  for (let i = 0; i < scene.oxygenAsteroids.getChildren().length; i++) {
    const asteroid = scene.oxygenAsteroids.getChildren()[i];
    if (
      Phaser.Math.Distance.Between(
        asteroid.x,
        0,
        scene.player.x,
        0
      ) > getMaxLength(scene) &&
      asteroid.x < scene.player.x
    ) {
      if (asteroid && asteroid != scene.baseAsteroid) {
        asteroid.destroy();
      }
    }
  }
}

export function dogCulling(scene) {
  // for (let i = 0; i < scene.dogs.getChildren().length; i++) {
  //   const dog = scene.dogs.getChildren()[i];
  //   if (
  //     Phaser.Math.Distance.Between(
  //       dog.x,
  //       dog.y,
  //       scene.player.x,
  //       scene.player.y
  //     ) > getMaxLength(scene) &&
  //     dog.x + 500 < scene.player.x
  //   ) {
  //     if (dog) {
  //       dog.onDestroy();
  //       dog.destroy();
  //     }
  //   }
  // }
}
