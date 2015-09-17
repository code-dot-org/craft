import LevelBlock from "./LevelBlock.js"
import FacingDirection from "./FacingDirection.js"
import _ from "lodash"

// for blocks on the action plane, we need an actual "block" object, so we can model

export default class LevelModel {
  constructor(levelData) {
    this.player = {
      name: "steve",

      position: levelData.playerStartPosition,

      isOnBlock: false,

      facing: FacingDirection.Right,

      inventory: ["logOak"]
    };

    this.initialPlayerState = Object.create(this.player);
    this.initialLevelData = Object.create(levelData);

    this.groundPlane = this.constructPlane(levelData.groundPlane, false);
    this.shadingPlane = [];
    this.actionPlane = this.constructPlane(levelData.actionPlane, true);
    this.fluffPlane = this.constructPlane(levelData.fluffPlane, false);

    this.computeShadingPlane();

  }

  constructPlane(planeData, isActionPlane) {
    var index,
        result = [],
        block;

    for (index = 0; index < planeData.length; ++index) {
      block = new LevelBlock(planeData[index]);
      block.isWalkable = !isActionPlane || planeData[index] === "";
      block.isPlacable = isActionPlane && block.isEmpty;
      block.isUsable = isActionPlane && !block.isEmpty;
      result.push(block);
    }

    return result;
  }

  isSolved()  {
      return this.initialLevelData.verificationFunction(this);
  }

    // Verifications
  isPlayerNextTo(blockType){
      var position;
      var result = false;

      // above
      position = [ this.player.position[0], this.player.position[1] -1 ];
      if(this.isBlockOfType(position, blockType)) {
          return true;
      }

      // below
      position = [ this.player.position[0], this.player.position[1] +1 ];
      if(this.isBlockOfType(position, blockType)) {
          return true;
      }

      // left
      position = [ this.player.position[0] +1, this.player.position[1] ];
      if(this.isBlockOfType(position, blockType)) {
          return true;
      }

      // Right
      position = [ this.player.position[0] -1, this.player.position[1] ];
      if(this.isBlockOfType(position, blockType)) {
          return true;
      }

      return false;
  }

  countOfTypeOnMap(blockType) {

      var count=0;
      for (var i = 0; i < 100; i++) {
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


  solutionMapMatchesResultMap(solutionMap)  {
      for (var i = 0; i < 100; i++) {
          // "" on the solution map means we dont care what's at that spot
          if (solutionMap[i] != "") {
              if (solutionMap[i] == "empty") {
                  if (!this.actionPlane[i].isEmpty) { 
                      return false; 
                  }
              }
              else if (this.actionPlane[i].blockType != solutionMap[i]) {
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
      return this.isBlockOfType(blockForwardPosition, blockType);
  }

  isBlockOfType(position, blockType)  {
      var result = false;

      let blockIndex = (position[1] * 10) + position[0];
      if (blockIndex >= 0 && blockIndex < 100) {

          if (blockType == "empty") {
              result =  this.actionPlane[blockIndex].isEmpty;
          }
          else {
              result = (blockType == this.actionPlane[blockIndex].blockType);
          }
      }

      return result;
  }

  isPlayerStandingInWater(){
    let blockIndex = (this.player.position[1] * 10) + this.player.position[0];
    return this.actionPlane[blockIndex].blockType == "water";
  }

  isPlayerStandingInLava() {
    // TODO: handle lava
    return false;
  }

  isPlayerStandingNearCreeper() {
    // TODO: handle creepers
    return false;
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
    // TODO: Is this ever NOT true?
    return true;
  }

  canDestroyBlockForward() {
    var result = false;

    if (!this.player.isOnBlock) {
      let blockForwardPosition = this.getMoveForwardPosition();
      let blockIndex = (blockForwardPosition[1] * 10) + blockForwardPosition[0];
      let [x, y] = [blockForwardPosition[0], blockForwardPosition[1]];

      if (x >= 0 && x < 10 && y >= 0 && y < 10) {
        result = !this.actionPlane[blockIndex].isEmpty && this.actionPlane[blockIndex].isDestroyable;
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

    var block = new LevelBlock(blockType);
    block.isEmpty = false;
    block.isWalkable = false;
    block.isPlacable = false;
    block.isUsable = true;

    this.actionPlane[blockIndex] = block;
    this.player.isOnBlock = true;
  }

  destroyBlockForward() {
    let blockForwardPosition = this.getMoveForwardPosition();
    let blockIndex = (blockForwardPosition[1] * 10) + blockForwardPosition[0];
    let [x, y] = [blockForwardPosition[0], blockForwardPosition[1]];

    if (x >= 0 && x < 10 && y >= 0 && y < 10) {
      this.actionPlane[blockIndex] = new LevelBlock("");
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
        if (x < 9 && !this.actionPlane[(y * 10) + x + 1].isEmpty) {
          // needs a left side AO shadow
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Left' })
          hasLeft = true;
        }

        if (x > 0 && !this.actionPlane[(y * 10) + x - 1].isEmpty) {
          // needs a right side AO shadow
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Right' })
          hasRight = true;
        }

        if (y > 0 && !this.actionPlane[((y - 1) * 10) + x].isEmpty) {
          // needs a bottom side AO shadow
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Bottom' })
        } else if (y > 0) {
          if (x < 9 && !this.actionPlane[((y - 1) * 10) + x + 1].isEmpty) {
            // needs a bottom left side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_BottomLeft' })
          }

          if (!hasRight && x > 0 && !this.actionPlane[((y - 1) * 10) + x - 1].isEmpty) {
            // needs a bottom right side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_BottomRight' })
          }
        }

        if (y < 9) {
          if (x < 9 && !this.actionPlane[((y + 1) * 10) + x + 1].isEmpty) {
            // needs a bottom left side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_TopLeft' })
          }

          if (!hasRight && x > 0 && !this.actionPlane[((y + 1) * 10) + x - 1].isEmpty) {
            // needs a bottom right side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_TopRight' })
          }
        }
      }
    }
  }

}
