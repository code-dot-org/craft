import GameState from "./GameState";

export default class DebugState extends GameState {
  constructor(phaserApp, name, ...everything) {
    super(phaserApp, ...everything);
    this.name = name;
    this.phaserApp = phaserApp;
  }

  onEnter() {
    console.log(`Entering state ${this.name}`);
  }

  update() {

  }

  render() {
    this.phaserApp.game.debug.text(`Current state: ${this.name}`, 2, 14, "#00ff00");
  }

  onExit() {

    console.log(`Exiting state ${this.name}`);
  }
}


