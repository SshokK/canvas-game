import { HUD_AMMO_ELEMENT_ID, HUD_LEVEL_ELEMENT_ID, HUD_SCORE_ELEMENT_ID } from '../Game/Game';

let stateInstance = null;

const INITIAL_STATE = {
  DOM_ELEMENTS: {
    BLOCKER: null,
    MAIN: null,
    STATS: null,
    MESSAGES: null,
    INSTRUCTIONS: null,
    TITLE: null,
    WEBGL: null
  },
  CONTROLS: null,
  ENABLE_CONTROLS: false,
  CONTROLS_ENABLED: false,
  MOVE_FORWARD: false,
  MOVE_BACKWARD: false,
  MOVE_LEFT: false,
  MOVE_RIGHT: false,
  IS_JUMPING: false,
  IS_SHOOTING: false,
  LEVEL: 1,
  MAX_BULLETS: 20,
  ACTUAL_AMMO: 40,
  SCORE: 0,
  LAST_SCORE: 0
};

class State {
  elements = {
    blockerDOMElement: INITIAL_STATE.DOM_ELEMENTS.BLOCKER,
    mainDOMElement: INITIAL_STATE.DOM_ELEMENTS.MAIN,
    statsDOMElement: INITIAL_STATE.DOM_ELEMENTS.STATS,
    messagesDOMElement: INITIAL_STATE.DOM_ELEMENTS.MESSAGES,
    instructionsDOMElement: INITIAL_STATE.DOM_ELEMENTS.INSTRUCTIONS,
    titleDOMElement: INITIAL_STATE.DOM_ELEMENTS.TITLE,
    webGLOutputElement: INITIAL_STATE.DOM_ELEMENTS.WEBGL
  };
  controls = INITIAL_STATE.CONTROLS;
  enableControls = INITIAL_STATE.ENABLE_CONTROLS;
  controlsEnabled = INITIAL_STATE.CONTROLS_ENABLED;
  moveForward = INITIAL_STATE.MOVE_FORWARD;
  moveBackward = INITIAL_STATE.MOVE_BACKWARD;
  moveLeft = INITIAL_STATE.MOVE_LEFT;
  moveRight = INITIAL_STATE.MOVE_RIGHT;
  isJumping = INITIAL_STATE.IS_JUMPING;
  isShooting = INITIAL_STATE.IS_SHOOTING;

  level = INITIAL_STATE.LEVEL;
  maxBullets = INITIAL_STATE.MAX_BULLETS;
  actualAmmo = INITIAL_STATE.ACTUAL_AMMO;
  score = INITIAL_STATE.SCORE;
  lastScore = INITIAL_STATE.LAST_SCORE;

  constructor(params) {
    if (!stateInstance) {
      this.elements = params.elements;
      stateInstance = this;
    }
    return stateInstance;
  }

  updateHUD = (score) => {
    const state = new State();
    const ammoElement = document.getElementById(HUD_AMMO_ELEMENT_ID);
    ammoElement.innerHTML = 'Ammunition: ' + state.actualAmmo;

    const newScore = score === undefined ? state.score : score;
    const scoreElement = document.getElementById(HUD_SCORE_ELEMENT_ID);
    scoreElement.innerHTML = 'Score: ' + newScore;

    const levelElement = document.getElementById(HUD_LEVEL_ELEMENT_ID);
    levelElement.innerHTML = 'Level: ' + state.level;
  }
}

export default State;
