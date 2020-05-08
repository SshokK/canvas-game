let stateInstance = null;

class State {
  elements = {
    blockerDOMElement: null,
    mainDOMElement: null,
    statsDOMElement: null,
    messagesDOMElement: null,
    instructionsDOMElement: null,
    titleDOMElement: null,
    webGLOutputElement: null
  };
  controls = null;
  enableControls = true;
  controlsEnabled = false;
  moveForward = false;
  moveBackward = false;
  moveLeft = false;
  moveRight = false;
  jumping = false;
  shooting = false;

  constructor(params) {
    if (!stateInstance) {
      this.elements = params.elements;
      stateInstance = this;
    }
    return stateInstance;
  }
}

export default State;
