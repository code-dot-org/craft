const LevelBlock = require("./LevelBlock.js");

const Connection = {
  North: 1,
  South: 2,
  East: 4,
  West: 8,
};

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
    return [
      [x, y - 1],
      [x, y + 1],
      [x + 1, y],
      [x - 1, y],
    ];
  }

  getOrthogonalBlocks(position) {
    return {
      north: {block: this.getBlockAt(position, 0, -1), relative: Connection.South},
      south: {block: this.getBlockAt(position, 0, 1), relative: Connection.North},
      east: {block: this.getBlockAt(position, 1, 0), relative: Connection.West},
      west: {block: this.getBlockAt(position, -1, 0), relative: Connection.East},
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

    if (block.connectionA && block.connectionB) {
      return;
    }

    const mask = this.getOrthogonalMask(position, ({block, relative}) => {
      if (!block || !block.isRail) {
        return false;
      }
      const a = !block.connectionA || block.connectionA === relative;
      const b = !block.connectionB || block.connectionB === relative;

      return a || b;
    });

    const connections = [
      [], [Connection.North], [Connection.South], [Connection.North, Connection.South],
      [Connection.East], [Connection.North, Connection.East], [Connection.South, Connection.East], [Connection.South, Connection.East],
      [Connection.West], [Connection.North, Connection.West], [Connection.South, Connection.West], [Connection.South, Connection.West],
      [Connection.East, Connection.West], [Connection.North, Connection.East], [Connection.South, Connection.East], [Connection.North, Connection.East],
    ][mask];

    block.connectionA = connections[0];
    block.connectionB = connections[1];

    const directions = {
      1: 'North',
      2: 'South',
      4: 'East',
      8: 'West',
    };
    const a = directions[block.connectionA] || '';
    const b = directions[block.connectionB] || '';
    block.blockType = `rails${a}${b}`;

    if (updateTouching) {
      this.getOrthogonalPositions(position).forEach(orthogonalPosition => {
        this.determineRailType(orthogonalPosition)
      });
    }
  }
};
