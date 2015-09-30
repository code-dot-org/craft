import FacingDirection from "./FacingDirection.js"

export default class LevelView {
  constructor(controller) {
    console.log("LevelView::constructor");
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

    this.miniBlocks = {
      "dirt": ["Miniblocks", 0, 5],
      "coarseDirt": ["Miniblocks", 6, 11],
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
      "carrots": ["Miniblocks", 180, 185]
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
      "glass": ["blocks", "Glass", -13, 0],
      "oreGold": ["blocks", "Gold_Ore", -13, 0],
      "grass": ["blocks", "Grass", -13, 0],
      "gravel": ["blocks", "Gravel", -13, 0],
      "clayHardened": ["blocks", "Hardened_Clay", -13, 0],
      "oreIron": ["blocks", "Iron_Ore", -13, 0],
      "oreLapis": ["blocks", "Lapis_Ore", -13, 0],
      "lava": ["blocks", "Lava", -13, 0],
      "leavesAcacia": ["blocks", "Leaves_Acacia", -13, 0],
      "leavesBirch": ["blocks", "Leaves_Birch", -13, 0],
      "leavesJungle": ["blocks", "Leaves_Jungle", -13, 0],
      "leavesOak": ["blocks", "Leaves_Oak", -13, 0],
      "leavesSpruce": ["blocks", "Leaves_Spruce", -13, 0],
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
      "water": ["blocks", "Water", -13, 0],
      "wool": ["blocks", "Wool_White", -13, 0],

      "leavesAcacia": ["leavesAcacia", "Leaves0", -42, 80],
      "leavesBirch": ["leavesBirch", "Leaves0", -100, -10],
      "leavesJungle": ["leavesJungle", "Leaves0", -69, 43],
      "leavesOak": ["leavesOak", "Leaves0", -100, 0],
      "leavesSpruce": ["leavesSpruce", "Leaves0", -76, 60],

      "tallGrass": ["tallGrass", "", -13, 0],
    };

    this.actionPlaneBlocks = [];
    this.toDestroy = [];
  }

  preload(playerAtlas) {
    console.log("LevelView::preload");
    this.game.load.atlasJSONHash('player', `${this.assetRoot}images/${playerAtlas}.png`, `${this.assetRoot}images/${playerAtlas}.json`);
    this.game.load.image('entityShadow', `${this.assetRoot}images/Character_Shadow.png`);
    this.game.load.image('selectionIndicator', `${this.assetRoot}images/Selection_Indicator.png`);

    this.game.load.image('shadeLayer', `${this.assetRoot}images/Shade_Layer.png`);
    this.game.load.atlasJSONHash('AO', `${this.assetRoot}images/AO.png`, `${this.assetRoot}images/AO.json`);
    this.game.load.atlasJSONHash('blockShadows', `${this.assetRoot}images/Block_Shadows.png`, `${this.assetRoot}images/Block_Shadows.json`);

    this.game.load.image('tallGrass', `${this.assetRoot}images/TallGrass.png`);
    this.game.load.atlasJSONHash('blocks', `${this.assetRoot}images/Blocks.png`, `${this.assetRoot}images/Blocks.json`);
    this.game.load.atlasJSONHash('leavesAcacia', `${this.assetRoot}images/Leaves_Acacia_Decay.png`, `${this.assetRoot}images/Leaves_Acacia_Decay.json`);
    this.game.load.atlasJSONHash('leavesBirch', `${this.assetRoot}images/Leaves_Birch_Decay.png`, `${this.assetRoot}images/Leaves_Birch_Decay.json`);
    this.game.load.atlasJSONHash('leavesJungle', `${this.assetRoot}images/Leaves_Jungle_Decay.png`, `${this.assetRoot}images/Leaves_Jungle_Decay.json`);
    this.game.load.atlasJSONHash('leavesOak', `${this.assetRoot}images/Leaves_Oak_Decay.png`, `${this.assetRoot}images/Leaves_Oak_Decay.json`);
    this.game.load.atlasJSONHash('leavesSpruce', `${this.assetRoot}images/Leaves_Spruce_Decay.png`, `${this.assetRoot}images/Leaves_Spruce_Decay.json`);
    this.game.load.atlasJSONHash('sheep', `${this.assetRoot}images/Sheep.png`, `${this.assetRoot}images/Sheep.json`);

    this.game.load.atlasJSONHash('destroyOverlay', `${this.assetRoot}images/Destroy_Overlay.png`, `${this.assetRoot}images/Destroy_Overlay.json`);
    this.game.load.atlasJSONHash('blockExplode', `${this.assetRoot}images/BlockExplode.png`, `${this.assetRoot}images/BlockExplode.json`);
    this.game.load.atlasJSONHash('miningParticles', `${this.assetRoot}images/MiningParticles.png`, `${this.assetRoot}images/MiningParticles.json`);
    this.game.load.atlasJSONHash('miniBlocks', `${this.assetRoot}images/Miniblocks.png`, `${this.assetRoot}images/Miniblocks.json`);

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
    console.log("LevelView::create");
    this.createPlanes();
    this.reset(levelModel);
  }

  reset(levelModel) {
    console.log("LevelView::reset");
    let player = levelModel.player;
    
    this.resetPlanes(levelModel);
    this.preparePlayerSprite();
    this.updateShadingPlane(levelModel.shadingPlane);
    this.setPlayerPosition(player.position[0], player.position[1]);
    this.setSelectionIndicatorPosition(player.position[0], player.position[1]);
    this.playPlayerAnimation("idle", player.position, player.facing);
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
    this.setSelectionIndicatorPosition(position[0], position[1]);
    this.playerSprite.sortOrder = position[1] * 10 + 5;

    let animName = animationName + direction;
    return this.playerSprite.animations.play(animName);    
  }

  playIdleAnimation(position, facing, isOnBlock) {
    this.playPlayerAnimation("idle", position, facing, isOnBlock);
  }

  playSuccessAnimation(position, facing, isOnBlock) {
    this.playPlayerAnimation("celebrate", position, facing, isOnBlock);
  }

  playFailureAnimation(position, facing, isOnBlock) {
    this.playPlayerAnimation("fail", position, facing, isOnBlock);
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
    }, 200, Phaser.Easing.Linear.EaseOut);

    tween.onComplete.add(() => {
      completionHandler();
    });

    tween.start();
  }

  playPlaceBlockAnimation(position, facing, blockType, completionHandler) {
    var tween,
        jumpAnimName;

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

  playShearSheepAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler) {
    let direction = this.getDirectionName(facing);
    this.setSelectionIndicatorPosition(destroyPosition[0], destroyPosition[1]);

    this.playPlayerAnimation("punch", playerPosition, facing, false).onComplete.add(() => {
      let blockIndex = (destroyPosition[1] * 10) + destroyPosition[0];
      let blockToShear = this.actionPlaneBlocks[blockIndex];

      blockToShear.animations.stop(null, true);
      blockToShear.animations.play("used");

      this.playExplosionAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler);
    });
  }

  playDestroyBlockAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler) {
    this.setSelectionIndicatorPosition(destroyPosition[0], destroyPosition[1]);

    this.playPlayerAnimation("mine", playerPosition, facing, false);
    this.playMiningParticlesAnimation(facing, destroyPosition);
    this.playBlockDestroyOverlayAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler);
  }

  playBlockDestroyOverlayAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler) {
    let blockIndex = (destroyPosition[1] * 10) + destroyPosition[0];
    let blockToDestroy = this.actionPlaneBlocks[blockIndex];
    let direction = this.getDirectionName(facing);

    let destroyOverlay = this.actionPlane.create(-12 + 40 * destroyPosition[0], -22 + 40 * destroyPosition[1], "destroyOverlay", "destroy1");
    destroyOverlay.sortOrder = destroyPosition[1] * 10 + 2;
    destroyOverlay.animations.add("destroy", Phaser.Animation.generateFrameNames("destroy", 1, 12, "", 0), 30, false).onComplete.add(() =>
    {
      this.actionPlaneBlocks[blockIndex] = null;

      if (blockToDestroy.hasOwnProperty("onBlockDestroy")) {
        blockToDestroy.onBlockDestroy(blockToDestroy);
      }

      blockToDestroy.kill();
      destroyOverlay.kill();
      this.toDestroy.push(blockToDestroy);
      this.toDestroy.push(destroyOverlay);

      this.setSelectionIndicatorPosition(playerPosition[0], playerPosition[1]);

      this.audioPlayer.play('dig_wood1');
      this.playExplosionAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler);
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
    miningParticles.animations.add("miningParticles", Phaser.Animation.generateFrameNames("MiningParticles", miningParticlesFirstFrame, miningParticlesFirstFrame + 11, "", 0), 30, false).onComplete.add(() =>
    {
      miningParticles.kill();
      this.toDestroy.push(miningParticles);
    });
    miningParticles.animations.play("miningParticles");
  }

  playExplosionAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler) {
    var explodeAnim = this.actionPlane.create(-36 + 40 * destroyPosition[0], -30 + 40 * destroyPosition[1], "blockExplode", "BlockBreakParticle0");
    explodeAnim.sortOrder = destroyPosition[1] * 10 + 2;
    explodeAnim.animations.add("explode", Phaser.Animation.generateFrameNames("BlockBreakParticle", 0, 7, "", 0), 30, false).onComplete.add(() =>
    {
      explodeAnim.kill();
      this.toDestroy.push(explodeAnim);
      this.playItemDropAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler);
    });
    explodeAnim.animations.play("explode");
  }

  playItemDropAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler) {
    completionHandler();
  }

  setPlayerPosition(x, y) {
    this.playerSprite.x = -18 + 40 * x;
    this.playerSprite.y = -32 + 40 * y;
    this.playerSprite.sortOrder = y * 10 + 5;
  }

  setSelectionIndicatorPosition(x, y) {
    this.selectionIndicator.x = -35 + 23 + 40 * x;
    this.selectionIndicator.y = -55 + 43 + 40 * y;
  }

  createPlanes() {
    console.log("LevelView::createPlanes");
    this.groundPlane = this.game.add.group();
    this.groundPlane.yOffset = -2;
    this.shadingPlane = this.game.add.group();
    this.shadingPlane.yOffset = -2;
    this.actionPlane = this.game.add.group();
    this.actionPlane.yOffset = -22;
    this.fluffPlane = this.game.add.group();
    this.fluffPlane.yOffset = -160;
  }

  resetPlanes(levelData) {
    var sprite,
        x,
        y,
        i,
        blockType,
        frameList;

    console.log("LevelView::resetPlanes");

    this.groundPlane.removeAll(true);
    this.actionPlane.removeAll(true);
    this.fluffPlane.removeAll(true);
    this.shadingPlane.removeAll(true);

    this.baseShading = this.shadingPlane.create(0, 0, 'shadeLayer');

    for (y = 0; y < 10; ++y) {
      for (x = 0; x < 10; ++x) {
        let blockIndex = (y * 10) + x;
        this.createBlock(this.groundPlane, x, y, levelData.groundPlane[blockIndex].blockType);
      }
    }

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
    this.playerSprite.animations.add('bump_down', Phaser.Animation.generateFrameNames("Player_", 49, 54, "", 3), frameRate, true);
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
    this.playerSprite.animations.add('bump_right', Phaser.Animation.generateFrameNames("Player_", 109, 114, "", 3), frameRate, true);
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
    this.playerSprite.animations.add('bump_left', Phaser.Animation.generateFrameNames("Player_", 229, 234, "", 3), frameRate, true);
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
    this.playerSprite.animations.add('bump_up', Phaser.Animation.generateFrameNames("Player_", 169, 174, "", 3), frameRate, true);
    this.playerSprite.animations.add('jumpDown_up', Phaser.Animation.generateFrameNames("Player_", 175, 180, "", 3), frameRate, true);
    this.playerSprite.animations.add('mine_up', Phaser.Animation.generateFrameNames("Player_", 249, 252, "", 3), frameRate, true);
  }

  createBlock(plane, x, y, blockType) {
    var i,
        sprite = null,
        frameList;

    switch (blockType) {
      case "treeAcacia":
      case "treeBirch":
      case "treeJungle":
      case "treeOak":
      case "treeSpruce":
        sprite = this.createBlock(plane, x, y, "log" + blockType.substring(4));
        sprite.fluff = this.createBlock(this.fluffPlane, x, y, "leaves" + blockType.substring(4));

        sprite.onBlockDestroy = (logSprite) => {
          logSprite.fluff.animations.add("despawn", Phaser.Animation.generateFrameNames("Leaves", 0, 6, "", 0), 15, false).onComplete.add(() => {
            this.toDestroy.push(logSprite.fluff);
            logSprite.fluff.kill();
          });

          logSprite.fluff.animations.play("despawn");
        };
        break;

      case "sheep":
        // Facing Left: Eat Grass: 199-216
        sprite = plane.create(-12 + 40 * x, -12 + 40 * y, "sheep", "Sheep_199");
        frameList = Phaser.Animation.generateFrameNames("Sheep_", 199, 216, "", 0);
        for (i = 0; i < 30; ++i) {
          frameList.push("Sheep_190");
        }
        sprite.animations.add("idle", frameList, 15, true);

        frameList = Phaser.Animation.generateFrameNames("Sheep_", 430, 447, "", 0);
        for (i = 0; i < 30; ++i) {
          frameList.push("Sheep_430");
        }

        sprite.animations.add("used", frameList, 15, true);
        sprite.animations.play("idle");
        break;

      default:
        let atlas = this.blocks[blockType][0];
        let frame = this.blocks[blockType][1];
        let xOffset = this.blocks[blockType][2];
        let yOffset = this.blocks[blockType][3];
        sprite = plane.create(xOffset + 40 * x, yOffset + plane.yOffset + 40 * y, atlas, frame);
        break;
    }

    return sprite;
  }
}
