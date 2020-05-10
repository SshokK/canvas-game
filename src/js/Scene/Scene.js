import * as Physijs from 'physijs-webpack';
import * as Three from 'three';
import State from '../State/State';
import Avatar from '../Avatar/Avatar';
import Map from '../Map/Map';
import Bullets from '../Bullets/Bullets';
import Enemies from '../Enemies/Enemies';
import { SCENES } from '../LevelManager/LevelManager';


export const SCENES_MAP = {
  1: SCENES.DAY,
  2: SCENES.NIGHT,
  3: SCENES.FOG,
  4: SCENES.DAY,
  5: SCENES.NIGHT,
  6: SCENES.FOG,
  7: SCENES.DAY
}

class Scene extends Physijs.Scene {
  constructor(renderer, aCamera) {
    super();
    this.setGravity(new Three.Vector3(0, -50, 0));

    this.camera = aCamera;

    this.avatar = null;
    this.map = null;
    this.enemies = null;
    this.bullets = null;
    this.index = 0;

    this.createAvatar();
    this.avatar.loadWeapons();

    this.place = new Three.Object3D();
    this.createMap();
    this.createBullets();
    this.createEnemies();

    this.add(this.place);
  }

  shoot() {
    const state = new State();

    if (this.index >= state.maxBullets) {
      this.index = 0;
      this.bullets.reload();
    }
    if (!state.shooting) {
      this.bullets.shoot(
        this.index,
        this.avatar.getPosition(),
        this.camera.getWorldDirection(),
        this.avatar.getActiveWeapon()
      );
      this.index++;
      state.actualAmmo--;
      state.updateHUD();
    }
  }


  createMap() {
    const state = new State()

    this.map = new Map(SCENES_MAP[state.level] || SCENES.DAY);

    for (let i = 0; i < this.map.getMapSize(); ++i) {
      this.add(this.map.getMap(i));
    }

    if (SCENES_MAP[state.level] === SCENES.FOG) {
      const color = 0xFFFFFF;
      const fog = new Three.Fog(color, 150, 400);
      console.log(this, fog)
      this.fog = fog
    }
  }

  createAvatar() {
    this.avatar = new Avatar(this.camera, this);
  }

  createBullets() {
    const state = new State()
    const loader = new Three.TextureLoader();
    const texture = loader.load('./imgs/bullettext.jpg');
    this.bullets = new Bullets(state.maxBullets, this, new Three.MeshPhongMaterial({ map: texture }));
  }

  createEnemies() {
    const state = new State();
    this.enemies = new Enemies(this, state.level);
  }

  endGame() {
    const state = new State();

    state.enableControls = false;
    state.controls.enabled = false;

    state.moveForward = false;
    state.moveBackward = false;
    state.moveLeft = false;
    state.moveRight = false;
    state.jumping = false;

    state.elements.blockerDOMElement.style.display = 'block';
    state.elements.instructionsDOMElement.style.display = '';
    state.elements.instructionsDOMElement.style.fontSize = '50px';
    state.elements.instructionsDOMElement.innerHTML =
      'TotalScore : ' + state.score + ', press the P key to play one time. <br> Or press B to sign out';
  }

  animate() {
    const state = new State();

    this.simulate();

    if (state.moveForward) this.avatar.moveForward();
    if (state.moveBackward) this.avatar.moveBackward();
    if (state.moveLeft) this.avatar.moveLeft();
    if (state.moveRight) this.avatar.moveRight();

    if (state.jumping) {
      this.avatar.jump();
    }

    if (state.shooting) {
      this.avatar.animateWeapon();
    }

    this.avatar.updateControls();

    this.enemies.animate();

    if (state.actualAmmo === 0) {
      this.endGame();
    }
  }

  changeWeapon() {
    this.avatar.changeWeapon();
  }

  getCamera() {
    return this.camera;
  }

  getCameraControls() {
    return this.controls;
  }

  setCameraAspect(anAspectRatio) {
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }

  newLevel() {
    const state = new State();

    this.avatar.setInitialPosition();

    if (state.score - state.lastScore !== 40) {
      state.score = state.lastScore + 40;
    }

    state.updateHUD();
    this.removeMap();
    this.createMap();
    this.createEnemies();
    state.lastScore = state.score;
  }

  removeMap = () => {
    for (let i = 0; i < this.enemies.getEnemiesSize(); ++i) {
      this.remove(this.enemies.getEnemies(i));
    }
    for (let i = 0; i < this.map.getMapSize(); ++i) {
      this.remove(this.map.getMap(i));
    }

    this.fog = undefined;
  }

  newGame() {
    const state = new State();

    state.elements.blockerDOMElement.style.display = 'none';
    state.elements.enableControls = true;
    state.controls.enabled = true;

    this.avatar.setInitialPosition();
    state.actualAmmo = 40;
    state.score = 0;
    state.level = 1;
    state.updateHUD();

    this.removeMap();
    this.createMap();
    this.createEnemies();
  }
}

export default Scene;
