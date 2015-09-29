import CommandQueue from "./CommandQueue/CommandQueue.js";
import BaseCommand from "./CommandQueue/BaseCommand.js";
import DestroyBlockCommand from "./CommandQueue/DestroyBlockCommand.js";
import MoveForwardCommand from "./CommandQueue/MoveForwardCommand.js";
import TurnCommand from "./CommandQueue/TurnCommand.js";
import WhileCommand from "./CommandQueue/WhileCommand.js";

import LevelModel from "./LevelMVC/LevelModel.js"
import LevelView from "./LevelMVC/LevelView.js"

import DemoLevels from "./levels.js"

import * as CodeOrgAPI from "./API/CodeOrgAPI.js"

var GAME_WIDTH = 400;
var GAME_HEIGHT = 400;

/**
 * Initializes a new instance of a mini-game visualization
 */
class PhaserApp {
  /**
   * @param {Object} phaserAppConfig
   * @param {String} phaserAppConfig.containerId DOM ID to mount this app
   * @param {Phaser} phaserAppConfig.Phaser Phaser package
   * @constructor
   */
  constructor(phaserAppConfig) {
    this.DEBUG = phaserAppConfig.debug;

    // Phaser pre-initialization config
    window.PhaserGlobal = {
      disableAudio: true,
      hideBanner: !this.DEBUG
    };

    /**
     * @public {Object} codeOrgAPI - API with externally-callable methods for
     * starting an attempt, issuing commands, etc.
     */
    this.codeOrgAPI = CodeOrgAPI.get(this);

    /**
     * @property {LevelConfig}
     */
    this.levelConfig = null;

    var Phaser = phaserAppConfig.Phaser;

    /**
     * Main Phaser game instance.
     * @property {Phaser.Game}
     */
    this.game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO,
      phaserAppConfig.containerId, {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this),
        render: this.render.bind(this)
      }
    );

    this.queue = new CommandQueue(this);
    this.OnCompleteCallback = null;

    this.assetRoot = phaserAppConfig.assetRoot;

    this.audioPlayer = phaserAppConfig.audioPlayer;
  }

  /**
   * @param {Object} levelConfig
   */
  loadLevel(levelConfig) {
    this.levelData = Object.freeze(levelConfig);

    this.levelModel = new LevelModel(this.levelData);
    this.levelView = new LevelView(this);
  }

  resetBoard() {
    this.levelModel.reset();
    this.levelView.reset();
  }

  reset() {
    this.levelModel.reset();
    this.levelView.reset(this.levelModel);
  }

  preload() {
    this.game.time.advancedTiming = true;
    this.levelView.preload();
  }

  create() {
    this.levelView.create();
    this.addCheatKeys();

    this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
  }

  update() {
      this.queue.tick();
      this.levelView.update();

      if (this.queue.isFinished()) {
          this.handleEndState();
      } 
  }

  addCheatKeys() {
    this.game.input.keyboard.addKey(Phaser.Keyboard.TILDE).onUp.add(() => {
      this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onUp.add(() => {
        var dummyFunc = function () {
          console.log("highlight move forward command.");
        };
        this.codeOrgAPI.moveForward(dummyFunc);
      });

      this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onUp.add(() => {
        var dummyFunc = function () {
          console.log("highlight turn right command.");
        };
        this.codeOrgAPI.turnRight(dummyFunc);
      });

      this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onUp.add(() => {
        var dummyFunc = function () {
          console.log("highlight turn left command.");
        };
        this.codeOrgAPI.turnLeft(dummyFunc);
      });

      this.game.input.keyboard.addKey(Phaser.Keyboard.P).onUp.add(() => {
        var dummyFunc = function () {
          console.log("highlight placeBlock command.");
        };
        this.codeOrgAPI.placeBlock(dummyFunc, "logOak");
      });

      this.game.input.keyboard.addKey(Phaser.Keyboard.D).onUp.add(() => {
        var dummyFunc = function () {
          console.log("highlight destroy block command.");
        };
        this.codeOrgAPI.destroyBlock(dummyFunc);
      });

      this.game.input.keyboard.addKey(Phaser.Keyboard.E).onUp.add(() => {
        var dummyFunc = function (result) {
          console.log(`Execute command list done: ${result} `);
        };
        this.codeOrgAPI.startAttempt(dummyFunc);
      });

      this.game.input.keyboard.addKey(Phaser.Keyboard.W).onUp.add(() => {
        var dummyFunc = function () {
          console.log("Execute While command list");
        };
        var blockType = "empty";
        var codeBlock = function () {
          this.PhaserApp.codeOrgAPI.moveForward(function () {
            console.log("Execute While command move block");
          });
          this.PhaserApp.codeOrgAPI.moveForward(function () {
            console.log("Execute While command move block2");
          });
          this.PhaserApp.codeOrgAPI.turnLeft(function () {
            console.log("Execute While command turn");
          });
        };
        this.codeOrgAPI.whilePathAhead(dummyFunc, blockType, codeBlock);
      });
    });
  }

  handleEndState() {
      // TODO: go into success/failure animation? (or are we called by CodeOrg for that?)

      // report back to the code.org side the pass/fail result 
      //     then clear the callback so we dont keep calling it
      if (this.OnCompleteCallback != null) {
          if (this.queue.isSucceeded()) {
              this.OnCompleteCallback(true);
          }
          else {
              this.OnCompleteCallback(false);
          }
          this.OnCompleteCallback = null;
      }
  }

  render() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
    this.levelView.render();
  }

  // command processors
  moveForward(commandQueueItem) {
    if (this.levelModel.canMoveForward()) {
        let wasOnBlock = this.levelModel.player.isOnBlock;
        this.levelModel.moveForward();
        // TODO: check for Lava, Creeper, water => play approp animation & call commandQueueItem.failed()

        if (this.levelModel.isPlayerStandingInWater()) {
            //this.levelView.playDrownFailureAnimation(this.levelModel.player.position, this.levelModel.player.facing, this.levelModel.player.isOnBlock, () => {
                commandQueueItem.failed();
            //} );
        } 
        else if(this.levelModel.isPlayerStandingInLava()) {
            //this.levelView.playBurnInLavaAnimation(this.levelModel.player.position, this.levelModel.player.facing, this.levelModel.player.isOnBlock, () => {
                commandQueueItem.failed();
            //} );
        } 
        else if(this.levelModel.isPlayerStandingNearCreeper()) {
            //this.levelView.playCreeperExplodeAnimation(this.levelModel.player.position, this.levelModel.player.facing, this.levelModel.player.isOnBlock, () => {
                commandQueueItem.failed();
            //} );
        } 
        else  {
            this.levelView.playMoveForwardAnimation(this.levelModel.player.position, this.levelModel.player.facing, wasOnBlock && wasOnBlock != this.levelModel.player.isOnBlock, () => {
                commandQueueItem.succeeded();
            });
        }
        
    } else {
        // check if moveFwd failed due to walking off the board
        let blockForwardPosition =  this.levelModel.getMoveForwardPosition();

        if (blockForwardPosition[0] >= 0 && blockForwardPosition[0] < 10 && blockForwardPosition[1] >= 0 && blockForwardPosition[1] < 10) {
            commandQueueItem.succeeded();
        }
        // stop the walking animation and fail
        this.levelView.playIdleAnimation(this.levelModel.player.position, this.levelModel.player.facing );
        commandQueueItem.failed();
    }
  }

  turn(commandQueueItem, direction) {
    if (direction == -1) {
      this.levelModel.turnLeft();
    }

    if (direction == 1) {
      this.levelModel.turnRight();
    }

    this.levelView.updatePlayerDirection(this.levelModel.player.position, this.levelModel.player.facing);
    commandQueueItem.succeeded();
  }

  destroyBlock(commandQueueItem) {
    if (this.levelModel.canDestroyBlockForward()) {
      let destroyPosition = this.levelModel.getMoveForwardPosition();
      let block = this.levelModel.actionPlane[(destroyPosition[1] * 10) + destroyPosition[0]];
      let blockType = block.blockType;

      if (block.isDestroyable) {
        this.levelModel.destroyBlockForward();
        this.levelView.playDestroyBlockAnimation(this.levelModel.player.position, this.levelModel.player.facing, destroyPosition, blockType, () => {
          this.levelModel.computeShadingPlane();
          this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
          commandQueueItem.succeeded();
        });
      } else if (block.isUsable) {
        switch (blockType) {
          case "sheep":
            // TODO: What to do with already sheered sheep?
            this.levelView.playShearSheepAnimation(this.levelModel.player.position, this.levelModel.player.facing, destroyPosition, blockType, () => {
              commandQueueItem.succeeded();
            });
            break;
        }
      }
    } else {
    // TODO: should we fail when there's no pblock to destroy??
        commandQueueItem.succeeded();
    }
  }

  placeBlock(commandQueueItem, blockType) {
    if (this.levelModel.canPlaceBlock()) {
      this.levelModel.placeBlock(blockType);
      this.levelView.playPlaceBlockAnimation(this.levelModel.player.position, this.levelModel.player.facing, blockType, () => {
        this.levelModel.computeShadingPlane();
        this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
        commandQueueItem.succeeded();
      });
    } else {
      //commandQueueItem.failed();
    }
  }

  checkSolution(commandQueueItem) {
      // switch to idle animation while we verify
      this.levelView.playIdleAnimation(this.levelModel.player.position, this.levelModel.player.facing );
 
      // check the final state to see if its solved
      if (this.levelModel.isSolved()) {
          commandQueueItem.succeeded();
      } else {
          commandQueueItem.failed();
      }
  }

  isPathAhead(blockType)  {
      return this.levelModel.isForwardBlockOfType(blockType);
  }

}

window.PhaserApp = PhaserApp;

export default PhaserApp;
