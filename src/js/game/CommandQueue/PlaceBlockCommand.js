
import CommandState from "./CommandState.js";
import BaseCommand from "./BaseCommand.js";

export default class PlaceBlockCommand extends BaseCommand {
    constructor(phaserApp, highlightCallback, blockType) {
        super(phaserApp, highlightCallback);
        
        this.BlockType = blockType;
    }

    tick() {
        // do stuff??
    }
    
    begin() {
        super.begin();
        this.PhaserApp.placeBlock(this, this.BlockType);
    }
}

