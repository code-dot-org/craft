
import CommandState from "./CommandState.js";
import BaseCommand from "./BaseCommand.js";

export default class DestroyBlockCommand extends BaseCommand {
    constructor(phaserApp, highlightCallback) {

        super(phaserApp, highlightCallback);
    }

    tick() {
        // do stuff
        console.log(`Move command: TICK   ${this.counter} `);

        if (this.counter <= 0) {
            this.state = CommandState.SUCCESS;
            console.log(`Debug command: TICK   ${this.counter} `);
        }
    }
    
    begin() {
        super.begin();
        console.log("MOVE command: BEGIN");
    }

}

