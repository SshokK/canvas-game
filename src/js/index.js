import React from 'react';
import { render } from 'react-dom';
import Game from './Game/Game';
import State from './State/State';
import './index.css';

const STATS_OUTPUT_ELEMENT_ID = 'stats';
const MESSAGES_ELEMENT_ID = 'messages';
const BLOCKER_ELEMENT_ID = 'blocker';
const INSTRUCTION_ELEMENT_ID = 'instructions';
const TITLE_ELEMENT_ID = 'title';
const WEBGL_OUTPUT_ELEMENT_ID = 'WebGL';

class App extends React.Component {
  componentDidMount = () => {
    new State({
      elements: {
        mainDOMElement: document.body,
        statsDOMElement: document.getElementById(STATS_OUTPUT_ELEMENT_ID),
        messagesDOMElement: document.getElementById(MESSAGES_ELEMENT_ID),
        instructionsDOMElement: document.getElementById(INSTRUCTION_ELEMENT_ID),
        titleDOMElement: document.getElementById(TITLE_ELEMENT_ID),
        webGLOutputElement: document.getElementById(WEBGL_OUTPUT_ELEMENT_ID),
        blockerDOMElement: document.getElementById(BLOCKER_ELEMENT_ID)
      }
    });
    new Game();
  };

  render() {
    return (
      <>
        <div id={BLOCKER_ELEMENT_ID}>
          <div id={INSTRUCTION_ELEMENT_ID}>
            <span id={TITLE_ELEMENT_ID} style={{ fontSize: '50px' }}>
              Click to start
            </span>
            <br />
            If you run out of bullets, the game ends
            <br />
            W, A, S, D = Move
            <br />
            Space = Skip
            <br />
            Wheel / Q = Change Weapon
            <br />
            Click Left = Shoot
            <br />
            Move Mouse = Look
            <br />
            Esc = Pause
          </div>
        </div>
        <div id={STATS_OUTPUT_ELEMENT_ID} />
        <div id={INSTRUCTION_ELEMENT_ID} className={'game__instructions'} />
        <div id={WEBGL_OUTPUT_ELEMENT_ID} />
      </>
    );
  }
}

render(<App />, document.getElementById('root'));
