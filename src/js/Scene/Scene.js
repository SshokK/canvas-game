import * as Physijs from 'physijs-webpack';
import * as Three from 'three';
import State from '../State/State';
import Crosshair from '../Crosshair/Crosshair';
import Avatar from '../Avatar/Avatar';
import Skybox from '../Skybox/Skybox';
import Map from '../Map/Map';
import Bullets from '../Bullets/Bullets';
import Enemies from '../Enemies/Enemies';

class Scene extends Physijs.Scene {
  constructor(renderer, aCamera) {
    super();
    this.setGravity(new Three.Vector3(0, -50, 0));

    this.camera = aCamera;
    this.createCrosshair(renderer);

    this.avatar = null;
    this.map = null;
    this.enemies = null;
    this.skybox = null;
    this.Bullets = null;
    this.index = 0;
    this.maxBullets = 20;
    this.actualAmmo = 40;
    this.score = 0;
    this.lastScore = 0;
    this.level = 1;

    this.createHUD();

    this.createAvatar();
    this.avatar.loadWeapons();
    this.place = this.createPlace();
    this.createBullets();
    this.createEnemies(this.level);

    this.ambientLight = null;
    this.spotLight = null;
    this.createLights();

    this.add(this.place);
  }

  createHUD() {
    const score = document.createElement('div');
    score.id = 'score';
    score.style.position = 'absolute';
    score.style.width = 1;
    score.style.height = 1;
    score.innerHTML = 'Score: ' + this.score;
    score.style.top = 50 + 'px';
    score.style.left = 50 + 'px';
    score.style.fontSize = 50 + 'px';
    score.style.color = 'white';
    document.body.appendChild(score);

    const ammo = document.createElement('div');
    ammo.id = 'ammo';
    ammo.style.position = 'absolute';
    ammo.style.width = 1;
    ammo.style.height = 1;
    ammo.innerHTML = 'Ammunation: ' + this.actualAmmo;
    ammo.style.top = 100 + 'px';
    ammo.style.left = 50 + 'px';
    ammo.style.fontSize = 50 + 'px';
    ammo.style.color = 'white';
    document.body.appendChild(ammo);

    const level = document.createElement('div');
    level.id = 'level';
    level.style.position = 'absolute';
    level.style.width = 1;
    level.style.height = 1;
    level.innerHTML = 'Level: ' + this.level;
    level.style.top = 150 + 'px';
    level.style.left = 50 + 'px';
    level.style.fontSize = 50 + 'px';
    level.style.color = 'white';
    document.body.appendChild(level);
  }

  updateAmmo() {
    const text = document.getElementById('ammo');
    text.innerHTML = 'Ammunation: ' + this.actualAmmo;
  }

  updateScore(newScore) {
    const text = document.getElementById('score');
    this.score += newScore;
    text.innerHTML = 'Score: ' + this.score;
  }

  updateLevel() {
    const level = document.getElementById('level');
    level.innerHTML = 'Level: ' + this.level;
  }

  // / It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCrosshair(renderer) {
    // Create the Crosshair
    const crosshair = new Crosshair();
    this.camera.add(crosshair);

    // Place it in the center
    const crosshairPercentX = 50;
    const crosshairPercentY = 50;
    const crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
    const crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;
    crosshair.position.set(crosshairPercentX, crosshairPositionY, -0.3);
  }

  shoot() {
    const state = new State();

    if (this.index >= this.maxBullets) {
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
      this.actualAmmo--;
      this.updateAmmo();
    }
  }

  // / It creates lights and adds them to the graph
  createLights() {
    // add subtle ambient lighting
    this.ambientLight = new Three.AmbientLight(0xccddee, 0.35);
    this.add(this.ambientLight);

    // add spotlight for the shadows
    this.spotLight = new Three.SpotLight(0xffffff);
    this.spotLight.position.set(0, 500, 1000);
    this.spotLight.intensity = 1;
    this.spotLight.castShadow = true;
    // the shadow resolution
    this.spotLight.shadow.mapSize.width = 2048;
    this.spotLight.shadow.mapSize.height = 2048;
    this.add(this.spotLight);
  }

  // / It creates the place
  /**
   * @return place
   */
  createPlace() {
    const place = new Three.Object3D();

    this.skybox = new Skybox();
    place.add(this.skybox);

    // Creates the map
    this.map = new Map();
    for (let i = 0; i < this.map.getMapSize(); ++i) {
      this.add(this.map.getMap(i));
    }

    return place;
  }

  // / It creates the avatar
  /**
   *
   */
  createAvatar() {
    this.avatar = new Avatar(this.camera, this);
  }

  // / It creates the bullets
  /**
   *
   */
  createBullets() {
    const loader = new Three.TextureLoader();
    const texture = loader.load('./imgs/bullettext.jpg');
    this.bullets = new Bullets(this.maxBullets, this, new Three.MeshPhongMaterial({ map: texture }));
  }

  // / It creates the enemies
  /**
   *
   */
  createEnemies() {
    this.enemies = new Enemies(this, this.level);
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
      'TotalScore : ' + this.score + ', press the P key to play another game';
  }

  // /
  /**
   * @controls - The GUI information
   */
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

    if (this.actualAmmo == 0) {
      this.endGame();
    }
  }

  changeWeapon() {
    this.avatar.changeWeapon();
  }

  // / It returns the camera
  /**
   * @return The camera
   */
  getCamera() {
    return this.camera;
  }

  // / It returns the camera controls
  /**
   * @return The camera controls
   */
  getCameraControls() {
    return this.controls;
  }

  // / It updates the aspect ratio of the camera
  /**
   * @param anAspectRatio - The new aspect ratio for the camera
   */
  setCameraAspect(anAspectRatio) {
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }

  newLevel() {
    this.avatar.setInitialPosition();

    if (this.score - this.lastScore != 40) {
      this.score = this.lastScore + 40;
    }

    this.updateLevel();

    for (let i = 0; i < this.enemies.getEnemiesSize(); ++i) {
      this.remove(this.enemies.getEnemies(i));
    }
    this.createEnemies();
    this.lastScore = this.score;
  }

  newGame() {
    const state = new State();

    state.elements.blockerDOMElement.style.display = 'none';
    state.elements.enableControls = true;
    state.controls.enabled = true;

    this.avatar.setInitialPosition();
    this.actualAmmo = 40;
    this.updateAmmo();
    this.score = 0;
    this.updateScore(0);
    this.level = 1;
    this.updateLevel();

    for (let i = 0; i < this.enemies.getEnemiesSize(); ++i) {
      this.remove(this.enemies.getEnemies(i));
    }
    this.createEnemies();
  }
}

export default Scene;
