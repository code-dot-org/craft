import CommandQueue from "./CommandQueue/CommandQueue.js";
import BaseCommand from "./CommandQueue/BaseCommand.js";
import DestroyBlockCommand from "./CommandQueue/DestroyBlockCommand.js";
import CallbackCommand from "./CommandQueue/CallbackCommand.js";
import MoveForwardCommand from "./CommandQueue/MoveForwardCommand.js";
import TurnCommand from "./CommandQueue/TurnCommand.js";
import WhileCommand from "./CommandQueue/WhileCommand.js";
import ForeverCommand from "./CommandQueue/ForeverCommand.js";
import IfBlockAheadCommand from "./CommandQueue/IfBlockAheadCommand.js";

import LevelModel from "./LevelMVC/LevelModel.js";
import LevelView from "./LevelMVC/LevelView.js";
import AssetLoader from "./LevelMVC/AssetLoader.js";

import FacingDirection from "./LevelMVC/FacingDirection.js";

import AStarPathFinding from "./LevelMVC/AStarPathFinding.js";

import * as CodeOrgAPI from "./API/CodeOrgAPI.js";

var GAME_WIDTH = 400;
var GAME_HEIGHT = 400;

/**
 * Initializes a new instance of a mini-game visualization
 */
class GameController {
  /**
   * @param {Object} gameControllerConfig
   * @param {String} gameControllerConfig.containerId DOM ID to mount this app
   * @param {Phaser} gameControllerConfig.Phaser Phaser package
   * @constructor
   */
  constructor(gameControllerConfig) {
    this.DEBUG = gameControllerConfig.debug;

    // Phaser pre-initialization config
    window.PhaserGlobal = {
      disableAudio: true,
      disableWebAudio: true,
      hideBanner: !this.DEBUG
    };

    /**
     * @public {Object} codeOrgAPI - API with externally-callable methods for
     * starting an attempt, issuing commands, etc.
     */
    this.codeOrgAPI = CodeOrgAPI.get(this);

    var Phaser = gameControllerConfig.Phaser;

    /**
     * Main Phaser game instance.
     * @property {Phaser.Game}
     */
    this.game = new Phaser.Game({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      renderer: Phaser.CANVAS,
      parent: gameControllerConfig.containerId,
      state: 'earlyLoad',
      // TODO(bjordan): remove now that using canvas?
      preserveDrawingBuffer: true // enables saving .png screengrabs
    });

    this.specialLevelType = null;
    this.queue = new CommandQueue(this);
    this.OnCompleteCallback = null;

    this.assetRoot = gameControllerConfig.assetRoot;

    this.audioPlayer = gameControllerConfig.audioPlayer;
    this.afterAssetsLoaded = gameControllerConfig.afterAssetsLoaded;
    this.assetLoader = new AssetLoader(this);
    this.earlyLoadAssetPacks =
        gameControllerConfig.earlyLoadAssetPacks || [];
    this.earlyLoadNiceToHaveAssetPacks =
        gameControllerConfig.earlyLoadNiceToHaveAssetPacks || [];

    this.resettableTimers = [];

    this.events = [];

    // Phaser "slow motion" modifier we originally tuned animations using
    this.assumedSlowMotion = 1.5;
    this.initialSlowMotion = gameControllerConfig.customSlowMotion || this.assumedSlowMotion;

    this.playerDelayFactor = 1.0;

    this.game.state.add('earlyLoad', {
      preload: () => {
        // don't let state change stomp essential asset downloads in progress
        this.game.load.resetLocked = true;
        this.assetLoader.loadPacks(this.earlyLoadAssetPacks);
      },
      create: () => {
        // optionally load some more assets if we complete early load before level load
        this.assetLoader.loadPacks(this.earlyLoadNiceToHaveAssetPacks);
        this.game.load.start();
      }
    });

    this.game.state.add('levelRunner', {
      preload: this.preload.bind(this),
      create: this.create.bind(this),
      update: this.update.bind(this),
      render: this.render.bind(this)
    });
  }

  getRandomBool() {
    return this.levelModel.getRandomBool();
  }

  /**
   * @param {Object} levelConfig
   */
  loadLevel(levelConfig) {
    //levelConfig.isEventLevel = true; // TODO(bjordan): DO NOT COMMIT
    this.levelData = Object.freeze(levelConfig);

    this.levelModel = new LevelModel(this.levelData);
    this.levelView = new LevelView(this);
    this.specialLevelType = levelConfig.specialLevelType;

    this.game.state.start('levelRunner');
  }

  reset() {
    this.levelModel.reset();
    this.levelView.reset(this.levelModel);
    this.resettableTimers.forEach((timer) => {
      timer.stop(true);
    });
    this.resettableTimers.length = 0;
    this.events.length = 0;
  }

  preload() {
    this.game.load.resetLocked = true;
    this.game.time.advancedTiming = this.DEBUG;
    this.game.stage.disableVisibilityChange = true;
    this.assetLoader.loadPacks(this.levelData.assetPacks.beforeLoad);
  }

  create() {
    this.levelView.create(this.levelModel);
    this.game.time.slowMotion = this.initialSlowMotion;
    this.addCheatKeys();
    this.assetLoader.loadPacks(this.levelData.assetPacks.afterLoad);
    this.game.load.onLoadComplete.addOnce(() => {
      if (this.afterAssetsLoaded) {
        this.afterAssetsLoaded();
      }
    });

    this.game.load.start();
  }

  followingPlayer() {
    return !!this.levelData.gridDimensions;
  }

  update() {
    this.queue.tick();
    this.levelView.update();

    if (this.queue.isFinished()) {
      this.handleEndState();
    }
  }

  addCheatKeys() {
    if (!this.levelData.isEventLevel) {
      return;
    }
    this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onUp.add(() => {
      var dummyFunc = function () {
        console.log("highlight move forward command.");
      };
      //if (this.queue.currentCommand instanceof CallbackCommand) { return; }
      this.codeOrgAPI.moveDirectionNow(dummyFunc, FacingDirection.Up);
      this.queue.begin();
    });

    this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onUp.add(() => {
      var dummyFunc = function () {
        console.log("highlight turn right command.");
      };
      //if (this.queue.currentCommand instanceof CallbackCommand) { return; }
      this.codeOrgAPI.moveDirectionNow(dummyFunc, FacingDirection.Right);
      this.queue.begin();
    });

    this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onUp.add(() => {
      var dummyFunc = function () {
        console.log("highlight turn left command.");
      };
      //if (this.queue.currentCommand instanceof CallbackCommand) { return; }
      this.codeOrgAPI.moveDirectionNow(dummyFunc, FacingDirection.Left);
      this.queue.begin();
    });

    this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onUp.add(() => {
      var dummyFunc = function () {
        console.log("highlight turn left command.");
      };
      //if (this.queue.currentCommand instanceof CallbackCommand) { return; }
      this.codeOrgAPI.moveDirectionNow(dummyFunc, FacingDirection.Down);
      this.queue.begin();
    });

    this.game.input.keyboard.addKey(Phaser.Keyboard.P).onUp.add(() => {
      var dummyFunc = function () {
        console.log("highlight placeBlock command.");
      };
      this.codeOrgAPI.placeBlock(dummyFunc, "logOak");
      this.codeOrgAPI.startAttempt(dummyFunc);
    });

    this.game.input.keyboard.addKey(Phaser.Keyboard.D).onUp.add(() => {
      var dummyFunc = function () {
        console.log("highlight destroy block command.");
      };
      this.codeOrgAPI.destroyBlock(dummyFunc);
      this.codeOrgAPI.startAttempt(dummyFunc);
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
        this.GameController.codeOrgAPI.moveForward(function () {
          console.log("Execute While command move block");
        });
        this.GameController.codeOrgAPI.moveForward(function () {
          console.log("Execute While command move block2");
        });
        this.GameController.codeOrgAPI.turnLeft(function () {
          console.log("Execute While command turn");
        });
      };
      this.codeOrgAPI.whilePathAhead(dummyFunc, blockType, codeBlock);
    });
  }

  handleEndState() {
    // report back to the code.org side the pass/fail result
    //     then clear the callback so we dont keep calling it
    if (this.OnCompleteCallback) {
      if (this.queue.isSucceeded()) {
        this.OnCompleteCallback(true, this.levelModel);
      } else {
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

  scaleFromOriginal() {
    var [newWidth, newHeight] = this.levelData.gridDimensions || [10, 10];
    var [originalWidth, originalHeight] = [10, 10];
    return [newWidth / originalWidth, newHeight / originalHeight];
  }

  getScreenshot() {
    return this.game.canvas.toDataURL("image/png");
  }

  startAttempt() {
    if (this.levelData.isEventLevel) {
      const timeoutCallback = () => {
        this.levelModel.actionPlane.forEach((block) => {
          if (block.isEmpty) {
            return;
          }

          this.events.forEach(e => {
            e({ eventType: 'everySecond', blockReference: block, blockType: block.blockType });
          });
          this.queue.begin();
        });
        this.delayBy(1000, timeoutCallback);
      };
      this.delayBy(1000, timeoutCallback);
    }
  }

  // command processors
  moveEntityNorth(commandQueueItem, entity) {
    const {x, y} = this.levelModel.entityToPosition(entity);

    this.moveEntityTo(entity, [x, y - 1]);
    commandQueueItem.succeeded();
  }

  moveEntitySouth(commandQueueItem, entity) {
    const {x, y} = this.levelModel.entityToPosition(entity);

    this.moveEntityTo(entity, [x, y + 1]);
    commandQueueItem.succeeded();
  }

  moveEntityEast(commandQueueItem, entity) {
    const {x, y} = this.levelModel.entityToPosition(entity);

    this.moveEntityTo(entity, [x + 1, y]);
    commandQueueItem.succeeded();
  }

  moveEntityWest(commandQueueItem, entity) {
    const {x, y} = this.levelModel.entityToPosition(entity);

    this.moveEntityTo(entity, [x - 1, y]);
    commandQueueItem.succeeded();
  }

  setEntityNorth(commandQueueItem, entity, blockType) {
    const {x, y} = this.levelModel.entityToPosition(entity);

    this.setBlockAt(x, y - 1, blockType);
    commandQueueItem.succeeded();
  }

  setEntitySouth(commandQueueItem, entity, blockType) {
    const {x, y} = this.levelModel.entityToPosition(entity);

    this.setBlockAt(x, y + 1, blockType);
    commandQueueItem.succeeded();
  }

  setEntityEast(commandQueueItem, entity, blockType) {
    const {x, y} = this.levelModel.entityToPosition(entity);

    this.setBlockAt(x + 1, y, blockType);
    commandQueueItem.succeeded();
  }

  setEntityWest(commandQueueItem, entity, blockType) {
    const {x, y} = this.levelModel.entityToPosition(entity);

    this.setBlockAt(x - 1, y, blockType);
    commandQueueItem.succeeded();
  }

  setEntityAhead(commandQueueItem, entity, blockType) {
    const {x, y} = this.levelModel.entityToPosition(entity);
    const [aheadX, aheadY] = this.levelModel.getEntityMoveForwardPosition([x, y], entity.facing);
    this.setBlockAt(aheadX, aheadY, blockType);
    commandQueueItem.succeeded();
  }

  destroyEntityAhead(commandQueueItem, entity) {
    const {x, y} = this.levelModel.entityToPosition(entity);
    this.destroyBlockWithoutPlayerInteraction(this.levelModel.getEntityMoveForwardPosition([x, y], entity.facing));
    commandQueueItem.succeeded();
  }

  destroyEntityBehind(commandQueueItem, entity) {
    const {x, y} = this.levelModel.entityToPosition(entity);
    this.destroyBlockWithoutPlayerInteraction(this.levelModel.getEntityMoveBackwardPosition([x, y], entity.facing));
    commandQueueItem.succeeded();
  }

  setEntityBehind(commandQueueItem, entity, blockType) {
    const {x, y} = this.levelModel.entityToPosition(entity);
    const [behindX, behindY] = this.levelModel.getEntityMoveBackwardPosition([x, y], entity.facing);
    this.setBlockAt(behindX, behindY, blockType);
    commandQueueItem.succeeded();
  }

  setEntityLeft(commandQueueItem, entity, blockType) {
    const {x, y} = this.levelModel.entityToPosition(entity);
    const [aheadX, aheadY] = this.levelModel.getEntityLeftPosition([x, y], entity.facing);
    this.setBlockAt(aheadX, aheadY, blockType);
    commandQueueItem.succeeded();
  }

  setEntityRight(commandQueueItem, entity, blockType) {
    const {x, y} = this.levelModel.entityToPosition(entity);
    const [aheadX, aheadY] = this.levelModel.getEntityRightPosition([x, y], entity.facing);
    this.setBlockAt(aheadX, aheadY, blockType);
    commandQueueItem.succeeded();
  }

  moveEntityForward(commandQueueItem, entity) {
    const {x, y} = this.levelModel.entityToPosition(entity);

    this.moveEntityTo(entity, this.levelModel.getEntityMoveForwardPosition([x, y], entity.facing));
    commandQueueItem.succeeded();
  }

  waitFor(commandQueueItem, ms) {
    setTimeout(() => commandQueueItem.succeeded(), ms);
  }

  // direction is 1 ==> move toward, or 0 ==> move away from
  moveEntityToPlayer(commandQueueItem, entity, isToward) {
    const aStar = new AStarPathFinding(this.levelModel);
    const entityPosition = this.levelModel.entityToPosition(entity);

    const path = aStar.findPath([entityPosition.x, entityPosition.y], this.levelModel.player.position);

    // if there is a valid path to the player, turn to face the block in the first step.
    if (path.length > 0) {
      const firstNode = path[0];
      let targetPosition = isToward ? [firstNode.x, firstNode.y] : this.levelModel.getEntityRunAwayPosition(entity, this.levelModel.getFaceDirectionTo([entityPosition.x, entityPosition.y], [firstNode.x, firstNode.y]));

      // if the intent is to move away from the player, there may not be a valid position to move to.
      if (targetPosition) {
        this.levelModel.turnToDirection(entity, this.levelModel.getFaceDirectionTo([entityPosition.x, entityPosition.y], targetPosition));
        this.moveEntityTo(entity, targetPosition);
      }
    }
    commandQueueItem.succeeded();
  }

  moveEntityTo(entity, position) {
    const playerIndex = this.levelModel.coordinatesToIndex(this.levelModel.player.position);

    // Move only if the designated block is empty
    const targetIndex = this.levelModel.coordinatesToIndex(position);
    if (this.levelModel.inBounds(position[0], position[1]) &&
        this.levelModel.actionPlane[targetIndex].isEmpty &&
        playerIndex !== targetIndex) {
      const sourceIndex = this.levelModel.actionPlane.indexOf(entity);

      const sourcePos = this.levelModel.indexToXY(sourceIndex);
      const targetPos = this.levelModel.indexToXY(targetIndex);

      // Move the block in the model and view.
      this.levelModel.moveBlock(sourceIndex, targetIndex);
      this.levelView.moveBlockSprite(sourceIndex, position, entity.isEntity, this.levelModel.getFaceDirectionTo([sourcePos.x, sourcePos.y], [targetPos.x, targetPos.y]), () => {});

      // Update renderer
      this.levelModel.computeShadingPlane();
      this.levelModel.computeFowPlane();
      this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
      this.levelView.updateFowPlane(this.levelModel.fowPlane);
    }
  }

  moveForward(commandQueueItem) {
    var player = this.levelModel.player,
        allFoundCreepers,
        groundType,
        jumpOff;

    if (this.levelModel.canMoveForward()) {
      let wasOnBlock = player.isOnBlock;
      this.levelModel.moveForward();
      // TODO: check for Lava, Creeper, water => play approp animation & call commandQueueItem.failed()

      jumpOff = wasOnBlock && wasOnBlock !== player.isOnBlock;
      if (player.isOnBlock || jumpOff) {
        groundType = this.levelModel.actionPlane[this.levelModel.coordinatesToIndex(player.position)].blockType;
      } else {
        groundType = this.levelModel.groundPlane[this.levelModel.coordinatesToIndex(player.position)].blockType;
      }

      this.levelView.playMoveForwardAnimation(player.position, player.facing, jumpOff, player.isOnBlock, groundType, () => {
        this.levelView.playIdleAnimation(player.position, player.facing, player.isOnBlock);

        // First arg is if we found a creeper
        allFoundCreepers = this.levelModel.isPlayerStandingNearCreeper();

        if (this.levelModel.isPlayerStandingInWater()) {
          this.levelView.playDrownFailureAnimation(player.position, player.facing, player.isOnBlock, () => {
            commandQueueItem.failed();
          });
        } else if (this.levelModel.isPlayerStandingInLava()) {
          this.levelView.playBurnInLavaAnimation(player.position, player.facing, player.isOnBlock, () => {
            commandQueueItem.failed();
          });
        } else {
          this.delayPlayerMoveBy(30, 200, () => {
            commandQueueItem.succeeded();
          });
        }
      });
    } else {
      if (this.levelModel.isForwardBlockOfType("creeper")) {
        this.levelView.playCreeperExplodeAnimation(player.position, player.facing, this.levelModel.getMoveForwardPosition(), player.isOnBlock, () => {
          commandQueueItem.failed();
        });
      } else {
        this.levelView.playBumpAnimation(player.position, player.facing, false);
        this.delayPlayerMoveBy(400, 800, () => {
          commandQueueItem.succeeded();
        });
      }
    }
  }

  moveDirection(commandQueueItem, direction) {
    const player = this.levelModel.player;

    this.levelModel.turnToDirection(player, direction);

    if (!this.levelModel.canMoveForward()) {
      this.levelView.playBumpAnimation(player.position, player.facing, false);
      commandQueueItem.succeeded();

      // The world edge was bumped, don't invoke events.
      const forwardPos = this.levelModel.getMoveForwardPosition();
      if (this.levelModel.inBounds(forwardPos[0], forwardPos[1])) {
        this.events.forEach(e => e({ eventType: 'blockTouched', blockReference: this.levelModel.getForwardBlock(), blockType: this.levelModel.getForwardBlockType() }));
      }
      return;
    }

    this.levelModel.actionPlane.forEach((block) => {
      if (block.isEmpty) {
        return;
      }

      this.events.forEach(e => {
        e({ eventType: 'playerMoved', blockReference: block, blockType: block.blockType });
      });
    });

    this.levelModel.moveDirection(direction);
    const groundType = this.levelModel.groundPlane[this.levelModel.coordinatesToIndex(player.position)].blockType;
    this.levelView.updatePlayerDirection(this.levelModel.player.position, this.levelModel.player.facing);
    this.levelView.playMoveForwardAnimation(player.position, player.facing, false, player.isOnBlock, groundType, () => {
      this.levelView.playIdleAnimation(player.position, player.facing, player.isOnBlock);
      this.delayPlayerMoveBy(30, 200, () => {
        commandQueueItem.succeeded();
      });
    });
  }

  turn(commandQueueItem, direction) {
    const player = this.levelModel.player;

    if (direction === -1) {
      this.levelModel.turnLeft(player);
    }

    if (direction === 1) {
      this.levelModel.turnRight(player);
    }
    this.levelView.updatePlayerDirection(this.levelModel.player.position, this.levelModel.player.facing);

    this.delayPlayerMoveBy(200, 800, () => {
      commandQueueItem.succeeded();
    });
  }

  turnEntity(commandQueueItem, entity, direction) {
    if (direction === -1) {
      this.levelModel.turnLeft(entity);
    }

    if (direction === 1) {
      this.levelModel.turnRight(entity);
    }

    const sourceIndex = this.levelModel.actionPlane.indexOf(entity);
    this.levelView.updateBlockSpriteDirection(sourceIndex, entity.facing);

    commandQueueItem.succeeded();
  }

  turnEntityToPlayer(commandQueueItem, entity) {
    const aStar = new AStarPathFinding(this.levelModel);
    const entityPosition = this.levelModel.entityToPosition(entity);

    const path = aStar.findPath([entityPosition.x, entityPosition.y], this.levelModel.player.position);

    // if there is a valid path to the player, turn to face the block in the first step.
    if (path.length > 0) {
      const firstNode = path[0];
      this.levelModel.turnToDirection(entity, this.levelModel.getFaceDirectionTo([entityPosition.x, entityPosition.y], [firstNode.x, firstNode.y]));

      const sourceIndex = this.levelModel.actionPlane.indexOf(entity);
      this.levelView.updateBlockSpriteDirection(sourceIndex, entity.facing);
    }
    commandQueueItem.succeeded();
  }

  turnEntityAwayPlayer(commandQueueItem, entity) {
    const aStar = new AStarPathFinding(this.levelModel);
    const entityPosition = this.levelModel.entityToPosition(entity);

    const path = aStar.findPath([entityPosition.x, entityPosition.y], this.levelModel.player.position);

    // if there is a valid path to the player, turn to face the block in the first step.
    if (path.length > 0) {
      const firstNode = path[0];
      this.levelModel.turnToDirection(entity, this.levelModel.getFaceDirectionTo([firstNode.x, firstNode.y], [entityPosition.x, entityPosition.y]));

      const sourceIndex = this.levelModel.actionPlane.indexOf(entity);
      this.levelView.updateBlockSpriteDirection(sourceIndex, entity.facing);
    }
    commandQueueItem.succeeded();
  }

  destroyEntity(commandQueueItem, entity) {
    const {x, y} = this.levelModel.entityToPosition(entity);
    this.destroyBlockWithoutPlayerInteraction([x, y]);
    this.levelModel.computeShadingPlane();
    this.levelModel.computeFowPlane();
    this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
    this.levelView.updateFowPlane(this.levelModel.fowPlane);
    commandQueueItem.succeeded();
  }

  explodeEntity(commandQueueItem, entity) {
    const {x, y} = this.levelModel.entityToPosition(entity);
    this.levelView.playExplosionCloudAnimation([x, y]);
    commandQueueItem.succeeded();
  }

  flashEntity(commandQueueItem, entity) {
    const {x, y} = this.levelModel.entityToPosition(entity);
    var delay = this.levelView.flashSpriteToWhite([x, y]);
    this.delayBy(delay, () => {
      commandQueueItem.succeeded();
    });
  }

  playSound(commandQueueItem, sound) {
    this.levelView.audioPlayer.play(sound);
    commandQueueItem.succeeded();
  }

  destroyBlockWithoutPlayerInteraction(position) {
      let block = this.levelModel.actionPlane[this.levelModel.yToIndex(position[1]) + position[0]];
    this.levelModel.destroyBlock(position);

    if (block) {
      let destroyPosition = block.position; // position isn't a member of block, is this valid? Resolves to Undefined.
      let blockType = block.blockType;

      if (block.isDestroyable) {
        this.levelModel.computeShadingPlane();
        this.levelModel.computeFowPlane();
        switch (blockType) {
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

        this.levelView.actionPlaneBlocks[this.levelModel.yToIndex(destroyPosition[1]) + destroyPosition[0]].kill();
        this.levelView.playExplosionAnimation(this.levelModel.player.position, this.levelModel.player.facing, destroyPosition, blockType, () => {}, true);
      } else if (block.isUsable) {
        switch (blockType) {
          case "sheep":
            // TODO: What to do with already sheered sheep?
            this.levelView.playShearAnimation(this.levelModel.player.position, this.levelModel.player.facing, destroyPosition, blockType, () => {});
            break;
        }
      }
    }
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
          this.levelModel.computeFowPlane();
          switch (blockType) {
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

          this.levelView.playDestroyBlockAnimation(player.position, player.facing, destroyPosition, blockType, this.levelModel.shadingPlane, this.levelModel.fowPlane, () => {
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
            default:
              commandQueueItem.succeeded();
          }
        } else {
          commandQueueItem.succeeded();
        }
      }
    } else {
      this.levelView.playPunchDestroyAirAnimation(player.position, player.facing, this.levelModel.getMoveForwardPosition(), () => {
        this.levelView.setSelectionIndicatorPosition(player.position[0], player.position[1]);
        this.levelView.playIdleAnimation(player.position, player.facing, player.isOnBlock);
        this.delayPlayerMoveBy(200, 600, () => {
          commandQueueItem.succeeded();
        });
      });
    }
  }

  canUseTints() {
    // TODO(bjordan): Remove
    // all browsers appear to work with new version of Phaser
    return true;
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
      var checkRailBlock = this.levelModel.railMap[this.levelModel.yToIndex(this.levelModel.player.position[1]) + this.levelModel.player.position[0]];
    if (checkRailBlock !== "") {
      blockType = checkRailBlock;
    } else {
      blockType = "railsVertical";
    }
    return blockType;
  }

  placeBlock(commandQueueItem, blockType) {
      var blockIndex = (this.levelModel.yToIndex(this.levelModel.player.position[1]) + this.levelModel.player.position[0]);
    var blockTypeAtPosition = this.levelModel.actionPlane[blockIndex].blockType;
    if (this.levelModel.canPlaceBlock()) {
      if (this.checkMinecartLevelEndAnimation() && blockType === "rail") {
        blockType = this.checkRailBlock(blockType);
      }

      if (blockTypeAtPosition !== "") {
        this.levelModel.destroyBlock(blockIndex);
      }
      if (this.levelModel.placeBlock(blockType)) {
        this.levelView.playPlaceBlockAnimation(this.levelModel.player.position, this.levelModel.player.facing, blockType, blockTypeAtPosition, () => {
          this.levelModel.computeShadingPlane();
          this.levelModel.computeFowPlane();
          this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
          this.levelView.updateFowPlane(this.levelModel.fowPlane);
          this.delayBy(200, () => {
            this.levelView.playIdleAnimation(this.levelModel.player.position, this.levelModel.player.facing, false);
          });
          this.delayPlayerMoveBy(200, 400, () => {
            commandQueueItem.succeeded();
          });
        });
      } else {
        var signalBinding = this.levelView.playPlayerAnimation("jumpUp", this.levelModel.player.position, this.levelModel.player.facing, false).onLoop.add(() => {
          this.levelView.playIdleAnimation(this.levelModel.player.position, this.levelModel.player.facing, false);
          signalBinding.detach();
          this.delayBy(800, () => commandQueueItem.succeeded());
        }, this);
      }
    } else {
      commandQueueItem.failed();
    }
  }

  setPlayerActionDelayByQueueLength() {
    var START_SPEED_UP = 10;
    var END_SPEED_UP = 20;

    var queueLength = this.queue.getLength();
    var speedUpRangeMax = END_SPEED_UP - START_SPEED_UP;
    var speedUpAmount = Math.min(Math.max(queueLength - START_SPEED_UP, 0), speedUpRangeMax);

    this.playerDelayFactor = 1 - (speedUpAmount / speedUpRangeMax);
  }

  delayBy(ms, completionHandler) {
    var timer = this.game.time.create(true);
    timer.add(this.originalMsToScaled(ms), completionHandler, this);
    timer.start();
    this.resettableTimers.push(timer);
  }

  delayPlayerMoveBy(minMs, maxMs, completionHandler) {
    this.delayBy(Math.max(minMs, maxMs * this.playerDelayFactor), completionHandler);
  }

  originalMsToScaled(ms) {
    var realMs = ms / this.assumedSlowMotion;
    return realMs * this.game.time.slowMotion;
  }

  originalFpsToScaled(fps) {
    var realFps = fps * this.assumedSlowMotion;
    return realFps / this.game.time.slowMotion;
  }

  setBlockAt(x, y, blockType) {
    if (!this.levelModel.inBounds(x, y)) {
      return;
    }
    if (this.levelModel.isPlayer(x, y)) {
      return; // TODO(bjordan): should not do when e.g. placing on ground
    }
    if (!this.levelModel.isBlockOfTypeOnPlane([x, y], "empty", this.levelModel.actionPlane)) {
      return; // TODO(bjordan): should not do when e.g. placing on ground
    }
    const block = this.levelModel.placeBlockAt(x, y, blockType);
    this.levelView.setBlockAt(x, y, blockType);
    this.events.forEach(e => e({ eventType: 'entitySpawned', blockReference: block, blockType: block.blockType }));
  }

  placeBlockForward(commandQueueItem, blockType) {
    var forwardPosition,
        placementPlane,
        soundEffect = () => {};

    if (!this.levelModel.canPlaceBlockForward()) {
      this.levelView.playPunchAirAnimation(this.levelModel.player.position, this.levelModel.player.facing, this.levelModel.player.position, () => {
        this.levelView.playIdleAnimation(this.levelModel.player.position, this.levelModel.player.facing, false);
        commandQueueItem.succeeded();
      });
      return;
    }

    forwardPosition = this.levelModel.getMoveForwardPosition();
    placementPlane = this.levelModel.getPlaneToPlaceOn(forwardPosition);
    if (this.levelModel.isBlockOfTypeOnPlane(forwardPosition, "lava", placementPlane)) {
      soundEffect = () => this.levelView.audioPlayer.play("fizz");
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
      this.delayPlayerMoveBy(200, 400, () => {
        commandQueueItem.succeeded();
      });
    });
  }

  checkSolution(commandQueueItem) {
    let player = this.levelModel.player;
    this.levelView.setSelectionIndicatorPosition(player.position[0], player.position[1]);

    // check the final state to see if its solved
    if (this.levelModel.isSolved()) {
      if (this.checkHouseBuiltEndAnimation()) {
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
            },
            () => {
              this.levelModel.destroyBlock(bedPosition);
              this.levelModel.destroyBlock(doorPosition);
              this.levelModel.computeShadingPlane();
              this.levelModel.computeFowPlane();
              this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
              this.levelView.updateFowPlane(this.levelModel.fowPlane);
            }
        );
      } else if (this.checkMinecartLevelEndAnimation()) {
        this.levelView.playMinecartAnimation(player.position, player.facing, player.isOnBlock,
            () => commandQueueItem.succeeded(), this.levelModel.getMinecartTrack(), this.levelModel.getUnpoweredRails());
      } else if (this.checkTntAnimation()) {
        this.levelView.scaleShowWholeWorld(() => {});
        var tnt = this.levelModel.getTnt();
        var wasOnBlock = player.isOnBlock;
        this.levelView.playDestroyTntAnimation(player.position, player.facing, player.isOnBlock, this.levelModel.getTnt(), this.levelModel.shadingPlane,
            () => {
              if (tnt.length) {
                // Shakes camera (need to avoid contention with pan?)
                //this.game.camera.setPosition(0, 5);
                //this.game.add.tween(this.game.camera)
                //    .to({y: -10}, 40, Phaser.Easing.Sinusoidal.InOut, false, 0, 3, true)
                //    .to({y: 0}, 0)
                //    .start();
              }
              for (var i in tnt) {
                if (tnt[i].x === this.levelModel.player.position.x && tnt[i].y === this.levelModel.player.position.y) {
                  this.levelModel.player.isOnBlock = false;
                }
                var surroundingBlocks = this.levelModel.getAllBorderingPositionNotOfType(tnt[i], "tnt");
                this.levelModel.destroyBlock(tnt[i]);
                for (var b = 1; b < surroundingBlocks.length; ++b) {
                  if (surroundingBlocks[b][0]) {
                    this.destroyBlockWithoutPlayerInteraction(surroundingBlocks[b][1]);
                  }
                }
              }
              if (!player.isOnBlock && wasOnBlock) {
                this.levelView.playPlayerJumpDownVerticalAnimation(player.position, player.facing);
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
      } else {
        this.levelView.playSuccessAnimation(player.position, player.facing, player.isOnBlock,
            () => commandQueueItem.succeeded());
      }
    } else {
      this.levelView.playFailureAnimation(player.position, player.facing, player.isOnBlock, () => {
        commandQueueItem.failed();
      });
    }
  }

  isPathAhead(blockType) {
    return this.levelModel.isForwardBlockOfType(blockType);
  }

}

window.GameController = GameController;

export default GameController;
