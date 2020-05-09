import * as Three from 'three';
import { SCENES } from '../LevelManager/LevelManager';

const getSkybox = (name) => [
  `./img/skyboxes/${name}/ft.JPG`,
  `./img/skyboxes/${name}/bk.JPG`,
  `./img/skyboxes/${name}/up.JPG`,
  `./img/skyboxes/${name}/dn.JPG`,
  `./img/skyboxes/${name}/rt.JPG`,
  `./img/skyboxes/${name}/lf.JPG`
];

class Skybox extends Three.Object3D {
  constructor(name = SCENES.DAY) {
    super();

    this.lenghtxz = 1000;
    this.heighty = 500;
    this.skybox = null;

    const geometry = new Three.BoxGeometry(this.lenghtxz, this.heighty, this.lenghtxz);

    const loader = new Three.TextureLoader();

    const material = getSkybox(name).map(
      (imagePath) => new Three.MeshBasicMaterial({ map: loader.load(imagePath), side: Three.BackSide })
    );

    this.skybox = new Three.Mesh(geometry, material);

    this.skybox.applyMatrix(new Three.Matrix4().makeTranslation(0, 0, 0));

    this.add(this.skybox);
  }
}

export default Skybox;
