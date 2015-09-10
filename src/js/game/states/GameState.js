import State from "./State";
import ManagedState from "./managed/ManagedState";

export default class GameState extends ManagedState {
  constructor(phaserApp, ...everything) {
    super(...everything);
    this.phaserApp = phaserApp;
    this.game = phaserApp.game;
  }

  update() {
  }

  render() {
  }
}
