import FacingDirection from "./FacingDirection.js"

export default class LevelView {
  constructor(controller) {
    this.controller = controller;
    this.game = controller.game;
    this.assetRoot = controller.assetRoot;
    this.levelData = controller.levelData;

    this.baseShading = null;

    this.playerSprite = null;
    this.playerGhost = null;        // The ghost is a copy of the player sprite that sits on top of everything at 20% opacity, so the player can go under trees and still be seen.
    this.playerShadow = null;
    this.selectionIndicator = null;

    this.playerPosition = [2, 4];
    this.playerFacing = 0;

    this.groundPlane = null;
    this.shadingPlane = null;
    this.actionPlane = null;
    this.fluffPlane = null;

    this.actionPlaneBlocks = [];
    this.toDestroy = [];
  }

  preload() {
    this.game.load.atlasJSONHash('player', `${this.assetRoot}images/Steve_Square.png`, `${this.assetRoot}images/Steve_Square.json`);
    this.game.load.image('characterShadow', `${this.assetRoot}images/Character_Shadow.png`);
    this.game.load.image('selectionIndicator', `${this.assetRoot}images/Selection_Indicator.png`);

    this.game.load.image('shadeLayer', `${this.assetRoot}images/Shade_Layer.png`);
    this.game.load.image('AOeffect_Left', `${this.assetRoot}images/AOeffect_Left.png`);
    this.game.load.image('AOeffect_Right', `${this.assetRoot}images/AOeffect_Right.png`);
    this.game.load.image('AOeffect_Bottom', `${this.assetRoot}images/AOeffect_Bottom.png`);
    this.game.load.image('AOeffect_BottomLeft', `${this.assetRoot}images/AOeffect_BottomLeft.png`);
    this.game.load.image('AOeffect_BottomRight', `${this.assetRoot}images/AOeffect_BottomRight.png`);
    this.game.load.image('AOeffect_TopLeft', `${this.assetRoot}images/AOeffect_TopLeft.png`);
    this.game.load.image('AOeffect_TopRight', `${this.assetRoot}images/AOeffect_TopRight.png`);

    this.game.load.atlasJSONHash('leavesOak', `${this.assetRoot}images/Leaves_Oak_decay.png`, `${this.assetRoot}images/Leaves_Oak_decay.json`);
    this.game.load.atlasJSONHash('destroyOverlay', `${this.assetRoot}images/Destroy_Overlay.png`, `${this.assetRoot}images/Destroy_Overlay.json`);

    this.game.load.image('grass', `${this.assetRoot}images/Block_0000_Grass.png`);
    this.game.load.image('coarseDirt', `${this.assetRoot}images/Block_0002_coarse_dirt.png`);
    this.game.load.image('tallGrass', `${this.assetRoot}images/TallGrass.png`);
    this.game.load.image('logOak', `${this.assetRoot}images/Block_0008_log_oak.png`);
  }

  create() {
    this.preparePlanes(this.levelData);

    this.preparePlayerSprite();
    this.setPlayerPosition(this.playerPosition[0], this.playerPosition[1]);
    this.setSelectionIndicatorPosition(this.playerPosition[0], this.playerPosition[1]);
    this.playerSprite.animations.play('idle_right');
  }

  update() {
    var i;

    for (i = 0; i < this.toDestroy.length; ++i) {
      this.toDestroy[i].destroy();
    }
    this.toDestroy = [];

    this.playerGhost.frame = this.playerSprite.frame;
    this.actionPlane.sort('z', Phaser.Group.SORT_ASCENDING);
  }

  render() {

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

  playMoveForwardAnimation(position, facing, isOnBlock, completionHandler) {
    var tween,
        walkAnimName;

    let direction = this.getDirectionName(facing);

    this.setSelectionIndicatorPosition(position[0], position[1]);
    this.playerSprite.z = position[1] * 10 + 5;

    walkAnimName = "walk" + direction;

    this.playerSprite.animations.play(walkAnimName);
    tween = this.game.add.tween(this.playerSprite).to({
      x: (-35 + 40 * position[0]),
      y: (-55 + 40 * position[1] - 40 * (isOnBlock ? 1 : 0))
    }, 500, Phaser.Easing.Linear.None);

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

    jumpAnimName = "jump" + direction;

    this.playerSprite.animations.play(jumpAnimName);
    tween = this.game.add.tween(this.playerSprite).to({
      y: (-95 + 40 * position[1])
    }, 250, Phaser.Easing.Cubic.EaseOut);

    tween.onComplete.add(() => {
      let blockIndex = (position[1] * 10) + position[0];

      var sprite = this.actionPlane.create(-12 + 40 * position[0], -22 + 40 * position[1], blockType);
      sprite.z = position[1];
      this.actionPlaneBlocks[blockIndex] = sprite;
      completionHandler();
    });

    tween.start();
  }

  playDestroyBlockAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler) {
    var tween,
        destroyAnimName,
        destroyOverlay,
        blockToDestroy;

    let direction = this.getDirectionName(facing);
    this.setSelectionIndicatorPosition(destroyPosition[0], destroyPosition[1]);

    destroyAnimName = "pick" + direction;

    this.playerSprite.animations.play(destroyAnimName);
    destroyOverlay = this.actionPlane.create(-12 + 40 * destroyPosition[0], -22 + 40 * destroyPosition[1], "destroyOverlay", "destroy1");
    destroyOverlay.z = destroyPosition[1] * 10 + 2;
    destroyOverlay.animations.add("destroy", [
      "destroy1",
      "destroy2",
      "destroy3",
      "destroy4",
      "destroy5",
      "destroy6",
      "destroy7",
      "destroy8",
      "destroy9",
      "destroy10",
      "destroy11",
      "destroy12"], 30, false).onComplete.add(() =>
    {
      var sprite;

      blockToDestroy.kill();
      destroyOverlay.kill();
      this.toDestroy.push(blockToDestroy);
      this.toDestroy.push(destroyOverlay);
      this.setSelectionIndicatorPosition(playerPosition[0], playerPosition[1]);

      if (blockToDestroy.hasOwnProperty('fluff')) {
        // TODO: Property destroy the fluff (likely a tree top)
        sprite = blockToDestroy.fluff;
        sprite.kill();
        this.toDestroy.push(sprite);
      }

      completionHandler();
    });

    let blockIndex = (destroyPosition[1] * 10) + destroyPosition[0];
    blockToDestroy = this.actionPlaneBlocks[blockIndex];
    this.actionPlaneBlocks[blockIndex] = null;

    destroyOverlay.animations.play("destroy");
  }

  setPlayerPosition(x, y) {
    this.playerSprite.x = -35 + 40 * x;
    this.playerSprite.y = -55 + 40 * y;
    this.playerSprite.z = y * 10 + 5;
  }

  setSelectionIndicatorPosition(x, y) {
    this.selectionIndicator.x = -35 + 23 + 40 * x;
    this.selectionIndicator.y = -55 + 43 + 40 * y;
  }

  preparePlanes(levelData) {
    var sprite;

    this.groundPlane = this.game.add.group();
    this.shadingPlane = this.game.add.group();
    this.actionPlane = this.game.add.group();
    this.fluffPlane = this.game.add.group();
    this.baseShading = this.shadingPlane.create(0, 0, 'shadeLayer');

    for (var y = 0; y < 10; ++y) {
      for (var x = 0; x < 10; ++x) {
        let blockIndex = (y * 10) + x;
        this.groundPlane.create(-12 + 40 * x, -2 + 40 * y, levelData.groundPlane[blockIndex]);
      }
    }

    for (var y = 0; y < 10; ++y) {
      for (var x = 0; x < 10; ++x) {
        let blockIndex = (y * 10) + x;
        sprite = null;

        if (levelData.groundDecorationPlane[blockIndex] !== "") {
          sprite = this.actionPlane.create(-12 + 40 * x, -22 + 40 * y, levelData.groundDecorationPlane[blockIndex]);
          sprite.z = y * 10;
        }

        if (levelData.actionPlane[blockIndex] !== "") {
          sprite = this.actionPlane.create(-12 + 40 * x, -22 + 40 * y, levelData.actionPlane[blockIndex]);
          sprite.z = y * 10;
        }

        this.actionPlaneBlocks[blockIndex] = sprite;
      }
    }

    for (var y = 0; y < 10; ++y) {
      for (var x = 0; x < 10; ++x) {
        let blockIndex = (y * 10) + x;
        if (levelData.fluffPlane[blockIndex] !== "") {
          sprite = this.fluffPlane.create(-104 + 40 * x, -160 + 40 * y, levelData.fluffPlane[blockIndex], "Leaves_Oak0.png");
          this.actionPlaneBlocks[blockIndex].fluff = sprite;
          this.actionPlaneBlocks[blockIndex].fluffType = "leavesOak";
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
          sx -= 22;
          break;

        case "AOeffect_Right":
          sx -= 2;
          break;

        case "AOeffect_Bottom":
          sx -= 12;
          sy += 20;
          break;

        case "AOeffect_BottomLeft":
          sx -= 12;
          sy += 20;
          break;

        case "AOeffect_BottomRight":
          sx -= 12;
          sy += 20;
          break;

        case "AOeffect_TopLeft":
          sx -= 12;
          break;

        case "AOeffect_TopRight":
          sx -= 12;
          break;
      }

      this.shadingPlane.create(sx, sy, shadowItem.type);
    }
  }

  preparePlayerSprite() {
    this.playerSprite = this.actionPlane.create(0, 0, 'player', '_0000_CDO_Mockup_001.png');
    this.playerGhost = this.fluffPlane.create(0, 0, 'player', '_0000_CDO_Mockup_001.png');
    this.playerGhost.parent = this.playerSprite;
    this.playerGhost.alpha = 0.2;

    this.selectionIndicator = this.shadingPlane.create(24, 44, 'selectionIndicator');

    this.playerShadow = this.shadingPlane.create(22, 55, "characterShadow");
    this.playerShadow.parent = this.playerSprite

    this.playerSprite.animations.add('idle_down', [
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0000_CDO_Mockup_001.png',
      '_0001_CDO_Mockup_002.png',
      '_0002_CDO_Mockup_003.png',
      '_0003_CDO_Mockup_004.png',
      '_0004_CDO_Mockup_005.png',
      '_0005_CDO_Mockup_006.png',
      '_0006_CDO_Mockup_007.png',
      '_0007_CDO_Mockup_008.png',
      '_0008_CDO_Mockup_009.png',
      '_0009_CDO_Mockup_010.png',
      '_0010_CDO_Mockup_011.png',
      '_0011_CDO_Mockup_012.png'
    ], 10, true);

    this.playerSprite.animations.add('walk_down', [
      '_0012_CDO_Mockup_013.png',
      '_0013_CDO_Mockup_014.png',
      '_0014_CDO_Mockup_015.png',
      '_0015_CDO_Mockup_016.png',
      '_0016_CDO_Mockup_017.png',
      '_0017_CDO_Mockup_018.png',
      '_0018_CDO_Mockup_019.png',
      '_0019_CDO_Mockup_020.png'
    ], 10, true);

    this.playerSprite.animations.add('pick_down', [
      '_0020_CDO_Mockup_021.png',
      '_0021_CDO_Mockup_022.png',
      '_0022_CDO_Mockup_023.png',
      '_0023_CDO_Mockup_024.png'
    ], 10, true);

    this.playerSprite.animations.add('hurt_down', [
      '_0024_CDO_Mockup_025.png',
      '_0025_CDO_Mockup_026.png',
      '_0026_CDO_Mockup_027.png',
      '_0027_CDO_Mockup_028.png'
    ], 10, true);

    this.playerSprite.animations.add('crouch_down', [
      '_0028_CDO_Mockup_029.png',
      '_0029_CDO_Mockup_030.png',
      '_0030_CDO_Mockup_031.png',
      '_0031_CDO_Mockup_032.png'
    ], 10, true);

    this.playerSprite.animations.add('jump_down', [
      '_0032_CDO_Mockup_033.png',
      '_0033_CDO_Mockup_034.png',
      '_0034_CDO_Mockup_035.png',
      '_0035_CDO_Mockup_036.png'
    ], 10, true);

    this.playerSprite.animations.add('idle_right', [
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0036_CDO_Mockup_037.png',
      '_0037_CDO_Mockup_038.png',
      '_0038_CDO_Mockup_039.png',
      '_0039_CDO_Mockup_040.png',
      '_0040_CDO_Mockup_041.png',
      '_0041_CDO_Mockup_042.png',
      '_0042_CDO_Mockup_043.png',
      '_0043_CDO_Mockup_044.png',
      '_0044_CDO_Mockup_045.png',
      '_0045_CDO_Mockup_046.png',
      '_0046_CDO_Mockup_047.png',
      '_0047_CDO_Mockup_048.png'
    ], 10, true);

    this.playerSprite.animations.add('walk_right', [
      '_0048_CDO_Mockup_049.png',
      '_0049_CDO_Mockup_050.png',
      '_0050_CDO_Mockup_051.png',
      '_0051_CDO_Mockup_052.png',
      '_0052_CDO_Mockup_053.png',
      '_0053_CDO_Mockup_054.png',
      '_0054_CDO_Mockup_055.png',
      '_0055_CDO_Mockup_056.png'
    ], 20, true);

    this.playerSprite.animations.add('pick_right', [
      '_0056_CDO_Mockup_057.png',
      '_0057_CDO_Mockup_058.png',
      '_0058_CDO_Mockup_059.png',
      '_0059_CDO_Mockup_060.png'
    ], 10, true);

    this.playerSprite.animations.add('hurt_right', [
      '_0060_CDO_Mockup_061.png',
      '_0061_CDO_Mockup_062.png',
      '_0062_CDO_Mockup_063.png',
      '_0063_CDO_Mockup_064.png'
    ], 10, true);

    this.playerSprite.animations.add('crouch_right', [
      '_0064_CDO_Mockup_065.png',
      '_0065_CDO_Mockup_066.png',
      '_0066_CDO_Mockup_067.png',
      '_0067_CDO_Mockup_068.png'
    ], 10, true);

    this.playerSprite.animations.add('jump_right', [
      '_0068_CDO_Mockup_069.png',
      '_0069_CDO_Mockup_070.png',
      '_0070_CDO_Mockup_071.png',
      '_0071_CDO_Mockup_072.png'
    ], 10, true);

    this.playerSprite.animations.add('idle_up', [
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0072_CDO_Mockup_073.png',
      '_0073_CDO_Mockup_074.png',
      '_0074_CDO_Mockup_075.png',
      '_0075_CDO_Mockup_076.png',
      '_0076_CDO_Mockup_077.png',
      '_0077_CDO_Mockup_078.png',
      '_0078_CDO_Mockup_079.png',
      '_0079_CDO_Mockup_080.png',
      '_0080_CDO_Mockup_081.png',
      '_0081_CDO_Mockup_082.png',
      '_0082_CDO_Mockup_083.png',
      '_0083_CDO_Mockup_084.png'
    ], 10, true);

    this.playerSprite.animations.add('walk_up', [
      '_0084_CDO_Mockup_085.png',
      '_0085_CDO_Mockup_086.png',
      '_0086_CDO_Mockup_087.png',
      '_0087_CDO_Mockup_088.png',
      '_0088_CDO_Mockup_089.png',
      '_0089_CDO_Mockup_090.png',
      '_0090_CDO_Mockup_091.png',
      '_0091_CDO_Mockup_092.png'
    ], 10, true);

    this.playerSprite.animations.add('pick_up', [
      '_0092_CDO_Mockup_093.png',
      '_0093_CDO_Mockup_094.png',
      '_0094_CDO_Mockup_095.png',
      '_0095_CDO_Mockup_096.png'
    ], 10, true);

    this.playerSprite.animations.add('hurt_up', [
      '_0096_CDO_Mockup_097.png',
      '_0097_CDO_Mockup_098.png',
      '_0098_CDO_Mockup_099.png',
      '_0099_CDO_Mockup_100.png'
    ], 10, true);

    this.playerSprite.animations.add('crouch_up', [
      '_0100_CDO_Mockup_101.png',
      '_0101_CDO_Mockup_102.png',
      '_0102_CDO_Mockup_103.png',
      '_0103_CDO_Mockup_104.png'
    ], 10, true);

    this.playerSprite.animations.add('jump_up', [
      '_0104_CDO_Mockup_105.png',
      '_0105_CDO_Mockup_106.png',
      '_0106_CDO_Mockup_107.png',
      '_0107_CDO_Mockup_108.png'
    ], 10, true);

    this.playerSprite.animations.add('idle_left', [
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0108_CDO_Mockup_109.png',
      '_0109_CDO_Mockup_110.png',
      '_0110_CDO_Mockup_111.png',
      '_0111_CDO_Mockup_112.png',
      '_0112_CDO_Mockup_113.png',
      '_0113_CDO_Mockup_114.png',
      '_0114_CDO_Mockup_115.png',
      '_0115_CDO_Mockup_116.png',
      '_0116_CDO_Mockup_117.png',
      '_0117_CDO_Mockup_118.png',
      '_0118_CDO_Mockup_119.png',
      '_0119_CDO_Mockup_120.png'
    ], 10, true);

    this.playerSprite.animations.add('walk_left', [
      '_0120_CDO_Mockup_121.png',
      '_0121_CDO_Mockup_122.png',
      '_0122_CDO_Mockup_123.png',
      '_0123_CDO_Mockup_124.png',
      '_0124_CDO_Mockup_125.png',
      '_0125_CDO_Mockup_126.png',
      '_0126_CDO_Mockup_127.png',
      '_0127_CDO_Mockup_128.png'
    ], 10, true);

    this.playerSprite.animations.add('pick_left', [
      '_0128_CDO_Mockup_129.png',
      '_0129_CDO_Mockup_130.png',
      '_0130_CDO_Mockup_131.png',
      '_0131_CDO_Mockup_132.png'
    ], 10, true);

    this.playerSprite.animations.add('hurt_left', [
      '_0132_CDO_Mockup_133.png',
      '_0133_CDO_Mockup_134.png',
      '_0134_CDO_Mockup_135.png',
      '_0135_CDO_Mockup_136.png'
    ], 10, true);

    this.playerSprite.animations.add('crouch_left', [
      '_0137_CDO_Mockup_138.png',
      '_0138_CDO_Mockup_139.png',
      '_0139_CDO_Mockup_140.png'
    ], 10, true);

    this.playerSprite.animations.add('jump_left', [
      '_0140_CDO_Mockup_141.png',
      '_0141_CDO_Mockup_142.png',
      '_0142_CDO_Mockup_143.png',
      '_0143_CDO_Mockup_144.png'
    ], 10, true);
  }
}