const BaseEntity = require("./BaseEntity");
const FacingDirection = require("../LevelMVC/FacingDirection");

module.exports = class Boat extends BaseEntity {
  constructor(controller, type, identifier, x, y, facing) {
    super(controller, type, identifier, x, y, facing);
    this.offset = [-22, -28];
    this.prepareSprite();
    this.sprite.sortOrder = this.controller.levelView.yToIndex(this.position.y);
  }

  getFrameForDirection() {
    switch (this.facing) {
      case FacingDirection.North:
        return 'Boat_05';
      case FacingDirection.South:
        return 'Boat_01';
      case FacingDirection.East:
        return 'Boat_07';
      case FacingDirection.West:
        return 'Boat_03';
    }
  }

  prepareSprite() {
    const actionGroup = this.controller.levelView.actionGroup;
    const frame = this.getFrameForDirection();
    this.sprite = actionGroup.create(0, 0, 'player' + this.controller.player.name, frame);

    // Initialize.
    this.sprite.x = this.offset[0] + 40 * this.position.x;
    this.sprite.y = this.offset[1] + 40 * this.position.y;

    const bob  = this.game.add.tween(this.sprite);
    bob.to({ y: '-3' }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
  }
};
