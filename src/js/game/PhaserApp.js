import Phaser from 'Phaser';
import _ from 'lodash';

import CommandQueue from "./CommandQueue/CommandQueue.js";
import BaseCommand from "./CommandQueue/BaseCommand.js";
import DestroyBlockCommand from "./CommandQueue/DestroyBlockCommand.js";
import MoveForwardCommand from "./CommandQueue/MoveForwardCommand.js";
import TurnCommand from "./CommandQueue/TurnCommand.js";
import WhileCommand from "./CommandQueue/WhileCommand.js";

import LevelModel from "./LevelMVC/LevelModel.js"
import LevelView from "./LevelMVC/LevelView.js"

import * as CodeOrgAPI from "./API/CodeOrgAPI.js"

var GAME_WIDTH = 400;
var GAME_HEIGHT = 400;

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
    this.codeOrgAPI = CodeOrgAPI.get(this);

    /**
     * @property {LevelConfig}
     */
    this.levelConfig = null;

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
  }

  /**
   * @param {LevelConfig} levelConfig
   */
  loadLevel(levelConfig) {
    this.levelConfig = levelConfig;

    this.levelData = [
      // Ground layer
      ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
        "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
        "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
        "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
        "coarseDirt", "coarseDirt", "coarseDirt", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
        "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
        "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
        "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
        "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
        "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"
      ],

      // Action layer
      ["grass", "grass", "", "", "", "", "", "", "grass", "grass",
        "", "grass", "", "", "", "", "", "", "", "grass",
        "", "", "", "logOak", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "logOak", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "logOak", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "logOak", "", "", ""
      ],

      // Fluff layer
      []
    ];

    this.levelModel = new LevelModel(this.levelData);
    this.levelView = new LevelView(this);
  }

  preload() {
    this.game.time.advancedTiming = true;
    this.levelView.preload();
  }

  create() {
    this.levelView.create();

// keyboard cheats for debugging
    this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onUp.add(() => {
        var dummyFunc = function() { console.log("highlight move forward command.");};
        this.codeOrgAPI.moveForward(dummyFunc);
    });

    this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onUp.add(() => {
        var dummyFunc = function() { console.log("highlight turn right command.");};
        this.codeOrgAPI.turnRight(dummyFunc);
    });

    this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onUp.add(() => {
        var dummyFunc = function() { console.log("highlight turn left command.");};
        this.codeOrgAPI.turnLeft(dummyFunc);
    });

    this.game.input.keyboard.addKey(Phaser.Keyboard.P).onUp.add(() => {
        var dummyFunc = function() { console.log("highlight placeBlock command.");};
        this.codeOrgAPI.placeBlock(dummyFunc,"logOak");
    });

    this.game.input.keyboard.addKey(Phaser.Keyboard.D).onUp.add(() => {
        var dummyFunc = function() { console.log("highlight destroy block command.");};
        this.codeOrgAPI.destroyBlock(dummyFunc);
    });

    this.game.input.keyboard.addKey(Phaser.Keyboard.E).onUp.add(() => {
        var dummyFunc = function(result) { console.log(`Execute command list done: ${result} `); };
        this.codeOrgAPI.startAttempt(dummyFunc);
    });

    this.game.input.keyboard.addKey(Phaser.Keyboard.W).onUp.add(() => {
        var dummyFunc = function() { console.log("Execute While command list"); };
        var blockType = "empty";
        var codeBlock = function() { 
            this.PhaserApp.codeOrgAPI.moveForward( function() { console.log("Execute While command move block");}); 
            this.PhaserApp.codeOrgAPI.moveForward( function() { console.log("Execute While command move block2");}); 
            this.PhaserApp.codeOrgAPI.turnLeft( function() { console.log("Execute While command turn");}); 
        };
        this.codeOrgAPI.whilePathAhead(dummyFunc, blockType, codeBlock);
    });

    this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
  }

  update() {
      this.queue.tick();
      this.levelView.update();

      if (this.queue.isFinished()) {
          this.handleEndState();
      } 
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
      this.levelModel.moveForward();
      this.levelView.playMoveForwardAnimation(this.levelModel.player.position, this.levelModel.player.facing, () => {
        commandQueueItem.succeeded();
      });
    } else {
      // TODO: Decide when you can't move is a failure? Walking into Lava, for example.
      commandQueueItem.succeeded();
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
      let blockType = this.levelModel.getBlockTypeForward();

      this.levelModel.destroyBlockForward();
      this.levelView.playDestroyBlockAnimation(this.levelModel.player.position, this.levelModel.player.facing, blockType, () => {
        this.levelModel.computeShadingPlane();
        this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
        commandQueueItem.succeeded();
      });
    } else {
      //commandQueueItem.failed();
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
