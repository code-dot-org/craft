
import CommandState from "./CommandState.js";
import BaseCommand from "./BaseCommand.js";

export default class PlaceInFrontCommand extends BaseCommand {
    constructor(phaserApp, highlightCallback, blockType) {
        super(phaserApp, highlightCallback);
        
        this.BlockType = blockType;
    }

    tick() {
        // do stuff??
    }
    
    begin() {
        super.begin();
        this.PhaserApp.placeBlockForward(this, this.BlockType);
    }
}

