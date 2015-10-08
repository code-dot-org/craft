
import CommandState from "./CommandState.js";
import CommandQueue from "./CommandQueue.js";
import BaseCommand from "./BaseCommand.js";

export default class IfBlockAheadCommand extends BaseCommand {
    constructor(phaserApp, highlightCallback, blockType, callback) {
        super(phaserApp, highlightCallback);

        this.blockType = blockType;
        this.ifCodeCallback = callback;

        this.queue = new CommandQueue(this);
    }

    tick() {
        if (this.state === CommandState.WORKING ) {
            // tick our command queue
            this.queue.tick();
        }

        if (this.queue.isFailed()) {
            this.state = CommandState.FAILURE;
        }

        if (this.queue.isSucceeded()) {
            this.state = CommandState.SUCCESS;
        }

    }

    begin() {
        super.begin();
        if (this.PhaserApp.DEBUG) {
            console.log("WHILE command: BEGIN");
        }

        // setup the "if" check
        this.handleIfCheck();
    }

    handleIfCheck() {
        if (this.PhaserApp.isPathAhead(this.blockType)) {
            this.queue.reset();
            this.PhaserApp.queue.setWhileCommandInsertState(this.queue);
            this.ifCodeCallback(); // inserts commands via CodeOrgAPI
            this.PhaserApp.queue.setWhileCommandInsertState(null);
            this.queue.begin();
        } else {
            this.state = CommandState.SUCCESS;
        }
    }

}

