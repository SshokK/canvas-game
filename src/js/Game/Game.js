import * as dat from 'dat.gui';
import * as Three from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import Scene from '../Scene/Scene';
import State from '../State/State';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const POINTER_LOCK_PROPERTIES = ['pointerLockElement', 'mozPointerLockElement', 'webkitPointerLockElement'];

class Game {
  renderer = null;
  camera = null;
  controls = null;
  stats = null;
  scene = null;



  constructor() {
    const state = new State();

    if (this.doesDocumentHasPointerLock()) {
      this.setPointerLockEvents();
    } else {
      this.setInstructions('Your browser doesn\'t seem to support Pointer Lock API');
    }
    this.setWindowEventListeners();

    this.camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = this.createRenderer();
    state.elements.webGLOutputElement.append(this.renderer.domElement);

    // Create a scene, that will hold all our elements such as objects, cameras and lights.
    this.scene = new Scene(this.renderer.domElement, this.camera);
    state.controls = new PointerLockControls(this.camera);
    this.scene.add(state.controls.getObject());

    this.createGUI(true);
    this.render();
  }

  /**
   * Creates GUI
   *
   * @param {boolean} withStats - Flag to show stats or not
   */
  createGUI = (withStats) => {
    const GUI = new dat.GUI();

    if (withStats) {
      this.stats = this.initStats();
    }
  };

  /**
   * @return Stats
   */
  initStats = () => {
    const state = new State();
    const stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    state.elements.statsDOMElement.append(stats.domElement);

    return stats;
  };

  /**
   * @param {string} message - The message
   */
  setInstructions = (message) => {
    const state = new State();

    state.elements.instructionsDOMElement.innerHTML = message;
  };

  /**
   * @param {string} message - The message
   */
  setMessage = (message) => {
    const state = new State();

    state.elements.messagesDOMElement.innerHTML = `<h2>${message}</h2>}`;
  };

  /**
   * @param {object} event - Mouse event
   */
  handleMouseDown = (event) => {
    const state = new State();

    if (state.enableControls) {
      if (event.buttons === 1 && state.elements.blockerDOMElement.style.display === 'none') {
        this.scene.shoot();
        state.shooting = true;
      }
    }
  };

  /**
   * @param {Event} event - Key event
   */
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

  /**
   * @param {Event} event - Key event
   */
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

  /**
   * @param {object} event - Mouse wheel event
   */
  handleMouseWheel = (event) => {
    const state = new State();

    if (state.enableControls) {
      if (!state.shooting) scene.changeWeapon();
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

  /**
   * Renders every frame
   */
  render = () => {
    requestAnimationFrame(this.render);

    this.stats.update();
    this.scene.animate();
    this.renderer.render(this.scene, this.scene.getCamera());
    this.scene.simulate();
  };

  /**
   * @return {boolean}
   */
  doesDocumentHasPointerLock = () => {
    return POINTER_LOCK_PROPERTIES.some((lockProperty) => lockProperty in document);
  };

  /**
   * @param {Element} HTMLElement - HTML element
   *
   * @return {boolean}
   */
  isPointerLockIsTheSameElement = (HTMLElement) => {
    return POINTER_LOCK_PROPERTIES.some((lockProperty) => document[lockProperty] === HTMLElement);
  };

  /**
   * @param {Event} event - Pointer lock change event
   */
  handlePointerLockChange = (event) => {
    const state = new State();

    if (this.isPointerLockIsTheSameElement(state.elements.mainDOMElement)) {
      state.controlsEnabled = true;
      state.controls.enabled = true;
      state.enableControls = true;
      state.elements.blockerDOMElement.style.display = 'none'
    } else {
      state.elements.blockerDOMElement.style.display = 'block'
      state.elements.instructionsDOMElement.style.display = '';
      state.elements.instructionsDOMElement.style.fontSize = '50px';
      state.elements.instructionsDOMElement.innerHTML = 'Pause';

      state.enableControls = false;
      state.controls.enabled = false;
    }
  };

  /**
   * @param {Event} event - Pointer lock error event
   */
  handlePointerLockError = (event) => {
    const state = new State();

    state.elements.instructionsDOMElement.style.display = '';
  };

  /**
   * @param {Event} event - Pointer lock error event
   */
  handleInstructionsClick = (event) => {
    const state = new State();

    state.elements.instructionsDOMElement.style.display = 'none';

    // Ask the browser to lock the pointer
    state.elements.mainDOMElement.requestPointerLock =
      state.elements.mainDOMElement.requestPointerLock ||
      state.elements.mainDOMElement.mozRequestPointerLock ||
      state.elements.mainDOMElement.webkitRequestPointerLock;
    state.elements.mainDOMElement.requestPointerLock();
  };

  setPointerLockEvents = () => {
    const state = new State();

    document.addEventListener('pointerlockchange', this.handlePointerLockChange, false);
    document.addEventListener('mozpointerlockchange', this.handlePointerLockChange, false);
    document.addEventListener('webkitpointerlockchange', this.handlePointerLockChange, false);

    document.addEventListener('pointerlockerror', this.handlePointerLockError, false);
    document.addEventListener('mozpointerlockerror', this.handlePointerLockError, false);
    document.addEventListener('webkitpointerlockerror', this.handlePointerLockError, false);

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
}

export default Game;
