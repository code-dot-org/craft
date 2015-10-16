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

  getHouseBottomRight()  {
      return this.initialLevelData.houseBottomRight;
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

  houseGroundToFloorHelper(position, woolType, arrayCheck)
  {
    var checkActionBlock,
        checkGroundBlock,
        posAbove, 
        posBelow,
        posRight,
        posLeft,
        checkIndex = 0,
        array = arrayCheck;
        let index = (position[2] * 10) + position[1];

        if(index === 44)
        {
          index = 44;
        }

    posAbove =  [0, position[1], position[2] + 1];
    posAbove[0] = (posAbove[2] * 10) + posAbove[1];

    posBelow =  [0, position[1], position[2] - 1];
    posBelow[0] = (posBelow[2] * 10) + posBelow[1];

    posRight =  [0, position[1] + 1, position[2]];
    posRight[0] = (posRight[2] * 10) + posRight[1];
    
    posLeft =  [0, position[1] - 1, position[2]];
    posRight[0] = (posRight[2] * 10) + posRight[1];

    checkActionBlock = this.actionPlane[index];
    checkGroundBlock = this.groundPlane[index];
    for(var i = 0; i < array.length; ++i) {
      if(array[i][0] === index) {
        checkIndex = -1;
        break;
      }
    }

    if(checkActionBlock.blockType != "") {
      return {};
    }
    else if(array.length > 0 && checkIndex === -1) {
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

  getAllBorderingPlayer(blockType){
    var player = this.player;
    var position;
    var allFoundObjects = [false];
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

  isPlayerStandingNearCreeper() {
    return this.getAllBorderingPlayer("creeper");
  }

getMinecartTrack() {
    var track = [];
    track.push(["down", [3,4], FacingDirection.Down]);
    track.push(["down", [3,5], FacingDirection.Down]);
    track.push(["down", [3,6], FacingDirection.Down]);
    track.push(["down", [3,7], FacingDirection.Down]);
    track.push(["down", [3,8], FacingDirection.Down]);  
    track.push(["turn_left", [3,8], FacingDirection.Right]);
    track.push(["right", [4,8], FacingDirection.Right]);
    track.push(["right", [5,8], FacingDirection.Right]);
    track.push(["right", [6,8], FacingDirection.Right]);
    track.push(["right", [7,8], FacingDirection.Right]);
    track.push(["right", [8,8], FacingDirection.Right]);
    track.push(["right", [9,8], FacingDirection.Right]);
    return track;
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
    this.moveTo(blockForwardPosition);
  }

  moveTo(position) {
    let blockIndex = (position[1] * 10) + position[0];

    this.player.position = position;
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

  solveFOWTypeForMap() {
    var emissives,
        blocksToSolve;

    emissives = this.getAllEmissives();
    blocksToSolve = this.findBlocksAffectedByEmissives(emissives);

    for(var block in blocksToSolve) {
      if(blocksToSolve.hasOwnProperty(block)) {
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

    for(var torch in emissivesTouching) {
      var currentTorch = emissivesTouching[torch];
      y = position[1];
      x = position[0];

      angle = Math.atan2(currentTorch[1] - position[1], currentTorch[0] - position[0]);
      //invert
      angle = -angle;
      //Normalize to be between 0 and 2*pi
      if(angle < 0) {
        angle += 2 * Math.PI;
      }
      //convert to degrees for simplicity
      angle *= 360 / (2*Math.PI);

      //top right
      if(!rightQuad &&angle > 32.5 && angle <= 57.5) {
        topRightQuad = true;
        this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_InCorner_TopRight" };
      }//top left
      if(!leftQuad &&angle > 122.5 && angle <= 147.5) {
        topLeftQuad = true;
        this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_InCorner_TopLeft"};
      }//bot left
      if(!leftQuad &&angle > 212.5 && angle <= 237.5) {
        botLeftQuad = true;
        this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_InCorner_BottomLeft"};
      }//botright
      if(!rightQuad && angle > 302.5 && angle <= 317.5) {
        botRightQuad = true;
        this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_InCorner_BottomRight"};
      }
      //right
      if(angle >= 327.5 || angle <= 32.5) {
        rightQuad = true;
        this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_Right" };
      }//bot
      if(angle > 237.5 && angle <= 302.5) {
        botQuad = true;
        this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_Bottom"};
      }
      //left
      if(angle > 147.5 && angle <= 212.5) {
        leftQuad = true;
        this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_Left"};
      }
      //top
      if(angle > 57.5 && angle <= 122.5) {
        topQuad = true;
        this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_Top"};
      }
    }

    if(topLeftQuad && botLeftQuad) {
      this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_Left"};
    }
    if(topRightQuad && botRightQuad) {
      this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_Right"};
    }
    if(topLeftQuad && topRightQuad) {
      this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_Top"};
    }
    if(botRightQuad && botLeftQuad) {
      this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_Bottom"};
    }

    //fully lit 
    if( (botRightQuad && topLeftQuad) || (botLeftQuad && topRightQuad) || leftQuad && rightQuad || topQuad && botQuad || (rightQuad && botQuad && topLeftQuad) 
          || (botQuad && topRightQuad && topLeftQuad) || (topQuad && botRightQuad && botLeftQuad) || (leftQuad && topRightQuad && botRightQuad) || (leftQuad && botQuad && topRightQuad)) {//((botRightQuad && (leftQuad) && (topLeftQuad || topRightQuad))) {
      this.fowPlane[index] = "";
    }

    //darkend botleft corner
    else if( (botQuad && leftQuad) || (botQuad && topLeftQuad) || (leftQuad && botRightQuad) ){// || (leftQuad || topLeftQuad || botLeftQuad) && ( botQuad || botRightQuad)) {//(rightQuad && (topRightQuad || botRightQuad)) {//(!botLeftQuad && !leftQuad && !botQuad && ((topLeftQuad || topQuad) && (botRightQuad) && (rightQuad || topRightQuad))) {
      this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_Bottom_Left"};
    } 
    //darkend botRight corner
    else if((botQuad && rightQuad) || (botQuad && topRightQuad) || (rightQuad && botLeftQuad)) {//(!botRightQuad && !rightQuad && !botQuad && ((topLeftQuad || topQuad) && (botLeftQuad) && (leftQuad || topRightQuad))) {
      this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_Bottom_Right"};
    }
    //darkend topRight corner
    else if((topQuad && rightQuad) || (topQuad && botRightQuad) || (rightQuad && topLeftQuad)) {//(!topRightQuad && !rightQuad && !topQuad && ((botRightQuad) && (botLeftQuad || botQuad) && (leftQuad || topLeftQuad))) {
      this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_Top_Right"};
    }
    //darkend topLeft corner
    else if((topQuad && leftQuad) || (topQuad && botLeftQuad) || (leftQuad && topRightQuad)){// !topLeftQuad && !leftQuad && !topQuad && ((botRightQuad) && (botLeftQuad || botQuad) && (rightQuad || topRightQuad))) {
      this.fowPlane[index] = { x: x, y: y, type: "FogOfWar_Top_Left"};
    }
  }

  getAllEmissives(){
    var emissives = [];
    for (var y = 0; y < 10; ++y) {
      for (var x = 0; x < 10; ++x) {
        var index = this.coordinatesToIndex([x,y]);
        if(!this.actionPlane[index].isEmpty && this.actionPlane[index].isEmissive || this.groundPlane[index].isEmissive && this.actionPlane[index].isEmpty ) {
          emissives.push([x,y]);
        }
      }
    }
    return emissives;
  }

  findBlocksAffectedByEmissives(emissives) {
    var blocksTouchedByEmissives = {};
    //find emissives that are close enough to light us.
    for(var torch in emissives)
    {
      var currentTorch = emissives[torch];
      let y = currentTorch[1];
      let x = currentTorch[0];
      for (var yIndex = currentTorch[1] - 2; yIndex <= (currentTorch[1] + 2); ++yIndex) {
        for (var xIndex = currentTorch[0] - 2; xIndex <= (currentTorch[0] + 2); ++xIndex) {

          //Ensure we're looking inside the map
          if(yIndex < 0 || yIndex > 9 || xIndex < 0 || xIndex > 9)
            continue;

          //Ignore the indexes directly around us.
          //Theyre taken care of on the FOW first pass 
          if( (yIndex >= y - 1 && yIndex <= y + 1) && (xIndex >= x - 1 && xIndex <= x + 1) )
            continue;

          //we want unique copies so we use a map.
          blocksTouchedByEmissives[yIndex.toString() + xIndex.toString()] = [xIndex,yIndex]; 
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
        if(yIndex < 0 || yIndex > 9 || xIndex < 0 || xIndex > 9)
          continue;

        //Ignore the indexes directly around us. 
        if( (yIndex >= y - 1 && yIndex <= y + 1) && (xIndex >= x - 1 && xIndex <= x + 1) )
          continue;

        for(var torch in emissives) {
          if(emissives[torch][0] === xIndex && emissives[torch][1] === yIndex) {
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

      //second pass for partial lit squares
      this.solveFOWTypeForMap();

      for (y = 0; y < 10; ++y) {
        for (x = 0; x < 10; ++x) {
          let blockIndex = (y * 10) + x;
          
          if (this.groundPlane[blockIndex].isEmissive && this.actionPlane[blockIndex].isEmpty ||
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
