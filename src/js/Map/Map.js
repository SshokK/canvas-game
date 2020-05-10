import * as Three from 'three';
import * as Physijs from 'physijs-webpack';
import Skybox from '../Skybox/Skybox';
import { SCENES } from '../LevelManager/LevelManager';

const MAPS = {
  [SCENES.DAY]: function() {
    this.map_size = 0;
    this.map = [];

    const loader = new Three.TextureLoader();
    const textureMetal = loader.load('./img/metal.jpg');
    const textureBase = loader.load('./img/dirt.jpg');
    const textureWood = loader.load('./img/wood_2.jpg');
    const textureWood2 = loader.load('./img/wood.jpg');
    const textureGrass = loader.load('./img/grass.jpg');

    const mat = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: textureMetal }), 0, 0);
    const matBase = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: textureBase }), 0, 0);
    const matWood = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: textureWood }), 50, 0);
    const matWood2 = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: textureWood2 }), 50, 0);
    const matGrass = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: textureGrass }), 50, 0);

    const floor = new Physijs.BoxMesh(new Three.BoxGeometry(200, 0.0, 200, 1, 1, 1), matWood2, 0);
    floor.applyMatrix(new Three.Matrix4().makeTranslation(0, 0, 0));
    floor.receiveShadow = true;
    floor.autoUpdateMatrix = false;
    this.map.push(floor);
    ++this.map_size;

    const enemies2 = new Physijs.BoxMesh(new Three.BoxGeometry(210, 4, 400, 1, 1, 1), matGrass, 0);
    enemies2.applyMatrix(new Three.Matrix4().makeTranslation(0, 0, -300));
    enemies2.receiveShadow = true;
    enemies2.autoUpdateMatrix = false;
    this.map.push(enemies2);
    ++this.map_size;

    const bullets3 = new Physijs.BoxMesh(new Three.BoxGeometry(50, 0.0, 50, 1, 1, 1), mat, 0);
    bullets3.applyMatrix(new Three.Matrix4().makeTranslation(0, -10, 0));
    bullets3.receiveShadow = false;
    bullets3.autoUpdateMatrix = false;
    this.map.push(bullets3);
    ++this.map_size;

    const fenceS4 = new Physijs.BoxMesh(new Three.BoxGeometry(220, 50, 20, 1, 1, 1), matWood, 0);
    fenceS4.applyMatrix(new Three.Matrix4().makeTranslation(0, 2.5, 100));
    fenceS4.receiveShadow = true;
    fenceS4.autoUpdateMatrix = false;
    this.map.push(fenceS4);
    ++this.map_size;

    const fenceE5 = new Physijs.BoxMesh(new Three.BoxGeometry(20, 50, 200, 1, 1, 1), matWood, 0);
    fenceE5.applyMatrix(new Three.Matrix4().makeTranslation(100, 2.5, 0));
    fenceE5.receiveShadow = true;
    fenceE5.autoUpdateMatrix = false;
    this.map.push(fenceE5);
    ++this.map_size;

    const fenceW6 = new Physijs.BoxMesh(new Three.BoxGeometry(20, 50, 200, 1, 1, 1), matWood, 0);
    fenceW6.applyMatrix(new Three.Matrix4().makeTranslation(-100, 2.5, 0));
    fenceW6.receiveShadow = true;
    fenceW6.autoUpdateMatrix = false;
    this.map.push(fenceW6);
    ++this.map_size;

    const fenceN7 = new Physijs.BoxMesh(new Three.BoxGeometry(220, 4, 8, 1, 1, 1), matWood, 0);
    fenceN7.applyMatrix(new Three.Matrix4().makeTranslation(0, 2.5, -96));
    fenceN7.receiveShadow = true;
    fenceN7.autoUpdateMatrix = false;
    this.map.push(fenceN7);
    ++this.map_size;

    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].forEach((_, i, arr) => {
      const fenceV = new Physijs.BoxMesh(new Three.BoxGeometry(3, 46, 6, 1, 1, 1), matWood, 0);
      fenceV.applyMatrix(new Three.Matrix4().makeTranslation(i * (200 / arr.length) - 100, 2.5, -96));
      fenceV.receiveShadow = true;
      fenceV.autoUpdateMatrix = false;
      this.map.push(fenceV);
      ++this.map_size;
    })

    const ceil = new Physijs.BoxMesh(new Three.BoxGeometry(400, 4, 400, 1, 1, 1), matWood, 0);
    ceil.applyMatrix(new Three.Matrix4().makeTranslation(0, 30, 50));
    ceil.receiveShadow = true;
    ceil.autoUpdateMatrix = false;
    this.map.push(ceil);
    ++this.map_size;

    const mountain = new Physijs.CylinderMesh(new Three.CylinderGeometry(50, 500, 50, 10, 10), matBase, 0);
    mountain.applyMatrix(new Three.Matrix4().makeTranslation(0, -40, -50));
    mountain.receiveShadow = true;
    mountain.autoUpdateMatrix = false;
    this.map.push(mountain);
    ++this.map_size;

    const ambientLight = new Three.AmbientLight(0xccddee, 0.35);
    this.map.push(ambientLight);
    ++this.map_size;

    const spotLight = new Three.SpotLight(0xffcc4d);
    spotLight.position.set(-400, 500, 0);``
    spotLight.intensity = 1;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    this.map.push(spotLight);
    ++this.map_size;

    const skybox = new Skybox(SCENES.DAY);
    this.map.push(skybox);
    ++this.map_size;

    return this;
  },
  [SCENES.NIGHT]: function() {
    this.map_size = 0;
    this.map = [];

    const loader = new Three.TextureLoader();
    const textureMetal = loader.load('./img/metal.jpg');
    const textureBase = loader.load('./img/dirt.jpg');
    const textureWood = loader.load('./img/wood_2.jpg');
    const textureWood2 = loader.load('./img/wood.jpg');
    const textureGrass = loader.load('./img/grass_night.jpg');

    const mat = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: textureMetal }), 0, 0);
    const matBase = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: textureBase }), 0, 0);
    const matWood = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: textureWood }), 50, 0);
    const matWood2 = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: textureWood2 }), 50, 0);
    const matGrass = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: textureGrass }), 50, 0);

    const floor = new Physijs.BoxMesh(new Three.BoxGeometry(200, 0.0, 200, 1, 1, 1), matWood2, 0);
    floor.applyMatrix(new Three.Matrix4().makeTranslation(0, 0, 0));
    floor.receiveShadow = true;
    floor.autoUpdateMatrix = false;
    this.map.push(floor);
    ++this.map_size;

    const enemies2 = new Physijs.BoxMesh(new Three.BoxGeometry(210, 4, 400, 1, 1, 1), matGrass, 0);
    enemies2.applyMatrix(new Three.Matrix4().makeTranslation(0, 0, -300));
    enemies2.receiveShadow = true;
    enemies2.autoUpdateMatrix = false;
    this.map.push(enemies2);
    ++this.map_size;

    const bullets3 = new Physijs.BoxMesh(new Three.BoxGeometry(50, 0.0, 50, 1, 1, 1), mat, 0);
    bullets3.applyMatrix(new Three.Matrix4().makeTranslation(0, -10, 0));
    bullets3.receiveShadow = false;
    bullets3.autoUpdateMatrix = false;
    this.map.push(bullets3);
    ++this.map_size;

    const fenceS4 = new Physijs.BoxMesh(new Three.BoxGeometry(220, 50, 20, 1, 1, 1), matWood, 0);
    fenceS4.applyMatrix(new Three.Matrix4().makeTranslation(0, 2.5, 100));
    fenceS4.receiveShadow = true;
    fenceS4.autoUpdateMatrix = false;
    this.map.push(fenceS4);
    ++this.map_size;

    const fenceE5 = new Physijs.BoxMesh(new Three.BoxGeometry(20, 50, 200, 1, 1, 1), matWood, 0);
    fenceE5.applyMatrix(new Three.Matrix4().makeTranslation(100, 2.5, 0));
    fenceE5.receiveShadow = true;
    fenceE5.autoUpdateMatrix = false;
    this.map.push(fenceE5);
    ++this.map_size;

    const fenceW6 = new Physijs.BoxMesh(new Three.BoxGeometry(20, 50, 200, 1, 1, 1), matWood, 0);
    fenceW6.applyMatrix(new Three.Matrix4().makeTranslation(-100, 2.5, 0));
    fenceW6.receiveShadow = true;
    fenceW6.autoUpdateMatrix = false;
    this.map.push(fenceW6);
    ++this.map_size;

    const fenceN7 = new Physijs.BoxMesh(new Three.BoxGeometry(220, 4, 8, 1, 1, 1), matWood, 0);
    fenceN7.applyMatrix(new Three.Matrix4().makeTranslation(0, 2.5, -96));
    fenceN7.receiveShadow = true;
    fenceN7.autoUpdateMatrix = false;
    this.map.push(fenceN7);
    ++this.map_size;

    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].forEach((_, i, arr) => {
      const fenceV = new Physijs.BoxMesh(new Three.BoxGeometry(3, 46, 6, 1, 1, 1), matWood, 0);
      fenceV.applyMatrix(new Three.Matrix4().makeTranslation(i * (200 / arr.length) - 100, 2.5, -96));
      fenceV.receiveShadow = true;
      fenceV.autoUpdateMatrix = false;
      this.map.push(fenceV);
      ++this.map_size;
    })

    const ceil = new Physijs.BoxMesh(new Three.BoxGeometry(400, 4, 400, 1, 1, 1), matWood, 0);
    ceil.applyMatrix(new Three.Matrix4().makeTranslation(0, 30, 50));
    ceil.receiveShadow = true;
    ceil.autoUpdateMatrix = false;
    this.map.push(ceil);
    ++this.map_size;

    const mountain = new Physijs.CylinderMesh(new Three.CylinderGeometry(50, 500, 50, 10, 10), matBase, 0);
    mountain.applyMatrix(new Three.Matrix4().makeTranslation(0, -40, -50));
    mountain.receiveShadow = true;
    mountain.autoUpdateMatrix = false;
    this.map.push(mountain);
    ++this.map_size;

    const ambientLight = new Three.AmbientLight(0x2f2b38, 1);
    this.map.push(ambientLight);
    ++this.map_size;

    const skybox = new Skybox(SCENES.NIGHT);
    this.map.push(skybox);
    ++this.map_size;

    return this;
  },
  [SCENES.FOG]: function() {
    this.map_size = 0;
    this.map = [];

    const loader = new Three.TextureLoader();
    const textureMetal = loader.load('./img/metal.jpg');
    const textureBase = loader.load('./img/dirt.jpg');

    const mat = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: textureMetal }), 0, 0);
    const matBase = Physijs.createMaterial(new Three.MeshPhongMaterial({ map: textureBase }), 0, 0);

    const start1 = new Physijs.BoxMesh(new Three.BoxGeometry(200, 0.0, 200, 1, 1, 1), mat, 0);
    start1.applyMatrix(new Three.Matrix4().makeTranslation(0, 0, 0));
    start1.receiveShadow = true;
    start1.autoUpdateMatrix = false;
    this.map.push(start1);
    ++this.map_size;

    const enemies2 = new Physijs.BoxMesh(new Three.BoxGeometry(210, 4, 400, 1, 1, 1), mat, 0);
    enemies2.applyMatrix(new Three.Matrix4().makeTranslation(0, 0, -300));
    enemies2.receiveShadow = true;
    enemies2.autoUpdateMatrix = false;
    this.map.push(enemies2);
    ++this.map_size;

    const bullets3 = new Physijs.BoxMesh(new Three.BoxGeometry(50, 0.0, 50, 1, 1, 1), mat, 0);
    bullets3.applyMatrix(new Three.Matrix4().makeTranslation(0, -10, 0));
    bullets3.receiveShadow = false;
    bullets3.autoUpdateMatrix = false;
    this.map.push(bullets3);
    ++this.map_size;

    const fenceS4 = new Physijs.BoxMesh(new Three.BoxGeometry(220, 8, 20, 1, 1, 1), mat, 0);
    fenceS4.applyMatrix(new Three.Matrix4().makeTranslation(0, 2.5, 20));
    fenceS4.receiveShadow = true;
    fenceS4.autoUpdateMatrix = false;
    this.map.push(fenceS4);
    ++this.map_size;

    const fenceE5 = new Physijs.BoxMesh(new Three.BoxGeometry(20, 8, 200, 1, 1, 1), mat, 0);
    fenceE5.applyMatrix(new Three.Matrix4().makeTranslation(100, 2.5, 0));
    fenceE5.receiveShadow = true;
    fenceE5.autoUpdateMatrix = false;
    this.map.push(fenceE5);
    ++this.map_size;

    const fenceW6 = new Physijs.BoxMesh(new Three.BoxGeometry(20, 8, 200, 1, 1, 1), mat, 0);
    fenceW6.applyMatrix(new Three.Matrix4().makeTranslation(-100, 2.5, 0));
    fenceW6.receiveShadow = true;
    fenceW6.autoUpdateMatrix = false;
    this.map.push(fenceW6);
    ++this.map_size;

    const fenceN7 = new Physijs.BoxMesh(new Three.BoxGeometry(220, 4, 8, 1, 1, 1), mat, 0);
    fenceN7.applyMatrix(new Three.Matrix4().makeTranslation(0, 2.5, -96));
    fenceN7.receiveShadow = true;
    fenceN7.autoUpdateMatrix = false;
    this.map.push(fenceN7);
    ++this.map_size;

    const mountain = new Physijs.CylinderMesh(new Three.CylinderGeometry(50, 500, 50, 10, 10), matBase, 0);
    mountain.applyMatrix(new Three.Matrix4().makeTranslation(0, -40, -50));
    mountain.receiveShadow = true;
    mountain.autoUpdateMatrix = false;
    this.map.push(mountain);
    ++this.map_size;

    const ambientLight = new Three.AmbientLight(0xccddee, 0.35);
    this.map.push(ambientLight);
    ++this.map_size;

    const spotLight = new Three.SpotLight(0xffffff);
    spotLight.position.set(0, 500, 1000);
    spotLight.intensity = 1;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    this.map.push(spotLight);
    ++this.map_size;

    const skybox = new Skybox(SCENES.FOG);
    this.map.push(skybox);
    ++this.map_size;

    return this;
  }
}

class Map {
  constructor(sceneName) {
    MAPS[sceneName].call(this);
  }

  getMap(i) {
    return this.map[i];
  }

  getMapSize() {
    return this.map_size;
  }
}

export default Map;
