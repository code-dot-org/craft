const LevelBlock = require("./LevelBlock.js");

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

  setBlockAt(position, block, oldBlock = {}, force = false) {
    this[this.coordinatesToIndex(position)] = block;

    if (block.isRedstone) {
      this.determineRedstoneSprite(position);
    }
    if (block.isRedstone || oldBlock.isRedstone) {
      this.getOrthogonalPositions(position).forEach(orthogonalPosition => {
        const orthogonalBlock = this.getBlockAt(orthogonalPosition);
        if (orthogonalBlock && orthogonalBlock.isRedstone) {
          this.determineRedstoneSprite(orthogonalPosition);
          if (this.levelModel) {
            this.levelModel.controller.levelView.refreshActionPlane(
              this.levelModel, [this.coordinatesToIndex(orthogonalPosition)]);
          }
        }
      });
      this.getRedstone();
    }

    if (block.blockType === "") {
      this.getOrthogonalPositions(position).forEach(orthogonalPosition => {
        const orthogonalBlock = this.getBlockAt(orthogonalPosition);
        if (orthogonalBlock && orthogonalBlock.isRedstone) {
          this.determineRedstoneSprite(orthogonalPosition);
        }
      });
    }

    if (block.isRail && !force) {
      block.blockType = this.determineRailType(position);
    }

    if (this.levelModel) {
      this.levelModel.controller.levelView.refreshActionPlane(this.levelModel,
        [this.coordinatesToIndex(position)]);
    }

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

  determineRailType(position) {
    const mask = this.getOrthogonalMask(position, block => block && block.isRail);
    const variant = [
      "Vertical", "Vertical", "Vertical", "Vertical",
      "Horizontal", "BottomLeft", "TopLeft", "TopLeft",
      "Horizontal", "BottomRight", "TopRight", "TopRight",
      "Horizontal", "BottomLeft", "TopLeft", "BottomLeft",
    ][mask];

    return `rails${variant}`;
  }

  determineRedstoneSprite(position) {
    let foundAbove = false;
    let foundBelow = false;
    let foundRight = false;
    let foundLeft = false;
    let myIndex = this.coordinatesToIndex(position);
    let orthogonalBlocks = this.getOrthogonalBlocks(position);

    let borderCount = 0;

    // If in bounds, we want to see if any redstone is around the index in question
    // Below index
    if (orthogonalBlocks.south !== undefined && orthogonalBlocks.south.blockType.startsWith("redstoneWire")) {
      foundBelow = true;
      ++borderCount;
    }
    // Above index
    if (orthogonalBlocks.north !== undefined && orthogonalBlocks.north.blockType.startsWith("redstoneWire")) {
      foundAbove = true;
      ++borderCount;
    }
    // Right index
    if (orthogonalBlocks.east !== undefined && orthogonalBlocks.east.blockType.startsWith("redstoneWire")) {
      foundRight = true;
      ++borderCount;
    }
    // Left index
    if (orthogonalBlocks.west !== undefined && orthogonalBlocks.west.blockType.startsWith("redstoneWire")) {
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

    return this[myIndex].blockType;
  }

  getRedstone() {
    this.redstoneList = [];
    this.redstoneListON = [];
    for (let i = 0; i < this.length; ++i) {
      if (this[i].blockType.substring(0,12) === "redstoneWire") {
        this[i].isPowered = false;
        this.redstoneList.push(i);
      }
    }
    for (let i = 0; i < this.length; ++i) {
      if (this[i].blockType === "railsRedstoneTorch") {
        let y = Math.floor(i / this.height);
        let x = i - (y * this.height);
        let pos = [x,y];
        this.redstonePropagation(pos);
      }
    }

    for (let obj in this.redstoneList) {
      if (this.levelModel !== null) {
        console.log("The block at index: " + this.levelModel.controller.levelView.indexToCoordinates(this.redstoneList[obj]) + " is a " + this[this.redstoneList[obj]].blockType + ". This block is NOT charged.");
      }
    }
    for (let obj in this.redstoneListON) {
      if (this.levelModel !== null) {
        console.log("The block at index: " + this.levelModel.controller.levelView.indexToCoordinates(this.redstoneListON[obj]) + " is a " + this[this.redstoneListON[obj]].blockType + ". This block IS charged.");
      }
    }
  }

  redstonePropagation(position) {
    let block = this[this.levelModel.yToIndex(position[1]) + position[0]];
    //console.log("the position of " + block.blockType + " is " + "(" + position.x + ", " + position.y + "). This block is charged!");

    if (block.blockType.substring(0,12) === "redstoneWire") {
      let index = this.levelModel.controller.levelView.coordinatesToIndex(position);
      let indexToRemove = this.redstoneList.indexOf(index);
      this.redstoneList.splice(indexToRemove,1);
      this.redstoneListON.push(index);
    }

    //below current pos check
    let adjacentBlock = this[this.levelModel.yToIndex(position[1] + 1) + position[0]];
    if (this.levelModel.inBounds(position[0], position[1] + 1)
      && adjacentBlock.isPowered === false
      && adjacentBlock.blockType.substring(0,12) === "redstoneWire") {
      adjacentBlock.isPowered = true;
      this.redstonePropagation([position[0],position[1] + 1]);
    }
    //above current pos check
    adjacentBlock = this[this.levelModel.yToIndex(position[1] - 1) + position[0]];
    if (this.levelModel.inBounds(position[0], position[1] - 1)
      && adjacentBlock.isPowered === false
      && adjacentBlock.blockType.substring(0,12) === "redstoneWire") {
      adjacentBlock.isPowered = true;
      this.redstonePropagation([position[0],position[1] - 1]);
    }
    //left of current pos check
    adjacentBlock = this[this.levelModel.yToIndex(position[1]) + position[0] - 1];
    if (this.levelModel.inBounds(position[0] - 1, position[1])
      && adjacentBlock.isPowered === false
      && adjacentBlock.blockType.substring(0,12) === "redstoneWire") {
      adjacentBlock.isPowered = true;
      this.redstonePropagation([position[0] - 1,position[1]]);
    }
    //right of current pos check
    adjacentBlock = this[this.levelModel.yToIndex(position[1]) + position[0] + 1];
    if (this.levelModel.inBounds(position[0] + 1, position[1])
      && adjacentBlock.isPowered === false
      && adjacentBlock.blockType.substring(0,12) === "redstoneWire") {
      adjacentBlock.isPowered = true;
      this.redstonePropagation([position[0] + 1,position[1]]);
    }
  }
};
