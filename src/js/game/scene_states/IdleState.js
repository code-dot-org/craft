import Phaser from 'Phaser';
import States from './States';
import PhaserAppState from './PhaserAppState';

/**
 * Sets Run button to visible and waits for press.
 */
class IdleState extends PhaserAppState {
  create() {
    console.log("Creating idle stte");

    window.goToPlayback = function () {
      this.game.state.start(States.PLAYBACK)
    }.bind(this);
  }
}

export default IdleState;
