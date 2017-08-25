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

  inBounds(position) {
    const [x, y] = position;
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  coordinatesToIndex(position) {
    return position[1] * this.width + position[0];
  }

  getBlockAt(position, offsetX = 0, offsetY = 0) {
    const [x, y] = position;
    const target = [x + offsetX, y + offsetY];

    if (this.inBounds(target)) {
      return this[this.coordinatesToIndex(target)];
    }
  }

  setBlockAt(position, block) {
    this[this.coordinatesToIndex(position)] = block;

    this.determineRailType(position, true);

    return block;
  }

  getOrthogonalPositions(position) {
    const [x, y] = position;
    return {
      north: [x, y - 1],
      south: [x, y + 1],
      east: [x + 1, y],
      west: [x - 1, y],
    };
  }

  getOrthogonalBlocks(position) {
    return {
      north: this.getBlockAt(position, 0, -1),
      south: this.getBlockAt(position, 0, 1),
      east: this.getBlockAt(position, 1, 0),
      west: this.getBlockAt(position, -1, 0),
    };
  }

  getOrthogonalMask(position, comparator) {
    const orthogonal = this.getOrthogonalBlocks(position);
    return (
      (comparator(orthogonal.north) << 0) +
      (comparator(orthogonal.south) << 1) +
      (comparator(orthogonal.east) << 2) +
      (comparator(orthogonal.west) << 3)
    );
  }

  determineRailType(position, updateTouching = false) {
    const block = this.getBlockAt(position);

    if (!block || !block.isRail) {
      return;
    }

    if (updateTouching) {
      Object.values(this.getOrthogonalPositions(position)).forEach(orthogonalPosition => {
        this.determineRailType(orthogonalPosition);
      });
    }

    const mask = this.getOrthogonalMask(position, block => block && block.isRail);
    const variant = [
      "Vertical", "Vertical", "Vertical", "Vertical",
      "Horizontal", "BottomLeft", "TopLeft", "TopLeft",
      "Horizontal", "BottomRight", "TopRight", "TopRight",
      "Horizontal", "BottomLeft", "TopLeft", "BottomLeft",
    ][mask];

    block.blockType = `rails${variant}`;
  }
};
