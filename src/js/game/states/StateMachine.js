/**
 * Tracks a current state and calls enter/exit on transitions.
 *
 * Gives states a reference to itself for transitions.
 */
export default class StateMachine {
  /**
   * @param {Map.<String, State>} stateIdsToStates
   */
  constructor(stateIdsToStates = new Map()) {
    /**
     * @property {Map.<String, State>}
     */
    this.states = stateIdsToStates;

    /**
     * @property {State}
     */
    this.currentState = null;
  }

  enterState(stateID) {
    var state = this.states.get(stateID);
    if (this.currentState) {
      this.currentState.onExit();
    }
    if (!state) {
      throw `Couldn't find state ${stateID}`;
    }
    this.currentState = state;
    this.currentState.onEnter();
  }
}
