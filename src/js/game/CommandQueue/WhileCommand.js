
import CommandState from "./CommandState.js";
import BaseCommand from "./BaseCommand.js";

export default class WhileCommand extends BaseCommand {
    constructor(phaserApp, highlightCallback) {

        super(phaserApp, highlightCallback);
    }

    tick() {
        // do stuff
        console.log(`While command: TICK   ${this.counter} `);

        if (this.counter <= 0) {
            this.state = CommandState.SUCCESS;
            console.log(`WHILE command: TICK   ${this.counter} `);
        }
    }
    
    begin() {
        super.begin();
        console.log("WHILE command: BEGIN");
    }

}

