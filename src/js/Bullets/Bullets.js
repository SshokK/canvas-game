import * as Three from 'three';
import * as Physijs from 'physijs-webpack';
import { Howl } from 'howler';

class Bullets {
  constructor(maxBullets, scene, aMaterial) {
    this.material = aMaterial;
    this.objWidth = 1;
    this.maxBullets = maxBullets;
    this.bullets = [];
    this.launched = [];
    this.target = [];
    this.scene = null;

    for (let i = 0; i < maxBullets; ++i) {
      this.launched[i] = false;
      this.target[i] = new Three.Vector3(0, 0, 0);
      this.bullets[i] = this.createObject(i);
      this.scene = scene;
      this.scene.add(this.bullets[i]);
    }
  }

  getLaunched(i) {
    return this.launched[i];
  }

  setLaunched(i) {
    this.launched[i] = false;
  }

  getParameters(i) {
    return {
      x: this.bullets[i].position.x,
      y: this.bullets[i].position.y,
      z: this.bullets[i].position.z,
      radio: this.objWidth / 2
    };
  }

  reload() {
    for (let i = 0; i < this.maxBullets; ++i) {
      this.bullets[i].remove();
      this.launched[i] = false;
      this.target[i] = new Three.Vector3(0, 0, 0);
      this.bullets[i] = this.createObject(i);
      this.scene.add(this.bullets[i]);
    }
  }

  createObject(i) {
    const bullet = new Physijs.SphereMesh(new Three.SphereGeometry(this.objWidth / 4, 20, 20), this.material, 50);
    bullet.position.set(i, -9.5, 0.0);
    bullet.castShadow = true;
    return bullet;
  }

  setInitPosition(i) {
    this.bullets[i].position.x = i;
    this.bullets[i].position.y = -9.5;
    this.bullets[i].position.z = 0;
    this.bullets[i].__dirtyPosition = true;
  }

  shoot(i, position, target, weapon) {
    this.target[i].set(target.x, target.y, target.z);
    this.bullets[i].position.set(position.x - target.x, position.y + 5, position.z - target.z);

    // Detect more collisions per second
    this.bullets[i].setCcdMotionThreshold(10);
    this.bullets[i].setCcdSweptSphereRadius(this.objWidth / 4);

    this.bullets[i].__dirtyPosition = true;
    this.launched[i] = true;

    let potential = null;
    let sound = null;

    if (weapon === 0) {
      potential = 35000;
      sound = new Howl({
        src: ['./sounds/m4a1_s.mp3'],
        volume: 0.1
      });
    } else if (weapon === 1) {
      potential = 50000;
      sound = new Howl({
        src: ['./sounds/escopeta.mp3'],
        volume: 0.1
      });
    }

    const force = new Three.Vector3(
      this.target[i].x * potential,
      this.target[i].y * potential,
      this.target[i].z * potential
    );
    this.bullets[i].applyCentralImpulse(force);

    sound.play();
  }
}

export default Bullets;
