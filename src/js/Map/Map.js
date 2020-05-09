import * as Three from 'three';
import * as Physijs from 'physijs-webpack';

class Map {
  constructor() {
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
    fenceS4.applyMatrix(new Three.Matrix4().makeTranslation(0, 2.5, 100));
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

    return this;
  }

  getMap(i) {
    return this.map[i];
  }

  getMapSize() {
    return this.map_size;
  }
}

export default Map;
