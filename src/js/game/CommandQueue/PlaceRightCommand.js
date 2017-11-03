const BaseCommand = require("./BaseCommand.js");

module.exports = class PlaceLeftCommand extends BaseCommand {
  constructor(gameController, highlightCallback, blockType, targetEntity) {
    super(gameController, highlightCallback, targetEntity);

    this.BlockType = blockType;
  }

  tick() {
    // do stuff??
  }

  begin() {
    super.begin();
    this.GameController.placeBlockLeft(this, this.BlockType);
  }
};
