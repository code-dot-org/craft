import CommandState from "./CommandState.js";
import CommandQueue from "./CommandQueue.js";
import BaseCommand from "./BaseCommand.js";

export default class ForeverCommand extends BaseCommand {
  constructor(gameController, highlightCallback, callback) {
    super(gameController, highlightCallback);
    this.WhileCode = callback;
    this.queue = new CommandQueue(this);
  }

  tick() {
    if (this.state === CommandState.WORKING) {
      // tick our command queue
      this.queue.tick();
    }

    if (this.queue.isFailed()) {
      this.state = CommandState.FAILURE;
    }

    if (this.queue.isSucceeded()) {
      // a single run of our inner queue has completed, insert another round
      this.handleWhileCheck();
    }
  }

  begin() {
    super.begin();
    if (this.gameController.DEBUG) {
      console.log("WHILE command: BEGIN");
    }

    // setup the while check the first time
    this.handleWhileCheck();
  }

  handleWhileCheck() {
    this.queue.reset();
    this.gameController.queue.setWhileCommandInsertState(this.queue);
    this.WhileCode();
    this.gameController.queue.setWhileCommandInsertState(null);
    this.queue.begin();
  }
}

