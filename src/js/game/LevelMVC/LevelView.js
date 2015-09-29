import FacingDirection from "./FacingDirection.js"

export default class LevelView {
  constructor(controller) {
    this.controller = controller;
    this.audioPlayer = controller.audioPlayer;
    this.game = controller.game;
    this.assetRoot = controller.assetRoot;
    this.levelData = controller.levelData;

    this.baseShading = null;

    this.playerSprite = null;
    this.playerGhost = null;        // The ghost is a copy of the player sprite that sits on top of everything at 20% opacity, so the player can go under trees and still be seen.
    this.playerShadow = null;
    this.selectionIndicator = null;

    this.playerModel = controller.levelModel.player;

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
      "": [""],
      "bedrock": ["Bedrock"],
      "bricks": ["Bricks"],
      "clay": ["Clay"],
      "oreCoal": ["Coal_Ore"],
      "dirtCoarse": ["Coarse_Dirt"],
      "cobblestone": ["Cobblestone"],
      "oreDiamond": ["Diamond_Ore"],
      "dirt": ["Dirt"],
      "oreEmerald": ["Emerald_Ore"],
      "farmlandWet": ["Farmland_Wet"],
      "glass": ["Glass"],
      "oreGold": ["Gold_Ore"],
      "grass": ["Grass"],
      "gravel": ["Gravel"],
      "clayHardened": ["Hardened_Clay"],
      "oreIron": ["Iron_Ore"],
      "oreLapis": ["Lapis_Ore"],
      "lava": ["Lava"],
      "leavesAcacia": ["Leaves_Acacia"],
      "leavesBirch": ["Leaves_Birch"],
      "leavesJungle": ["Leaves_Jungle"],
      "leavesOak": ["Leaves_Oak"],
      "leavesSpruce": ["Leaves_Spruce"],
      "logAcacia": ["Log_Acacia"],
      "logBirch": ["Log_Birch"],
      "logJungle": ["Log_Jungle"],
      "logOak": ["Log_Oak"],
      "logSpruce": ["Log_Spruce"],
      "obsidian": ["Obsidian"],
      "planksAcacia": ["Planks_Acacia"],
      "planksBirch": ["Planks_Birch"],
      "planksJungle": ["Planks_Jungle"],
      "planksOak": ["Planks_Oak"],
      "planksSpruce": ["Planks_Spruce"],
      "oreRedstone": ["Redstone_Ore"],
      "sand": ["Sand"],
      "sandstone": ["Sandstone"],
      "stone": ["Stone"],
      "tnt": ["Tnt"],
      "water": ["Water"],
      "wool": ["Wool_White"],
    };

    this.actionPlaneBlocks = [];
    this.toDestroy = [];
  }

  preload() {
    var playerAtlas = "Alex";

    this.game.load.atlasJSONHash('player', `${this.assetRoot}images/${playerAtlas}.png`, `${this.assetRoot}images/${playerAtlas}.json`);
    this.game.load.image('entityShadow', `${this.assetRoot}images/Character_Shadow.png`);
    this.game.load.image('selectionIndicator', `${this.assetRoot}images/Selection_Indicator.png`);

    this.game.load.image('shadeLayer', `${this.assetRoot}images/Shade_Layer.png`);
    this.game.load.atlasJSONHash('AO', `${this.assetRoot}images/AO.png`, `${this.assetRoot}images/AO.json`);

    this.game.load.atlasJSONHash('leavesOak', `${this.assetRoot}images/Leaves_Oak_Decay.png`, `${this.assetRoot}images/Leaves_Oak_Decay.json`);
    this.game.load.atlasJSONHash('destroyOverlay', `${this.assetRoot}images/Destroy_Overlay.png`, `${this.assetRoot}images/Destroy_Overlay.json`);
    this.game.load.atlasJSONHash('blockExplode', `${this.assetRoot}images/BlockExplode.png`, `${this.assetRoot}images/BlockExplode.json`);
    this.game.load.atlasJSONHash('miningParticles', `${this.assetRoot}images/MiningParticles.png`, `${this.assetRoot}images/MiningParticles.json`);
    this.game.load.atlasJSONHash('miniBlocks', `${this.assetRoot}images/Miniblocks.png`, `${this.assetRoot}images/Miniblocks.json`);
    this.game.load.atlasJSONHash('blocks', `${this.assetRoot}images/Blocks.png`, `${this.assetRoot}images/Blocks.json`);

    //this.game.load.image('grass', `${this.assetRoot}images/Block_0000_Grass.png`);
    //this.game.load.image('coarseDirt', `${this.assetRoot}images/Block_0002_coarse_dirt.png`);
    this.game.load.image('tallGrass', `${this.assetRoot}images/TallGrass.png`);
    //this.game.load.image('logOak', `${this.assetRoot}images/Block_0008_log_oak.png`);
    //this.game.load.image('planksOak', `${this.assetRoot}images/Block_0020_planks_oak.png`);

    this.game.load.atlasJSONHash('sheep', `${this.assetRoot}images/Sheep.png`, `${this.assetRoot}images/Sheep.json`);

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

  create() {
    this.createPlanes();
    this.reset();
  }

  isCreated() {
    return !!this.groundPlane;
  }

  reset(levelModel) {
    if (!this.isCreated()) {
      return;
    }

    this.resetPlanes(this.levelData);
    this.preparePlayerSprite();
    this.updateShadingPlane(this.controller.levelModel.shadingPlane);
    this.setPlayerPosition(this.playerModel.position[0], this.playerModel.position[1]);
    this.setSelectionIndicatorPosition(this.playerModel.position[0], this.playerModel.position[1]);
    this.playIdleAnimation(this.playerModel.position, this.playerModel.facing);
  }

  update() {
    var i;

    for (i = 0; i < this.toDestroy.length; ++i) {
      this.toDestroy[i].destroy();
    }
    this.toDestroy = [];

    if (this.playerGhost) {
      this.playerGhost.frame = this.playerSprite.frame;
    }
  }

  render() {
    this.actionPlane.sort('sortOrder'); 
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

  playIdleAnimation(position, facing, isOnBlock) {
      var tween,
          idleAnimName;

      let direction = this.getDirectionName(facing);

      this.setSelectionIndicatorPosition(position[0], position[1]);
      this.playerSprite.sortOrder = position[1] * 10 + 5;

      idleAnimName = "idle" + direction;

      this.playerSprite.animations.play(idleAnimName);
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

      var sprite = this.actionPlane.create(-12 + 40 * position[0], -22 + 40 * position[1], blockType);
      sprite.sortOrder = position[1] * 10;

      this.actionPlaneBlocks[blockIndex] = sprite;
      completionHandler();
    });

    tween.start();
  }

  playDestroyBlockAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler) {
    var tween,
        destroyAnimName,
        destroyOverlay,
        blockToDestroy,
        miningParticles,
        miningParticlesIndex;

    let miningParticlesData = [
      [24, -100, -80],   // left
      [12, -120, -80],   // bottom
      [0, -60, -80],   // right
      [36, -80, -60],   // top
    ];

    let direction = this.getDirectionName(facing);
    this.setSelectionIndicatorPosition(destroyPosition[0], destroyPosition[1]);

    miningParticlesIndex = (direction === "_left" ? 0 : direction === "_bottom" ? 1 : direction === "_right" ? 2 : 3);
    let miningParticlesFirstFrame = miningParticlesData[miningParticlesIndex][0];
    let miningParticlesOffsetX = miningParticlesData[miningParticlesIndex][1];
    let miningParticlesOffsetY = miningParticlesData[miningParticlesIndex][2];
    miningParticles = this.actionPlane.create(miningParticlesOffsetX + 40 * destroyPosition[0], miningParticlesOffsetY + 40 * destroyPosition[1], "miningParticles", "MiningParticles" + miningParticlesFirstFrame);
    miningParticles.sortOrder = destroyPosition[1] * 10 + 2;
    miningParticles.animations.add("miningParticles", Phaser.Animation.generateFrameNames("MiningParticles", miningParticlesFirstFrame, miningParticlesFirstFrame + 11, "", 0), 30, false).onComplete.add(() =>
    {
      miningParticles.kill();
      this.toDestroy.push(miningParticles);
    });
    miningParticles.animations.play("miningParticles");

    destroyAnimName = "mine" + direction;

    this.playerSprite.animations.play(destroyAnimName);
    destroyOverlay = this.actionPlane.create(-12 + 40 * destroyPosition[0], -22 + 40 * destroyPosition[1], "destroyOverlay", "destroy1");
    destroyOverlay.sortOrder = destroyPosition[1] * 10 + 2;
    destroyOverlay.animations.add("destroy", Phaser.Animation.generateFrameNames("destroy", 1, 12, "", 0), 30, false).onComplete.add(() =>
    {
      var explodeAnim;

      if (blockToDestroy.hasOwnProperty("onBlockDestroy")) {
        blockToDestroy.onBlockDestroy(blockToDestroy);
      }

      explodeAnim = this.actionPlane.create(-36 + 40 * destroyPosition[0], -30 + 40 * destroyPosition[1], "blockExplode", "BlockBreakParticle0");
      explodeAnim.sortOrder = destroyPosition[1] * 10 + 2;
      explodeAnim.animations.add("explode", Phaser.Animation.generateFrameNames("BlockBreakParticle", 0, 7, "", 0), 30, false).onComplete.add(() =>
      {
        explodeAnim.kill();
        this.toDestroy.push(explodeAnim);
      });
      explodeAnim.animations.play("explode");

      blockToDestroy.kill();
      destroyOverlay.kill();
      this.toDestroy.push(blockToDestroy);
      this.toDestroy.push(destroyOverlay);

      this.setSelectionIndicatorPosition(playerPosition[0], playerPosition[1]);

      this.audioPlayer.play('dig_wood1');
      completionHandler();
    });

    let blockIndex = (destroyPosition[1] * 10) + destroyPosition[0];
    blockToDestroy = this.actionPlaneBlocks[blockIndex];
    this.actionPlaneBlocks[blockIndex] = null;

    destroyOverlay.animations.play("destroy");
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
    this.groundPlane = this.game.add.group();
    this.shadingPlane = this.game.add.group();
    this.actionPlane = this.game.add.group();
    this.fluffPlane = this.game.add.group();
  }

  resetPlanes(levelData) {
    var sprite,
        x,
        y,
        blockType;

    this.groundPlane.removeAll(true);
    this.actionPlane.removeAll(true);
    this.fluffPlane.removeAll(true);
    this.shadingPlane.removeAll(true);

    this.baseShading = this.shadingPlane.create(0, 0, 'shadeLayer');

    for (y = 0; y < 10; ++y) {
      for (x = 0; x < 10; ++x) {
        let blockIndex = (y * 10) + x;
        this.groundPlane.create(-12 + 40 * x, -2 + 40 * y, "blocks", this.blocks[levelData.groundPlane[blockIndex]][0]);
      }
    }

    this.actionPlaneBlocks = [];
    for (y = 0; y < 10; ++y) {
      for (x = 0; x < 10; ++x) {
        let blockIndex = (y * 10) + x;
        sprite = null;

        if (levelData.groundDecorationPlane[blockIndex] !== "") {
          sprite = this.actionPlane.create(-12 + 40 * x, -22 + 40 * y, levelData.groundDecorationPlane[blockIndex]);
          sprite.sortOrder = y * 10;
        }

        sprite = null;
        if (levelData.actionPlane[blockIndex] !== "") {
          blockType = levelData.actionPlane[blockIndex];

          switch (blockType) {
            case "treeOak":
              sprite = this.actionPlane.create(-12 + 40 * x, -22 + 40 * y, "blocks", this.blocks["logOak"][0]);
              sprite.fluff = this.fluffPlane.create(-100 + 40 * x, -160 + 40 * y, "leavesOak", "Leaves_Oak0");
              sprite.fluffType = "leavesOak";

              sprite.onBlockDestroy = (logSprite) => {
                logSprite.fluff.animations.add("despawn", Phaser.Animation.generateFrameNames("Leaves_Oak", 0, 6, "", 0), 20, false).onComplete.add(() => {
                  this.toDestroy.push(logSprite.fluff);
                  logSprite.fluff.kill();
                });
                logSprite.fluff.animations.play("despawn");
              };
              break;

            case "sheep":
              // Facing Left
              // Look Right: 181-189
              // Look Left: 190-198
              // Eat Grass: 199-216
              // Kick Back Legs: 217-234
              // Look Down: 235-240
              sprite = this.actionPlane.create(-12 + 40 * x, -12 + 40 * y, "sheep", "Sheep_190");
              break;              

            default:
              sprite = this.actionPlane.create(-12 + 40 * x, -22 + 40 * y, "blocks", this.blocks[blockType][0]);
              break;
          }

          sprite.sortOrder = y * 10;          
        }

        this.actionPlaneBlocks.push(sprite);
      }
    }

    for (y = 0; y < 10; ++y) {
      for (x = 0; x < 10; ++x) {
        let blockIndex = (y * 10) + x;
        if (levelData.fluffPlane[blockIndex] !== "") {
          sprite = this.fluffPlane.create(-104 + 40 * x, -160 + 40 * y, levelData.fluffPlane[blockIndex]);
        }
      }
    }
  }

  updateShadingPlane(shadingData) {
    var index, shadowItem, sx, sy;

    this.shadingPlane.removeAll();

    this.shadingPlane.add(this.baseShading);
    this.shadingPlane.add(this.selectionIndicator);
    this.shadingPlane.add(this.playerShadow);
    this.playerShadow.parent = this.playerSprite;

    for (index = 0; index < shadingData.length; ++index) {
      shadowItem = shadingData[index];

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
      }

      this.shadingPlane.create(sx, sy, "AO", shadowItem.type);
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

    this.playerShadow = this.shadingPlane.create(6, 30, "entityShadow");
    this.playerShadow.parent = this.playerSprite;

    frameList = [];
    for (i = 0; i < 19; ++i) {
      frameList.push("Player_001");
    }
    genFrames = Phaser.Animation.generateFrameNames("Player_", 1, 12, "", 3);
    frameList = frameList.concat(genFrames);
    this.playerSprite.animations.add('idle_down', frameList, frameRate / 2, true);
    this.playerSprite.animations.add('walk_down', Phaser.Animation.generateFrameNames("Player_", 13, frameRate, "", 3), frameRate, true);
    this.playerSprite.animations.add('punch_down', Phaser.Animation.generateFrameNames("Player_", 21, 24, "", 3), frameRate, true);
    this.playerSprite.animations.add('hurt_down', Phaser.Animation.generateFrameNames("Player_", 25, 28, "", 3), frameRate, true);
    this.playerSprite.animations.add('crouch_down', Phaser.Animation.generateFrameNames("Player_", 29, 32, "", 3), frameRate, true);
    this.playerSprite.animations.add('jumpUp_down', Phaser.Animation.generateFrameNames("Player_", 33, 36, "", 3), frameRate / 2, true);
    this.playerSprite.animations.add('fail_down', Phaser.Animation.generateFrameNames("Player_", 105, 108, "", 3), frameRate, true);
    this.playerSprite.animations.add('celebrate_down', Phaser.Animation.generateFrameNames("Player_", 37, 44, "", 3), frameRate, true);
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
    this.playerSprite.animations.add('punch_right', Phaser.Animation.generateFrameNames("Player_", 81, 84, "", 3), frameRate, true);
    this.playerSprite.animations.add('hurt_right', Phaser.Animation.generateFrameNames("Player_", 85, 88, "", 3), frameRate, true);
    this.playerSprite.animations.add('crouch_right', Phaser.Animation.generateFrameNames("Player_", 89, 92, "", 3), frameRate, true);
    this.playerSprite.animations.add('jumpUp_right', Phaser.Animation.generateFrameNames("Player_", 93, 96, "", 3), frameRate / 2, true);
    this.playerSprite.animations.add('fail_right', Phaser.Animation.generateFrameNames("Player_", 105, 108, "", 3), frameRate, true);
    this.playerSprite.animations.add('celebrate_right', Phaser.Animation.generateFrameNames("Player_", 37, 44, "", 3), frameRate, true);
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
    this.playerSprite.animations.add('punch_left', Phaser.Animation.generateFrameNames("Player_", 201, 204, "", 3), frameRate, true);
    this.playerSprite.animations.add('hurt_left', Phaser.Animation.generateFrameNames("Player_", 205, 208, "", 3), frameRate, true);
    this.playerSprite.animations.add('crouch_left', Phaser.Animation.generateFrameNames("Player_", 209, 212, "", 3), frameRate, true);
    this.playerSprite.animations.add('jumpUp_left', Phaser.Animation.generateFrameNames("Player_", 213, 216, "", 3), frameRate / 2, true);
    this.playerSprite.animations.add('fail_left', Phaser.Animation.generateFrameNames("Player_", 105, 108, "", 3), frameRate, true);
    this.playerSprite.animations.add('celebrate_left', Phaser.Animation.generateFrameNames("Player_", 37, 44, "", 3), frameRate, true);
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
    this.playerSprite.animations.add('punch_up', Phaser.Animation.generateFrameNames("Player_", 141, 144, "", 3), frameRate, true);
    this.playerSprite.animations.add('hurt_up', Phaser.Animation.generateFrameNames("Player_", 145, 148, "", 3), frameRate, true);
    this.playerSprite.animations.add('crouch_up', Phaser.Animation.generateFrameNames("Player_", 149, 152, "", 3), frameRate, true);
    this.playerSprite.animations.add('jumpUp_up', Phaser.Animation.generateFrameNames("Player_", 153, 156, "", 3), frameRate / 2, true);
    this.playerSprite.animations.add('fail_up', Phaser.Animation.generateFrameNames("Player_", 105, 108, "", 3), frameRate, true);
    this.playerSprite.animations.add('celebrate_up', Phaser.Animation.generateFrameNames("Player_", 37, 44, "", 3), frameRate, true);
    this.playerSprite.animations.add('bump_up', Phaser.Animation.generateFrameNames("Player_", 169, 174, "", 3), frameRate, true);
    this.playerSprite.animations.add('jumpDown_up', Phaser.Animation.generateFrameNames("Player_", 175, 180, "", 3), frameRate, true);
    this.playerSprite.animations.add('mine_up', Phaser.Animation.generateFrameNames("Player_", 249, 252, "", 3), frameRate, true);
  }
}
