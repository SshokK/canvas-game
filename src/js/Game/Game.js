import * as Three from 'three';
import Scene from '../Scene/Scene';
import State from '../State/State';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const POINTER_LOCK_PROPERTIES = ['pointerLockElement', 'mozPointerLockElement', 'webkitPointerLockElement'];
export const HUD_AMMO_ELEMENT_ID = 'ammo';
export const HUD_SCORE_ELEMENT_ID = 'score';
export const HUD_LEVEL_ELEMENT_ID = 'level';

class Game {
  constructor() {
    const state = new State();

    if (this.doesDocumentHasPointerLock()) {
      this.setPointerLockEvents();
    } else {
      this.setInstructions('Your browser doesn\'t seem to support Pointer Lock API');
    }
    this.setWindowEventListeners();
    this.createHUD();

    this.camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = this.createRenderer();
    state.elements.webGLOutputElement.append(this.renderer.domElement);

    // Create a scene, that will hold all our elements such as objects, cameras and lights.
    this.scene = new Scene(this.renderer.domElement, this.camera);
    state.controls = new PointerLockControls(this.camera);
    this.scene.add(state.controls.getObject());

    this.render();
  }

  setInstructions = (message) => {
    const state = new State();

    state.elements.instructionsDOMElement.innerHTML = message;
  };

  handleMouseDown = (event) => {
    const state = new State();

    if (state.enableControls) {
      if (event.buttons === 1 && state.elements.blockerDOMElement.style.display === 'none') {
        this.scene.shoot();
        state.shooting = true;
      }
    }
  };

  handleKeyDown = (event) => {
    const state = new State();

    if (state.enableControls) {
      if ([38, 87].includes(event.keyCode)) {
        state.moveForward = true;
      }

      if ([37, 65].includes(event.keyCode)) {
        state.moveLeft = true;
      }

      if ([40, 83].includes(event.keyCode)) {
        state.moveBackward = true;
      }

      if ([39, 68].includes(event.keyCode)) {
        state.moveRight = true;
      }

      if ([32].includes(event.keyCode)) {
        state.jumping = true;
      }

      if ([81].includes(event.keyCode)) {
        if (!state.shooting) {
          this.scene.changeWeapon();
        }
      }
    } else {
      if ([80].includes(event.keyCode)) {
        this.scene.newGame();
      }
    }
  };

  handleKeyUp = (event) => {
    const state = new State();

    if (state.enableControls) {
      if ([38, 87].includes(event.keyCode)) {
        state.moveForward = false;
      }

      if ([37, 65].includes(event.keyCode)) {
        state.moveLeft = false;
      }

      if ([40, 83].includes(event.keyCode)) {
        state.moveBackward = false;
      }

      if ([39, 68].includes(event.keyCode)) {
        state.moveRight = false;
      }
    }
  };

  handleMouseWheel = () => {
    const state = new State();

    if (state.enableControls) {
      if (!state.shooting) this.scene.changeWeapon();
    }
  };

  handleWindowResize = () => {
    this.scene.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  /**
   * @return {WebGLRenderer} - The renderer
   */
  createRenderer = () => {
    const renderer = new Three.WebGLRenderer();
    renderer.setClearColor(new Three.Color(0xeeeeee), 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    return renderer;
  };

  render = () => {
    this.requestId = requestAnimationFrame(this.render);

    this.scene.animate();
    this.renderer.render(this.scene, this.scene.getCamera());
  };

  stopRender = () => {
    const state = new State();

    cancelAnimationFrame(this.requestId);

    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('mousedown', this.handleMouseDown, true);
    window.removeEventListener('keydown', this.handleKeyDown, true);
    window.removeEventListener('keyup', this.handleKeyUp, true);
    window.removeEventListener('mousewheel', this.handleMouseDown, true); // For Chrome and others
    window.removeEventListener('DOMMouseScroll', this.handleMouseWheel, true);

    document.removeEventListener('pointerlockchange', this.handlePointerLockChange, false);
    document.removeEventListener('pointerlockerror', this.handlePointerLockError, false);

    document.exitPointerLock();
  }

  doesDocumentHasPointerLock = () => {
    return POINTER_LOCK_PROPERTIES.some((lockProperty) => lockProperty in document);
  };

  isPointerLockIsTheSameElement = (HTMLElement) => {
    return POINTER_LOCK_PROPERTIES.some((lockProperty) => document[lockProperty] === HTMLElement);
  };

  handlePointerLockChange = () => {
    const state = new State();

    if (this.isPointerLockIsTheSameElement(state.elements.mainDOMElement)) {
      state.controlsEnabled = true;
      state.controls.enabled = true;
      state.enableControls = true;
      state.elements.blockerDOMElement.style.display = 'none';
    } else {
      state.elements.blockerDOMElement.style.display = 'block';
      state.elements.instructionsDOMElement.style.display = '';
      state.elements.instructionsDOMElement.style.fontSize = '50px';
      state.elements.instructionsDOMElement.innerHTML = 'Pause';

      state.enableControls = false;
      state.controls.enabled = false;
    }
  };

  handlePointerLockError = () => {
    const state = new State();

    state.elements.instructionsDOMElement.style.display = '';
  };

  handleInstructionsClick = () => {
    const state = new State();

    state.elements.instructionsDOMElement.style.display = 'none';
    state.elements.mainDOMElement.requestPointerLock();
  };

  setPointerLockEvents = () => {
    const state = new State();

    document.addEventListener('pointerlockchange', this.handlePointerLockChange, false);
    document.addEventListener('pointerlockerror', this.handlePointerLockError, false);

    state.elements.instructionsDOMElement.addEventListener('click', this.handleInstructionsClick, false);
  };

  setWindowEventListeners = () => {
    window.addEventListener('resize', this.handleWindowResize);
    window.addEventListener('mousedown', this.handleMouseDown, true);
    window.addEventListener('keydown', this.handleKeyDown, true);
    window.addEventListener('keyup', this.handleKeyUp, true);
    window.addEventListener('mousewheel', this.handleMouseDown, true); // For Chrome and others
    window.addEventListener('DOMMouseScroll', this.handleMouseWheel, true); // For Firefox
  };

  createHUD() {
    const state = new State();

    this.createHudDOMElement(HUD_SCORE_ELEMENT_ID, 'Score', state.score, 50);
    this.createHudDOMElement(HUD_AMMO_ELEMENT_ID, 'Ammunition', state.actualAmmo, 100);
    this.createHudDOMElement(HUD_LEVEL_ELEMENT_ID, 'Level', state.level, 150);
  }

  createHudDOMElement = (id, label, value, offsetY = 50) => {
    const el = document.createElement('div');
    el.id = id;
    el.style.position = 'absolute';
    el.style.width = 1;
    el.style.height = 1;
    el.innerHTML = `${label}: ${value}`;
    el.style.top = offsetY + 'px';
    el.style.left = 50 + 'px';
    el.style.fontSize = 20 + 'px';
    el.style.color = 'white';
    document.body.appendChild(el);
  };
}

export default Game;
