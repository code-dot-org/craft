import StateMachine from "./../StateMachine";

/**
 * Tracks a current state and calls enter/exit on transitions.
 *
 * Gives states a reference to itself for transitions.
 */
export default class StateManager extends StateMachine {
  constructor(...passThrough) {
    super(...passThrough);

    /**
     * @property {ManagedState}
     */
    this.currentState = null;

    this.states.forEach((state, stateID) => {
      state.setManager(this, stateID);
    });
    this.states.forEach((state, stateID) => {
      state.onStatesInitialized()
    });
  }

  currentStateID() {
    return this.currentState.stateID;
  }
}
