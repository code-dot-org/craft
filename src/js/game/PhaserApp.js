import Phaser from 'Phaser';
import _ from 'lodash';
import DemoPhaserState from './scenes/DemoPhaserState';
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
     * @property {PhaserAppConfig}
     */
    this.initialConfig = phaserAppConfig;

    /**
     * @property {LevelConfig}
     */
    this.levelConfig = null;

    /**
     * Main Phaser game instance.
     * @property {Phaser.Game}
     */
    this.game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO,
        this.initialConfig.containerId,
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
      [AppStates.LOADING, new DebugState(this, "loading")],
      [AppStates.RESETTING, new ResettingState(this)],
      [AppStates.WAITING, new WaitingState(this)],
      [AppStates.RUNNING, new RunningState(this)]
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
        'assets/images/spritesheet_tiles.png', 130, 130);
  }

  create() {
    this.initializeDemoPhaserState();

    // Once loaded, go to resetting state.
    this.stateMachine.enterState(AppStates.RESETTING);
    // Waiting on level config for state change.
  }

  initializeDemoPhaserState() {
    var demoSceneId = "Demo";
    this.game.state.add(demoSceneId, new DemoPhaserState());
    this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(() => {
      this.game.state.start(demoSceneId);
    });
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
