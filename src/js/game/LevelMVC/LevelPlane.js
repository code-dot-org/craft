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

  getOrthogonalPositionsArray(position) {
    const positions = this.getOrthogonalPositions(position);
    return Object.keys(positions).map(key => positions[key]);
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

    const orthogonal = this.getOrthogonalPositions(position);
    const mask = this.getOrthogonalMask(position, block => block && block.isRail);

    switch (mask) {
      case 0:
      case 1:
      case 2:
      case 3:
        block.blockType = 'railsVertical';
        break;
      case 4:
      case 8:
      case 12:
        block.blockType = 'railsHorizontal';
        break;
      case 5:
      case 13:
      case 15:
        block.blockType = 'railsBottomLeft';
        break;
      case 6:
      case 7:
      case 14:
        block.blockType = 'railsTopLeft';
        break;
      case 10:
      case 11:
        block.blockType = 'railsTopRight';
        break;
      case 9:
        block.blockType = 'railsBottomRight';
        break;
    }

    if (updateTouching) {
      switch (mask) {
        case 1:
          this.determineRailType(orthogonal.north);
          break;
        case 2:
          this.determineRailType(orthogonal.south);
          break;
        case 3:
          this.determineRailType(orthogonal.north);
          this.determineRailType(orthogonal.south);
          break;
        case 4:
          this.determineRailType(orthogonal.east);
          break;
        case 5:
        case 13:
        case 15:
          this.determineRailType(orthogonal.north);
          this.determineRailType(orthogonal.east);
          break;
        case 6:
        case 7:
        case 14:
          this.determineRailType(orthogonal.south);
          this.determineRailType(orthogonal.east);
          break;
        case 8:
          this.determineRailType(orthogonal.west);
          break;
        case 10:
        case 11:
          this.determineRailType(orthogonal.south);
          this.determineRailType(orthogonal.west);
          break;
        case 9:
          this.determineRailType(orthogonal.north);
          this.determineRailType(orthogonal.west);
          break;
        case 12:
          this.determineRailType(orthogonal.east);
          this.determineRailType(orthogonal.west);
          break;
      }
    }
  }
};
