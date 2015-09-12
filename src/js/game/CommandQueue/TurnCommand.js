
import CommandState from "./CommandState.js";
import BaseCommand from "./BaseCommand.js";

export default class TurnCommand extends BaseCommand {
    constructor(phaserApp, highlightCallback, direction) {
        super(phaserApp, highlightCallback);
        
        this.Direction = direction;
    }

    tick() {
        // do stuff

        this.counter--;
        console.log(`TURN command: TICK   ${this.counter} `);

        if (this.counter <= 0) {
            this.state = CommandState.SUCCESS;
            console.log(`TURN command: TICK   ${this.counter} `);
        }
    }
    
    begin() {
        super.begin();
        console.log(`TURN command: BEGIN turning ${this.Direction}  `);
    }

}

