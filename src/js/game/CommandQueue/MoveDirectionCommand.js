const BaseCommand = require("./BaseCommand.js");

module.exports = class MoveDirectionCommand extends BaseCommand {
  constructor(gameController, highlightCallback, targetEntity, direction) {
    super(gameController, highlightCallback, targetEntity);

    this.Direction = direction;
  }

  tick() {
    // do stuff
  }

  begin() {
    super.begin();
    this.GameController.moveDirection(this, this.Direction);
  }
};
