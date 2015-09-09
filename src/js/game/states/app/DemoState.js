import GameState from "../GameState";
import DemoPhaserState from "./DemoPhaserState";

/**
 * Resets game board to match original levelConfig.
 */
export default class DemoState extends GameState {
  onStatesInitialized() {
    this.game.state.add('Demo', new DemoPhaserState());
  }

  onEnter() {
    this.timeEnter();
    this.game.state.start("Demo");
  }

  onExit() {
    this.game.state.start("default");
    this.timeExit();
  }
}
