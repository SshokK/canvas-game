import * as Physijs from 'physijs-webpack';
import * as Three from 'three';

class Enemies {
  constructor(scene, level) {
    this.enemies = [];
    this.countCollitions = [];
    this.direction = [];
    this.force = 0;
    this.init = true;
    this.countDead = 0;

    this.scene = scene;

    if (level == 1) {
      this.force = 5;
    } else if (level == 2) {
      this.force = 10;
    } else if (level == 3) {
      this.force = 20;
    } else if (level == 4) {
      this.force = 30;
    } else if (level == 5) {
      this.force = 50;
    } else if (level == 6) {
      this.force = 70;
    } else if (level == 7) {
      this.force = 90;
    } else if (level == 8) {
      this.force = 100;
    } else if (level == 9) {
      this.force = 120;
    } else {
      this.force = 150;
    }

    const loader = new Three.TextureLoader();
    const diana = loader.load('./imgs/diana.png');

    this.mat1 = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: diana }), 0, 0);
    this.mat2 = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: diana }), 0, 0);
    this.mat3 = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: diana }), 0, 0);
    this.mat4 = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: diana }), 0, 0);

    const objetivo1 = new Physijs.BoxMesh(new Three.BoxGeometry(7.5, 10, 2.5, 1, 1, 1), this.mat1, 1);
    objetivo1.applyMatrix(new Three.Matrix4().makeTranslation(100, 7, -150));
    objetivo1.receiveShadow = true;
    objetivo1.autoUpdateMatrix = false;
    this.countCollitions.push(0);
    this.direction.push('left');
    this.enemies.push(objetivo1);
    this.scene.add(objetivo1);
    this.addBulletListener(this.enemies.length - 1);

    const objetivo2 = new Physijs.BoxMesh(new Three.BoxGeometry(7.5, 10, 2.5, 1, 1, 1), this.mat2, 1);
    objetivo2.applyMatrix(new Three.Matrix4().makeTranslation(-100, 7, -250));
    objetivo2.receiveShadow = true;
    objetivo2.autoUpdateMatrix = false;
    this.countCollitions.push(0);
    this.direction.push('right');
    this.enemies.push(objetivo2);
    this.scene.add(objetivo2);
    this.addBulletListener(this.enemies.length - 1);

    const objetivo3 = new Physijs.BoxMesh(new Three.BoxGeometry(7.5, 10, 2.5, 1, 1, 1), this.mat3, 1);
    objetivo3.applyMatrix(new Three.Matrix4().makeTranslation(100, 7, -350));
    objetivo3.receiveShadow = true;
    objetivo3.autoUpdateMatrix = false;
    this.countCollitions.push(0);
    this.direction.push('left');
    this.enemies.push(objetivo3);
    this.scene.add(objetivo3);
    this.addBulletListener(this.enemies.length - 1);

    const objetivo4 = new Physijs.BoxMesh(new Three.BoxGeometry(7.5, 10, 2.5, 1, 1, 1), this.mat4, 1);
    objetivo4.applyMatrix(new Three.Matrix4().makeTranslation(-100, 7, -450));
    objetivo4.receiveShadow = true;
    objetivo4.autoUpdateMatrix = false;
    this.countCollitions.push(0);
    this.direction.push('right');
    this.enemies.push(objetivo4);
    this.scene.add(objetivo4);
    this.addBulletListener(this.enemies.length - 1);

    return this;
  }

  addBulletListener(i) {
    this.enemies[i].addEventListener('collision', (elOtroObjeto, velocidad, rotacion, normal) => {
      if (this.countCollitions[i] == 1) {
        const sound = new Howl({
          src: ['./sounds/death.mp3'],
          volume: 0.3
        });
        sound.play();
        this.scene.updateScore(10);
        this.countDead++;
        if (this.countDead == 4) {
          this.scene.level++;
          this.scene.newLevel();
        }
      }
      this.countCollitions[i]++;
    });
  }

  getEnemies(i) {
    return this.enemies[i];
  }

  getEnemiesSize() {
    return this.enemies.length;
  }

  animate() {
    for (let i = 0; i < this.enemies.length; ++i) {
      if (this.enemies[i].position.x >= 100 && this.direction[i] === 'left') {
        this.enemies[i].applyCentralImpulse(new Three.Vector3(-this.force, 0, 0));
        this.direction[i] = 'right';
      } else if (this.enemies[i].position.x <= -100 && this.direction[i] === 'right') {
        this.enemies[i].applyCentralImpulse(new Three.Vector3(this.force, 0, 0));
        this.direction[i] = 'left';
      }
    }
    if (this.init) {
      this.force *= 2;
      this.init = false;
    }

    // Force next level in case it didn't detect a collision
    if (
      this.enemies[0].position.z !== -150 &&
      this.enemies[1].position.z !== -250 &&
      this.enemies[2].position.z !== -350 &&
      this.enemies[3].position.z !== -450
    ) {
      this.scene.level++;
      this.scene.newLevel();
    }
  }
}

export default Enemies;
