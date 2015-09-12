
import CommandState from "./CommandState.js";
import BaseCommand from "./BaseCommand.js";

export default class TurnCommand extends BaseCommand {
    constructor(phaserApp, highlightCallback, direction) {
        super(phaserApp, highlightCallback);
        
        this.Direction = direction;
    }

    tick() {
        // do stuff??
    }
    
    begin() {
        super.begin();
        console.log(`TURN command: BEGIN turning ${this.Direction}  `);
        this.PhaserApp.turn(this, this.Direction);
    }

}

