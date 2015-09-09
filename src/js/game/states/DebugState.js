import GameState from "./GameState";

export default class DebugState extends GameState {
  onEnter() {
    this.timeEnter();
  }

  render() {
    this.phaserApp.game.debug.text(`Current state: ${this.name}`, 2, 14, "#00ff00");
  }

  onExit() {
    this.timeExit();
  }
}


