const LevelBlock = require("./LevelBlock.js");

module.exports = class LevelPlane extends Array {
  constructor(planeData, width, height, isActionPlane = false) {
    super();

    this.width = width;
    this.height = height;

    for (let index = 0; index < planeData.length; ++index) {
      let block = new LevelBlock(planeData[index]);
      // TODO(bjordan): put this truth in constructor like other attrs
      block.isWalkable = block.isWalkable || !isActionPlane;
      this.push(block);
    }
  }

  coordinatesToIndex(position) {
    return position[1] * this.width + position[0];
  }

  getBlockAt(position) {
    return this[this.coordinatesToIndex(position)];
  }

  setBlockAt(position, block) {
    this[this.coordinatesToIndex(position)] = block;
  }
};
