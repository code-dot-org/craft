const LevelBlock = require("./LevelBlock.js");

module.exports = class LevelPlane extends Array {
  constructor(planeData, isActionPlane) {
    super();

    for (let index = 0; index < planeData.length; ++index) {
      let block = new LevelBlock(planeData[index]);
      // TODO(bjordan): put this truth in constructor like other attrs
      block.isWalkable = block.isWalkable || !isActionPlane;
      this.push(block);
    }
  }
};
