const LevelPlane = require("./LevelPlane.js");
const LevelBlock = require("./LevelBlock.js");
const FacingDirection = require("./FacingDirection.js");
const Player = require("../Entities/Player.js");

// for blocks on the action plane, we need an actual "block" object, so we can model

module.exports = class LevelModel {
  constructor(levelData, controller) {
    this.planeWidth = levelData.gridDimensions ?
      levelData.gridDimensions[0] : 10;
    this.planeHeight = levelData.gridDimensions ?
      levelData.gridDimensions[1] : 10;
    this.controller = controller;
    this.player = {};

    this.railMap =
      ["", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "railsUnpoweredVertical", "", "", "", "", "", "",
        "", "", "", "railsUnpoweredVertical", "", "", "", "", "", "",
        "", "", "", "railsUnpoweredVertical", "", "", "", "", "", "",
        "", "", "", "railsUnpoweredVertical", "", "", "", "", "", "",
        "", "", "", "railsUnpoweredVertical", "", "", "", "", "", "",
        "", "", "", "railsBottomLeft", "railsHorizontal", "railsHorizontal", "railsHorizontal", "railsHorizontal", "railsHorizontal", "railsHorizontal",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", ""];

    this.initialLevelData = Object.create(levelData);

    this.reset();

    this.initialPlayerState = Object.create(this.player);
  }

  planeArea() {
    return this.planeWidth * this.planeHeight;
  }

  inBounds(x, y) {
    return x >= 0 && x < this.planeWidth && y >= 0 && y < this.planeHeight;
  }

  reset() {
    this.groundPlane = new LevelPlane(this.initialLevelData.groundPlane, this.planeWidth, this.planeHeight);
    this.groundDecorationPlane = new LevelPlane(this.initialLevelData.groundDecorationPlane, this.planeWidth, this.planeHeight);
    this.shadingPlane = [];
    this.actionPlane = new LevelPlane(this.initialLevelData.actionPlane, this.planeWidth, this.planeHeight, true);
    
    for (let i = 0; i < this.actionPlane.length; ++i) {
      if (this.actionPlane[i].blockType.substring(0,12) === "redstoneWire") {
        let y = Math.floor(i / this.planeHeight);
        let x = i - (y * this.planeHeight);
        this.determineRedstoneSprite(x, y, this.actionPlane[i]);
      }
    }
    
    this.fluffPlane = new LevelPlane(this.initialLevelData.fluffPlane, this.planeWidth, this.planeHeight);
    this.fowPlane = [];
    this.isDaytime = this.initialLevelData.isDaytime === undefined || this.initialLevelData.isDaytime;

    let levelData = Object.create(this.initialLevelData);
    let [x, y] = levelData.playerStartPosition;
    if (this.initialLevelData.usePlayer !== undefined) {
      this.usePlayer = this.initialLevelData.usePlayer;
    } else {
      this.usePlayer = true;
    }
    if (this.usePlayer) {
      this.player = new Player(this.controller, "Player", x, y, this.initialLevelData.playerName || "Steve", !this.actionPlane[this.yToIndex(y) + x].getIsEmptyOrEntity(), levelData.playerStartDirection);
      this.controller.levelEntity.pushEntity(this.player);
      this.controller.player = this.player;
    }

    this.computeShadingPlane();
    this.computeFowPlane();
  }

  yToIndex(y) {
    return y * this.planeWidth;
  }

  isSolved() {
    return this.initialLevelData.verificationFunction(this);
  }

  isFailed() {
    if (this.initialLevelData.failureCheckFunction !== undefined) {
      return this.initialLevelData.failureCheckFunction(this);
    } else {
      return false;
    }
  }

  getHouseBottomRight() {
    return this.initialLevelData.houseBottomRight;
  }

  // Verifications
  isPlayerNextTo(blockType) {
    if (!this.usePlayer) {
      return false;
    }
    var position;

    // above
    position = [this.player.position[0], this.player.position[1] - 1];
    if (this.inBounds(position[0], position[1]) && (this.isBlockOfType(position, blockType) || this.isEntityOfType(position, blockType) || this.groundPlane.getBlockAt(position).blockType === blockType)) {
      return true;
    }

    // below
    position = [this.player.position[0], this.player.position[1] + 1];
    if (this.inBounds(position[0], position[1]) && (this.isBlockOfType(position, blockType) || this.isEntityOfType(position, blockType) || this.groundPlane.getBlockAt(position).blockType === blockType)) {
      return true;
    }

    // left
    position = [this.player.position[0] + 1, this.player.position[1]];
    if (this.inBounds(position[0], position[1]) && (this.isBlockOfType(position, blockType) || this.isEntityOfType(position, blockType) || this.groundPlane.getBlockAt(position).blockType === blockType)) {
      return true;
    }

    // Right
    position = [this.player.position[0] - 1, this.player.position[1]];
    if (this.inBounds(position[0], position[1]) && (this.isBlockOfType(position, blockType) || this.isEntityOfType(position, blockType) || this.groundPlane.getBlockAt(position).blockType === blockType)) {
      return true;
    }

    return false;
  }

  isEntityNextTo(entityType, blockType) {
    var entityList = this.controller.levelEntity.getEntitiesOfType(entityType);
    for (var i = 0; i < entityList.length; i++) {
      var entity = entityList[i];
      var position;

      // above
      position = [entity.position[0], entity.position[1] - 1];
      if (this.inBounds(position[0], position[1]) && (this.isBlockOfType(position, blockType) || this.isEntityOfType(position, blockType) || this.groundPlane.getBlockAt(position).blockType === blockType)) {
        return true;
      }

      // below
      position = [entity.position[0], entity.position[1] + 1];
      if (this.inBounds(position[0], position[1]) && (this.isBlockOfType(position, blockType) || this.isEntityOfType(position, blockType) || this.groundPlane.getBlockAt(position).blockType === blockType)) {
        return true;
      }

      // left
      position = [entity.position[0] + 1, entity.position[1]];
      if (this.inBounds(position[0], position[1]) && (this.isBlockOfType(position, blockType) || this.isEntityOfType(position, blockType) || this.groundPlane.getBlockAt(position).blockType === blockType)) {
        return true;
      }

      // Right
      position = [entity.position[0] - 1, entity.position[1]];
      if (this.inBounds(position[0], position[1]) && (this.isBlockOfType(position, blockType) || this.isEntityOfType(position, blockType) || this.groundPlane.getBlockAt(position).blockType === blockType)) {
        return true;
      }
    }
    return false;
  }

  isEntityOnBlocktype(entityType, blockType, count = 1) {
    var entityList = this.controller.levelEntity.getEntitiesOfType(entityType);
    var resultCount = 0;
    for (var i = 0; i < entityList.length; i++) {
      var entity = entityList[i];
      if (this.isBlockOfType(entity.position, blockType) || this.groundPlane.getBlockAt(entity.position).blockType === blockType) {
        resultCount++;
      }
    }
    return resultCount >= count;
  }

  isEntityAt(entityType, position) {
    var entityList = this.controller.levelEntity.getEntitiesOfType(entityType);
    for (var i = 0; i < entityList.length; i++) {
      var entity = entityList[i];
      if (entity.position[0] === position[0] && entity.position[1] === position[1]) {
        return true;
      }
    }
    return false;
  }

  isEntityTypeRunning(entityType) {
    var entityList = this.controller.levelEntity.getEntitiesOfType(entityType);
    for (var i = 0; i < entityList.length; i++) {
      var entity = entityList[i];
      const notStarted = !entity.queue.isStarted();
      const notFinished = !entity.queue.isFinished();
      if ((notStarted && entity.queue.commandList_.length > 0) || notFinished) {
        return true;
      }
    }
    return false;
  }

  isEntityDied(entityType, count = 1) {
    var deathCount = this.controller.levelEntity.entityDeathCount;
    if (deathCount.has(entityType)) {
      if (deathCount.get(entityType) >= count) {
        return true;
      }
    }
    return false;
  }

  getScore() {
    return this.controller.score;
  }

  getEntityCount(entityType) {
    var entityList = this.controller.levelEntity.getEntitiesOfType(entityType);
    return entityList.length;
  }

  getCommandExecutedCount(commandName, targetType) {
    return this.controller.getCommandCount(commandName, targetType, false);
  }

  getRepeatCommandExecutedCount(commandName, targetType) {
    return this.controller.getCommandCount(commandName, targetType, true);
  }

  getTurnRandomCount() {
    return this.controller.turnRandomCount;
  }

  getInventoryAmount(inventoryType) {
    if (!this.usePlayer) {
      return 0;
    }
    if (inventoryType === "all" || inventoryType === "All") {
      var inventory = this.player.inventory;
      var count = 0;
      for (var key in inventory) {
        count += inventory[key];
      }
      return count;
    }
    return this.player.inventory[inventoryType];
  }

  getInventoryTypes() {
    if (!this.usePlayer) {
      return [];
    }
    return Object.keys(this.player.inventory);
  }

  countOfTypeOnMap(blockType) {
    var count = 0,
      i;

    for (i = 0; i < this.planeArea(); ++i) {
      if (blockType === this.actionPlane[i].blockType) {
        ++count;
      }
    }
    return count;
  }

  isPlayerAt(position) {
    if (!this.usePlayer) {
      return false;
    }
    return this.player.position[0] === position[0] &&
      this.player.position[1] === position[1];
  }

  spritePositionToIndex(offset, spritePosition) {
    var position = [spritePosition[0] - offset[0], spritePosition[1] - offset[1]];
    return [position[0] / 40, position[1] / 40];
  }

  solutionMapMatchesResultMap(solutionMap) {
    for (var i = 0; i < this.planeArea(); i++) {
      var solutionItemType = solutionMap[i];

      // "" on the solution map means we dont care what's at that spot
      if (solutionItemType !== "") {
        if (solutionItemType === "empty") {
          if (!this.actionPlane[i].isEmpty) {
            return false;
          }
        } else if (solutionItemType === "any") {
          if (this.actionPlane[i].isEmpty) {
            return false;
          }
        } else if (this.actionPlane[i].blockType !== solutionItemType) {
          return false;
        }
      }
    }
    return true;
  }

  getTnt() {
    var tnt = [];
    for (var x = 0; x < this.planeWidth; ++x) {
      for (var y = 0; y < this.planeHeight; ++y) {
        var index = this.coordinatesToIndex([x, y]);
        var block = this.actionPlane[index];
        if (block.blockType === "tnt") {
          tnt.push([x, y]);
        }
      }
    }
    return tnt;
  }

  getUnpoweredRails() {
    var unpoweredRails = [];
    for (var x = 0; x < this.planeWidth; ++x) {
      for (var y = 0; y < this.planeHeight; ++y) {
        var index = this.coordinatesToIndex([x, y]);
        var block = this.actionPlane[index];
        if (block.blockType.substring(0, 7) === "railsUn") {
          unpoweredRails.push([x, y], "railsPowered" + this.actionPlane[index].blockType.substring(14));
        }
      }
    }
    return unpoweredRails;
  }

  getMoveForwardPosition(entity = this.player) {
    var cx = entity.position[0],
      cy = entity.position[1];

    switch (entity.facing) {
      case FacingDirection.Up:
        --cy;
        break;

      case FacingDirection.Down:
        ++cy;
        break;

      case FacingDirection.Left:
        --cx;
        break;

      case FacingDirection.Right:
        ++cx;
        break;
    }

    return [cx, cy];
  }

  getPushBackPosition(entity, pushedByFacing) {
    var cx = entity.position[0],
      cy = entity.position[1];

    switch (pushedByFacing) {
      case FacingDirection.Up:
        --cy;
        break;

      case FacingDirection.Down:
        ++cy;
        break;

      case FacingDirection.Left:
        --cx;
        break;

      case FacingDirection.Right:
        ++cx;
        break;
    }

    return [cx, cy];
  }

  getMoveDirectionPosition(entity = this.player, facing) {
    let currentFacing = entity.facing;
    this.turnToDirection(entity, facing);
    let position = this.getMoveForwardPosition(entity);
    this.turnToDirection(entity, currentFacing);
    return position;
  }

  isForwardBlockOfType(blockType) {
    let blockForwardPosition = this.getMoveForwardPosition();

    let actionIsEmpty = this.isBlockOfTypeOnPlane(blockForwardPosition, "empty", this.actionPlane);

    if (blockType === '' && actionIsEmpty) {
      return true;
    }

    return actionIsEmpty ?
      this.isBlockOfTypeOnPlane(blockForwardPosition, blockType, this.groundPlane) :
      this.isBlockOfTypeOnPlane(blockForwardPosition, blockType, this.actionPlane);
  }

  getForwardBlockType() {
    return this.getForwardBlock().blockType;
  }

  getForwardBlock() {
    let blockForwardPosition = this.getMoveForwardPosition();
    return this.actionPlane.getBlockAt(blockForwardPosition);
  }

  isBlockOfType(position, blockType) {
    return this.isBlockOfTypeOnPlane(position, blockType, this.actionPlane);
  }

  isEntityOfType(position, type) {
    var entities = this.controller.levelEntity.getEntitiesOfType(type);
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      return (position[0] === entity.position[0]) && (position[1] === entity.position[1]);
    }
    return false;
  }

  isBlockOfTypeOnPlane(position, blockType, plane) {
    var result = false;

    let [x, y] = position;
    if (this.inBounds(x, y)) {

      if (blockType === "empty") {
        result = plane.getBlockAt(position).isEmpty;
      } else if (blockType === "tree") {
        result = plane.getBlockAt(position).getIsTree();
      } else {
        result = (blockType === plane.getBlockAt(position).blockType);
      }
    }

    return result;
  }

  isPlayerStandingInWater() {
    return this.groundPlane.getBlockAt(this.player.position).blockType === "water";
  }

  isPlayerStandingInLava() {
    return this.groundPlane.getBlockAt(this.player.position).blockType === "lava";
  }

  coordinatesToIndex(coordinates) {
    return this.yToIndex(coordinates[1]) + coordinates[0];
  }

  checkPositionForTypeAndPush(blockType, position, objectArray) {
    if ((!blockType && (this.actionPlane.getBlockAt(position).blockType !== "")) || this.isBlockOfType(position, blockType)) {
      objectArray.push([true, position]);
      return true;
    } else {
      objectArray.push([false, null]);
      return false;
    }
  }

  houseGroundToFloorHelper(position, woolType, arrayCheck) {
    var checkActionBlock,
      posAbove,
      posBelow,
      posRight,
      posLeft,
      checkIndex = 0,
      array = arrayCheck;
    let index = this.yToIndex(position[2]) + position[1];

    if (index === 44) {
      index = 44;
    }

    posAbove = [0, position[1], position[2] + 1];
    posAbove[0] = this.yToIndex(posAbove[2]) + posAbove[1];

    posBelow = [0, position[1], position[2] - 1];
    posBelow[0] = this.yToIndex(posBelow[2]) + posBelow[1];

    posRight = [0, position[1] + 1, position[2]];
    posRight[0] = this.yToIndex(posRight[2]) + posRight[1];

    posLeft = [0, position[1] - 1, position[2]];
    posRight[0] = this.yToIndex(posRight[2]) + posRight[1];

    checkActionBlock = this.actionPlane[index];
    for (var i = 0; i < array.length; ++i) {
      if (array[i][0] === index) {
        checkIndex = -1;
        break;
      }
    }

    if (checkActionBlock.blockType !== "") {
      return {};
    } else if (array.length > 0 && checkIndex === -1) {
      return {};
    }
    array.push(position);
    array.concat(this.houseGroundToFloorHelper(posAbove, woolType, array));
    array.concat(this.houseGroundToFloorHelper(posBelow, woolType, array));
    array.concat(this.houseGroundToFloorHelper(posRight, woolType, array));
    array.concat(this.houseGroundToFloorHelper(posLeft, woolType, array));

    return array;
  }

  houseGroundToFloorBlocks(startingPosition) {
    //checkCardinalDirections for actionblocks.
    //If no action block and square isn't the type we want.
    //Change it.
    var woolType = "wool_orange";

    //Place this block here
    //this.createBlock(this.groundPlane, startingPosition[0], startingPosition[1], woolType);
    var helperStartData = [0, startingPosition[0], startingPosition[1]];
    return this.houseGroundToFloorHelper(helperStartData, woolType, []);
  }

  getEntityAt(position) {
    for (var entity of this.controller.levelEntity.entityMap) {
      if (entity[1].position[0] === position[0] && entity[1].position[1] === position[1]) {
        return entity[1];
      }
    }
    return undefined;
  }

  getAllBorderingPositionNotOfType(position, blockType) {
    var surroundingBlocks = this.getAllBorderingPosition(position, null);
    for (var b = 1; b < surroundingBlocks.length; ++b) {
      if (surroundingBlocks[b][0] && this.actionPlane[this.coordinatesToIndex(surroundingBlocks[b][1])].blockType === blockType) {
        surroundingBlocks[b][0] = false;
      }
    }
    return surroundingBlocks;
  }

  getAllBorderingPosition(position, blockType) {
    var p;
    var allFoundObjects = [false];
    //Check all 8 directions

    //Top Right
    p = [position[0] + 1, position[1] + 1];
    if (this.checkPositionForTypeAndPush(blockType, p, allFoundObjects)) {
      allFoundObjects[0] = true;
    }
    //Top Left
    p = [position[0] - 1, position[1] + 1];
    if (this.checkPositionForTypeAndPush(blockType, p, allFoundObjects)) {
      allFoundObjects[0] = true;
    }
    //Bot Right
    p = [position[0] + 1, position[1] - 1];
    if (this.checkPositionForTypeAndPush(blockType, p, allFoundObjects)) {
      allFoundObjects[0] = true;
    }
    //Bot Left
    p = [position[0] - 1, position[1] - 1];
    if (this.checkPositionForTypeAndPush(blockType, p, allFoundObjects)) {
      allFoundObjects[0] = true;
    }

    //Check cardinal Directions
    //Top
    p = [position[0], position[1] + 1];
    if (this.checkPositionForTypeAndPush(blockType, p, allFoundObjects)) {
      allFoundObjects[0] = true;
    }
    //Bot
    p = [position[0], position[1] - 1];
    if (this.checkPositionForTypeAndPush(blockType, p, allFoundObjects)) {
      allFoundObjects[0] = true;
    }
    //Right
    p = [position[0] + 1, position[1]];
    if (this.checkPositionForTypeAndPush(blockType, p, allFoundObjects)) {
      allFoundObjects[0] = true;
    }
    //Left
    p = [position[0] - 1, position[1]];
    if (this.checkPositionForTypeAndPush(blockType, p, allFoundObjects)) {
      allFoundObjects[0] = true;
    }

    return allFoundObjects;
  }

  getAllBorderingPlayer(blockType) {
    return this.getAllBorderingPosition(this.player.position, blockType);
  }

  isPlayerStandingNearCreeper() {
    return this.getAllBorderingPlayer("creeper");
  }

  getMinecartTrack() {
    var track = [];
    track.push(["down", [3, 2], FacingDirection.Down, 300]);
    track.push(["down", [3, 3], FacingDirection.Down, 300]);
    track.push(["down", [3, 4], FacingDirection.Down, 300]);
    track.push(["down", [3, 5], FacingDirection.Down, 300]);
    track.push(["down", [3, 6], FacingDirection.Down, 300]);
    track.push(["down", [3, 7], FacingDirection.Down, 300]);
    track.push(["turn_left", [3, 7], FacingDirection.Right, 400]);
    track.push(["right", [4, 7], FacingDirection.Right, 400]);
    track.push(["right", [5, 7], FacingDirection.Right, 400]);
    track.push(["right", [6, 7], FacingDirection.Right, 400]);
    track.push(["right", [7, 7], FacingDirection.Right, 400]);
    track.push(["right", [8, 7], FacingDirection.Right, 400]);
    track.push(["right", [9, 7], FacingDirection.Right, 400]);
    track.push(["right", [10, 7], FacingDirection.Right, 400]);
    track.push(["right", [11, 7], FacingDirection.Right, 400]);
    return track;
  }

  canMoveForward(entity = this.player) {
    let blockForwardPosition = this.getMoveForwardPosition(entity);
    return this.isPositionEmpty(blockForwardPosition);
  }

  isPositionEmpty(position) {
    var result = [false,];
    let [x, y] = position;

    if (this.inBounds(x, y)) {
      if (!this.actionPlane.getBlockAt(position).isWalkable) {
        result.push("notWalkable");
      }
      if (!this.actionPlane.getBlockAt(position).isEmpty) {
        if (this.player.isOnBlock) {
          return [true];
        }
        result.push("notEmpty");
      }
      // Only prevent walking into water/lava in "Events" levels.
      if (this.groundPlane.getBlockAt(position).blockType === "water") {
        if (this.controller.levelData.isEventLevel) {
          result.push("water");
        } else {
          return [true];
        }
      } else if (this.groundPlane.getBlockAt(position).blockType === "lava") {
        if (this.controller.levelData.isEventLevel) {
          result.push("lava");
        } else {
          return [true];
        }
      }
      var frontEntity = this.getEntityAt(position);
      if (frontEntity !== undefined) {
        result.push("frontEntity");
        result.push(frontEntity);
      }
      result[0] = (this.actionPlane.getBlockAt(position).isWalkable || ((frontEntity !== undefined && frontEntity.isOnBlock)
        // action plane is empty
        && !this.actionPlane.getBlockAt(position).isEmpty))
        // there is no entity
        && (frontEntity === undefined)
        // no lava or water
        && (this.groundPlane.getBlockAt(position).blockType !== "water" && this.groundPlane.getBlockAt(position).blockType !== "lava");
    } else {
      result.push("outBound");
    }

    return result;
  }

  canMoveDirection(entity = this.player, direction) {
    // save current direction of the entity
    var currentDirection = entity.facing;
    this.turnToDirection(entity, direction);
    var result = this.canMoveForward(entity);
    // rerotate the entity to the saved direction
    this.turnToDirection(entity, currentDirection);
    return result;
  }

  canPlaceBlock() {
    return true;
  }

  canPlaceBlockForward() {
    if (this.player.isOnBlock) {
      return false;
    }

    return this.getPlaneToPlaceOn(this.getMoveForwardPosition()) !== null;
  }

  getPlaneToPlaceOn(position) {
    let [x, y] = position;

    if (this.inBounds(x, y)) {
      let actionBlock = this.actionPlane.getBlockAt(position);
      if (actionBlock.isPlacable) {
        let groundBlock = this.groundPlane.getBlockAt(position);
        if (groundBlock.isPlacable) {
          return this.groundPlane;
        }
        return this.actionPlane;
      }
    }

    return null;
  }

  canDestroyBlockForward() {
    var result = false;

    if (!this.player.isOnBlock) {
      let blockForwardPosition = this.getMoveForwardPosition();
      let [x, y] = blockForwardPosition;

      if (this.inBounds(x, y)) {
        let block = this.actionPlane.getBlockAt(blockForwardPosition);
        result = !block.isEmpty && (block.isDestroyable || block.isUsable);
      }
    }

    return result;
  }

  moveForward(entity = this.player) {
    let blockForwardPosition = this.getMoveForwardPosition(entity);
    this.moveTo(blockForwardPosition, entity);
  }

  moveTo(position, entity = this.player) {
    entity.position = position;

    if (this.actionPlane.getBlockAt(position).isEmpty) {
      entity.isOnBlock = false;
    }
  }

  turnLeft(entity = this.player) {

    switch (entity.facing) {
      case FacingDirection.Up:
        entity.facing = FacingDirection.Left;
        break;

      case FacingDirection.Left:
        entity.facing = FacingDirection.Down;
        break;

      case FacingDirection.Down:
        entity.facing = FacingDirection.Right;
        break;

      case FacingDirection.Right:
        entity.facing = FacingDirection.Up;
        break;
    }
  }

  turnRight(entity = this.player) {
    switch (entity.facing) {
      case FacingDirection.Up:
        entity.facing = FacingDirection.Right;
        break;

      case FacingDirection.Right:
        entity.facing = FacingDirection.Down;
        break;

      case FacingDirection.Down:
        entity.facing = FacingDirection.Left;
        break;

      case FacingDirection.Left:
        entity.facing = FacingDirection.Up;
        break;
    }
  }

  turnToDirection(entity = this.player, direction) {
    entity.facing = direction;
  }

  moveDirection(entity = this.player, direction) {
    this.turnToDirection(entity, direction);
    this.moveForward();
  }

  placeBlock(blockType) {
    const position = this.player.position;
    var shouldPlace = false;

    switch (blockType) {
      case "cropWheat":
        shouldPlace = this.groundPlane.getBlockAt(position).blockType === "farmlandWet";
        break;

      default:
        shouldPlace = true;
        break;
    }

    if (shouldPlace === true) {
      var block = new LevelBlock(blockType);

      this.actionPlane.setBlockAt(position, block);
      this.player.isOnBlock = !block.isWalkable;
    }

    return shouldPlace;
  }

  placeBlockForward(blockType, targetPlane) {
    let blockPosition = this.getMoveForwardPosition();

    //for placing wetland for crops in free play
    if (blockType === "watering") {
      blockType = "farmlandWet";
      targetPlane = this.groundPlane;
    }
    let newBlock = new LevelBlock(blockType);
    let newBlockType = blockType;

    let connectingBlock = this.checkConnectionOnPlace("redstoneWire", blockType, targetPlane)
    // If checkConnection didn't handle the placement, we'll revert to standard methods
    if (!connectingBlock) {
      targetPlane.setBlockAt(blockPosition, newBlock);
    }
    let index = this.yToIndex(blockPosition[1]) + blockPosition[0];
    newBlock = targetPlane[index];
    return newBlock.blockType;
  }
  
  checkConnectionOnPlace(substring, blockType, targetPlane) {
    let newBlock = new LevelBlock(blockType);
    if (blockType.substring(0,substring.length) === substring) {
      let blockPosition = this.getMoveForwardPosition();
      let blockIndex = this.yToIndex(blockPosition[1]) + blockPosition[0];
      let topIndex = blockIndex - this.controller.levelModel.actionPlane.height;
      let bottomIndex = blockIndex + this.controller.levelModel.actionPlane.height;
      let rightIndex = blockIndex + 1;
      let leftIndex = blockIndex - 1;

      // To future proof, we want the determination function to be based on the substring.
      var funtion_pointer = null;
      // Just add more cases here if we have more connection dependent block types.
      switch(substring) {
        case "redstoneWire":
        funtion_pointer = this.determineRedstoneSprite.bind(this);
        break;
      }

      // Extra work when placing is to determine the right sprite to draw.
      let newBlockType = funtion_pointer(blockPosition[0], blockPosition[1], newBlock);
      newBlock = new LevelBlock(newBlockType);
      targetPlane.setBlockAt(blockPosition, newBlock);

      let indices = [];

      // We want to check adjacent blocks as well:
      if (this.inBounds(blockPosition[0], blockPosition[1] - 1)) {
        if (this.actionPlane[topIndex].blockType.substring(0,12) === substring) {
          let upBlockType = funtion_pointer(blockPosition[0], blockPosition[1] - 1, newBlock);
          this.actionPlane[this.yToIndex(blockPosition[1] - 1) + blockPosition[0]].blockType = upBlockType;
          indices.push(topIndex);
        }
      }
      if (this.inBounds(blockPosition[0], blockPosition[1] + 1)) {
        if (this.actionPlane[bottomIndex].blockType.substring(0,12) === substring) {
          let downBlockType = funtion_pointer(blockPosition[0], blockPosition[1] + 1, newBlock);
          this.actionPlane[this.yToIndex(blockPosition[1] + 1) + blockPosition[0]].blockType = downBlockType;
          indices.push(bottomIndex);
        }
      }
      if (this.inBounds(blockPosition[0] + 1, blockPosition[1])) {
        if (this.actionPlane[rightIndex].blockType.substring(0,12) === substring) {
          let rightBlockType = funtion_pointer(blockPosition[0] + 1, blockPosition[1], newBlock);
          this.actionPlane[this.yToIndex(blockPosition[1]) + blockPosition[0] + 1].blockType = rightBlockType;
          indices.push(rightIndex);
        }
      }
      if (this.inBounds(blockPosition[0] - 1, blockPosition[1])) {
        if (this.actionPlane[leftIndex].blockType.substring(0,12) === substring) {
          let leftBlockType = funtion_pointer(blockPosition[0] - 1, blockPosition[1], newBlock);
          this.actionPlane[this.yToIndex(blockPosition[1]) + blockPosition[0] - 1].blockType = leftBlockType;
          indices.push(leftIndex);
        }
      }
      // After checking, refresh those indices
      this.controller.levelView.refreshActionPlane(this, indices);
      return true;
    } else {
      return false;
    }
  }

  destroyBlock(position) {
    var block = null;
    let [x, y] = [position[0], position[1]];

    if (this.inBounds(x, y)) {
      block = this.actionPlane.getBlockAt(position);
      if (block !== null) {
        block.position = [x, y];

        if (block.isDestroyable) {
          this.actionPlane.setBlockAt(position, new LevelBlock(""));
        }
      }
    }

    return block;
  }

  destroyBlockForward(entity) {
    var block = null;

    let blockForwardPosition = this.getMoveForwardPosition(entity);
    let [x, y] = blockForwardPosition;

    if (this.inBounds(x, y)) {
      block = this.actionPlane.getBlockAt(blockForwardPosition);
      if (block !== null) {

        if (block.isDestroyable) {
          this.actionPlane.setBlockAt(blockForwardPosition, new LevelBlock(""));
        }
      }
    }

    return block;
  }

  solveFOWTypeForMap() {
    var emissives,
      blocksToSolve;

    emissives = this.getAllEmissives();
    blocksToSolve = this.findBlocksAffectedByEmissives(emissives);

    for (var block in blocksToSolve) {
      if (blocksToSolve.hasOwnProperty(block)) {
        this.solveFOWTypeFor(blocksToSolve[block], emissives);
      }
    }
  }

  solveFOWTypeFor(position, emissives) {
    var emissivesTouching,
      topLeftQuad = false,
      botLeftQuad = false,
      leftQuad = false,
      topRightQuad = false,
      botRightQuad = false,
      rightQuad = false,
      topQuad = false,
      botQuad = false,
      angle = 0,
      index = this.coordinatesToIndex(position),
      x,
      y;

    emissivesTouching = this.findEmissivesThatTouch(position, emissives);

    for (var torch in emissivesTouching) {
      var currentTorch = emissivesTouching[torch];
      y = position[1];
      x = position[0];

      angle = Math.atan2(currentTorch[1] - position[1], currentTorch[0] - position[0]);
      //invert
      angle = -angle;
      //Normalize to be between 0 and 2*pi
      if (angle < 0) {
        angle += 2 * Math.PI;
      }
      //convert to degrees for simplicity
      angle *= 360 / (2 * Math.PI);

      //top right
      if (!rightQuad && angle > 32.5 && angle <= 57.5) {
        topRightQuad = true;
        this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_InCorner_TopRight", precedence: 0 });
      }//top left
      if (!leftQuad && angle > 122.5 && angle <= 147.5) {
        topLeftQuad = true;
        this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_InCorner_TopLeft", precedence: 0 });
      }//bot left
      if (!leftQuad && angle > 212.5 && angle <= 237.5) {
        botLeftQuad = true;
        this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_InCorner_BottomLeft", precedence: 0 });
      }//botright
      if (!rightQuad && angle > 302.5 && angle <= 317.5) {
        botRightQuad = true;
        this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_InCorner_BottomRight", precedence: 0 });
      }
      //right
      if (angle >= 327.5 || angle <= 32.5) {
        rightQuad = true;
        this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_Right", precedence: 1 });
      }//bot
      if (angle > 237.5 && angle <= 302.5) {
        botQuad = true;
        this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_Bottom", precedence: 1 });
      }
      //left
      if (angle > 147.5 && angle <= 212.5) {
        leftQuad = true;
        this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_Left", precedence: 1 });
      }
      //top
      if (angle > 57.5 && angle <= 122.5) {
        topQuad = true;
        this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_Top", precedence: 1 });
      }
    }

    if (topLeftQuad && botLeftQuad) {
      this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_Left", precedence: 1 });
    }
    if (topRightQuad && botRightQuad) {
      this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_Right", precedence: 1 });
    }
    if (topLeftQuad && topRightQuad) {
      this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_Top", precedence: 1 });
    }
    if (botRightQuad && botLeftQuad) {
      this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_Bottom", precedence: 1 });
    }

    if ((botRightQuad && topLeftQuad) || (botLeftQuad && topRightQuad) || leftQuad && rightQuad || topQuad && botQuad || (rightQuad && botQuad && topLeftQuad) ||
      (botQuad && topRightQuad && topLeftQuad) || (topQuad && botRightQuad && botLeftQuad) || (leftQuad && topRightQuad && botRightQuad) || (leftQuad && botQuad && topRightQuad)) {
      //fully lit
      this.fowPlane[index] = "";
    } else if ((botQuad && leftQuad) || (botQuad && topLeftQuad) || (leftQuad && botRightQuad)) {
      // darkend botleft corner
      this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_Bottom_Left", precedence: 2 });
    } else if ((botQuad && rightQuad) || (botQuad && topRightQuad) || (rightQuad && botLeftQuad)) {
      // darkend botRight corner
      this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_Bottom_Right", precedence: 2 });
    } else if ((topQuad && rightQuad) || (topQuad && botRightQuad) || (rightQuad && topLeftQuad)) {
      // darkend topRight corner
      this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_Top_Right", precedence: 2 });
    } else if ((topQuad && leftQuad) || (topQuad && botLeftQuad) || (leftQuad && topRightQuad)) {
      // darkend topLeft corner
      this.pushIfHigherPrecedence(index, { x: x, y: y, type: "FogOfWar_Top_Left", precedence: 2 });
    }
  }

  pushIfHigherPrecedence(index, fowObject) {
    if (fowObject === "") {
      this.fowPlane[index] = "";
      return;
    }
    var existingItem = this.fowPlane[index];
    if (existingItem && existingItem.precedence > fowObject.precedence) {
      return;
    }
    this.fowPlane[index] = fowObject;
  }

  getAllEmissives() {
    var emissives = [];
    for (var y = 0; y < this.planeHeight; ++y) {
      for (var x = 0; x < this.planeWidth; ++x) {
        var index = this.coordinatesToIndex([x, y]);
        if (!this.actionPlane[index].isEmpty && this.actionPlane[index].isEmissive || this.groundPlane[index].isEmissive && this.actionPlane[index].isEmpty) {
          emissives.push([x, y]);
        }
      }
    }
    return emissives;
  }

  findBlocksAffectedByEmissives(emissives) {
    var blocksTouchedByEmissives = {};
    //find emissives that are close enough to light us.
    for (var torch in emissives) {
      var currentTorch = emissives[torch];
      let y = currentTorch[1];
      let x = currentTorch[0];
      for (var yIndex = currentTorch[1] - 2; yIndex <= (currentTorch[1] + 2); ++yIndex) {
        for (var xIndex = currentTorch[0] - 2; xIndex <= (currentTorch[0] + 2); ++xIndex) {

          //Ensure we're looking inside the map
          if (!this.inBounds(xIndex, yIndex)) {
            continue;
          }

          //Ignore the indexes directly around us.
          //Theyre taken care of on the FOW first pass
          if ((yIndex >= y - 1 && yIndex <= y + 1) && (xIndex >= x - 1 && xIndex <= x + 1)) {
            continue;
          }

          //we want unique copies so we use a map.
          blocksTouchedByEmissives[yIndex.toString() + xIndex.toString()] = [xIndex, yIndex];
        }
      }
    }

    return blocksTouchedByEmissives;
  }

  findEmissivesThatTouch(position, emissives) {
    var emissivesThatTouch = [];
    let y = position[1];
    let x = position[0];
    //find emissives that are close enough to light us.
    for (var yIndex = y - 2; yIndex <= (y + 2); ++yIndex) {
      for (var xIndex = x - 2; xIndex <= (x + 2); ++xIndex) {

        //Ensure we're looking inside the map
        if (!this.inBounds(xIndex, yIndex)) {
          continue;
        }

        //Ignore the indexes directly around us.
        if ((yIndex >= y - 1 && yIndex <= y + 1) && (xIndex >= x - 1 && xIndex <= x + 1)) {
          continue;
        }

        for (var torch in emissives) {
          if (emissives[torch][0] === xIndex && emissives[torch][1] === yIndex) {
            emissivesThatTouch.push(emissives[torch]);
          }
        }
      }
    }

    return emissivesThatTouch;
  }

  computeFowPlane() {
    var x, y;

    this.fowPlane = [];
    if (this.isDaytime) {
      for (y = 0; y < this.planeHeight; ++y) {
        for (x = 0; x < this.planeWidth; ++x) {
          // this.fowPlane.push[""]; // noop as originally written
          // TODO(bjordan) completely remove?
        }
      }
    } else {
      // compute the fog of war for light emitting blocks
      for (y = 0; y < this.planeHeight; ++y) {
        for (x = 0; x < this.planeWidth; ++x) {
          this.fowPlane.push({ x: x, y: y, type: "FogOfWar_Center" });
        }
      }

      //second pass for partial lit squares
      this.solveFOWTypeForMap();

      for (y = 0; y < this.planeHeight; ++y) {
        for (x = 0; x < this.planeWidth; ++x) {
          const groundBlock = this.groundPlane.getBlockAt([x, y]);
          const actionBlock = this.actionPlane.getBlockAt([x, y]);

          if (groundBlock.isEmissive && actionBlock.isEmpty ||
            (!actionBlock.isEmpty && actionBlock.isEmissive)) {
            this.clearFowAround(x, y);
          }
        }
      }

    }
  }

  clearFowAround(x, y) {
    var ox, oy;

    for (oy = -1; oy <= 1; ++oy) {
      for (ox = -1; ox <= 1; ++ox) {
        this.clearFowAt(x + ox, y + oy);
      }
    }
  }

  clearFowAt(x, y) {
    if (x >= 0 && x < this.planeWidth && y >= 0 && y < this.planeHeight) {
      let blockIndex = this.yToIndex(y) + x;
      this.fowPlane[blockIndex] = "";
    }
  }

  clearFow() {
    for (var x = 0; x < this.planeWidth; x++) {
      for (var y = 0; y < this.planeHeight; y++) {
        let blockIndex = this.yToIndex(y) + x;
        this.fowPlane[blockIndex] = "";
      }
    }
  }

  determineRedstoneSprite(x, y, blockType) {
        let foundAbove = false;
        let foundBelow = false;
        let foundRight = false;
        let foundLeft = false;
        let myIndex = (this.yToIndex(y) + x);
        let belowIndex = (this.yToIndex(y + 1)) + x;
        let aboveIndex = (this.yToIndex(y - 1)) + x;
        let leftIndex = (this.yToIndex(y)) + x - 1;
        let rightIndex = (this.yToIndex(y)) + x + 1;

        let borderCount = 0;
        let whatIsThis = this.actionPlane;
        
        if (!this.inBounds(x, y)) {
            // If we're looking out of bounds, just leave, you goofball.
            return;
        }
        // If in bounds, we want to see if any redstone is around the index in question
        // Below index
        if (this.inBounds(x, y + 1)) {
            if (this.actionPlane[belowIndex].blockType.substring(0,12) === "redstoneWire") {
                foundBelow = true;
                ++borderCount;
            }
        }
        // Above index
        if (this.inBounds(x, y - 1)) {
            if (this.actionPlane[aboveIndex].blockType.substring(0,12) === "redstoneWire") {
                foundAbove = true;
                ++borderCount;
            }
        }
        // Right index
        if (this.inBounds(x + 1, y)) {
            if (this.actionPlane[rightIndex].blockType.substring(0,12) === "redstoneWire") {
                foundRight = true;
                ++borderCount;
            }
        }
        // Left index
        if (this.inBounds(x - 1, y)) {
            if (this.actionPlane[leftIndex].blockType.substring(0,12) === "redstoneWire") {
                foundLeft = true;
                ++borderCount;
            }
        }

        if (borderCount === 0) {
            // No connecting redstone wire.
            this.actionPlane[myIndex].blockType = "redstoneWire";
        } else if (borderCount === 1) {
            // Only 1 connection extends a line.
            if (foundBelow || foundAbove) {
                this.actionPlane[myIndex].blockType = "redstoneWireVertical";
            } else if (foundLeft || foundRight) {
                this.actionPlane[myIndex].blockType = "redstoneWireHorizontal";
            }
        } else if (borderCount === 2) {
            if ((foundBelow || foundAbove) && !foundRight && !foundLeft){
                // Purely vertical, no left or right.
                this.actionPlane[myIndex].blockType = "redstoneWireVertical";
            } else if ((foundRight || foundLeft) && !foundBelow && !foundAbove){
                // Purely horizontal, no above or below.
                this.actionPlane[myIndex].blockType = "redstoneWireHorizontal";
            } else {
                // We have a corner and will need to rotate.
                if (foundBelow) {
                    // If we have a blow, the other has to be right or left.
                    if (foundLeft) {
                        this.actionPlane[myIndex].blockType = "redstoneWireDownLeft";
                    } else {
                        this.actionPlane[myIndex].blockType = "redstoneWireDownRight";
                    }
                } else {
                    // If not below, then above + left or right.
                    if (foundLeft) {
                        this.actionPlane[myIndex].blockType = "redstoneWireUpLeft";
                    } else {
                        this.actionPlane[myIndex].blockType = "redstoneWireUpRight";
                    }
                }
            }
        } else if (borderCount === 3) {
            // We are deciding between T sprite orientations.
            if (!foundBelow) {
                this.actionPlane[myIndex].blockType = "redstoneWireTUp";
            } else if (!foundAbove) {
                this.actionPlane[myIndex].blockType = "redstoneWireTDown";
            } else if (!foundLeft) {
                this.actionPlane[myIndex].blockType = "redstoneWireTRight";
            } else if (!foundRight) {
                this.actionPlane[myIndex].blockType = "redstoneWireTLeft";
            }
        } else if (borderCount === 4) {
            // All four sides connected: Cross.
            this.actionPlane[myIndex].blockType = "redstoneWireCross";
        }
    return this.actionPlane[myIndex].blockType;
  }

  computeShadingPlane() {
    var x,
      y,
      index,
      hasRight;

    this.shadingPlane = [];

    for (index = 0; index < this.planeArea(); ++index) {
      x = index % this.planeWidth;
      y = Math.floor(index / this.planeWidth);

      hasRight = false;

      if (this.actionPlane[index].isEmpty || this.actionPlane[index].isTransparent) {
        if (y === 0) {
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Bottom' });
        }

        if (y === this.planeHeight - 1) {
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Top' });
        }

        if (x === 0) {
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Right' });
        }

        if (x === this.planeWidth - 1) {
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Left' });
        }

        if (x < this.planeWidth - 1 && !this.actionPlane[this.yToIndex(y) + x + 1].getIsEmptyOrEntity()) {
          // needs a left side AO shadow
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Left' });
        }

        if (x > 0 && !this.actionPlane[this.yToIndex(y) + x - 1].getIsEmptyOrEntity()) {
          // needs a right side AO shadow
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Right' });
          this.shadingPlane.push({
            x: x,
            y: y,
            type: 'Shadow_Parts_Fade_base.png'
          });

          if (y > 0 && x > 0 && this.actionPlane[this.yToIndex(y - 1) + x - 1].getIsEmptyOrEntity()) {
            this.shadingPlane.push({
              x: x,
              y: y,
              type: 'Shadow_Parts_Fade_top.png'
            });
          }

          hasRight = true;
        }

        if (y > 0 && !this.actionPlane[this.yToIndex(y - 1) + x].getIsEmptyOrEntity()) {
          // needs a bottom side AO shadow
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Bottom' });
        } else if (y > 0) {
          if (x < this.planeWidth - 1 && !this.actionPlane[this.yToIndex(y - 1) + x + 1].getIsEmptyOrEntity() &&
            this.actionPlane[this.yToIndex(y) + x + 1].getIsEmptyOrEntity()) {
            // needs a bottom left side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_BottomLeft' });
          }

          if (!hasRight && x > 0 && !this.actionPlane[this.yToIndex(y - 1) + x - 1].getIsEmptyOrEntity()) {
            // needs a bottom right side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_BottomRight' });
          }
        }

        if (y < this.planeHeight - 1) {
          if (x < this.planeWidth - 1 && !this.actionPlane[this.yToIndex(y + 1) + x + 1].getIsEmptyOrEntity() &&
            this.actionPlane[this.yToIndex(y) + x + 1].getIsEmptyOrEntity()) {
            // needs a bottom left side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_TopLeft' });
          }

          if (!hasRight && x > 0 && !this.actionPlane[this.yToIndex(y + 1) + x - 1].getIsEmptyOrEntity()) {
            // needs a bottom right side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_TopRight' });
          }
        }
      }
    }
  }
};
