import LevelBlock from "./LevelBlock.js"
import FacingDirection from "./FacingDirection.js"

// for blocks on the action plane, we need an actual "block" object, so we can model

export default class LevelModel {
  constructor(levelData) {
    console.log("LevelModel::constructor");
    this.player = {};

    this.initialLevelData = Object.create(levelData);

    this.reset();

    this.initialPlayerState = Object.create(this.player);
  }

  reset() {
    console.log("LevelModel::reset");
    this.groundPlane = this.constructPlane(this.initialLevelData.groundPlane, false);
    this.groundDecorationPlane = this.constructPlane(this.initialLevelData.groundDecorationPlane, false);
    this.shadingPlane = [];
    this.actionPlane = this.constructPlane(this.initialLevelData.actionPlane, true);
    this.fluffPlane = this.constructPlane(this.initialLevelData.fluffPlane, false);
    this.fowPlane = [];
    this.isDaytime = this.initialLevelData.isDaytime === undefined || this.initialLevelData.isDaytime;

    let levelData = Object.create(this.initialLevelData);
    let [x, y] = [levelData.playerStartPosition[0], levelData.playerStartPosition[1]];

    this.player.name = this.initialLevelData.playerName || "Steve";
    this.player.position = levelData.playerStartPosition;
    this.player.isOnBlock = !this.actionPlane[(y * 10) + x].getIsEmptyOrEntity();
    this.player.facing = levelData.playerStartDirection;

    this.player.inventory = {};

    this.computeShadingPlane();
    this.computeFowPlane();
  }

  constructPlane(planeData, isActionPlane) {
    var index,
        result = [],
        block;

    for (index = 0; index < planeData.length; ++index) {
      block = new LevelBlock(planeData[index]);
      block.isWalkable = !isActionPlane || planeData[index] === "";
      block.isPlacable = (isActionPlane && block.isEmpty) ||
          (block.blockType === "lava" || block.blockType === "water");
      block.isUsable = isActionPlane && !block.isEmpty;
      result.push(block);
    }

    return result;
  }

  isSolved()  {
      return this.initialLevelData.verificationFunction(this);
  }

    // Verifications
  isPlayerNextTo(blockType) {
    var position;
    var result = false;

    // above
    position = [this.player.position[0], this.player.position[1] - 1];
    if (this.isBlockOfType(position, blockType)) {
      return true;
    }

    // below
    position = [this.player.position[0], this.player.position[1] + 1];
    if (this.isBlockOfType(position, blockType)) {
      return true;
    }

    // left
    position = [this.player.position[0] + 1, this.player.position[1]];
    if (this.isBlockOfType(position, blockType)) {
      return true;
    }

    // Right
    position = [this.player.position[0] - 1, this.player.position[1]];
    if (this.isBlockOfType(position, blockType)) {
      return true;
    }

    return false;
  }

  getInventoryAmount(inventoryType) {
    return this.player.inventory[inventoryType] || 0;
  };


  getInventoryTypes() {
    return Object.keys(this.player.inventory);
  };

  countOfTypeOnMap(blockType) {
    var count = 0,
        i;

    for (i = 0; i < 100; ++i) {
      if (blockType == this.actionPlane[i].blockType) {
        ++count;
      }
    }
    return count;
  }

  isPlayerAt(position) {
      return this.player.position[0] === position[0] &&
          this.player.position[1] === position[1];
  }

  solutionMapMatchesResultMap(solutionMap) {
    for (var i = 0; i < 100; i++) {
      var solutionItemType = solutionMap[i];

      // "" on the solution map means we dont care what's at that spot
      if (solutionItemType != "") {
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

  getMoveForwardPosition() {
    var cx = this.player.position[0],
        cy = this.player.position[1];

    switch (this.player.facing) {
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

  isForwardBlockOfType(blockType) {
    let blockForwardPosition = this.getMoveForwardPosition();

    let actionIsEmpty = this.isBlockOfTypeOnPlane(blockForwardPosition, "empty", this.actionPlane);

    if (blockType === '' && actionIsEmpty) {
      return true;
    }

    return actionIsEmpty ?
        this.isBlockOfTypeOnPlane(blockForwardPosition, blockType, this.groundPlane) :
        this.isBlockOfTypeOnPlane(blockForwardPosition, blockType, this.actionPlane)
  }

  isBlockOfType(position, blockType)  {
      return this.isBlockOfTypeOnPlane(position, blockType, this.actionPlane);
  }

  isBlockOfTypeOnPlane(position, blockType, plane)  {
      var result = false;

      let blockIndex = (position[1] * 10) + position[0];
      if (blockIndex >= 0 && blockIndex < 100) {

          if (blockType == "empty") {
              result =  plane[blockIndex].isEmpty;
          } else if (blockType == "tree") {
              result = plane[blockIndex].getIsTree();
          } else {
              result = (blockType == plane[blockIndex].blockType);
          }
      }

      return result;
  }

  isPlayerStandingInWater(){
    let blockIndex = (this.player.position[1] * 10) + this.player.position[0];
    return this.groundPlane[blockIndex].blockType === "water";
  }

  isPlayerStandingInLava() {
    let blockIndex = (this.player.position[1] * 10) + this.player.position[0];
    return this.groundPlane[blockIndex].blockType === "lava";
  }

  coordinatesToIndex(coordinates){
    return (coordinates[1] * 10) + coordinates[0];
  }

  checkPositionForTypeAndPush(blockType, position, objectArray){
    if (this.isBlockOfType(position, blockType)) {
      objectArray.push([true, position]);
      return true;
    }
    else
    {
      objectArray.push([false, null]);
      return false;
    }
  }

  getAllBorderingPositions(position)
  {
    var positionArray = [];
        //Top Right
    positionArray.push([player.position[0] + 1, player.position[1] + 1]);
    //Top Left
    positionArray.push([player.position[0] - 1, player.position[1] + 1]);
    //Bot Right
    positionArray.push([player.position[0] + 1, player.position[1] - 1]);
    //Bot Left
    positionArray.push([player.position[0] - 1, player.position[1] - 1]);

    //Check cardinal Directions
    //Top
    positionArray.push([player.position[0], player.position[1] + 1]);
    //Bot
    positionArray.push([player.position[0], player.position[1] - 1]);
    //Right
    positionArray.push([player.position[0] + 1, player.position[1]]);
    //Left
    positionArray.push([player.position[0] - 1, player.position[1]]);

    return positionArray;
  }

  getAllBorderingPlayer(blockType){
    var player = this.player;
    var position;
    var allFoundObjects = [false];
    let actionPlane = this.actionPlane;
    let coordinatesToIndex = this.coordinatesToIndex;
    //Check all 8 directions

    //Top Right
    position = [player.position[0] + 1, player.position[1] + 1];
    if(this.checkPositionForTypeAndPush(blockType, position, allFoundObjects)) {
      allFoundObjects[0] = true;
    }
    //Top Left
    position = [player.position[0] - 1, player.position[1] + 1];
    if(this.checkPositionForTypeAndPush(blockType, position, allFoundObjects)) {
      allFoundObjects[0] = true;
    }
    //Bot Right
    position = [player.position[0] + 1, player.position[1] - 1];
    if(this.checkPositionForTypeAndPush(blockType, position, allFoundObjects)) {
      allFoundObjects[0] = true;
    }
    //Bot Left
    position = [player.position[0] - 1, player.position[1] - 1];
    if(this.checkPositionForTypeAndPush(blockType, position, allFoundObjects)) {
      allFoundObjects[0] = true;
    }

    //Check cardinal Directions
    //Top
    position = [player.position[0], player.position[1] + 1];
    if(this.checkPositionForTypeAndPush(blockType, position, allFoundObjects)) {
      allFoundObjects[0] = true;
    }
    //Bot
    position = [player.position[0], player.position[1] - 1];
    if(this.checkPositionForTypeAndPush(blockType, position, allFoundObjects)) {
      allFoundObjects[0] = true;
    }
    //Right
    position = [player.position[0] + 1, player.position[1]];
    if(this.checkPositionForTypeAndPush(blockType, position, allFoundObjects)) {
      allFoundObjects[0] = true;
    }
    //Left
    position = [player.position[0] - 1, player.position[1]];
    if(this.checkPositionForTypeAndPush(blockType, position, allFoundObjects)) {
      allFoundObjects[0] = true;
    }

    return allFoundObjects;
  }

  isBorderingPlayer(blockType){
    return getAllBorderingPlayer[0];
  }

  isPlayerStandingNearCreeper() {
    return this.getAllBorderingPlayer("creeper");
  }

  canMoveForward() {
    var result = false;

    let blockForwardPosition = this.getMoveForwardPosition();
    let blockIndex = (blockForwardPosition[1] * 10) + blockForwardPosition[0];
    let [x, y] = [blockForwardPosition[0], blockForwardPosition[1]];

    if (x >= 0 && x < 10 && y >= 0 && y < 10) {
      result = this.actionPlane[blockIndex].isWalkable ||
               (this.player.isOnBlock && !this.actionPlane[blockIndex].isEmpty);
    }

    return result;
  }

  canPlaceBlock() {
    return true;
  }

  canPlaceBlockForward() {
    if (this.player.isOnBlock) {
      return false;
    }

    return this.getPlaneToPlaceOn(this.getMoveForwardPosition()) != null;
  }

  getPlaneToPlaceOn(coordinates) {
    let blockIndex = (coordinates[1] * 10) + coordinates[0];
    let [x, y] = [coordinates[0], coordinates[1]];

    if (x >= 0 && x < 10 && y >= 0 && y < 10) {
      let actionBlock = this.actionPlane[blockIndex];
      if (actionBlock.isPlacable) {
        let groundBlock = this.groundPlane[blockIndex];
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
      let blockIndex = (blockForwardPosition[1] * 10) + blockForwardPosition[0];
      let [x, y] = [blockForwardPosition[0], blockForwardPosition[1]];

      if (x >= 0 && x < 10 && y >= 0 && y < 10) {
        let block = this.actionPlane[blockIndex];
        result = !block.isEmpty && (block.isDestroyable || block.isUsable);
      }
    }

    return result;
  }

  moveForward() {
    let blockForwardPosition = this.getMoveForwardPosition();
    let blockIndex = (blockForwardPosition[1] * 10) + blockForwardPosition[0];

    this.player.position = blockForwardPosition;
    if (this.actionPlane[blockIndex].isEmpty) {
      this.player.isOnBlock = false;
    }
  }

  turnLeft() {
    switch (this.player.facing) {
      case FacingDirection.Up:
        this.player.facing = FacingDirection.Left;
        break;

      case FacingDirection.Left:
        this.player.facing = FacingDirection.Down;
        break;

      case FacingDirection.Down:
        this.player.facing = FacingDirection.Right;
        break;

      case FacingDirection.Right:
        this.player.facing = FacingDirection.Up;
        break;
    }
  }

  turnRight() {
    switch (this.player.facing) {
      case FacingDirection.Up:
        this.player.facing = FacingDirection.Right;
        break;

      case FacingDirection.Right:
        this.player.facing = FacingDirection.Down;
        break;

      case FacingDirection.Down:
        this.player.facing = FacingDirection.Left;
        break;

      case FacingDirection.Left:
        this.player.facing = FacingDirection.Up;
        break;
    }
  }

  placeBlock(blockType) {
    let blockPosition = this.player.position;
    let blockIndex = (blockPosition[1] * 10) + blockPosition[0];
    var shouldPlace = false;

    switch (blockType) {
      case "cropWheat":
        shouldPlace = this.groundPlane[blockIndex].blockType === "farmlandWet";
        break;

      default:
        shouldPlace = true;
        break;
    }

    if (shouldPlace === true) {
      var block = new LevelBlock(blockType);

      this.actionPlane[blockIndex] = block;
      this.player.isOnBlock = block.isDestroyable && block.isWalkable;
    }

    return shouldPlace;
  }

  placeBlockForward(blockType, targetPlane) {
    let blockPosition = this.getMoveForwardPosition();
    let blockIndex = (blockPosition[1] * 10) + blockPosition[0];

    var block = new LevelBlock(blockType);
    block.isEmpty = false;
    block.isWalkable = false;
    block.isPlacable = false;
    block.isUsable = true;

    targetPlane[blockIndex] = block;
  }

  destroyBlockForward() {
    var i,
        shouldAddToInventory = true,
        block = null;

    let blockForwardPosition = this.getMoveForwardPosition();
    let blockIndex = (blockForwardPosition[1] * 10) + blockForwardPosition[0];
    let [x, y] = [blockForwardPosition[0], blockForwardPosition[1]];
    
    if (x >= 0 && x < 10 && y >= 0 && y < 10) {
      block = this.actionPlane[blockIndex];
      if (block !== null) {
        block.position = [x, y];
        let inventoryType = this.getInventoryType(block.blockType);
        this.player.inventory[inventoryType] =
            (this.player.inventory[inventoryType] || 0) + 1;

        if (block.isDestroyable) {
          this.actionPlane[blockIndex] = new LevelBlock("");
        }
      }
    }

    return block;
  }

  getInventoryType(blockType) {
    switch (blockType) {
      case "sheep":
        return "wool";
      case "stone":
        return "cobblestone";
      case "treeAcacia":
      case "treeBirch":
      case "treeJungle":
      case "treeOak":
      case "treeSpruce":
        return "planks" + blockType.substring(4);
      default:
        return blockType;
    }
  }

  computeFowPlane() {
    var x, y;

    this.fowPlane = [];
    if (this.isDaytime) {
      for (y = 0; y < 10; ++y) {
        for (x = 0; x < 10; ++x) {
          this.fowPlane.push[""];          
        }
      }
    } else {
      // compute the fog of war for light emitting blocks
      for (y = 0; y < 10; ++y) {
        for (x = 0; x < 10; ++x) {
          this.fowPlane.push({ x: x, y: y, type: "FogOfWar_Center" });
        }
      }

      for (y = 0; y < 10; ++y) {
        for (x = 0; x < 10; ++x) {
          let blockIndex = (y * 10) + x;

          if (this.groundPlane[blockIndex].isEmissive ||
            (!this.actionPlane[blockIndex].isEmpty && this.actionPlane[blockIndex].isEmissive)) {
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
    if (x >= 0 && x < 10 && y >= 0 && y < 10) {
      let blockIndex = (y * 10) + x;
      this.fowPlane[blockIndex] = "";
    }
  }

  computeShadingPlane() {
    var x,
        y,
        index,
        hasLeft,
        hasRight;

    this.shadingPlane = [];

    for (index = 0; index < 100; ++index) {
      x = index % 10;
      y = Math.floor(index / 10);

      hasLeft = false;
      hasRight = false;

      if (this.actionPlane[index].isEmpty) {
        if (y == 0) {
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Bottom' });
        }

        if (y == 9) {
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Top' });
        }

        if (x == 0) {
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Right' });
        }

        if (x == 9) {
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Left' });
        }


        if (x < 9 && !this.actionPlane[(y * 10) + x + 1].getIsEmptyOrEntity()) {
          // needs a left side AO shadow
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Left' });
          hasLeft = true;
        }

        if (x > 0 && !this.actionPlane[(y * 10) + x - 1].getIsEmptyOrEntity()) {
          // needs a right side AO shadow
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Right' });
          this.shadingPlane.push({ x: x, y: y, type: 'Shadow_Parts_Fade_base.png' });

          if (y > 0 && x > 0 && this.actionPlane[((y - 1) * 10) + x - 1].getIsEmptyOrEntity()) {
            this.shadingPlane.push({ x: x, y: y, type: 'Shadow_Parts_Fade_top.png' });
          }

          hasRight = true;
        }

        if (y > 0 && !this.actionPlane[((y - 1) * 10) + x].getIsEmptyOrEntity()) {
          // needs a bottom side AO shadow
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Bottom' });
        } else if (y > 0) {
          if (x < 9 && !this.actionPlane[((y - 1) * 10) + x + 1].getIsEmptyOrEntity()) {
            // needs a bottom left side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_BottomLeft' });
          }

          if (!hasRight && x > 0 && !this.actionPlane[((y - 1) * 10) + x - 1].getIsEmptyOrEntity()) {
            // needs a bottom right side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_BottomRight' });
          }
        }

        if (y < 9) {
          if (x < 9 && !this.actionPlane[((y + 1) * 10) + x + 1].getIsEmptyOrEntity()) {
            // needs a bottom left side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_TopLeft' });
          }

          if (!hasRight && x > 0 && !this.actionPlane[((y + 1) * 10) + x - 1].getIsEmptyOrEntity()) {
            // needs a bottom right side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_TopRight' });
          }
        }
      }
    }
  }
}
