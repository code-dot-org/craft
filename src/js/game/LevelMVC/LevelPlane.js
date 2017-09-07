const LevelBlock = require("./LevelBlock.js");

const North = 1;
const South = 2;
const East = 4;
const West = 8;

const connectionName = function (connection) {
  switch (connection) {
    case 1: return 'North';
    case 2: return 'South';
    case 4: return 'East';
    case 8: return 'West';
    default: return '';
  }
};

const ConnectionPriority = [
  [], [North], [South], [North, South],
  [East], [North, East], [South, East], [South, East],
  [West], [North, West], [South, West], [South, West],
  [East, West], [North, East], [South, East], [North, East],
];

module.exports = class LevelPlane extends Array {
  constructor(planeData, width, height, isActionPlane = false, LevelModel = null) {
    super();

    this.width = width;
    this.height = height;
    this.levelModel = LevelModel;
    this.redstoneList = [];
    this.redstoneListON = [];

    for (let index = 0; index < planeData.length; ++index) {
      let block = new LevelBlock(planeData[index]);
      // TODO(bjordan): put this truth in constructor like other attrs
      block.isWalkable = block.isWalkable || !isActionPlane;
      this.push(block);
    }
  }

  /**
  * Determines whether the position in question is within the bounds of the plane.
  */
  inBounds(position) {
    const [x, y] = position;
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
  * Converts coordinates to a index
  */
  coordinatesToIndex(position) {
    return position[1] * this.width + position[0];
  }

  /**
  * Determines the positional coordinates given a specific index.
  */
  indexToCoordinates(index) {
    let y = Math.floor(index / this.width);
    let x = index - (y * this.width);
    return [x, y];
  }

  /**
  * Gets the block at the desired index within the plane.
  */
  getBlockAt(position, offsetX = 0, offsetY = 0) {
    const [x, y] = position;
    const target = [x + offsetX, y + offsetY];

    if (this.inBounds(target)) {
      return this[this.coordinatesToIndex(target)];
    }
  }

  /**
  * Changes the block at a desired position to the desired block.
  * Important note: This is the cornerstone of block placing/destroying.
  */
  setBlockAt(position, block, force = false, direction = null) {
    this[this.coordinatesToIndex(position)] = block;
    let offset = [0,0];

    // Direction will ever only not be null if we're calling this as a
    // function of player movement.
    switch (direction) {
      case 0: {
        offset[1] = -1;
        break;
      }
      case 1: {
        offset[0] = 1;
        break;
      }
      case 2: {
        offset[1] = 1;
        break;
      }
      case 3: {
        offset[0] = -1;
        break;
      }
    }

    // This will either be the pos the player is leaving or entering, depending on situation
    let positionInQuestion = [this.levelModel.player.position[0] + offset[0], this.levelModel.player.position[1] + offset[1]];
    let wasOnADoor = false;
    // If the questionable position was a door, we want to do a few things differently.
    if (this[this.coordinatesToIndex(positionInQuestion)].blockType === "doorIron") {
      wasOnADoor = true;
    }

    let redstoneToRefresh = [];
    if (block.isRedstone || block.blockType === '' || block.isConnectedToRedstone) {
      redstoneToRefresh = this.getRedstone(wasOnADoor, positionInQuestion);
    }

    if (!force) {
      this.determineRailType(position, true);
    }

    if (this.levelModel) {
      let positionAndTouching = this.getOrthogonalPositions(position).concat([position]);
      this.levelModel.controller.levelView.refreshActionPlane(positionAndTouching);
      this.levelModel.controller.levelView.refreshActionPlane(redstoneToRefresh);
    }

    return block;
  }

  /**
  * Gets the orthogonal positions around a given position.
  * Important note: This isn't doing bounds checking.
  */
  getOrthogonalPositions(position) {
    const [x, y] = position;
    return [
      [x, y - 1],
      [x, y + 1],
      [x + 1, y],
      [x - 1, y],
    ];
  }

  /**
  * Gets the blocks within orthogonal positions around a given position.
  * Important note: This DOES to bounds checking. Will be undefined if OOB.
  */
  getOrthogonalBlocks(position) {
    return {
      north: {block: this.getBlockAt(position, 0, -1), relative: South},
      south: {block: this.getBlockAt(position, 0, 1), relative: North},
      east: {block: this.getBlockAt(position, 1, 0), relative: West},
      west: {block: this.getBlockAt(position, -1, 0), relative: East},
    };
  }

  /**
  * Gets the mask of the orthogonal indices around the given position.
  */
  getOrthogonalMask(position, comparator) {
    const orthogonal = this.getOrthogonalBlocks(position);
    return (
      (comparator(orthogonal.north) << 0) +
      (comparator(orthogonal.south) << 1) +
      (comparator(orthogonal.east) << 2) +
      (comparator(orthogonal.west) << 3)
    );
  }

  /**
  * Determines which rail object should be placed given the context of surrounding
  * indices.
  */
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

    [block.connectionA, block.connectionB] = ConnectionPriority[mask];

    block.blockType = `rails${connectionName(block.connectionA)}${connectionName(block.connectionB)}`;

    if (updateTouching) {
      this.getOrthogonalPositions(position).forEach(orthogonalPosition => {
        this.determineRailType(orthogonalPosition);
      });
    }
  }

  /**
  * Determines which redstoneWire variant should be placed given the context of
  * surrounding indices and Powered state.
  */
  determineRedstoneSprite(position) {
    let foundAbove = false;
    let foundBelow = false;
    let foundRight = false;
    let foundLeft = false;
    let myIndex = this.coordinatesToIndex(position);
    let orthogonalBlocks = this.getOrthogonalBlocks(position);

    let borderCount = 0;

    // If in bounds, we want to see if any redstone is around the index in question.
    // Below index
    if (orthogonalBlocks.south.block !== undefined &&
    (orthogonalBlocks.south.block.isRedstone ||
    orthogonalBlocks.south.block.isConnectedToRedstone)) {
      foundBelow = true;
      ++borderCount;
    }
    // Above index
    if (orthogonalBlocks.north.block !== undefined &&
    (orthogonalBlocks.north.block.isRedstone ||
    orthogonalBlocks.north.block.isConnectedToRedstone)) {
      foundAbove = true;
      ++borderCount;
    }
    // Right index
    if (orthogonalBlocks.east.block !== undefined &&
    (orthogonalBlocks.east.block.isRedstone ||
    orthogonalBlocks.east.block.isConnectedToRedstone)) {
      foundRight = true;
      ++borderCount;
    }
    // Left index
    if (orthogonalBlocks.west.block !== undefined &&
    (orthogonalBlocks.west.block.isRedstone ||
    orthogonalBlocks.west.block.isConnectedToRedstone)) {
      foundLeft = true;
      ++borderCount;
    }

    if (borderCount === 0) {
      // No connecting redstone wire.
      this[myIndex].blockType = "redstoneWire";
    } else if (borderCount === 1) {
      // Only 1 connection extends a line.
      if (foundBelow || foundAbove) {
        this[myIndex].blockType = "redstoneWireVertical";
      } else if (foundLeft || foundRight) {
        this[myIndex].blockType = "redstoneWireHorizontal";
      }
    } else if (borderCount === 2) {
      if ((foundBelow || foundAbove) && !foundRight && !foundLeft){
        // Purely vertical, no left or right.
        this[myIndex].blockType = "redstoneWireVertical";
      } else if ((foundRight || foundLeft) && !foundBelow && !foundAbove){
        // Purely horizontal, no above or below.
        this[myIndex].blockType = "redstoneWireHorizontal";
      } else {
        // We have a corner and will need to rotate.
        if (foundBelow) {
          // If we have a blow, the other has to be right or left.
          if (foundLeft) {
            this[myIndex].blockType = "redstoneWireDownLeft";
          } else {
            this[myIndex].blockType = "redstoneWireDownRight";
          }
        } else {
          // If not below, then above + left or right.
          if (foundLeft) {
            this[myIndex].blockType = "redstoneWireUpLeft";
          } else {
            this[myIndex].blockType = "redstoneWireUpRight";
          }
        }
      }
    } else if (borderCount === 3) {
      // We are deciding between T sprite orientations.
      if (!foundBelow) {
        this[myIndex].blockType = "redstoneWireTUp";
      } else if (!foundAbove) {
        this[myIndex].blockType = "redstoneWireTDown";
      } else if (!foundLeft) {
        this[myIndex].blockType = "redstoneWireTRight";
      } else if (!foundRight) {
        this[myIndex].blockType = "redstoneWireTLeft";
      }
    } else if (borderCount === 4) {
      // All four sides connected: Cross.
      this[myIndex].blockType = "redstoneWireCross";
    }

    if (this[myIndex].isPowered) {
      this[myIndex].blockType += "On";
    }

    return this[myIndex].blockType;
  }

  /**
  * Updates the state and sprites of all redstoneWire on the plane.
  * Important note: This is what kicks off redstone charge propagation and is called
  * on place/destroy/run/load.... wherever updating charge is important.
  */
  getRedstone(OnDoor = false, DoorPosition = null) {
    this.redstoneList = [];
    this.redstoneListON = [];
    for (let i = 0; i < this.length; ++i) {
      if (this[i].isRedstone) {
        this[i].isPowered = false;
        let position = this.indexToCoordinates(i);
        this.redstoneList.push(position);
      }
    }
    for (let i = 0; i < this.length; ++i) {
      if (this[i].isRedstoneBattery) {
        let position = this.indexToCoordinates(i);
        this.redstonePropagation(position);
      }
    }

    let posToRefresh = [];
    for (let i = 0; i < this.redstoneList.length; ++i) {
      this.determineRedstoneSprite(this.redstoneList[i]);
      posToRefresh.push(this.redstoneList[i]);
    }
    for (let i = 0; i < this.redstoneListON.length; ++i) {
      this.determineRedstoneSprite(this.redstoneListON[i]);
      posToRefresh.push(this.redstoneListON[i]);
    }

    // Once we're done updating redstoneWire states, check to see if doors should open/close.
    // Do things a bit different
    if (OnDoor) {
      this.findDoorToAnimate(this.coordinatesToIndex(DoorPosition));
    } else {
      this.findDoorToAnimate(-1);
    }
    return posToRefresh;
  }

  positionEquivalence(lhs, rhs) {
    if (lhs[0] === rhs[0]) {
      if (lhs[1] === rhs[1]) {
        return true;
      }
    }
    return false;
  }

  findDoorToAnimate(notOffendingIndex) {
    for (let i = 0; i < this.length; ++i) {
      if (this[i].blockType === "doorIron" && notOffendingIndex !== i) {
        this[i].isPowered = this.powerCheck(this.indexToCoordinates(i));
        if (this[i].isPowered && !this[i].isOpen) {
          this.animateDoor(i, true);
        } else if (!this[i].isPowered && this[i].isOpen) {
          this.animateDoor(i, false);
        }
      }
    }
  }

  /**
  * Animate Door and set the status
  */
  animateDoor(index, Open) {
    this[index].isOpen = Open;
    let player = this.levelModel.player;
    this.levelModel.controller.levelView.setSelectionIndicatorPosition(this.indexToCoordinates(index)[0], this.indexToCoordinates(index)[1]);
    this.levelModel.controller.audioPlayer.play("doorOpen");
    // If it's not walable, then open otherwise, close.
    const canOpen = !this[index].isWalkable;
    this.levelModel.controller.levelView.playDoorAnimation(this.indexToCoordinates(index), canOpen, () => {
      this[index].isWalkable = !this[index].isWalkable;
      this.levelModel.controller.levelView.playIdleAnimation(player.position, player.facing, player.isOnBlock);
      this.levelModel.controller.levelView.setSelectionIndicatorPosition(player.position[0], player.position[1]);
    });
  }

  /**
  * Silly helper to get the index of a specific position in an array of positions.
  */
  findPositionInArray(position, array) {
    for (let i = 0; array.length; ++i) {
      if (position[0] === array[i][0]) {
        if (position[1] === array[i][1]) {
          return i;
        }
      }
    }
  }

  /**
  * If the block at the given position is redstone, this tracks the position, and
  * propagates power to the surrounding indices.
  */
  redstonePropagation(position) {
    let block = this[this.coordinatesToIndex(position)];
    if (block.isRedstone) {
      let indexToRemove = this.findPositionInArray(position, this.redstoneList);
      this.redstoneList.splice(indexToRemove,1);
      this.redstoneListON.push(position);
      this[this.coordinatesToIndex(position)].isPowered = true;
    }

    this.getOrthogonalPositions(position).forEach(orthogonalPosition => {
      this.blockPropagation(orthogonalPosition);
    });
  }

  /**
  * The actual recursive propagation functionality for updating Powered state and sending
  * the propagation call to surrounding indices.
  */
  blockPropagation(position) {
    let adjacentBlock = this[position[1] * this.width + position[0]];
    if (this.inBounds(position) &&
      adjacentBlock.isPowered === false &&
      adjacentBlock.isRedstone) {
      adjacentBlock.isPowered = true;
      this.redstonePropagation([position[0],position[1]]);
    }
  }

  /**
  * Checking power state for objects that are powered by redstone.
  */
  powerCheck(position) {
    let amIPowered = false;
    this.getOrthogonalPositions(position).forEach(orthogonalPosition => {
      if ((this[this.coordinatesToIndex(orthogonalPosition)].isRedstone &&
      this[this.coordinatesToIndex(orthogonalPosition)].isPowered) ||
      this[this.coordinatesToIndex(orthogonalPosition)].isRedstoneBattery) {
        amIPowered = true;
      }
    });

    return amIPowered;
  }

};
