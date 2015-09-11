import Phaser from 'Phaser';
import _ from 'lodash';
import DemoState from './states/app/DemoState';
import DebugState from './states/DebugState';
import StateManager from './states/managed/StateManager';
import WaitingState from './states/app/WaitingState.js';
import RunningState from './states/app/RunningState.js';
import ResettingState from './states/app/ResettingState.js';
import AppStates from './states/app/AppStates.js';

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
    /**
     * @public {Object} codeOrgAPI - API with externally-callable methods for
     * starting an attempt, issuing commands, etc.
     */
    this.codeOrgAPI = {
      /**
       * Called before a list of user commands will be issued.
       */
      startCommandCollection: () => {
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
      startAttempt: (onAttemptComplete) => {
        console.log("Starting new attempt.");
      },
      resetAttempt: () => {
        console.log("Resetting game.")
      },
      moveForward: (highlightCallback) => {
        console.log("Adding move forward command.");
      },
      turnRight: (highlightCallback) => {
        console.log("Adding turn right command.");
      },
      turnLeft: (highlightCallback) => {
        console.log("Adding turn left command.");
      },
      destroyBlock: (highlightCallback) => {
        console.log("Adding destroy block command.");
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

    /**
     * Global game events.
     *
     * Sample usage:
     *
     * this.gameEvents.onEnemyAdd.add(function () {
     *   console.log("Enemy added!")
     * });
     *
     * @type {Object.<String, Phaser.Signal>}
     */
    this.gameEvents = {
      // Fired when an enemy is added to the screen.
      onEnemyAdd: new Phaser.Signal(),
      onGameStarted: new Phaser.Signal()
    };

    this.stateMachine = new StateManager(new Map([
      [AppStates.LOADING, new DebugState(this)],
      [AppStates.RESETTING, new ResettingState(this)],
      [AppStates.WAITING, new WaitingState(this)],
      [AppStates.RUNNING, new RunningState(this)],
      [AppStates.DEMO, new DemoState(this)]
    ]));
    this.stateMachine.enterState(AppStates.LOADING);
  }

  /**
   * @param {LevelConfig} levelConfig
   */
  loadLevel(levelConfig) {
    this.levelConfig = levelConfig;
    switch (this.stateMachine.currentStateID()) {
      case AppStates.LOADING:
        // Still loading game and assets, wait until done.
        break;
      default:
        this.stateMachine.enterState(AppStates.RESETTING);
        break;
    }
  }

  preload() {
    this.game.time.advancedTiming = true;
    this.game.load.spritesheet('tiles',
        `${this.assetRoot}images/spritesheet_tiles.png`, 130, 130);
  }

  create() {
    this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(() => {
      this.stateMachine.enterState(AppStates.DEMO);
    });

    // Once loaded, go to resetting state.
    this.stateMachine.enterState(AppStates.RESETTING);
  }

  update() {
    this.stateMachine.currentState.update();
  }

  render() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
    this.stateMachine.currentState.render();
  }
}

window.PhaserApp = PhaserApp;

export default PhaserApp;
