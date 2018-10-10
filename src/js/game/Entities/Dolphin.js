const BaseEntity = require("./BaseEntity");
const FacingDirection = require("../LevelMVC/FacingDirection");

module.exports = class Dolphin extends BaseEntity {
  constructor(controller, type, identifier, x, y, facing) {
    super(controller, type, identifier, x, y, facing);
    this.offset = [-8, -8];
    this.prepareSprite();
    this.sprite.sortOrder = this.controller.levelView.yToIndex(this.position.y);
  }

  getFrameForDirection() {
    switch (this.facing) {
      case FacingDirection.North:
        return 'Dolphin09';
      case FacingDirection.South:
        return 'Dolphin27';
      case FacingDirection.East:
        return 'Dolphin00';
      case FacingDirection.West:
        return 'Dolphin18';
    }
  }

  prepareSprite() {
    const actionGroup = this.controller.levelView.actionGroup;
    const frame = this.getFrameForDirection();
    this.sprite = actionGroup.create(0, 0, 'dolphin', frame+'.png');
    // Initialize
    this.sprite.x = this.offset[0] + 40 * this.position.x;
    this.sprite.y = this.offset[1] + 40 * this.position.y;
  }
};
