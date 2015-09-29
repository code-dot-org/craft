
import CommandState from "./CommandState.js";
import CommandQueue from "./CommandQueue.js";
import BaseCommand from "./BaseCommand.js";

export default class CheckSolutionCommand extends BaseCommand {
    constructor(phaserApp) {
        var dummyFunc = function() {
            if (phaserApp.DEBUG) {
                console.log("Execute solve command");
            }
        };

        super(phaserApp, dummyFunc);
    }

    tick() {
        // do stuff
    }
    
    begin() {
        super.begin();
        if (this.PhaserApp.DEBUG) {
            console.log("Solve command: BEGIN");
        }
        var result = this.PhaserApp.checkSolution(this);
    }

}

