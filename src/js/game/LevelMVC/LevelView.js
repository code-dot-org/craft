import FacingDirection from "./FacingDirection.js"

export default class LevelView {
  constructor(controller) {
    this.controller = controller;
    this.audioPlayer = controller.audioPlayer;
    this.game = controller.game;
    this.assetRoot = controller.assetRoot;

    this.baseShading = null;

    this.playerSprite = null;
    this.playerGhost = null;        // The ghost is a copy of the player sprite that sits on top of everything at 20% opacity, so the player can go under trees and still be seen.
    this.selectionIndicator = null;

    this.groundPlane = null;
    this.shadingPlane = null;
    this.actionPlane = null;
    this.fluffPlane = null;
    this.fowPlane = null;

    this.miniBlocks = {
      "dirt": ["Miniblocks", 0, 5],
      "dirtCoarse": ["Miniblocks", 6, 11],
      "sand": ["Miniblocks", 12, 17],
      "gravel": ["Miniblocks", 18, 23],
      "brick": ["Miniblocks", 24, 29],
      "logAcacia": ["Miniblocks", 30, 35],
      "logBirch": ["Miniblocks", 36, 41],
      "logJungle": ["Miniblocks", 42, 47],
      "logOak": ["Miniblocks", 48, 53],
      "logSpruce": ["Miniblocks", 54, 59],
      "planksAcacia": ["Miniblocks", 60, 65],
      "planksBirch": ["Miniblocks", 66, 71],
      "planksJungle": ["Miniblocks", 72, 77],
      "planksOak": ["Miniblocks", 78, 83],
      "planksSpruce": ["Miniblocks", 84, 89],
      "cobblestone": ["Miniblocks", 90, 95],
      "sandstone": ["Miniblocks", 96, 101],
      "wool": ["Miniblocks", 102, 107],
      "redstoneDust": ["Miniblocks", 108, 113],
      "lapisLazuli": ["Miniblocks", 114, 119],
      "ingotIron": ["Miniblocks", 120, 125],
      "ingotGold": ["Miniblocks", 126, 131],
      "emerald": ["Miniblocks", 132, 137],
      "diamond": ["Miniblocks", 138, 143],
      "coal": ["Miniblocks", 144, 149],
      "bucketWater": ["Miniblocks", 150, 155],
      "bucketLava": ["Miniblocks", 156, 161],
      "gunPowder": ["Miniblocks", 162, 167],
      "wheat": ["Miniblocks", 168, 173],
      "potato": ["Miniblocks", 174, 179],
      "carrots": ["Miniblocks", 180, 185],

      "sheep": ["Miniblocks", 102, 107]
    };

    this.blocks = {
      "bedrock": ["blocks", "Bedrock", -13, 0],
      "bricks": ["blocks", "Bricks", -13, 0],
      "clay": ["blocks", "Clay", -13, 0],
      "oreCoal": ["blocks", "Coal_Ore", -13, 0],
      "dirtCoarse": ["blocks", "Coarse_Dirt", -13, 0],
      "cobblestone": ["blocks", "Cobblestone", -13, 0],
      "oreDiamond": ["blocks", "Diamond_Ore", -13, 0],
      "dirt": ["blocks", "Dirt", -13, 0],
      "oreEmerald": ["blocks", "Emerald_Ore", -13, 0],
      "farmlandWet": ["blocks", "Farmland_Wet", -13, 0],
      "flowerDandelion": ["blocks", "Flower_Dandelion", -13, 0],
      "flowerOxeeye": ["blocks", "Flower_Oxeeye", -13, 0],
      "flowerRose": ["blocks", "Flower_Rose", -13, 0],
      "glass": ["blocks", "Glass", -13, 0],
      "oreGold": ["blocks", "Gold_Ore", -13, 0],
      "grass": ["blocks", "Grass", -13, 0],
      "gravel": ["blocks", "Gravel", -13, 0],
      "clayHardened": ["blocks", "Hardened_Clay", -13, 0],
      "oreIron": ["blocks", "Iron_Ore", -13, 0],
      "oreLapis": ["blocks", "Lapis_Ore", -13, 0],
      "lava": ["blocks", "Lava_0", -13, 0],
      "logAcacia": ["blocks", "Log_Acacia", -13, 0],
      "logBirch": ["blocks", "Log_Birch", -13, 0],
      "logJungle": ["blocks", "Log_Jungle", -13, 0],
      "logOak": ["blocks", "Log_Oak", -13, 0],
      "logSpruce": ["blocks", "Log_Spruce", -13, 0],
      "obsidian": ["blocks", "Obsidian", -13, 0],
      "planksAcacia": ["blocks", "Planks_Acacia", -13, 0],
      "planksBirch": ["blocks", "Planks_Birch", -13, 0],
      "planksJungle": ["blocks", "Planks_Jungle", -13, 0],
      "planksOak": ["blocks", "Planks_Oak", -13, 0],
      "planksSpruce": ["blocks", "Planks_Spruce", -13, 0],
      "oreRedstone": ["blocks", "Redstone_Ore", -13, 0],
      "sand": ["blocks", "Sand", -13, 0],
      "sandstone": ["blocks", "Sandstone", -13, 0],
      "stone": ["blocks", "Stone", -13, 0],
      "tnt": ["blocks", "Tnt", -13, 0],
      "water": ["blocks", "Water_0", -13, 0],
      "wool": ["blocks", "Wool_White", -13, 0],
      "wool_orange": ["blocks", "Wool_Orange", -13, 0],

      "leavesAcacia": ["leavesAcacia", "Leaves0", -42, 80],
      "leavesBirch": ["leavesBirch", "Leaves0", -100, -10],
      "leavesJungle": ["leavesJungle", "Leaves0", -69, 43],
      "leavesOak": ["leavesOak", "Leaves0", -100, 0],
      "leavesSpruce": ["leavesSpruce", "Leaves0", -76, 60],

      "cropWheat": ["crops", "Wheat0", -13, 0],
      "torch": ["torch", "Torch0", -13, 0],

      "tallGrass": ["tallGrass", "", -13, 0],

      "lavaPop": ["lavaPop", "LavaPop01", -13, 0],
      "fire": ["fire", "", -11, 135],
      "bubbles": ["bubbles", "", -11, 135],
      "explosion": ["explosion", "", -70, 60],

      "door": ["door", "", -12, -10],
      //"bed": ["bed", "", -70, 60], 
    };

    this.actionPlaneBlocks = [];
    this.toDestroy = [];
  }

  preload(playerAtlas) {
    this.game.load.atlasJSONHash('player', `${this.assetRoot}images/${playerAtlas}.png`, `${this.assetRoot}images/${playerAtlas}.json`);
    this.game.load.image('entityShadow', `${this.assetRoot}images/Character_Shadow.png`);
    this.game.load.image('selectionIndicator', `${this.assetRoot}images/Selection_Indicator.png`);

    this.game.load.image('shadeLayer', `${this.assetRoot}images/Shade_Layer.png`);
    this.game.load.atlasJSONHash('AO', `${this.assetRoot}images/AO.png`, `${this.assetRoot}images/AO.json`);
    this.game.load.atlasJSONHash('blockShadows', `${this.assetRoot}images/Block_Shadows.png`, `${this.assetRoot}images/Block_Shadows.json`);
    this.game.load.atlasJSONHash('undergroundFow', `${this.assetRoot}images/UndergroundFoW.png`, `${this.assetRoot}images/UndergroundFoW.json`);

    this.game.load.image('tallGrass', `${this.assetRoot}images/TallGrass.png`);
    this.game.load.atlasJSONHash('blocks', `${this.assetRoot}images/Blocks.png`, `${this.assetRoot}images/Blocks.json`);
    this.game.load.atlasJSONHash('leavesAcacia', `${this.assetRoot}images/Leaves_Acacia_Decay.png`, `${this.assetRoot}images/Leaves_Acacia_Decay.json`);
    this.game.load.atlasJSONHash('leavesBirch', `${this.assetRoot}images/Leaves_Birch_Decay.png`, `${this.assetRoot}images/Leaves_Birch_Decay.json`);
    this.game.load.atlasJSONHash('leavesJungle', `${this.assetRoot}images/Leaves_Jungle_Decay.png`, `${this.assetRoot}images/Leaves_Jungle_Decay.json`);
    this.game.load.atlasJSONHash('leavesOak', `${this.assetRoot}images/Leaves_Oak_Decay.png`, `${this.assetRoot}images/Leaves_Oak_Decay.json`);
    this.game.load.atlasJSONHash('leavesSpruce', `${this.assetRoot}images/Leaves_Spruce_Decay.png`, `${this.assetRoot}images/Leaves_Spruce_Decay.json`);
    this.game.load.atlasJSONHash('sheep', `${this.assetRoot}images/Sheep.png`, `${this.assetRoot}images/Sheep.json`);
    this.game.load.atlasJSONHash('creeper', `${this.assetRoot}images/Creeper.png`, `${this.assetRoot}images/Creeper.json`);
    this.game.load.atlasJSONHash('crops', `${this.assetRoot}images/Crops.png`, `${this.assetRoot}images/Crops.json`);
    this.game.load.atlasJSONHash('torch', `${this.assetRoot}images/Torch.png`, `${this.assetRoot}images/Torch.json`);

    this.game.load.atlasJSONHash('destroyOverlay', `${this.assetRoot}images/Destroy_Overlay.png`, `${this.assetRoot}images/Destroy_Overlay.json`);
    this.game.load.atlasJSONHash('blockExplode', `${this.assetRoot}images/BlockExplode.png`, `${this.assetRoot}images/BlockExplode.json`);
    this.game.load.atlasJSONHash('miningParticles', `${this.assetRoot}images/MiningParticles.png`, `${this.assetRoot}images/MiningParticles.json`);
    this.game.load.atlasJSONHash('miniBlocks', `${this.assetRoot}images/Miniblocks.png`, `${this.assetRoot}images/Miniblocks.json`);
    this.game.load.atlasJSONHash('lavaPop', `${this.assetRoot}images/LavaPop.png`, `${this.assetRoot}images/LavaPop.json`);
    this.game.load.atlasJSONHash('fire', `${this.assetRoot}images/Fire.png`, `${this.assetRoot}images/Fire.json`);
    this.game.load.atlasJSONHash('bubbles', `${this.assetRoot}images/Bubbles.png`, `${this.assetRoot}images/Bubbles.json`);
    this.game.load.atlasJSONHash('explosion', `${this.assetRoot}images/Explosion.png`, `${this.assetRoot}images/Explosion.json`);
    this.game.load.atlasJSONHash('door', `${this.assetRoot}images/Door.png`, `${this.assetRoot}images/Door.json`);

    this.game.load.image('finishOverlay', `${this.assetRoot}images/WhiteRect.png`);
    this.game.load.image('bed', `${this.assetRoot}images/Bed2.png`);

    this.audioPlayer.register({id: 'beep', mp3: `${this.assetRoot}audio/beep.mp3`, ogg: 'TODO'});
    this.audioPlayer.register({
      id: 'dig_wood1',
      mp3: `${this.assetRoot}audio/dig_wood1.mp3`,
      wav: `${this.assetRoot}audio/dig_wood1.wav`,
      ogg: `${this.assetRoot}audio/dig_wood1.ogg`
    });

    this.audioPlayer.register({
      id: 'step_grass1',
      mp3: `${this.assetRoot}audio/step_grass1.mp3`,
      wav: `${this.assetRoot}audio/step_grass1.wav`,
      ogg: `${this.assetRoot}audio/step_grass1.ogg`
    });
  }

  create(levelModel) {
    this.createPlanes();
    this.reset(levelModel);
  }

  reset(levelModel) {
    let player = levelModel.player;

    this.resetPlanes(levelModel);
    this.preparePlayerSprite();
    this.updateShadingPlane(levelModel.shadingPlane);
    this.updateFowPlane(levelModel.fowPlane);
    this.setPlayerPosition(player.position[0], player.position[1], player.isOnBlock);
    this.setSelectionIndicatorPosition(player.position[0], player.position[1]);
    this.playIdleAnimation(player.position, player.facing, player.isOnBlock);
  }

  update() {
    var i;

    for (i = 0; i < this.toDestroy.length; ++i) {
      this.toDestroy[i].destroy();
    }
    this.toDestroy = [];

    if (this.playerGhost) {
      this.playerGhost.frame = this.playerSprite.frame;
      this.playerGhost.z = 1000;
    }
  }

  render() {
    this.actionPlane.sort('sortOrder');
    this.fluffPlane.sort('z');
  }

  getDirectionName(facing) {
    var direction;

    switch (facing) {
      case FacingDirection.Up:
        direction = "_up";
        break;

      case FacingDirection.Right:
        direction = "_right";
        break;

      case FacingDirection.Down:
        direction = "_down";
        break;

      case FacingDirection.Left:
        direction = "_left";
        break;
    }

    return direction;
  }

  updatePlayerDirection(position, facing) {
    let direction = this.getDirectionName(facing);

    this.setSelectionIndicatorPosition(position[0], position[1]);
    this.playerSprite.animations.play("idle" + direction);
  }

  playPlayerAnimation(animationName, position, facing, isOnBlock) {
    let direction = this.getDirectionName(facing);
    this.playerSprite.sortOrder = position[1] * 10 + 5;

    let animName = animationName + direction;
    return this.playerSprite.animations.play(animName);
  }

  playIdleAnimation(position, facing, isOnBlock) {
    this.playPlayerAnimation("idle", position, facing, isOnBlock);
  }

  playSuccessAnimation(position, facing, isOnBlock, completionHandler) {
    var beforeCelebrateTimer = this.game.time.create(true);
    beforeCelebrateTimer.add(250, () => {
      this.playPlayerAnimation("celebrate", position, facing, isOnBlock);
      var beforeCompleteTimer = this.game.time.create(true);
      beforeCompleteTimer.add(1200, completionHandler, this);
      beforeCompleteTimer.start();
    }, this);
    beforeCelebrateTimer.start();
  }

  playFailureAnimation(position, facing, isOnBlock, completionHandler) {
    var beforeFailTimer = this.game.time.create(true);
    beforeFailTimer.add(500, () => {
      this.playPlayerAnimation("fail", position, facing, isOnBlock);
    var beforeCompleteTimer = this.game.time.create(true);
      beforeCompleteTimer.add(1200, completionHandler, this);
      beforeCompleteTimer.start();
    }, this);
    beforeFailTimer.start();
  }

  playBumpAnimation(position, facing, isOnBlock) {
    this.playPlayerAnimation("bump", position, facing, isOnBlock).onComplete.add(()=>{
      //Should this be failure?
      this.playIdleAnimation(position, facing, isOnBlock);
    });
  }

  playDrownFailureAnimation(position, facing, isOnBlock, completionHandler) {
      var sprite,
          tween;

      this.playPlayerAnimation("fail", position, facing, isOnBlock);
      this.createBlock(this.fluffPlane, position[0], position[1], "bubbles");

      sprite = this.fluffPlane.create(0, 0, "finishOverlay");
      sprite.alpha = 0;
      sprite.tint = 0x324bff;

      tween = this.game.add.tween(sprite).to({
          alpha: 0.5,
      }, 200, Phaser.Easing.Linear.None);

      tween.onComplete.add(() => {
          completionHandler();
      });

      tween.start();
  }

  playBurnInLavaAnimation(position, facing, isOnBlock, completionHandler) {
    var sprite,
        tween;

    this.playPlayerAnimation("jumpUp", position, facing, isOnBlock);
    this.createBlock(this.fluffPlane, position[0], position[1], "fire");

    sprite = this.fluffPlane.create(0, 0, "finishOverlay");
    sprite.alpha = 0;
    sprite.tint = 0xd1580d;

    tween = this.game.add.tween(sprite).to({
      alpha: 0.5,
    }, 200, Phaser.Easing.Linear.None);

    tween.onComplete.add(() => {
      completionHandler();
    });

    tween.start();
  }

  playCreeperExplodeAnimation(position, facing, destroyPosition, isOnBlock, completionHandler) {
    var timer = this.game.time.create(true);
    timer.add(180, () => {
      var signalBinding = this.playPlayerAnimation("jumpUp", position, facing, false).onLoop.add(() => {
        this.playIdleAnimation(position, facing, isOnBlock);
        signalBinding.detach();
        this.playExplodingCreeperAnimation(position, facing, destroyPosition, isOnBlock, completionHandler, this);
      });
    }, this);
    timer.start();
  }

  playCreeperAnimation(position, facing, destroyPosition, isOnBlock, completionHandler){
      playExplosionAnimation(position, facing, destroyPosition, isOnBlock, completionHandler, false);
  }

  playExplodingCreeperAnimation(position, facing, destroyPosition, isOnBlock, completionHandler) {
    let direction = this.getDirectionName(facing);

    let blockIndex = (destroyPosition[1] * 10) + destroyPosition[0];
    let blockToExplode = this.actionPlaneBlocks[blockIndex];

    var creeperExplodeAnimation = blockToExplode.animations.getAnimation("explode");
    creeperExplodeAnimation.onComplete.add(() => {
      var borderingPositions;
      blockToExplode.kill();
      this.playExplosionAnimation(position, facing, destroyPosition, isOnBlock, () => {
        var timer = this.game.time.create(true);
        timer.add(400, () => {
          this.playFailureAnimation(position, facing, false, completionHandler);
        }, this);
        timer.start();
      }, false);
      var block = this.createBlock(this.fluffPlane, destroyPosition[0], destroyPosition[1], "explosion");
    });

    creeperExplodeAnimation.play();
  }

  coordinatesToIndex(coordinates) {
    return (coordinates[1] * 10) + coordinates[0];
  }

  addHouseBed(bottomCoordinates) {
    //Temporary, will be replaced by bed blocks
    var bedTopCoordinate = (bottomCoordinates[1] - 1);
    var sprite = this.actionPlane.create(38 * bottomCoordinates[0], 35 * bedTopCoordinate, "bed");
    sprite.sortOrder = bottomCoordinates[1] * 10;
  }

  addDoor(coordinates) {
    var sprite;
    let toDestroy = this.actionPlaneBlocks[this.coordinatesToIndex(coordinates)];
    this.createActionPlaneBlock(coordinates, "door");
    //Need to grab the correct blocktype from the action layer
    //And use that type block to create the ground block under the door
    sprite = this.createBlock(this.groundPlane, coordinates[0], coordinates[1], "wool_orange");
    toDestroy.kill();
    sprite.sortOrder = 6 * 10;
  }

  playSuccessHouseBuiltAnimation(position, facing, isOnBlock, createFloor, houseBottomRightPosition, completionHandler) {
    //fade screen to white
    //Add house blocks
    //fade out of white
    //Play success animation on player.
    var tweenToW,
        tweenWToC;

    tweenToW = this.playLevelEndAnimation(position, facing, isOnBlock, completionHandler);
    tweenToW.onComplete.add(() => {
      //Change house ground to floor
      var xCoord;
      var yCoord;
      var sprite;

      for(var i = 0; i < createFloor.length; ++i)
      {
        xCoord = createFloor[i][1];
        yCoord = createFloor[i][2];
        /*this.groundPlane[this.coordinatesToIndex([xCoord,yCoord])].kill();*/
        sprite = this.createBlock(this.groundPlane, xCoord, yCoord, "wool_orange");
        sprite.sortOrder = yCoord * 10;
      }

      this.addHouseBed([houseBottomRightPosition[0], houseBottomRightPosition[1]]);
      this.addDoor([houseBottomRightPosition[0] - 1, houseBottomRightPosition[1] + 1]);
      this.groundPlane.sort('sortOrder');
    });
  }

  //Tweens in and then out of white. returns the tween to white for adding callbacks
  playLevelEndAnimation(position, facing, isOnBlock, completionHandler) {
    var sprite,
        tweenToW,
        tweenWToC;

    sprite = this.fluffPlane.create(0, 0, "finishOverlay");
    sprite.alpha = 0;

    tweenToW = this.tweenToWhite(sprite);
    tweenWToC = this.tweenFromWhiteToClear(sprite);

    tweenToW.onComplete.add(() => {
      this.setPlayerPosition(position[0], position[1], isOnBlock);
      tweenWToC.start();
    });
    tweenWToC.onComplete.add(() => {
      this.playSuccessAnimation(position, facing, isOnBlock, completionHandler);
    });
    tweenToW.start();

    return tweenToW;
  }

  tweenFromWhiteToClear(sprite) {
    var tweenWhiteToClear;

    tweenWhiteToClear = this.game.add.tween(sprite).to({
      alpha: 0.0,
    }, 700, Phaser.Easing.Linear.None);
    return tweenWhiteToClear;
  }

  tweenToWhite(sprite){
    var tweenToWhite;

    tweenToWhite = this.game.add.tween(sprite).to({
      alpha: 1.0,
    }, 300, Phaser.Easing.Linear.None);
    return tweenToWhite;
  }

  playMoveForwardAnimation(position, facing, shouldJumpDown, completionHandler) {
    var tween,
        animName;

    this.audioPlayer.play("step_grass1");

    let direction = this.getDirectionName(facing);

    this.setSelectionIndicatorPosition(position[0], position[1]);
    this.playerSprite.sortOrder = position[1] * 10 + 5;

    if (!shouldJumpDown) {
      animName = "walk" + direction;
      this.playerSprite.animations.play(animName);
    } else {
      animName = "jumpDown" + direction;
      this.playerSprite.animations.play(animName);
    }

    tween = this.game.add.tween(this.playerSprite).to({
      x: (-18 + 40 * position[0]),
      y: (-32 + 40 * position[1])
    }, 200, Phaser.Easing.Linear.None);

    tween.onComplete.add(() => {
      completionHandler();
    });

    tween.start();
  }

  playPlaceBlockAnimation(position, facing, blockType, completionHandler) {
    var tween,
        jumpAnimName;

    if (blockType === "cropWheat" || blockType == "torch") {
      this.setSelectionIndicatorPosition(position[0], position[1]);
      this.playPlayerAnimation("punch", position, facing, false).onComplete.add(() => {
        let blockIndex = (position[1] * 10) + position[0];
        var sprite = this.createBlock(this.actionPlane, position[0], position[1], blockType);

        if (sprite) {
          sprite.sortOrder = position[1] * 10;
        }

        this.actionPlaneBlocks[blockIndex] = sprite;
        completionHandler();
      });
    } else {
      let direction = this.getDirectionName(facing);
      this.setSelectionIndicatorPosition(position[0], position[1]);

      jumpAnimName = "jumpUp" + direction;

      this.playerSprite.animations.play(jumpAnimName);
      tween = this.game.add.tween(this.playerSprite).to({
        y: (-55 + 40 * position[1])
      }, 125, Phaser.Easing.Cubic.EaseOut);

      tween.onComplete.add(() => {
        let blockIndex = (position[1] * 10) + position[0];
        var sprite = this.createBlock(this.actionPlane, position[0], position[1], blockType);

        if (sprite) {
          sprite.sortOrder = position[1] * 10;
        }

        this.actionPlaneBlocks[blockIndex] = sprite;
        completionHandler();
      });
      tween.start();
    }
  }

  playPlaceBlockInFrontAnimation(playerPosition, facing, blockPosition, plane, blockType, completionHandler) {
    this.setSelectionIndicatorPosition(blockPosition[0], blockPosition[1]);
    this.playPlayerAnimation("punch", playerPosition, facing, false).onComplete.add(() => {
      if (plane === this.controller.levelModel.actionPlane) {
        this.createActionPlaneBlock(blockPosition, blockType);
      } else {
        // re-lay ground tiles based on model
        this.refreshGroundPlane();
      }
      completionHandler();
    });
  }

  createActionPlaneBlock(position, blockType) {
    let blockIndex = (position[1] * 10) + position[0];
    var sprite = this.createBlock(this.actionPlane, position[0], position[1], blockType);

    if (sprite) {
      sprite.sortOrder = position[1] * 10;
    }

    this.actionPlaneBlocks[blockIndex] = sprite;
  }

  playShearSheepAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler) {
    let direction = this.getDirectionName(facing);
    this.setSelectionIndicatorPosition(destroyPosition[0], destroyPosition[1]);

    var signalBinding = this.playPlayerAnimation("punch", playerPosition, facing, false).onComplete.add(() => {
      signalBinding.detach();

      let blockIndex = (destroyPosition[1] * 10) + destroyPosition[0];
      let blockToShear = this.actionPlaneBlocks[blockIndex];

      blockToShear.animations.stop(null, true);
      var binding = blockToShear.animations.play("used").onLoop.add(() => {
        binding.detach();
        blockToShear.animations.play("face");
      });

      this.playExplosionAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler, true);
    });
  }

  playDestroyBlockAnimation(playerPosition, facing, destroyPosition, blockType, newShadingPlaneData, completionHandler) {
    this.setSelectionIndicatorPosition(destroyPosition[0], destroyPosition[1]);

    this.playPlayerAnimation("mine", playerPosition, facing, false);
    this.playMiningParticlesAnimation(facing, destroyPosition);
    this.playBlockDestroyOverlayAnimation(playerPosition, facing, destroyPosition, blockType, newShadingPlaneData, completionHandler);
  }

  playBlockDestroyOverlayAnimation(playerPosition, facing, destroyPosition, blockType, newShadingPlaneData, completionHandler) {
    let blockIndex = (destroyPosition[1] * 10) + destroyPosition[0];
    let blockToDestroy = this.actionPlaneBlocks[blockIndex];
    let direction = this.getDirectionName(facing);

    let destroyOverlay = this.actionPlane.create(-12 + 40 * destroyPosition[0], -22 + 40 * destroyPosition[1], "destroyOverlay", "destroy1");
    destroyOverlay.sortOrder = destroyPosition[1] * 10 + 2;
    var signalBinding = destroyOverlay.animations.add("destroy", Phaser.Animation.generateFrameNames("destroy", 1, 12, "", 0), 30, false).onComplete.add(() =>
    {
      signalBinding.detach();

      this.actionPlaneBlocks[blockIndex] = null;

      if (blockToDestroy.hasOwnProperty("onBlockDestroy")) {
        blockToDestroy.onBlockDestroy(blockToDestroy);
      }

      blockToDestroy.kill();
      destroyOverlay.kill();
      this.toDestroy.push(blockToDestroy);
      this.toDestroy.push(destroyOverlay);
      this.updateShadingPlane(newShadingPlaneData);

      this.setSelectionIndicatorPosition(playerPosition[0], playerPosition[1]);

      this.audioPlayer.play('dig_wood1');
      this.playExplosionAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler, true);
    });

    destroyOverlay.animations.play("destroy");
  }

  playMiningParticlesAnimation(facing, destroyPosition) {
    let miningParticlesData = [
      [24, -100, -80],   // left
      [12, -120, -80],   // bottom
      [0, -60, -80],   // right
      [36, -80, -60],   // top
    ];

    let direction = this.getDirectionName(facing);
    let miningParticlesIndex = (direction === "_left" ? 0 : direction === "_bottom" ? 1 : direction === "_right" ? 2 : 3);
    let miningParticlesFirstFrame = miningParticlesData[miningParticlesIndex][0];
    let miningParticlesOffsetX = miningParticlesData[miningParticlesIndex][1];
    let miningParticlesOffsetY = miningParticlesData[miningParticlesIndex][2];
    let miningParticles = this.actionPlane.create(miningParticlesOffsetX + 40 * destroyPosition[0], miningParticlesOffsetY + 40 * destroyPosition[1], "miningParticles", "MiningParticles" + miningParticlesFirstFrame);
    miningParticles.sortOrder = destroyPosition[1] * 10 + 2;
    var signalBinding = miningParticles.animations.add("miningParticles", Phaser.Animation.generateFrameNames("MiningParticles", miningParticlesFirstFrame, miningParticlesFirstFrame + 11, "", 0), 30, false).onComplete.add(() => {
      signalBinding.detach();

      miningParticles.kill();
      this.toDestroy.push(miningParticles);
    });
    miningParticles.animations.play("miningParticles");
  }

  playExplosionAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler, placeBlock) {
    var signalBinding,
        explodeAnim = this.actionPlane.create(-36 + 40 * destroyPosition[0], -30 + 40 * destroyPosition[1], "blockExplode", "BlockBreakParticle0");

    explodeAnim.sortOrder = destroyPosition[1] * 10 + 2;
    signalBinding = explodeAnim.animations.add("explode", Phaser.Animation.generateFrameNames("BlockBreakParticle", 0, 7, "", 0), 30, false).onComplete.add(() =>
    {
      signalBinding.detach();
      explodeAnim.kill();
      this.toDestroy.push(explodeAnim);

      if(placeBlock)
      {
        this.playPlayerAnimation("idle", playerPosition, facing, false);
        this.playItemDropAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler);
      }
    });
    explodeAnim.animations.play("explode");
    if(!placeBlock)
    {
      completionHandler();
    }
  }

  playItemDropAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler) {
    var signalBinding,
        sprite = this.createMiniBlock(destroyPosition[0], destroyPosition[1], blockType);
    sprite.sortOrder = destroyPosition[1] * 10 + 2;
    signalBinding = sprite.animations.play("animate").onComplete.add(() => {
      signalBinding.detach();
      this.playItemAcquireAnimation(playerPosition, facing, destroyPosition, blockType, sprite, completionHandler);
    });
  }

  playItemAcquireAnimation(playerPosition, facing, destroyPosition, blockType, sprite, completionHandler) {
    var tween;

    tween = this.game.add.tween(sprite).to({
      x: (-18 + 40 * playerPosition[0]),
      y: (-32 + 40 * playerPosition[1])
    }, 200, Phaser.Easing.Linear.None);

    tween.onComplete.add(() => {
      sprite.kill();
      this.toDestroy.push(sprite);
      completionHandler();
    });

    tween.start();
  }

  setPlayerPosition(x, y, isOnBlock) {
    this.playerSprite.x = -18 + 40 * x;
    this.playerSprite.y = -32 + (isOnBlock ? -23 : 0) + 40 * y;
    this.playerSprite.sortOrder = y * 10 + 5;
  }

  setSelectionIndicatorPosition(x, y) {
    this.selectionIndicator.x = -35 + 23 + 40 * x;
    this.selectionIndicator.y = -55 + 43 + 40 * y;
  }

  createPlanes() {
    this.groundPlane = this.game.add.group();
    this.groundPlane.yOffset = -2;
    this.shadingPlane = this.game.add.group();
    this.shadingPlane.yOffset = -2;
    this.actionPlane = this.game.add.group();
    this.actionPlane.yOffset = -22;
    this.fluffPlane = this.game.add.group();
    this.fluffPlane.yOffset = -160;
    this.fowPlane = this.game.add.group();
    this.fowPlane.yOffset = 0;
  }

  resetPlanes(levelData) {
    var sprite,
        x,
        y,
        i,
        blockType,
        frameList;

    this.groundPlane.removeAll(true);
    this.actionPlane.removeAll(true);
    this.fluffPlane.removeAll(true);
    this.shadingPlane.removeAll(true);
    this.fowPlane.removeAll(true);

    this.baseShading = this.shadingPlane.create(0, 0, 'shadeLayer');

    this.refreshGroundPlane();

    this.actionPlaneBlocks = [];
    for (y = 0; y < 10; ++y) {
      for (x = 0; x < 10; ++x) {
        let blockIndex = (y * 10) + x;
        sprite = null;

        if (!levelData.groundDecorationPlane[blockIndex].isEmpty) {
          sprite = this.createBlock(this.actionPlane, x, y, levelData.groundDecorationPlane[blockIndex].blockType);
          if (sprite) {
            sprite.sortOrder = y * 10;
          }
        }

        sprite = null;
        if (!levelData.actionPlane[blockIndex].isEmpty) {
          blockType = levelData.actionPlane[blockIndex].blockType;
          sprite = this.createBlock(this.actionPlane, x, y, blockType);
          if (sprite !== null) {
            sprite.sortOrder = y * 10;
          }
        }

        this.actionPlaneBlocks.push(sprite);
      }
    }

    for (y = 0; y < 10; ++y) {
      for (x = 0; x < 10; ++x) {
        let blockIndex = (y * 10) + x;
        if (!levelData.fluffPlane[blockIndex].isEmpty) {
          sprite = this.createBlock(this.fluffPlane, x, y, levelData.fluffPlane[blockIndex].blockType);
        }
      }
    }
  }

  refreshGroundPlane() {
    this.groundPlane.removeAll(true);
    for (var y = 0; y < 10; ++y) {
      for (var x = 0; x < 10; ++x) {
        let blockIndex = (y * 10) + x;
        var sprite = this.createBlock(this.groundPlane, x, y, this.controller.levelModel.groundPlane[blockIndex].blockType);
        if (sprite) {
          sprite.sortOrder = y * 10;
        }
      }
    }
  }

  updateShadingPlane(shadingData) {
    var index, shadowItem, sx, sy, atlas;

    this.shadingPlane.removeAll();

    this.shadingPlane.add(this.baseShading);
    this.shadingPlane.add(this.selectionIndicator);

    for (index = 0; index < shadingData.length; ++index) {
      shadowItem = shadingData[index];

      atlas = "AO";
      sx = 40 * shadowItem.x;
      sy = -22 + 40 * shadowItem.y;

      switch (shadowItem.type) {
        case "AOeffect_Left":
          sx += 26;
          sy += 22;
          break;

        case "AOeffect_Right":
          sx += 0;
          sy += 22;
          break;

        case "AOeffect_Bottom":
          sx += 0;
          sy += 22;
          break;

        case "AOeffect_BottomLeft":
          sx += 25;
          sy += 22;
          break;

        case "AOeffect_BottomRight":
          sx += 0;
          sy += 22;
          break;

        case "AOeffect_Top":
          sx += 0;
          sy += 47;
          break;

        case "AOeffect_TopLeft":
          sx += 25;
          sy += 47;
          break;

        case "AOeffect_TopRight":
          sx += 0;
          sy += 47;
          break;

        case "Shadow_Parts_Fade_base.png":
          atlas = "blockShadows";
          sx -= 52;
          sy += 0;
          break;

        case "Shadow_Parts_Fade_top.png":
          atlas = "blockShadows";
          sx -= 52;
          sy += 0;
          break;
      }

      this.shadingPlane.create(sx, sy, atlas, shadowItem.type);
    }
  }

  updateFowPlane(fowData) {
    var index, fx, fy, atlas;

    this.fowPlane.removeAll();

    for (index = 0; index < fowData.length; ++index) {
      let fowItem = fowData[index];

      if (fowItem !== "") {
        atlas = "undergroundFow";
        fx = -40 + 40 * fowItem.x;
        fy = -40 + 40 * fowItem.y;

        switch (fowItem.type) {
          case "FogOfWar_Center":
            break;

          default:
            break;
        }

        this.fowPlane.create(fx, fy, atlas, fowItem.type);
      }
    }
  }

  preparePlayerSprite() {
    var frameList,
        genFrames,
        i;

    let frameRate = 20;

    this.playerSprite = this.actionPlane.create(0, 0, 'player', 'Player_121');
    this.playerGhost = this.fluffPlane.create(0, 0, 'player', 'Player_121');
    this.playerGhost.parent = this.playerSprite;
    this.playerGhost.alpha = 0.2;

    this.selectionIndicator = this.shadingPlane.create(24, 44, 'selectionIndicator');

    frameList = [];
    for (i = 0; i < 19; ++i) {
      frameList.push("Player_001");
    }
    genFrames = Phaser.Animation.generateFrameNames("Player_", 1, 12, "", 3);
    frameList = frameList.concat(genFrames);
    this.playerSprite.animations.add('idle_down', frameList, frameRate / 2, true);
    this.playerSprite.animations.add('walk_down', Phaser.Animation.generateFrameNames("Player_", 13, frameRate, "", 3), frameRate, true);
    this.playerSprite.animations.add('punch_down', Phaser.Animation.generateFrameNames("Player_", 21, 24, "", 3), frameRate, false);
    this.playerSprite.animations.add('hurt_down', Phaser.Animation.generateFrameNames("Player_", 25, 28, "", 3), frameRate, true);
    this.playerSprite.animations.add('crouch_down', Phaser.Animation.generateFrameNames("Player_", 29, 32, "", 3), frameRate, true);
    this.playerSprite.animations.add('jumpUp_down', Phaser.Animation.generateFrameNames("Player_", 33, 36, "", 3), frameRate / 2, true);
    this.playerSprite.animations.add('fail_down', Phaser.Animation.generateFrameNames("Player_", 105, 108, "", 3), frameRate, false);
    this.playerSprite.animations.add('celebrate_down', Phaser.Animation.generateFrameNames("Player_", 37, 44, "", 3), frameRate / 2, true);
    this.playerSprite.animations.add('bump_down', Phaser.Animation.generateFrameNames("Player_", 49, 54, "", 3), frameRate, false);
    this.playerSprite.animations.add('jumpDown_down', Phaser.Animation.generateFrameNames("Player_", 55, 60, "", 3), frameRate, true);
    this.playerSprite.animations.add('mine_down', Phaser.Animation.generateFrameNames("Player_", 241, 244, "", 3), frameRate, true);

    frameList = [];
    for (i = 0; i < 19; ++i) {
      frameList.push("Player_061");
    }
    genFrames = Phaser.Animation.generateFrameNames("Player_", 61, 72, "", 3);
    frameList = frameList.concat(genFrames);
    this.playerSprite.animations.add('idle_right', frameList, frameRate / 2, true);
    this.playerSprite.animations.add('walk_right', Phaser.Animation.generateFrameNames("Player_", 73, 80, "", 3), frameRate, true);
    this.playerSprite.animations.add('punch_right', Phaser.Animation.generateFrameNames("Player_", 81, 84, "", 3), frameRate, false);
    this.playerSprite.animations.add('hurt_right', Phaser.Animation.generateFrameNames("Player_", 85, 88, "", 3), frameRate, true);
    this.playerSprite.animations.add('crouch_right', Phaser.Animation.generateFrameNames("Player_", 89, 92, "", 3), frameRate, true);
    this.playerSprite.animations.add('jumpUp_right', Phaser.Animation.generateFrameNames("Player_", 93, 96, "", 3), frameRate / 2, true);
    this.playerSprite.animations.add('fail_right', Phaser.Animation.generateFrameNames("Player_", 105, 108, "", 3), frameRate / 2, false);
    this.playerSprite.animations.add('celebrate_right', Phaser.Animation.generateFrameNames("Player_", 37, 44, "", 3), frameRate / 2, true);
    this.playerSprite.animations.add('bump_right', Phaser.Animation.generateFrameNames("Player_", 109, 114, "", 3), frameRate, false);
    this.playerSprite.animations.add('jumpDown_right', Phaser.Animation.generateFrameNames("Player_", 115, 120, "", 3), frameRate, true);
    this.playerSprite.animations.add('mine_right', Phaser.Animation.generateFrameNames("Player_", 245, 248, "", 3), frameRate, true);

    frameList = [];
    for (i = 0; i < 19; ++i) {
      frameList.push("Player_181");
    }
    genFrames = Phaser.Animation.generateFrameNames("Player_", 181, 192, "", 3);
    frameList = frameList.concat(genFrames);
    this.playerSprite.animations.add('idle_left', frameList, frameRate / 2, true);
    this.playerSprite.animations.add('walk_left', Phaser.Animation.generateFrameNames("Player_", 193, 200, "", 3), frameRate, true);
    this.playerSprite.animations.add('punch_left', Phaser.Animation.generateFrameNames("Player_", 201, 204, "", 3), frameRate, false);
    this.playerSprite.animations.add('hurt_left', Phaser.Animation.generateFrameNames("Player_", 205, 208, "", 3), frameRate, true);
    this.playerSprite.animations.add('crouch_left', Phaser.Animation.generateFrameNames("Player_", 209, 212, "", 3), frameRate, true);
    this.playerSprite.animations.add('jumpUp_left', Phaser.Animation.generateFrameNames("Player_", 213, 216, "", 3), frameRate / 2, true);
    this.playerSprite.animations.add('fail_left', Phaser.Animation.generateFrameNames("Player_", 105, 108, "", 3), frameRate / 2, false);
    this.playerSprite.animations.add('celebrate_left', Phaser.Animation.generateFrameNames("Player_", 37, 44, "", 3), frameRate / 2, true);
    this.playerSprite.animations.add('bump_left', Phaser.Animation.generateFrameNames("Player_", 229, 234, "", 3), frameRate, false);
    this.playerSprite.animations.add('jumpDown_left', Phaser.Animation.generateFrameNames("Player_", 235, 240, "", 3), frameRate, true);
    this.playerSprite.animations.add('mine_left', Phaser.Animation.generateFrameNames("Player_", 253, 256, "", 3), frameRate, true);

    frameList = [];
    for (i = 0; i < 19; ++i) {
      frameList.push("Player_121");
    }
    genFrames = Phaser.Animation.generateFrameNames("Player_", 121, 132, "", 3);
    frameList = frameList.concat(genFrames);
    this.playerSprite.animations.add('idle_up', frameList, frameRate / 2, true);
    this.playerSprite.animations.add('walk_up', Phaser.Animation.generateFrameNames("Player_", 133, 140, "", 3), frameRate, true);
    this.playerSprite.animations.add('punch_up', Phaser.Animation.generateFrameNames("Player_", 141, 144, "", 3), frameRate, false);
    this.playerSprite.animations.add('hurt_up', Phaser.Animation.generateFrameNames("Player_", 145, 148, "", 3), frameRate, true);
    this.playerSprite.animations.add('crouch_up', Phaser.Animation.generateFrameNames("Player_", 149, 152, "", 3), frameRate, true);
    this.playerSprite.animations.add('jumpUp_up', Phaser.Animation.generateFrameNames("Player_", 153, 156, "", 3), frameRate / 2, true);
    this.playerSprite.animations.add('fail_up', Phaser.Animation.generateFrameNames("Player_", 105, 108, "", 3), frameRate / 2, false);
    this.playerSprite.animations.add('celebrate_up', Phaser.Animation.generateFrameNames("Player_", 37, 44, "", 3), frameRate / 2, true);
    this.playerSprite.animations.add('bump_up', Phaser.Animation.generateFrameNames("Player_", 169, 174, "", 3), frameRate, false);
    this.playerSprite.animations.add('jumpDown_up', Phaser.Animation.generateFrameNames("Player_", 175, 180, "", 3), frameRate, true);
    this.playerSprite.animations.add('mine_up', Phaser.Animation.generateFrameNames("Player_", 249, 252, "", 3), frameRate, true);
  }

  createMiniBlock(x, y, blockType) {
    var frame = "",
        sprite = null,
        frameList,
        i, len;

    switch (blockType) {
      case "treeAcacia":
      case "treeBirch":
      case "treeJungle":
      case "treeOak":
      case "treeSpruce":
        frame = "log" + blockType.substring(4);
        break;
      case "stone":
        frame = "cobblestone";
        break;
      case "oreCoal":
        frame = "coal";
        break;
      case "oreDiamond":
        frame = "diamond";
        break;
      case "oreIron":
        frame = "ingotIron";
        break;
      case "oreGold":
        frame = "ingotGold";
        break;
      case "oreEmerald":
        frame = "emerald";
        break;
      case "oreRedstone":
        frame = "redstoneDust";
        break;
      case "grass":
        frame = "dirt";
        break;
      default:
        frame = blockType;
        break;
    }

    let atlas = "miniBlocks";
    let framePrefix = this.miniBlocks[frame][0];
    let frameStart = this.miniBlocks[frame][1];
    let frameEnd = this.miniBlocks[frame][2];
    let xOffset = -10;
    let yOffset = 0;

    frameList = Phaser.Animation.generateFrameNames(framePrefix, frameStart, frameEnd, "", 3);

    sprite = this.actionPlane.create(xOffset + 40 * x, yOffset + this.actionPlane.yOffset + 40 * y, atlas, "");
    sprite.animations.add("animate", frameList, 10, false);
    return sprite;
  }

  playAnimationWithOffset(sprite, animationName, animationFrameTotal, startFrame){
    var rand = Math.trunc(Math.random() * animationFrameTotal) + startFrame;
    sprite.animations.play(animationName).setFrame(rand, true);
  }

  createBlock(plane, x, y, blockType) {
    var i,
        sprite = null,
        frameList,
        atlas,
        frame,
        xOffset,
        yOffset,
        stillFrames;

    switch (blockType) {
      case "treeAcacia":
      case "treeBirch":
      case "treeJungle":
      case "treeOak":
      case "treeSpruce":
        sprite = this.createBlock(plane, x, y, "log" + blockType.substring(4));
        sprite.fluff = this.createBlock(this.fluffPlane, x, y, "leaves" + blockType.substring(4));

        sprite.onBlockDestroy = (logSprite) => {
          logSprite.fluff.animations.add("despawn", Phaser.Animation.generateFrameNames("Leaves", 0, 6, "", 0), 10, false).onComplete.add(() => {
            this.toDestroy.push(logSprite.fluff);
            logSprite.fluff.kill();
          });

          logSprite.fluff.animations.play("despawn");
        };
        break;

      case "sheep":
        // Facing Left: Eat Grass: 199-216
        sprite = plane.create(-12 + 40 * x, -12 + 40 * y, "sheep", "Sheep_199");
        frameList = Phaser.Animation.generateFrameNames("Sheep_", 199, 215, "", 0);
        for (i = 0; i < 30; ++i) {
          frameList.push("Sheep_215");
        }
        sprite.animations.add("idle", frameList, 15, true);

        // TODO(bjordan/gaallen) - update once updated Sheep.json
        //frameList = Phaser.Animation.generateFrameNames("Sheep_", 490, 491, "", 0);
        //stillFrames = Math.trunc(Math.random() * 20) + 5;
        //for (i = 0; i < stillFrames; ++i) {
        //  frameList.push("Sheep_492");
        //}

        frameList = Phaser.Animation.generateFrameNames("Sheep_", 439, 455, "", 0);
        for (i = 0; i < 3; ++i) {
          frameList.push("Sheep_455");
        }
        sprite.animations.add("face", frameList, 15, true);
        sprite.animations.add("used", frameList, 15, true);
        this.playAnimationWithOffset(sprite,"idle",17, 199);
        break;

      case "creeper":
        sprite = plane.create(-6 + 40 * x, 0 + plane.yOffset + 40 * y, "creeper", "Creeper_053");

        frameList = Phaser.Animation.generateFrameNames("Creeper_", 37, 51, "", 3);
        sprite.animations.add("explode", frameList, 15, false);

        frameList = Phaser.Animation.generateFrameNames("Creeper_", 53, 59, "", 3);
        stillFrames = Math.trunc(Math.random() * 10) + 20;
        for (i = 0; i < stillFrames; ++i) {
          frameList.push("Creeper_053");
        }
        sprite.animations.add("idle", frameList, 15, true);
        this.playAnimationWithOffset(sprite, "idle", 8, 52);
        break;

      case "torch":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = plane.create(xOffset + 40 * x, yOffset + plane.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Torch", 0, 23, "", 0);
        sprite.animations.add("idle", frameList, 15, true);
        sprite.animations.play("idle");
        break;

      case "water":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = plane.create(xOffset + 40 * x, yOffset + plane.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Water_", 0, 5, "", 0);
        sprite.animations.add("idle", frameList, 5, true);
        sprite.animations.play("idle");
        break;

      case "lava":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = plane.create(xOffset + 40 * x, yOffset + plane.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Lava_", 0, 5, "", 0);
        sprite.animations.add("idle", frameList, 5, true);
        sprite.animations.play("idle");
        break;

      case "lavaPop":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = plane.create(xOffset + 40 * x, yOffset + plane.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("LavaPop", 1, 30, "", 2);
        sprite.animations.add("idle", frameList, 5, true);
        this.playAnimationWithOffset(sprite, "idle", 29, 1);
        //sprite.animations.play("idle");
        break;

      case "fire":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = plane.create(xOffset + 40 * x, yOffset + plane.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Fire", 0, 14, "", 2);
        sprite.animations.add("idle", frameList, 5, true);
        sprite.animations.play("idle");
        break;

      case "bubbles":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = plane.create(xOffset + 40 * x, yOffset + plane.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Bubbles", 0, 14, "", 2);
        sprite.animations.add("idle", frameList, 5, true);
        sprite.animations.play("idle");
        break;

      case "explosion":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = plane.create(xOffset + 40 * x, yOffset + plane.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Explosion", 0, 16, "", 1);
        sprite.animations.add("idle", frameList, 15, false).onComplete.add(() => {
          this.toDestroy.push(sprite);
          sprite.kill();
        });
        sprite.animations.play("idle");
        break;

      case "door":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = plane.create(xOffset + 40 * x, yOffset + plane.yOffset + 40 * y, atlas, frame);

        frameList = [];
        let animationFrames = Phaser.Animation.generateFrameNames("Door", 0, 3, "", 1);
        for(var i = 0; i < 5; ++i)
        {
          frameList.push("Door0");
        }
        frameList = frameList.concat(animationFrames);

        sprite.animations.add("open", frameList, 5, false);
        sprite.animations.play("open");
        break;

      default:
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = plane.create(xOffset + 40 * x, yOffset + plane.yOffset + 40 * y, atlas, frame);
        break;
    }

    return sprite;
  }
}
