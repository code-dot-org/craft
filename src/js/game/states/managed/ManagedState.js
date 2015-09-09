import State from "./../State";

/**
 * A state that retains a reference to its manager, making it
 * possible to transition to other states.
 */
export default class ManagedState extends State {
  constructor(...everything) {
    super(...everything);
    this.stateManager = null;
    this.stateID = null;
  }

  setManager(manager, stateID) {
    this.stateManager = manager;
    this.stateID = stateID;
  }

  timeEnter() {
    this.enterTime = new Date();
    console.log(`State ${this.stateID} entered`);
  }

  timeExit() {
    console.log(`State ${this.stateID} time elapsed: ${new Date() - this.enterTime} ms`);
  }

  onStatesInitialized() {
  }
}
