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
        return 'Dolphin18';
      case FacingDirection.West:
        return 'Dolphin00';
    }
  }

  prepareSprite() {
    let frameRate = 12;
    const frameListPerDirection = [[9, 16], // up
    [18, 25], // right
    [27, 34], // down
    [0, 7]]; // left
    const frame = this.getFrameForDirection();
    const actionGroup = this.controller.levelView.actionGroup;
    this.sprite = actionGroup.create(0, 0, 'dolphin', frame+'.png');
    for (var i = 0; i < 4; i++) {
      let facingName = this.controller.levelView.getDirectionName(i);
      let frameList = Phaser.Animation.generateFrameNames("Dolphin", frameListPerDirection[i][0], frameListPerDirection[i][1], ".png", 2);
      this.sprite.animations.add("idle"+facingName, frameList, frameRate, false).onComplete.add(() => {
          this.controller.levelView.playScaledSpeed(this.sprite.animations, "idle"+facingName,.5);
      });
    }
    // Initialize
    let facingName = this.controller.levelView.getDirectionName(this.facing);
    this.controller.levelView.playScaledSpeed(this.sprite.animations, "idle" + facingName,.5);
    this.sprite.x = this.offset[0] + 40 * this.position.x;
    this.sprite.y = this.offset[1] + 40 * this.position.y;
  }
};
