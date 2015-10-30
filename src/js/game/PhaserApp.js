import CommandQueue from "./CommandQueue/CommandQueue.js";
import BaseCommand from "./CommandQueue/BaseCommand.js";
import DestroyBlockCommand from "./CommandQueue/DestroyBlockCommand.js";
import MoveForwardCommand from "./CommandQueue/MoveForwardCommand.js";
import TurnCommand from "./CommandQueue/TurnCommand.js";
import WhileCommand from "./CommandQueue/WhileCommand.js";
import IfBlockAheadCommand from "./CommandQueue/IfBlockAheadCommand.js";

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
    this.game = new Phaser.Game({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      renderer: Phaser.CANVAS,
      parent: phaserAppConfig.containerId,
      state: {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this),
        render: this.render.bind(this)
      },
      preserveDrawingBuffer: true // enables saving .png screengrabs
    });

    this.specialLevelType = null;
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
    this.specialLevelType = levelConfig.specialLevelType;
  }

  reset() {
    this.levelModel.reset();
    this.levelView.reset(this.levelModel);
  }

  preload() {
    this.game.time.advancedTiming = this.DEBUG;
    this.game.stage.disableVisibilityChange = true;
    this.levelView.preload(this.levelModel.player.name);
  }

  create() {
    this.levelView.create(this.levelModel);
    this.game.time.slowMotion = 1.5;
    this.addCheatKeys();
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
              this.OnCompleteCallback(true, this.levelModel);
          }
          else {
              this.OnCompleteCallback(false, this.levelModel);
          }
          this.OnCompleteCallback = null;
      }
  }

  render() {
    if (this.DEBUG) {
      this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
    }
    this.levelView.render();
  }

  getScreenshot() {
    return this.game.canvas.toDataURL("image/png");
  }

  // command processors
  moveForward(commandQueueItem) {
    var player = this.levelModel.player;
    var allFoundCreepers;

    if (this.levelModel.canMoveForward()) {
      let wasOnBlock = player.isOnBlock;
      this.levelModel.moveForward();
      // TODO: check for Lava, Creeper, water => play approp animation & call commandQueueItem.failed()


      this.levelView.playMoveForwardAnimation(player.position, player.facing, wasOnBlock && wasOnBlock != player.isOnBlock, player.isOnBlock, this.levelModel.groundPlane[player.position[1] * 10 + player.position[0]].blockType ,() => {
        this.levelView.playIdleAnimation(player.position, player.facing, player.isOnBlock);

      //First arg is if we found a creeper
        allFoundCreepers = this.levelModel.isPlayerStandingNearCreeper();

        if (this.levelModel.isPlayerStandingInWater()) {
            this.levelView.playDrownFailureAnimation(player.position, player.facing, player.isOnBlock, () => {
              commandQueueItem.failed();
            } );
        } 
        else if(this.levelModel.isPlayerStandingInLava()) {
          this.levelView.playBurnInLavaAnimation(player.position, player.facing, player.isOnBlock, () => {
            commandQueueItem.failed();
          } );
        }
        else {
          this.delayBy(200, () => {
            commandQueueItem.succeeded();
          });
        }
      });
    } 
    else {
      if(this.levelModel.isForwardBlockOfType("creeper"))
      {
        this.levelView.playCreeperExplodeAnimation(player.position, player.facing, this.levelModel.getMoveForwardPosition(), player.isOnBlock, () => {
          commandQueueItem.failed();
        });
      }
      else {
        this.levelView.playBumpAnimation(player.position, player.facing, false);
        this.delayBy(800, () => {
          commandQueueItem.succeeded();
        });
      }
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

    this.delayBy(800, () => {
      commandQueueItem.succeeded();
    });

  }

  destroyBlock(commandQueueItem) {
    let player = this.levelModel.player;
    if (this.levelModel.canDestroyBlockForward()) {
      let block = this.levelModel.destroyBlockForward();

      if (block !== null) {
        let destroyPosition = block.position;
        let blockType = block.blockType;

        if (block.isDestroyable) {
          this.levelModel.computeShadingPlane();
          switch(blockType){
            case "logAcacia":
            case "treeAcacia":
              blockType = "planksAcacia";
            break;
            case "logBirch":
            case "treeBirch":
             blockType = "planksBirch";
            break;
            case "logJungle":
            case "treeJungle":
              blockType = "planksJungle";
            break;
            case "logOak":
            case "treeOak":
             blockType = "planksOak";
            break;
            case "logSpruce":
            case "treeSpruce":
              blockType = "planksSpruce";
            break;
          }

          this.levelView.playDestroyBlockAnimation(player.position, player.facing, destroyPosition, blockType, this.levelModel.shadingPlane, () => {
            commandQueueItem.succeeded();
          });
        } else if (block.isUsable) {
          switch (blockType) {
            case "sheep":
              // TODO: What to do with already sheered sheep?
              this.levelView.playShearSheepAnimation(player.position, player.facing, destroyPosition, blockType, () => {
                commandQueueItem.succeeded();
              });
              break;
          }
        }
      }
    } else {
      this.levelView.playPunchDestroyAirAnimation(player.position, player.facing, this.levelModel.getMoveForwardPosition(), () => {
        this.levelView.setSelectionIndicatorPosition(player.position[0], player.position[1]);
        this.levelView.playIdleAnimation(player.position, player.facing, player.isOnBlock);
        this.delayBy(600, () => {
          commandQueueItem.succeeded();
        });
      });
    }
  }

  canUseTints() {
    return true; // testing with new version of Phaser
    //var isIELessThan10 = this.game.device.ieVersion && this.game.device.ieVersion <= 10;
    //return !isIELessThan10;
  }

  checkTntAnimation() {
    return this.specialLevelType === 'freeplay';
  }

  checkMinecartLevelEndAnimation() {
    return this.specialLevelType === 'minecart';
  }

  checkHouseBuiltEndAnimation() {
    return this.specialLevelType === 'houseBuild';
  }

  checkRailBlock(blockType) {
    var checkRailBlock = this.levelModel.railMap[10 * this.levelModel.player.position[1] + this.levelModel.player.position[0]];
    if(checkRailBlock != "") {
      blockType = checkRailBlock;
    }
    else
    {
      blockType = "railsVertical";
    }
    return blockType;
  }

  placeBlock(commandQueueItem, blockType) {
    var blockTypeAtPosition = this.levelModel.actionPlane[10 * this.levelModel.player.position[1] + this.levelModel.player.position[0]].blockType;
    if (this.levelModel.canPlaceBlock()) {
      if(this.checkMinecartLevelEndAnimation() && blockType == "rail") {
        blockType = this.checkRailBlock(blockType);
      }

      if (this.levelModel.placeBlock(blockType)) {
        this.levelView.playPlaceBlockAnimation(this.levelModel.player.position, this.levelModel.player.facing, blockType, blockTypeAtPosition,  () => {
          this.levelModel.computeShadingPlane();
          this.levelModel.computeFowPlane();
          this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
          this.levelView.updateFowPlane(this.levelModel.fowPlane);
          this.delayBy(200, () => {
            this.levelView.playIdleAnimation(this.levelModel.player.position, this.levelModel.player.facing, false);
          });
          this.delayBy(400, () => {
            commandQueueItem.succeeded();
          });
        });
      } else {
        var signalBinding = this.levelView.playPlayerAnimation("jumpUp", this.levelModel.player.position, this.levelModel.player.facing, false).onLoop.add(() => {
          this.levelView.playIdleAnimation(this.levelModel.player.position, this.levelModel.player.facing, false);
          signalBinding.detach();
          this.delayBy(800, () => { commandQueueItem.succeeded(); });
        }, this);
      }
    } else {
      commandQueueItem.failed();
    }
  }

  delayBy(ms, completionHandler) {
    var timer = this.game.time.create(true);
    timer.add(ms, completionHandler, this);
    timer.start();
  }

  placeBlockForward(commandQueueItem, blockType) {
    var forwardPosition,
        placementPlane,
        soundEffect = ()=>{};

    if (!this.levelModel.canPlaceBlockForward()) {
      this.levelView.playPunchAirAnimation(this.levelModel.player.position, this.levelModel.player.facing, this.levelModel.player.position, () => {
        this.levelView.playIdleAnimation(this.levelModel.player.position, this.levelModel.player.facing, false);
        commandQueueItem.succeeded();
      });
      return;
    }

    forwardPosition = this.levelModel.getMoveForwardPosition();
    placementPlane = this.levelModel.getPlaneToPlaceOn(forwardPosition);
    if(this.levelModel.isBlockOfTypeOnPlane(forwardPosition, "lava", placementPlane)) {
      soundEffect = ()=>{this.levelView.audioPlayer.play("fizz");};
    }
    this.levelModel.placeBlockForward(blockType, placementPlane);
    this.levelView.playPlaceBlockInFrontAnimation(this.levelModel.player.position, this.levelModel.player.facing, this.levelModel.getMoveForwardPosition(), placementPlane, blockType, () => {
      this.levelModel.computeShadingPlane();
      this.levelModel.computeFowPlane();
      this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
      this.levelView.updateFowPlane(this.levelModel.fowPlane);
      soundEffect();
      this.delayBy(200, () => {
        this.levelView.playIdleAnimation(this.levelModel.player.position, this.levelModel.player.facing, false);
      });
      this.delayBy(400, () => {
        commandQueueItem.succeeded();
      });
    });
  }

  checkSolution(commandQueueItem) {
    let player = this.levelModel.player;
    this.levelView.setSelectionIndicatorPosition(player.position[0], player.position[1]);

    // check the final state to see if its solved
    if (this.levelModel.isSolved()) {
      if(this.checkHouseBuiltEndAnimation()) {
        var houseBottomRight = this.levelModel.getHouseBottomRight();
        var inFrontOfDoor = [houseBottomRight[0] - 1, houseBottomRight[1] + 2];
        var bedPosition = [houseBottomRight[0], houseBottomRight[1]];
        var doorPosition = [houseBottomRight[0] - 1, houseBottomRight[1] + 1];
        this.levelModel.moveTo(inFrontOfDoor);
        this.levelView.playSuccessHouseBuiltAnimation(
            player.position,
            player.facing,
            player.isOnBlock,
            this.levelModel.houseGroundToFloorBlocks(houseBottomRight),
            [bedPosition, doorPosition],
            () => {
              commandQueueItem.succeeded();
            }
            ,
            () => {
              this.levelModel.destroyBlock(bedPosition);
              this.levelModel.destroyBlock(doorPosition);
              this.levelModel.computeShadingPlane();
              this.levelModel.computeFowPlane();
              this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
              this.levelView.updateFowPlane(this.levelModel.fowPlane);
            }
        );
      }
      else if(this.checkMinecartLevelEndAnimation())
      {
        this.levelView.playMinecartAnimation(player.position, player.facing, player.isOnBlock,
            () => { commandQueueItem.succeeded(); }, this.levelModel.getMinecartTrack(), this.levelModel.getUnpoweredRails());
      }
      else if(this.checkTntAnimation()) {
        var tnt = this.levelModel.getTnt();
        this.levelView.playDestroyTntAnimation(player.position, player.facing, player.isOnBlock, this.levelModel.getTnt(), this.levelModel.shadingPlane,
        () => {
          for(var i in tnt) {
            this.levelModel.destroyBlock(tnt[i]);
          }
          this.levelModel.computeShadingPlane();
          this.levelModel.computeFowPlane();
          this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
          this.levelView.updateFowPlane(this.levelModel.fowPlane);
          this.delayBy(200, () => {
            this.levelView.playSuccessAnimation(player.position, player.facing, player.isOnBlock, () => {
              commandQueueItem.succeeded();
            });
          });
        });
      }
      else {
        this.levelView.playSuccessAnimation(player.position, player.facing, player.isOnBlock,
            () => { commandQueueItem.succeeded(); });
      }
    } else {
      this.levelView.playFailureAnimation(player.position, player.facing, player.isOnBlock, () => {
        commandQueueItem.failed();
      });
    }
  }

  isPathAhead(blockType)  {
      return this.levelModel.isForwardBlockOfType(blockType);
  }

}

window.PhaserApp = PhaserApp;

export default PhaserApp;
