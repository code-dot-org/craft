const BaseCommand = require("./BaseCommand.js");

module.exports = class MoveForwardCommand extends BaseCommand {
  constructor(gameController, highlightCallback, targetEntity) {
    super(gameController, highlightCallback, targetEntity);
  }

  tick() {
    // do stuff
  }

  begin() {
    super.begin();
    this.GameController.moveForward(this);
  }
};
