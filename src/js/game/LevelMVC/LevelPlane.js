const LevelBlock = require("./LevelBlock.js");
const {
  North,
  South,
  East,
  West,
  opposite,
  turnDirection,
  turn,
} = require("./FacingDirection.js");

const connectionName = function (connection) {
  switch (connection) {
    case 0: return 'North';
    case 2: return 'South';
    case 1: return 'East';
    case 3: return 'West';
    default: return '';
  }
};

const RedstoneCircuitConnections = [
  "", "Vertical", "Vertical", "Vertical",
  "Horizontal", "UpRight", "DownRight", "TRight",
  "Horizontal", "UpLeft", "DownLeft", "TLeft",
  "Horizontal", "TUp", "TDown", "Cross",
];

const RailConnectionPriority = [
  [], [North], [South], [North, South],
  [East], [North, East], [South, East], [South, East],
  [West], [North, West], [South, West], [South, West],
  [East, West], [North, East], [South, East], [North, East],
];

const PoweredRailConnectionPriority = [
  [], [North], [South], [North, South],
  [East], [East, West], [East, West], [East, West],
  [West], [East, West], [East, West], [East, West],
  [East, West], [East, West], [East, West], [East, West],
];

module.exports = class LevelPlane {
  constructor(planeData, width, height, isActionPlane = false, LevelModel = null, planeType = null) {
    this._data = [];
    this.width = width;
    this.height = height;
    this.levelModel = LevelModel;
    this.redstoneList = [];
    this.redstoneListON = [];
    this.planeType = planeType;

    for (let index = 0; index < planeData.length; ++index) {
      let block = new LevelBlock(planeData[index]);
      // TODO(bjordan): put this truth in constructor like other attrs
      block.isWalkable = block.isWalkable || !isActionPlane;
      this._data.push(block);
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
   * Retrieve all the [x, y] coordinates within this plane
   *
   * @return {[Number, Number][]}
   */
  getAllPositions() {
    return this._data.map((_, i) => {
      return this.indexToCoordinates(i);
    });
  }

  /**
   * Gets the block at the desired position within the plane, optionally with an
   * offset
   *
   * @param {Number[]} position - [x, y] coordinates of block
   * @param {Number} [offsetX=0]
   * @param {Number} [offsetY=0]
   *
   * @return {LevelBlock}
   */
  getBlockAt(position, offsetX = 0, offsetY = 0) {
    const [x, y] = position;
    const target = [x + offsetX, y + offsetY];

    if (this.inBounds(target)) {
      return this._data[this.coordinatesToIndex(target)];
    }
  }

  isActionPlane() {
    return this.planeType === "actionPlane";
  }

  isDecorationPlane() {
    return this.planeType === "decorationPlane";
  }

  isGroundPlane() {
    return this.planeType === "groundPlane";
  }

  /**
  * Changes the block at a desired position to the desired block.
  * Important note: This is the cornerstone of block placing/destroying.
  */
  setBlockAt(position, block) {
    this._data[this.coordinatesToIndex(position)] = block;

    if (this.isActionPlane()) {

      let redstoneToRefresh = [];
      if (block.needToRefreshRedstone()) {
        redstoneToRefresh = this.getRedstone();
      }

      this.determineRailType(position, true);

      if (this.levelModel && this.levelModel.controller.levelView) {
        let positionAndTouching = this.getOrthogonalPositions(position).concat([position]);
        this.levelModel.controller.levelView.refreshActionGroup(positionAndTouching);
        this.levelModel.controller.levelView.refreshActionGroup(redstoneToRefresh);
      }
    } else if (this.isGroundPlane()) {
      this.levelModel.controller.levelView.refreshGroundGroup();
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

  forwardPosition(position, cardinal) {
    const [x, y] = position;
    switch (cardinal) {
      case North: return [x, y - 1];
      case South: return [x, y + 1];
      case East: return [x + 1, y];
      case West: return [x - 1, y];
    }
  }

  getMinecartTrack(position, facing) {
    const block = this.getBlockAt(position);

    if (!block.isRail) {
      return;
    }

    const speed = 300;

    if (block.connectionA === facing || block.connectionB === facing) {
      return ["", this.forwardPosition(position, facing), facing, speed];
    }

    const incomming = opposite(facing);
    if (block.connectionA === incomming && block.connectionB !== undefined) {
      const rotation = turnDirection(facing, block.connectionB);
      const newFacing = turn(facing, rotation);
      return [`turn_${rotation}`, position, newFacing, speed];
    }
    if (block.connectionB === incomming && block.connectionA !== undefined) {
      const rotation = turnDirection(facing, block.connectionA);
      const newFacing = turn(facing, rotation);
      return [`turn_${rotation}`, position, newFacing, speed];
    }
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

    if (block.connectionA !== undefined && block.connectionB !== undefined) {
      return;
    }

    const mask = this.getOrthogonalMask(position, ({block, relative}) => {
      if (!block || !block.isRail) {
        return false;
      }
      const a = block.connectionA === undefined || block.connectionA === relative;
      const b = block.connectionB === undefined || block.connectionB === relative;

      return a || b;
    });

    let powerState = '';
    let priority = RailConnectionPriority;
    if (block.isConnectedToRedstone) {
      powerState = 'Unpowered';
      priority = PoweredRailConnectionPriority;
    }

    // Look up what type of connection to create, based on the surrounding tracks.
    [block.connectionA, block.connectionB] = priority[mask];
    const variant = connectionName(block.connectionA) + connectionName(block.connectionB);

    block.blockType = `rails${powerState}${variant}`;

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
    const block = this.getBlockAt(position);

    if (!block || !block.isRedstone) {
      return;
    }

    const mask = this.getOrthogonalMask(position, ({block}) => {
      return block && (block.isRedstone || block.isConnectedToRedstone);
    });

    const variant = RedstoneCircuitConnections[mask];
    const powerState = block.isPowered ? 'On' : '';
    block.blockType = `redstoneWire${variant}${powerState}`;

    return `redstoneWire${variant}`;
  }

  /**
  * Updates the state and sprites of all redstoneWire on the plane.
  * Important note: This is what kicks off redstone charge propagation and is called
  * on place/destroy/run/load.... wherever updating charge is important.
  */
  getRedstone() {
    this.redstoneList = [];
    this.redstoneListON = [];

    this.getAllPositions().forEach((position) => {
      const block = this.getBlockAt(position);
      if (block.isRedstone) {
        block.isPowered = false;
        this.redstoneList.push(position);
      }
    });

    this.getAllPositions().forEach((position) => {
      const block = this.getBlockAt(position);
      if (block.isRedstoneBattery) {
        this.redstonePropagation(position);
      }
    });

    let posToRefresh = [];
    for (let i = 0; i < this.redstoneList.length; ++i) {
      this.determineRedstoneSprite(this.redstoneList[i]);
      posToRefresh.push(this.redstoneList[i]);
    }
    for (let i = 0; i < this.redstoneListON.length; ++i) {
      this.determineRedstoneSprite(this.redstoneListON[i]);
      posToRefresh.push(this.redstoneListON[i]);
    }

    this.powerAllBlocks();
    // Once we're done updating redstoneWire states, check to see if doors and pistons should open/close.
    this.getAllPositions().forEach((position) => {
      this.getIronDoors(position);
      this.getPistonState(position);
    });
    return posToRefresh;
  }

  checkEntityConflict(position) {
    let captureReturn = false;
    this.levelModel.controller.levelEntity.entityMap.forEach((workingEntity) => {
      if (this.levelModel.controller.positionEquivalence(position, workingEntity.position)) {
        captureReturn = true;
      }
    });
    return captureReturn;
  }

  /**
  * Evaluates what state Iron Doors on the map should be in.
  */
  getIronDoors(position) {
    const block = this.getBlockAt(position);
    const index = this.coordinatesToIndex(position);

    if (block.blockType === "doorIron") {
      block.isPowered = this.powerCheck(position, true);
      if (block.isPowered && !block.isOpen) {
        block.isOpen = true;
        if (this.levelModel) {
          this.levelModel.controller.levelView.animateDoor(index, true);
        }
      } else if (!block.isPowered && block.isOpen) {
        if (this.levelModel) {
          if (!this.checkEntityConflict(position)) {
            block.isOpen = false;
            this.levelModel.controller.levelView.animateDoor(index, false);
          }
        }
      }
    }
  }

  /**
  * Evaluates what state Pistons on the map should be in.
  */
  getPistonState(position) {
    const block = this.getBlockAt(position);

    if (block.blockType.startsWith("piston") && !block.blockType.startsWith("pistonArm")) {
      block.isPowered = this.powerCheck(position, true);
      if (block.isPowered) {
        this.activatePiston(position);
      } else if (!block.isPowered) {
        this.deactivatePiston(position);
      }

      if (this.levelModel) {
        this.levelModel.controller.updateFowPlane();
        this.levelModel.controller.updateShadingPlane();
      }
    }
  }

  /**
  * Find all iron doors in a level and evaluate if they need to be animated based on state
  */
  findDoorToAnimate(positionInQuestion) {
    this.getAllPositions().forEach((position) => {
      const block = this.getBlockAt(position);
      const index = this.coordinatesToIndex(position);

      if (block.blockType === "doorIron" && position !== positionInQuestion) {
        block.isPowered = this.powerCheck(position, true);
        if (block.isPowered && !block.isOpen) {
          block.isOpen = true;
          if (this.levelModel) {
            this.levelModel.controller.levelView.animateDoor(index, true);
          }
        } else if (!block.isPowered && block.isOpen && !this.checkEntityConflict(position)) {
          block.isOpen = false;
          if (this.levelModel) {
            this.levelModel.controller.levelView.animateDoor(index, false);
          }
        }
      }
    });
  }

  /**
  * Activates a piston at a given position to push blocks away from it depending on type.
  */
  activatePiston(position) {
    let neighbors = this.getOrthogonalBlocks(position);
    let neighborPosition = this.getOrthogonalPositions(position);

    let workingNeighbor = null;
    let pos = [];
    let offset = [];
    let pistonType = this.getBlockAt(position).blockType;
    if (this.getBlockAt(position).getIsStickyPiston()) {
      pistonType = pistonType.substring(0, pistonType.length - 6);
    }
    let checkOn = pistonType.substring(pistonType.length - 2, pistonType.length);
    if (checkOn === "On") {
      pistonType = pistonType.substring(0, pistonType.length - 2);
    }
    let armType = "";

    switch (pistonType) {
      case "pistonUp": {
        workingNeighbor = neighbors.north.block;
        offset = [0,-1];
        pos = neighborPosition[0];
        armType = "pistonArmUp";
        break;
      }
      case "pistonDown": {
        workingNeighbor = neighbors.south.block;
        offset = [0,1];
        pos = neighborPosition[1];
        armType = "pistonArmDown";
        break;
      }
      case "pistonRight": {
        workingNeighbor = neighbors.east.block;
        offset = [1,0];
        pos = neighborPosition[2];
        armType = "pistonArmRight";
        break;
      }
      case "pistonLeft": {
        workingNeighbor = neighbors.west.block;
        offset = [-1,0];
        pos = neighborPosition[3];
        armType = "pistonArmLeft";
        break;
      }
    }


    // Break an object right in front of the piston.
    if (workingNeighbor.isDestroyableUponPush()) {
      this.setBlockAt(pos, new LevelBlock(""));
      if (this.levelModel) {
        this.levelModel.controller.levelView.playExplosionAnimation(pos, 2, pos, workingNeighbor.blockType, null, null, this.player);
      }
    } else if (workingNeighbor.blockType !== "" && !workingNeighbor.blockType.startsWith("pistonArm")) {
      // We've actually got something to push.
      let blocksPositions = this.getBlocksToPush(pos, offset[0], offset[1]);
      let concat = "On";
      if (this.getBlockAt(position).getIsStickyPiston()) {
        concat += "Sticky";
      }
      let onPiston = new LevelBlock(pistonType += concat);
      this.setBlockAt(position, onPiston);
      this.pushBlocks(blocksPositions, offset[0], offset[1]);
    } else if (workingNeighbor.blockType === "") {
      // Nothing to push, so just make the arm.
      let concat = "On";
      if (this.getBlockAt(position).getIsStickyPiston()) {
        concat += "Sticky";
        armType += "Sticky";
      }
      let armBlock = new LevelBlock(armType);
      let pistonBlock = new LevelBlock(pistonType += concat);
      this.setBlockAt(pos, armBlock);
      this.setBlockAt(position, pistonBlock);
    }
  }

  /**
  * Deactivates a piston at a given position by determining what the arm orientation is.
  * NOTE: getOrthogonalPositions() does not match the order of the North/East/South/West defined in Facing Directions.
  * This should be cleaned up in a future PR so we don't have to define the directions here.
  */
  deactivatePiston(position) {
    let neighborPosition = this.getOrthogonalPositions(position);
    let north = 0;
    let south = 1;
    let east = 2;
    let west = 3;

    let pistonType = this.getBlockAt(position).blockType;
    if (this._data[this.coordinatesToIndex(position)].getIsStickyPiston()) {
      pistonType = pistonType.substring(0, pistonType.length - 6);
    }
    switch (pistonType) {
      case "pistonUpOn": {
        this.retractArm(neighborPosition[north], position);
        break;
      }
      case "pistonDownOn": {
        this.retractArm(neighborPosition[south], position);
        break;
      }
      case "pistonRightOn": {
        this.retractArm(neighborPosition[east], position);
        break;
      }
      case "pistonLeftOn": {
        this.retractArm(neighborPosition[west], position);
        break;
      }
    }
  }

  /**
  * Does the actual retraction of the arm of a piston.
  */
  retractArm(armPosition, pistonPosition) {
    let emptyBlock = new LevelBlock("");
    let pistonType = this.getBlockAt(pistonPosition);
    let concat = "";
    let blockType = "";
    if (this.getBlockAt(pistonPosition).getIsStickyPiston()) {
      concat = "Sticky";
      blockType = pistonType.blockType.substring(0, pistonType.blockType.length - 8);
    } else {
      blockType = pistonType.blockType.substring(0, pistonType.blockType.length - 2);
    }
    let newPistonType = blockType + concat;
    let offPiston = new LevelBlock(newPistonType);
    if (this.getBlockAt(armPosition).blockType.startsWith("pistonArm")) {
      if (this.getBlockAt(pistonPosition).getIsStickyPiston()) {
        let stuckBlockPosition = [armPosition[0], armPosition[1]];
        switch (pistonType.getPistonDirection()) {
          case South:
            stuckBlockPosition[1] += 1;
            break;
          case North:
            stuckBlockPosition[1] -= 1;
            break;
          case West:
            stuckBlockPosition[0] -= 1;
            break;
          case East:
            stuckBlockPosition[0] += 1;
            break;
        }
        if (this.inBounds(stuckBlockPosition) && this.getBlockAt(stuckBlockPosition).isStickable) {
          this.setBlockAt(armPosition, this.getBlockAt(stuckBlockPosition));
          this.setBlockAt(stuckBlockPosition, emptyBlock);
        } else {
          this.setBlockAt(armPosition, emptyBlock);
        }
      } else {
        this.setBlockAt(armPosition, emptyBlock);
      }
    }
    this.setBlockAt(pistonPosition, offPiston);
  }

  /**
  * Goes through a list of blocks and shuffles them over 1 index in a given direction.
  */
  pushBlocks(blocksPositions, offsetX = 0, offsetY = 0) {
    let pistonType = "";
    let redo = false;
    if (offsetX === 1) {
      pistonType = "pistonArmRight";
    } else if (offsetX === -1) {
      pistonType = "pistonArmLeft";
    } else {
      if (offsetY === 1) {
        pistonType = "pistonArmDown";
      } else if (offsetY === -1) {
        pistonType = "pistonArmUp";
      } else {
          // There is no offset, so we're not putting down anything.
      }
    }
    let armBlock = new LevelBlock(pistonType);
    for (let i = blocksPositions.length - 1; i >= 0; --i) {
      let destination = [blocksPositions[i][0] + offsetX, blocksPositions[i][1] + offsetY];
      let block = this.getBlockAt(blocksPositions[i]);
      if (this.inBounds(destination) && this.getBlockAt(destination).isDestroyableUponPush()) {
        if (this.levelModel) {
          this.levelModel.controller.levelView.playExplosionAnimation(destination, 2, destination, block.blockType, null, null, this.player);
        }
        redo = true;
      }
      this.setBlockAt(destination, this.getBlockAt(blocksPositions[i]));
      if (i === 0) {
        this.setBlockAt(blocksPositions[i], armBlock);
      }
    }
    if (redo) {
      this.getRedstone();
    }
  }

  /**
  * Returns a list of blocks in a given direction to be shuffled over later.
  */
  getBlocksToPush(position, offsetX = 0, offsetY = 0) {
    let pushingBlocks = [];
    let workingPosition = position;
    while (this.inBounds(workingPosition) && this.getBlockAt(workingPosition).getIsPushable()) {
      pushingBlocks.push(workingPosition);
      workingPosition = [workingPosition[0] + offsetX, workingPosition[1] + offsetY];
    }
    return pushingBlocks;
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
    const block = this.getBlockAt(position);

    if (block.isRedstone) {
      let indexToRemove = this.findPositionInArray(position, this.redstoneList);
      this.redstoneList.splice(indexToRemove,1);
      this.redstoneListON.push(position);
      block.isPowered = true;
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
    let adjacentBlock = this.getBlockAt(position);

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
  powerCheck(position, canReadCharge = false) {
    return this.getOrthogonalPositions(position).some(orthogonalPosition => {
      const block = this.getBlockAt(orthogonalPosition);
      if (block) {
        if (!block.isWeaklyPowerable) {
          return false;
        }
        if (this.getBlockAt(position).blockType.startsWith("piston")) {
          let piston = this.getBlockAt(position);
          let ignoreThisSide = [0, 0];
          switch (piston.getPistonDirection()) {
            case South:
              ignoreThisSide = [0, 1];
              break;
            case North:
              ignoreThisSide = [0, -1];
              break;
            case West:
              ignoreThisSide = [-1, 0];
              break;
            case East:
              ignoreThisSide = [1, 0];
              break;
          }
          let posCheck = [position[0] + ignoreThisSide[0], position[1] + ignoreThisSide[1]];
          if (posCheck[0] === orthogonalPosition[0] && posCheck[1] === orthogonalPosition[1]) {
            return false;
          }
        }
        if (canReadCharge) {
          return block.isPowered || block.isRedstoneBattery;
        }
        return (block.isRedstone && block.isPowered) || block.isRedstoneBattery;
      }
    });
  }

  powerAllBlocks() {
    for (let i = 0; i < this._data.length; ++i) {
      if (this._data[i].blockType !== "" && this._data[i].canHoldCharge()) {
        this._data[i].isPowered = this.powerCheck(this.indexToCoordinates(i));
      }
    }
  }

};
