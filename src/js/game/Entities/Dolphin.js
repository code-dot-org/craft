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
    let frameRate = 12;
    const frameListPerDirection = [[9, 16], // down
    [18, 25], // right
    [27, 34], // up
    [0, 7]]; // left
    //const frame = this.getFrameForDirection(); //this doesn't do what I'd expect.
    const actionGroup = this.controller.levelView.actionGroup;
    const stillFrameName=["Dolphin09","Dolphin00","Dolphin27","Dolphin18"];
    console.log(this.facing);
    this.sprite = actionGroup.create(0, 0, 'dolphin', stillFrameName[this.facing]+'.png');
    for (var i = 0; i < 4; i++) {
      let facingName = this.controller.levelView.getDirectionName(i); 
      if (i==0) facingName="_down";
      if (i==1) facingName="_right";
      if (i==2) facingName="_up";
      if (i==3) facingName="_left";//why doesn't the API work? 0 gives me up, 2 gives me down.
      //FacingDirection.js uses different convention than the direction used when an entity is specified in a level
      let frameList = Phaser.Animation.generateFrameNames("Dolphin", frameListPerDirection[i][0], frameListPerDirection[i][1], ".png", 2);
      console.log(frameList);
      this.sprite.animations.add("idle"+facingName, frameList, frameRate, false).onComplete.add(() => {
          this.controller.levelView.playScaledSpeed(this.sprite.animations, "idle"+facingName);
      });
    }
    // Initialize
    let facingName;
    if (this.facing==0) facingName="_down";
    if (this.facing==1) facingName="_right";
    if (this.facing==2) facingName="_up";
    if (this.facing==3) facingName="_left";
    this.controller.levelView.playScaledSpeed(this.sprite.animations, "idle" + facingName); //can't rely on this.controller.levelView.getDirectionName(this.facing); 
    console.log(this.facing);
    this.sprite.x = this.offset[0] + 40 * this.position.x;
    this.sprite.y = this.offset[1] + 40 * this.position.y;
  }
};
