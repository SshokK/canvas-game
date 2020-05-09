import * as Three from 'three';
import State from '../State/State';
import Scene from '../Scene/Scene';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

const CAMERA_FOV = 45;
const CAMERA_ASPECT = window.innerWidth / window.innerHeight;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;

const RENDERER_CLEAR_COLOR = 0xeeeeee;
const RENDERER_ALPHA = 1.0;
const RENDERER_PIXEL_RATIO = window.devicePixelRatio;
const RENDERER_WIDTH = window.innerWidth;
const RENDERER_HEIGHT = window.innerHeight;

export const SCENES = {
  DAY: 'day',
  NIGHT: 'night',
  FOG: 'fog'
};
const getScenesMap = (camera) => ({
  [SCENES.DAY]: new Scene(SCENES.DAY, camera),
  [SCENES.NIGHT]: new Scene(SCENES.NIGHT, camera),
  [SCENES.FOG]: new Scene(SCENES.FOG, camera)
});
const SCENES_MAP = [
  {
    1: SCENES.DAY,
    2: SCENES.DAY,
    3: SCENES.NIGHT,
    4: SCENES.NIGHT,
    5: SCENES.FOG,
    6: SCENES.FOG,
    7: SCENES.FOG
  }
];
const DEFAULT_SCENE = SCENES.DAY;

class LevelManager {
  constructor(rendererContainer) {
    const state = new State();

    this.camera = new Three.PerspectiveCamera(CAMERA_FOV, CAMERA_ASPECT, CAMERA_NEAR, CAMERA_FAR);
    this.renderer = this.createRenderer();

    rendererContainer.append(this.renderer.domElement);

    state.controls = new PointerLockControls(this.camera);

    this.scenes = getScenesMap(this.camera);

    this.currentScene = new Scene(SCENES.DAY, this.camera);
    this.currentScene.add(state.controls.getObject());

    this.render();
  }

  changeScene = (sceneName) => {
    const state = new State();

    this.currentScene = this.scenes[sceneName];
    this.currentScene.add(state.controls.getObject());
  };

  createRenderer = () => {
    const renderer = new Three.WebGLRenderer();

    renderer.setClearColor(new Three.Color(RENDERER_CLEAR_COLOR), RENDERER_ALPHA);
    renderer.setPixelRatio(RENDERER_PIXEL_RATIO);
    renderer.setSize(RENDERER_WIDTH, RENDERER_HEIGHT);
    renderer.shadowMap.enabled = true;

    return renderer;
  };

  resizeRenderer = () => {
    // TODO Rework. Constants are useless
    this.currentScene.setCameraAspect(RENDERER_PIXEL_RATIO);
    this.renderer.setSize(RENDERER_WIDTH, RENDERER_HEIGHT);
  };

  render = () => {
    window.requestAnimationFrame(this.render);

    this.currentScene.animate();
    this.renderer.render(this.currentScene, this.currentScene.getCamera());
    this.currentScene.simulate();
  };
}

export default LevelManager;
