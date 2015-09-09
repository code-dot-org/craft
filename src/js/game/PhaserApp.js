import Phaser from 'Phaser';
import _ from 'lodash';
import DemoState from './scene_states/DemoState';

var GAME_WIDTH = 400;
var GAME_HEIGHT = 400;

/**
 * @typedef {Object} PhaserAppConfig
 * @property {String} containerId - ID of container for Phaser to mount app in
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
     * For triggering display of graphics demo.
     */
    this.game.state.add("Demo", new DemoState());

    /**
     * Provides key objects for up/down/left/right
     * @property {Object<string, Phaser.Key>}
     */
    this.cursors = null;

    /**
     * Provides key objects for numbers
     * @property {Object<string, Phaser.Key>}
     */
    this.numberKeys = null;

    /**
     * Used to display a layer of lit area.
     * @type {Phaser.Sprite}
     */
    this.lightSprite = null;

    /**
     * Global game events.
     * TODO(bjordan): Better way to annotate that still gives completion?
     * @type {{
     *    onEnemyAdd: Phaser.Signal,
      *   onGameStarted: Phaser.Signal
      * }}
     */
    this.gameEvents = {
      // Fired when an enemy is added to the screen.
      onEnemyAdd: new Phaser.Signal(),
      onGameStarted: new Phaser.Signal()
    };

    this.gameEvents.onEnemyAdd.add(function () {
      console.log("Enemy added!");
    });

    console.log("Just testing ES6ify");
  }

  preload() {
    this.game.time.advancedTiming = true;

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.numberKeys = {
      ONE: this.game.input.keyboard.addKey(Phaser.Keyboard.ONE),
      TWO: this.game.input.keyboard.addKey(Phaser.Keyboard.TWO),
      THREE: this.game.input.keyboard.addKey(Phaser.Keyboard.THREE),
      FOUR: this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR),
      FIVE: this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE),
      SIX: this.game.input.keyboard.addKey(Phaser.Keyboard.SIX)
    }
  }

  create() {
  }

  update() {
    console.log("Updating");
  }

  render() {
    console.log("Test Render!");
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
    this.game.debug.text("TESTING!", 2, 14, "#00FF00");
  }
}

window.PhaserApp = PhaserApp;

export default PhaserApp;
