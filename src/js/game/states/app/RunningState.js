import GameState from "../GameState";
import AppStates from "./AppStates";
import $ from "jquery";

/**
 * Waits for the user to run the game.
 */
export default class RunningState extends GameState {
  onStatesInitialized() {
    this.$resetButton = $('#resetButton');
  }

  render() {
    this.game.debug.text("Game running!", 2, 28, "#00ff00");
  }

  onEnter() {
    this.timeEnter();
    this.$resetButton.show();
    this.$resetButton.click(() => {
      this.stateManager.enterState(AppStates.RESETTING);
    });
  }

  onExit() {
    this.timeExit();
    this.$resetButton.off('click');
    this.$resetButton.hide();
  }
}
