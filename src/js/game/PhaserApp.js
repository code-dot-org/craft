import Phaser from 'Phaser';
import _ from 'lodash';
import DemoState from './states/app/DemoState';
import DebugState from './states/DebugState';
import StateManager from './states/managed/StateManager';
import WaitingState from './states/app/WaitingState.js';
import RunningState from './states/app/RunningState.js';
import ResettingState from './states/app/ResettingState.js';
import AppStates from './states/app/AppStates.js';

import CommandQueue from "./CommandQueue/CommandQueue.js";
import BaseCommand from "./CommandQueue/BaseCommand.js";
import DestroyBlockCommand from "./CommandQueue/DestroyBlockCommand.js";
import MoveForwardCommand from "./CommandQueue/MoveForwardCommand.js";
import TurnCommand from "./CommandQueue/TurnCommand.js";
import WhileCommand from "./CommandQueue/WhileCommand.js";


var GAME_WIDTH = 400;
var GAME_HEIGHT = 400;

/**
 * @typedef {Object} PhaserAppConfig
 * @property {String} containerId - ID of container for Phaser to mount app in
 * @property {String} assetRoot - location of folder containing assets (with trailing slash)
 */

/**
 * @typedef {String} TileID
 */

/**
 * @typedef {Object} LevelConfig
 * @property {Array.<Array.<TileID>>} groundMap - map of level tile IDs
 * @property {Array.<Array.<TileID>>} objectMap - map of level tile IDs
 */

/**
 * Initializes a new instance of a Phaser game, and includes game-specific logic
 * and rendering.
 *
 * @param {PhaserAppConfig} phaserAppConfig
 * @constructor
 */
class PhaserApp {
    constructor(phaserAppConfig) {
        var self = this;

    /**
     * @public {Object} codeOrgAPI - API with externally-callable methods for
     * starting an attempt, issuing commands, etc.
     */
    this.codeOrgAPI = {
        /**
        * Called before a list of user commands will be issued.
        */
        startCommandCollection() {
            console.log("Collecting commands.");
        },
        /**
        * Called when an attempt should be started, and the entire set of
        * command-queue API calls have been issued.
        *
        * @param {Function} onAttemptComplete - callback with a single parameter,
        * "success", i.e., true if attempt was successful (level completed),
        * false if unsuccessful (level not completed).
        */
        startAttempt(onAttemptComplete) {
            self.queue.begin();
        },
        resetAttempt() {
            self.queue.reset();
        },
        moveForward(highlightCallback) {
            self.queue.addCommand(new MoveForwardCommand(self, function() { console.log("highlight move forward command."); } ) );
        },
        turnRight(highlightCallback) {
            self.queue.addCommand(new TurnCommand(self, function() { console.log("highlight turn right command."); }, 'right' ) );
        },
        turnLeft(highlightCallback) {
            self.queue.addCommand(new TurnCommand(self, function() { console.log("highlight turn left command."); }, 'left' ) );
        },
        destroyBlock(highlightCallback) {
            self.queue.addCommand(new DestroyBlockCommand(self, function() { console.log("highlight destroy block command."); } ) );
        },
        placeBlock: function (highlightCallback, blockType) {
            self.queue.addCommand(new BaseCommand(self, function() { console.log("highlight placeBlock command."); } ) );
        },
        whilePathAhead: function (highlightCallback, blockType, callback) {
            self.queue.addCommand(new BaseCommand(self, function() { console.log("highlight repeat while path ahead command."); } ) );
        }
    };

         /**
         * Game asset file URL path
         * @property {String}
         */
        this.assetRoot = phaserAppConfig.assetRoot;

        /**
         * @property {LevelConfig}
         */
        this.levelConfig = null;

        this.playerSprite = null;
        this.actionOutline = null;

        this.playerPosition = [2, 4];
        this.playerFacing = 0;

        this.groundPlane = null;
        this.shadingPlane = null;
        this.actionPlane = null;
        this.fluffPlane = null;

        this.levelData = [
            // Ground layer
            ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
             "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
             "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
             "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
             "coarseDirt",  "coarseDirt",  "coarseDirt",  "grass", "grass", "grass", "grass", "grass", "grass", "grass",
             "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
             "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
             "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
             "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
             "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"],

            // Action layer
            ["", "", "", "", "", "", "", "", "grass", "grass",
             "", "", "", "", "", "", "", "", "", "grass",
             "", "", "", "", "", "", "", "", "", "",
             "", "", "", "", "", "", "", "", "", "",
             "", "", "", "", "", "", "", "", "", "",
             "", "", "", "", "", "", "", "", "", "",
             "", "", "", "", "", "", "", "", "", "",
             "", "", "", "", "", "", "", "", "", "",
             "", "", "", "", "", "", "", "", "", "",
             "", "", "", "", "", "", "", "", "", ""],

            // Fluff layer
            []
        ];

        /**
         * Main Phaser game instance.
         * @property {Phaser.Game}
         */
        this.game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO,
            phaserAppConfig.containerId,
            {
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this),
                render: this.render.bind(this)
            }
        );

        this.queue = new CommandQueue(this);

    }

    /**
     * @param {LevelConfig} levelConfig
     */
    loadLevel(levelConfig) {
        this.levelConfig = levelConfig;
    }

    preload() {
    this.game.time.advancedTiming = true;
    this.game.load.spritesheet('tiles', `${this.assetRoot}images/spritesheet_tiles.png`, 130, 130);

    this.game.load.image('actionOutline', `${this.assetRoot}images/actionOutline.png`);

    this.game.load.image('grass', `${this.assetRoot}images/Block_0000_Grass.png`);
    this.game.load.image('coarseDirt', `${this.assetRoot}images/Block_0002_coarse_dirt.png`);

    this.game.load.atlasJSONHash('player', `${this.assetRoot}images/Steve_Square.png`, `${this.assetRoot}images/Steve_Square.json`);
  }

  create() {
    this.preparePlanes(this.levelData);

    this.preparePlayerSprite();
    this.setPlayerPosition(this.playerPosition[0], this.playerPosition[1]);
    this.playerSprite.animations.play('idle_right');

    this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(() => {
        this.moveForward();
    });
  }

// command processors
  moveForward(commandQueueItem) {
      var tween;
      this.playerSprite.animations.play('walk_right');
      tween = this.game.add.tween(this.playerSprite).to({x: (-12 + 40 * (this.playerPosition[0] + 1))}, 1000, Phaser.Easing.Linear.None);
      tween.onComplete.add(() => {
          this.playerSprite.animations.play('idle_right');
          ++this.playerPosition[0];
          commandQueueItem.succeeded();
      });
      tween.start();
  }
    
  turn(commandQueueItem, direction) {
      var tween;

      this.rotateFacing(direction);

      this.playerSprite.animations.play(this.getIdleSprite());
      tween = this.game.add.tween(this.playerSprite).to({value: 100}, 1000, Phaser.Easing.Linear.None);
      tween.onComplete.add(() => {
          this.playerSprite.animations.play(this.getIdleSprite());
          commandQueueItem.succeeded();
      });
      tween.start();
  }
    
  destroyBlock(commandQueueItem) {
      var tween;
      
      var spriteName = 'pick_'+ this.getFacing(); 
      this.playerSprite.animations.play(spriteName);
      tween = this.game.add.tween(this.playerSprite).to({value: 1000}, 1000, Phaser.Easing.Linear.None);
      tween.onComplete.add(() => {
          this.playerSprite.animations.play(this.getIdleSprite());
          commandQueueItem.succeeded();
      });
      tween.start();
  }
    
        
  placeBlock(commandQueueItem) {
      var tween;
      
      var spriteName = 'place_'+ this.getFacing(); 
      this.playerSprite.animations.play(spriteName);
      tween = this.game.add.tween(this.playerSprite).to({value: 100}, 1000, Phaser.Easing.Linear.None);
      tween.onComplete.add(() => {
          this.playerSprite.animations.play(this.getIdleSprite());
          commandQueueItem.succeeded();
      });
      tween.start();
  }

  update() {
        this.queue.tick();
  }

  rotateFacing(direction) {

      if (direction === 'left') {
          this.playerFacing -=90;
      } else {
          this.playerFacing +=90;
      }
      if (this.playerFacing <0) {
          this.playerFacing += 360;
      }
  }

  getFacing(){
      var facing = 'right';
      switch (this.playerFacing) {
          case 0:
              facing = 'right'; 
              break;
          case 90:
              facing = 'down'; 
              break;
          case 180:
              facing = 'left'; 
              break;
          case 270:
              facing = 'up'; 
              break;
          default:
              break;
      }
      return facing;
  }

  getIdleSprite(){
      return 'idle_'+ this.getFacing(); 
  }

  render() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
  }

  setPlayerPosition(x, y) {
      this.playerSprite.x = -35 + 40 * x;
      this.playerSprite.y = -50 + 40 * y;
  }

  preparePlanes(levelData) {
      var tileName;

    this.groundPlane = this.game.add.group();
    this.shadingPlane = this.game.add.group();
    this.actionPlane = this.game.add.group();
    this.fluffPlane = this.game.add.group();

    for (var y=0; y<10; ++y) {
        for (var x=0; x<10; ++x) {
            this.groundPlane.create(-12 + 40 * x, -2 + 40 * y, levelData[0][(y * 10) + x]);
        }
    }

    for (var y=0; y<10; ++y) {
        for (var x=0; x<10; ++x) {
            if (levelData[1][(y * 10) + x] !== "") {
                this.actionPlane.create(-12 + 40 * x, -22 + 40 * y, (levelData[1])[(y * 10) + x]);
            }
        }
    }
  }

  preparePlayerSprite() {
      this.actionOutline = this.shadingPlane.create(0, 0, 'actionOutline');
      this.playerSprite = this.actionPlane.create(0, 0, 'player', '_0000_CDO_Mockup_001.png');
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
          '_0011_CDO_Mockup_012.png'], 10, true);

      this.playerSprite.animations.add('walk_down', [
          '_0012_CDO_Mockup_013.png',
          '_0013_CDO_Mockup_014.png',
          '_0014_CDO_Mockup_015.png',
          '_0015_CDO_Mockup_016.png',
          '_0016_CDO_Mockup_017.png',
          '_0017_CDO_Mockup_018.png',
          '_0018_CDO_Mockup_019.png',
          '_0019_CDO_Mockup_020.png'], 10, true);

      this.playerSprite.animations.add('pick_down', [
          '_0020_CDO_Mockup_021.png',
          '_0021_CDO_Mockup_022.png',
          '_0022_CDO_Mockup_023.png',
          '_0023_CDO_Mockup_024.png'], 10, true);

      this.playerSprite.animations.add('hurt_down', [
          '_0024_CDO_Mockup_025.png',
          '_0025_CDO_Mockup_026.png',
          '_0026_CDO_Mockup_027.png',
          '_0027_CDO_Mockup_028.png'], 10, true);

      this.playerSprite.animations.add('crouch_down', [
          '_0028_CDO_Mockup_029.png',
          '_0029_CDO_Mockup_030.png',
          '_0030_CDO_Mockup_031.png',
          '_0031_CDO_Mockup_032.png'], 10, true);

      this.playerSprite.animations.add('jump_down', [
          '_0032_CDO_Mockup_033.png',
          '_0033_CDO_Mockup_034.png',
          '_0034_CDO_Mockup_035.png',
          '_0035_CDO_Mockup_036.png'], 10, true);

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
          '_0047_CDO_Mockup_048.png'], 10, true);

      this.playerSprite.animations.add('walk_right', [
          '_0048_CDO_Mockup_049.png',
          '_0049_CDO_Mockup_050.png',
          '_0050_CDO_Mockup_051.png',
          '_0051_CDO_Mockup_052.png',
          '_0052_CDO_Mockup_053.png',
          '_0053_CDO_Mockup_054.png',
          '_0054_CDO_Mockup_055.png',
          '_0055_CDO_Mockup_056.png'], 10, true);

      this.playerSprite.animations.add('pick_right', [
          '_0056_CDO_Mockup_057.png',
          '_0057_CDO_Mockup_058.png',
          '_0058_CDO_Mockup_059.png',
          '_0059_CDO_Mockup_060.png'], 10, true);

      this.playerSprite.animations.add('hurt_right', [
          '_0060_CDO_Mockup_061.png',
          '_0061_CDO_Mockup_062.png',
          '_0062_CDO_Mockup_063.png',
          '_0063_CDO_Mockup_064.png'], 10, true);

      this.playerSprite.animations.add('crouch_right', [
          '_0064_CDO_Mockup_065.png',
          '_0065_CDO_Mockup_066.png',
          '_0066_CDO_Mockup_067.png',
          '_0067_CDO_Mockup_068.png'], 10, true);

      this.playerSprite.animations.add('jump_right', [
          '_0068_CDO_Mockup_069.png',
          '_0069_CDO_Mockup_070.png',
          '_0070_CDO_Mockup_071.png',
          '_0071_CDO_Mockup_072.png'], 10, true);

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
          '_0083_CDO_Mockup_084.png'], 10, true);

      this.playerSprite.animations.add('walk_up', [
          '_0084_CDO_Mockup_085.png',
          '_0085_CDO_Mockup_086.png',
          '_0086_CDO_Mockup_087.png',
          '_0087_CDO_Mockup_088.png',
          '_0088_CDO_Mockup_089.png',
          '_0089_CDO_Mockup_090.png',
          '_0090_CDO_Mockup_091.png',
          '_0091_CDO_Mockup_092.png'], 10, true);

      this.playerSprite.animations.add('pick_up', [
          '_0092_CDO_Mockup_093.png',
          '_0093_CDO_Mockup_094.png',
          '_0094_CDO_Mockup_095.png',
          '_0095_CDO_Mockup_096.png'], 10, true);

      this.playerSprite.animations.add('hurt_up', [
          '_0096_CDO_Mockup_097.png',
          '_0097_CDO_Mockup_098.png',
          '_0098_CDO_Mockup_099.png',
          '_0099_CDO_Mockup_100.png'], 10, true);

      this.playerSprite.animations.add('crouch_up', [
          '_0100_CDO_Mockup_101.png',
          '_0101_CDO_Mockup_102.png',
          '_0102_CDO_Mockup_103.png',
          '_0103_CDO_Mockup_104.png'], 10, true);

      this.playerSprite.animations.add('jump_up', [
          '_0104_CDO_Mockup_105.png',
          '_0105_CDO_Mockup_106.png',
          '_0106_CDO_Mockup_107.png',
          '_0107_CDO_Mockup_108.png'], 10, true);

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
          '_0119_CDO_Mockup_120.png'], 10, true);

      this.playerSprite.animations.add('walk_left', [
          '_0120_CDO_Mockup_121.png',
          '_0121_CDO_Mockup_122.png',
          '_0122_CDO_Mockup_123.png',
          '_0123_CDO_Mockup_124.png',
          '_0124_CDO_Mockup_125.png',
          '_0125_CDO_Mockup_126.png',
          '_0126_CDO_Mockup_127.png',
          '_0127_CDO_Mockup_128.png'], 10, true);

      this.playerSprite.animations.add('pick_left', [
          '_0128_CDO_Mockup_129.png',
          '_0129_CDO_Mockup_130.png',
          '_0130_CDO_Mockup_131.png',
          '_0131_CDO_Mockup_132.png'], 10, true);

      this.playerSprite.animations.add('hurt_left', [
          '_0132_CDO_Mockup_133.png',
          '_0133_CDO_Mockup_134.png',
          '_0134_CDO_Mockup_135.png',
          '_0135_CDO_Mockup_136.png'], 10, true);

      this.playerSprite.animations.add('crouch_left', [
          '_0137_CDO_Mockup_138.png',
          '_0138_CDO_Mockup_139.png',
          '_0139_CDO_Mockup_140.png'], 10, true);

      this.playerSprite.animations.add('jump_left', [
          '_0140_CDO_Mockup_141.png',
          '_0141_CDO_Mockup_142.png',
          '_0142_CDO_Mockup_143.png',
          '_0143_CDO_Mockup_144.png'], 10, true);
  }

  computeShadingPlane() {
      this.shadingPlane.removeAll();

      // TODO: For each object
  }
}

window.PhaserApp = PhaserApp;

export default PhaserApp;
