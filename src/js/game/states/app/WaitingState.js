import GameState from "../GameState";
import AppStates from "./AppStates";
import $ from "jquery";

/**
 * Waits for the user to run the game.
 */
export default class WaitingState extends GameState {
  constructor(...rest) {
    super(...rest);

  }

  onStatesInitialized() {
    this.$runButton = $('#runButton');
  }

  render() {
    this.game.debug.text("Game loaded, waiting for run button press.",
        2, 28, "#00ff00");
  }

  onEnter() {
    this.timeEnter();
    // Show run button
    this.$runButton.show();
    this.$runButton.click(() => {
      this.stateManager.enterState(AppStates.RUNNING);
    });
  }

  onExit() {
    this.timeExit();
    this.$runButton.off('click');
    this.$runButton.hide();
  }
}
