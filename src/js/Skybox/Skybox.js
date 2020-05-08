import * as Three from 'three';

const getSkybox = (level) => [
  `./imgs/skyboxes/${level}/ft.JPG`,
  `./imgs/skyboxes/${level}/bk.JPG`,
  `./imgs/skyboxes/${level}/up.JPG`,
  `./imgs/skyboxes/${level}/dn.JPG`,
  `./imgs/skyboxes/${level}/rt.JPG`,
  `./imgs/skyboxes/${level}/lf.JPG`
];

class Skybox extends Three.Object3D {
  constructor() {
    super();

    this.lenghtxz = 1000;
    this.heighty = 500;

    this.skybox = null;

    const geometry = new Three.BoxGeometry(this.lenghtxz, this.heighty, this.lenghtxz);

    const loader = new Three.TextureLoader();

    const material = getSkybox('day').map(
      (imagePath) => new Three.MeshBasicMaterial({ map: loader.load(imagePath), side: Three.BackSide })
    );

    console.log(material)

    this.skybox = new Three.Mesh(geometry, material);

    this.skybox.applyMatrix(new Three.Matrix4().makeTranslation(0, 0, 0));

    this.add(this.skybox);
  }
}

export default Skybox;
