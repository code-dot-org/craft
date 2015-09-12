
import CommandState from "./CommandState.js";
import BaseCommand from "./BaseCommand.js";

export default class DestroyBlockCommand extends BaseCommand {
    constructor(phaserApp, highlightCallback) {

        super(phaserApp, highlightCallback);
    }

    tick() {
        // do stuff
    }
    
    begin() {
        super.begin();
        this.PhaserApp.destroyBlock(this);
    }

}

