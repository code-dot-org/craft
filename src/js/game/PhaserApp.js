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
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "grass", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", ""
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

    this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(() => {
      var dummy = { succeeded: function() {} }
      this.moveForward(dummy);
    });

    this.levelView.updateShadingPlane(this.levelModel.shadingPlane);
  }

  update() {
    this.queue.tick();
    this.levelView.update();
  }

  render() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
    this.levelView.render();
  }

  // command processors
  moveForward(commandQueueItem) {
    this.levelView.playWalkForwardAnimation(() => {
      commandQueueItem.succeeded();
    });
  }

  turn(commandQueueItem, direction) {
    var tween;

    this.rotateFacing(direction);

    this.playerSprite.animations.play(this.getIdleSprite());
    tween = this.game.add.tween(this.playerSprite).to({
      value: 100
    }, 1000, Phaser.Easing.Linear.None);
    tween.onComplete.add(() => {
      this.playerSprite.animations.play(this.getIdleSprite());
      commandQueueItem.succeeded();
    });
    tween.start();
  }

  destroyBlock(commandQueueItem) {
    var tween;

    var spriteName = 'pick_' + this.getFacing();
    this.playerSprite.animations.play(spriteName);
    tween = this.game.add.tween(this.playerSprite).to({
      value: 1000
    }, 1000, Phaser.Easing.Linear.None);
    tween.onComplete.add(() => {
      this.playerSprite.animations.play(this.getIdleSprite());
      commandQueueItem.succeeded();
    });
    tween.start();
  }


  placeBlock(commandQueueItem) {
    var tween;

    var spriteName = 'place_' + this.getFacing();
    this.playerSprite.animations.play(spriteName);
    tween = this.game.add.tween(this.playerSprite).to({
      value: 100
    }, 1000, Phaser.Easing.Linear.None);
    tween.onComplete.add(() => {
      this.playerSprite.animations.play(this.getIdleSprite());
      commandQueueItem.succeeded();
    });
    tween.start();
  }

  rotateFacing(direction) {

    if (direction === 'left') {
      this.playerFacing -= 90;
    } else {
      this.playerFacing += 90;
    }
    if (this.playerFacing < 0) {
      this.playerFacing += 360;
    }
  }

  getFacing() {
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

  getIdleSprite() {
    return 'idle_' + this.getFacing();
  }
}

window.PhaserApp = PhaserApp;

export default PhaserApp;
