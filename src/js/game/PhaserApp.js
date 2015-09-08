import Phaser from "Phaser";
var _ = require('lodash');

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
var PhaserApp = function (phaserAppConfig) {
  /**
   * @property {PhaserAppConfig}
   */
  this.initialConfig = phaserAppConfig;

  /**
   * Main Phaser game instance.
   * @property {Phaser.Game}
   */
  this.phaserGame = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO,
      this.initialConfig.containerId,
      {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this),
        render: this.render.bind(this)
      }
  );

  /**
   * @property {Phaser.Sprite}
   */
  this.mainCharacter = null;

  /**
   * @property {Phaser.Group}
   */
  this.obstacleLayer = null;

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

  this.debouncedEnemyAdd = _.debounce(this.addEnemyAtMouse.bind(this), 100,
      {leading: true, maxWait: 100});

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
};

PhaserApp.prototype.preload = function () {
  this.phaserGame.time.advancedTiming = true;
  this.phaserGame.load.spritesheet('tiles', 'assets/images/spritesheet_tiles.png', 130, 130);
  this.phaserGame.load.spritesheet('test-avatar', 'assets/images/test-avatar.png', 73, 100);
  this.phaserGame.load.spritesheet('test-avatar-enemy', 'assets/images/test-avatar-enemy.png', 73, 100);
  this.phaserGame.load.image('test-transparency', 'assets/images/test-transparency.png');
  this.phaserGame.load.image('oak', 'assets/images/tree_oak.png');
  this.phaserGame.load.image('pine', 'assets/images/tree_pine.png');
  this.cursors = this.phaserGame.input.keyboard.createCursorKeys();
  this.numberKeys = {
    ONE: this.phaserGame.input.keyboard.addKey(Phaser.Keyboard.ONE),
    TWO: this.phaserGame.input.keyboard.addKey(Phaser.Keyboard.TWO),
    THREE: this.phaserGame.input.keyboard.addKey(Phaser.Keyboard.THREE),
    FOUR: this.phaserGame.input.keyboard.addKey(Phaser.Keyboard.FOUR),
    FIVE: this.phaserGame.input.keyboard.addKey(Phaser.Keyboard.FIVE),
    SIX: this.phaserGame.input.keyboard.addKey(Phaser.Keyboard.SIX)
  };
};

PhaserApp.prototype.create = function () {
  this.initializeGroundTiles();
  this.obstacleLayer = this.phaserGame.add.group();
  this.initializeObstacleObjects();
  this.initializeCharacters();
  this.initializeShadowObject();
};

PhaserApp.prototype.initializeObstacleObjects = function () {
  for (var i = 0; i < 50; i++) {
    var x = this.phaserGame.math.snapTo(this.phaserGame.world.randomX, 40) + 20;
    var y = this.phaserGame.math.snapTo(this.phaserGame.world.randomY, 40) + 19;
    var obstacle = this.obstacleLayer.create(x, y, this.phaserGame.rnd.pick(['oak', 'pine']));
    obstacle.anchor.x = .5;
    obstacle.anchor.y = .95;
    obstacle.scale.x = .35;
    obstacle.scale.y = .35;
  }
};

PhaserApp.prototype.initializeCharacters = function () {
  this.mainCharacter = this.obstacleLayer.create(0, 0, 'test-avatar', 0);
  this.mainCharacter.anchor.x = .5;
  this.mainCharacter.anchor.y = .95;
  this.mainCharacter.animations.add('spritesheet');
  this.mainCharacter.animations.play('spritesheet', 30, true);

  this.enemy = this.addEnemy(100, 100);
};

PhaserApp.prototype.initializeShadowObject = function () {
  if (this.phaserGame.renderType !== Phaser.CANVAS) {
    this.shadowTexture = this.phaserGame.add.bitmapData(this.phaserGame.width, this.phaserGame.height);
    this.lightSprite = this.phaserGame.add.image(0, 0, this.shadowTexture);
    this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
  }
};

PhaserApp.prototype.initializeGroundTiles = function () {
  var gridX = 0;
  var gridY = 0;
  var gridHeight = 10;
  var gridWidth = 10;
  var groundTiles = [19, 19 + 7, 19 + 7 * 2, 19 + 7 * 3];
  while (gridX < gridWidth || gridY < gridHeight) {
    var tile = this.phaserGame.add.sprite(gridX * 40, gridY * 40,
        'tiles', this.phaserGame.rnd.pick(groundTiles));
    tile.width = 40;
    tile.height = 40;

    if (gridX < gridHeight) {
      gridX++;
    } else {
      if (gridY < gridHeight) {
        gridY++;
      }
      gridX = 0;
    }
  }
};

PhaserApp.prototype.update = function () {
  var x = this.phaserGame.math.snapTo(
          this.phaserGame.input.activePointer.x - 20, 40) + 20;
  var y = this.phaserGame.math.snapTo(
          this.phaserGame.input.activePointer.y - 20, 40) + 21;
  this.mainCharacter.x = x;
  this.mainCharacter.y = y;

  this.obstacleLayer.sort('y', Phaser.Group.SORT_ASCENDING);

  if (this.phaserGame.renderType !== Phaser.CANVAS) {
    this.shadowTexture.context.fillStyle = 'rgb(100, 100, 100)';
    this.shadowTexture.context.fillRect(0, 0, this.phaserGame.width, this.phaserGame.height);
    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
    this.shadowTexture.context.arc(150, 150,
        100, 0, Math.PI * 2);
    this.shadowTexture.context.arc(250, 250,
        100, 0, Math.PI * 2);
    this.shadowTexture.context.fill();
    this.shadowTexture.dirty = true;
  }

  if (this.phaserGame.input.activePointer.isDown) {
    this.debouncedEnemyAdd();
  }
};

PhaserApp.prototype.addEnemyAtMouse = function () {
  this.addEnemy(this.phaserGame.math.snapTo(this.phaserGame.input.activePointer.x - 20, 40),
      this.phaserGame.math.snapTo(this.phaserGame.input.activePointer.y - 20, 40));
};

PhaserApp.prototype.addEnemy = function (x, y) {
  this.gameEvents.onEnemyAdd.dispatch();
  var newEnemy = this.obstacleLayer.create(x, y, 'test-avatar-enemy', 0);
  newEnemy.anchor.x = .5;
  newEnemy.anchor.y = .95;
  newEnemy.animations.add('spritesheet');
  newEnemy.animations.play('spritesheet', 30, true);
  return newEnemy;
};

PhaserApp.prototype.render = function () {
  this.phaserGame.debug.text(this.phaserGame.time.fps || '--', 2, 14, "#00ff00");
};

window.PhaserApp = PhaserApp;

module.exports = PhaserApp;
