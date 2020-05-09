import * as Physijs from 'physijs-webpack';
import * as Three from 'three';
import State from '../State/State';

const TARGETS = [
  {
    direction: 'left',
    distance: -150
  },
  {
    direction: 'right',
    distance: -250
  },
  {
    direction: 'left',
    distance: -350
  },
  {
    direction: 'right',
    distance: -450
  }
];

const FORCE_MAP = {
  1: 5,
  2: 10,
  3: 20,
  4: 30,
  5: 50,
  6: 70,
  7: 90,
  8: 100,
  9: 120
};
const DEFAULT_FORCE = 150;

class Enemies {
  constructor(scene) {
    const state = new State();
    this.enemies = [];
    this.countCollitions = [];
    this.direction = [];
    this.init = true;
    this.countDead = 0;

    this.scene = scene;
    this.force = FORCE_MAP[state.level] || DEFAULT_FORCE;
    this.targets = [];

    const loader = new Three.TextureLoader();
    const diana = loader.load('./img/diana.png');

    TARGETS.forEach((target, targetNum) => {
      const material = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: diana }), 0, 0);
      const targetModel = new Physijs.BoxMesh(new Three.BoxGeometry(7.5, 10, 1, 1, 1, 1), material, 1);
      const positionX = target.direction === 'left' ? 100 : -100;

      targetModel.applyMatrix(new Three.Matrix4().makeTranslation(positionX, 7, target.distance));
      targetModel.receiveShadow = true;
      targetModel.autoUpdateMatrix = false;

      this.countCollitions.push(0);
      this.direction.push(target.direction);
      this.enemies.push(targetModel);
      this.targets.push(targetModel);
      this.scene.add(targetModel);
      this.addBulletListener(targetNum);
    });

    return this;
  }

  addBulletListener(i) {
    const state = new State();

    this.enemies[i].addEventListener('collision', (elOtroObjeto, velocity, rotation, normal) => {
      if (this.countCollitions[i] === 1) {
        const sound = new Howl({
          src: ['./sounds/death.mp3'],
          volume: 0.3
        });
        sound.play();
        state.score += 10;
        state.updateHUD();
        this.countDead++;

        if (this.countDead === TARGETS.length) {
          state.level += 1;
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
    const state = new State();

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
    if (this.enemies.every((enemy, i) => enemy.position.z !== TARGETS[i].distance)) {
      state.level++;
      this.scene.newLevel();
    }
  }
}

export default Enemies;
