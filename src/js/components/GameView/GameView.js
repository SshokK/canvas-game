import React from 'react';
import Game from '../../Game/Game';
import State from '../../State/State';
import './index.scss';

const STATS_OUTPUT_ELEMENT_ID = 'stats';
const MESSAGES_ELEMENT_ID = 'messages';
const BLOCKER_ELEMENT_ID = 'blocker';
const INSTRUCTION_ELEMENT_ID = 'instructions';
const TITLE_ELEMENT_ID = 'title';
const WEBGL_OUTPUT_ELEMENT_ID = 'WebGL';
const START_BUTTON_ID = 'start'

class GameView extends React.Component {
  state = {
    isControlsListOpen: false
  };

  componentDidMount = () => {
    document.addEventListener('keydown', this.handleKeyDown);
    new State({
      elements: {
        mainDOMElement: document.body,
        statsDOMElement: document.getElementById(STATS_OUTPUT_ELEMENT_ID),
        messagesDOMElement: document.getElementById(MESSAGES_ELEMENT_ID),
        instructionsDOMElement: document.getElementById(INSTRUCTION_ELEMENT_ID),
        startButtonDOMElement: document.getElementById(START_BUTTON_ID),
        titleDOMElement: document.getElementById(TITLE_ELEMENT_ID),
        webGLOutputElement: document.getElementById(WEBGL_OUTPUT_ELEMENT_ID),
        blockerDOMElement: document.getElementById(BLOCKER_ELEMENT_ID)
      },
      updateScoreInReact: () => {}
    });
    this.game = new Game();
  };

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if (e.key === 'b') {
      this.game.stopRender();
      const state = new State();
      this.props.signOut(state);
      state.setInitialState();
    }
  }

  render() {
    return (
      <>
        <div id={BLOCKER_ELEMENT_ID}>
          <div id={INSTRUCTION_ELEMENT_ID} className={'game__instructions'}>
            <div className={'game__instructions__rows_wrapper'}>
              <div className={'game__instructions__row_warning'}>If you run out of bullets, the game ends</div>
              <div className={'game__instructions__row'}>W, A, S, D = Move</div>
              <div className={'game__instructions__row'}>Space = Skip</div>
              <div className={'game__instructions__row'}>Wheel / Q = Change Weapon</div>
              <div className={'game__instructions__row'}>Click Left = Shoot</div>
              <div className={'game__instructions__row'}>Move Mouse = Look</div>
              <div className={'game__instructions__row'}>Esc = Pause</div>
              <div className={'game__instructions__row'}>B = Sign out</div>
            </div>
            <div className={'game__instructions__start_caption'}>
              Click on a screen to start
            </div>
          </div>
        </div>
        <div id={MESSAGES_ELEMENT_ID} />
        <div id={STATS_OUTPUT_ELEMENT_ID} />
        <div id={WEBGL_OUTPUT_ELEMENT_ID} />
      </>
    );
  }
}

export default GameView
