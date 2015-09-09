import Phaser from 'Phaser';
import _ from 'lodash';

/**
 * Sets Run button to visible and waits for press.
 */
class DemoPhaserState extends Phaser.State {
  constructor(...args) {
    super(...args);
    this.debouncedEnemyAdd = _.debounce(this.addEnemyAtMouse.bind(this), 100,
        {leading: true, maxWait: 100});
  }

  preload() {
    this.game.load.image('logo', 'assets/images/phaser.png');
    this.game.load.spritesheet('tiles', 'assets/images/spritesheet_tiles.png', 130, 130);
    this.game.load.spritesheet('test-avatar', 'assets/images/test-avatar.png', 73, 100);
    this.game.load.spritesheet('test-avatar-enemy', 'assets/images/test-avatar-enemy.png', 73, 100);
    this.game.load.image('test-transparency', 'assets/images/test-transparency.png');
    this.game.load.image('oak', 'assets/images/tree_oak.png');
    this.game.load.image('pine', 'assets/images/tree_pine.png');
  }

  create() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.numberKeys = {
      ONE: this.game.input.keyboard.addKey(Phaser.Keyboard.ONE),
      TWO: this.game.input.keyboard.addKey(Phaser.Keyboard.TWO),
      THREE: this.game.input.keyboard.addKey(Phaser.Keyboard.THREE),
      FOUR: this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR),
      FIVE: this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE),
      SIX: this.game.input.keyboard.addKey(Phaser.Keyboard.SIX)
    };
    this.initializeGroundTiles();
    this.obstacleLayer = this.game.add.group();
    this.initializeObstacleObjects();
    this.initializeCharacters();
    this.initializeShadowObject();
  }

  update() {
    this.obstacleLayer.sort('y', Phaser.Group.SORT_ASCENDING);

    this.updateShadowObject();

    if (this.game.input.activePointer.isDown) {
      this.debouncedEnemyAdd();
    }
  }

  shutdown() {

  }

  initializeObstacleObjects() {
    for (var i = 0; i < 50; i++) {
      var x = this.game.math.snapTo(this.game.world.randomX, 40) + 20;
      var y = this.game.math.snapTo(this.game.world.randomY, 40) + 19;
      var obstacle = this.obstacleLayer.create(x, y, this.game.rnd.pick(['oak', 'pine']));
      obstacle.anchor.x = .5;
      obstacle.anchor.y = .95;
      obstacle.scale.x = .35;
      obstacle.scale.y = .35;
    }
  }

  initializeCharacters() {
    this.mainCharacter = this.obstacleLayer.create(0, 0, 'test-avatar', 0);
    this.mainCharacter.anchor.x = .5;
    this.mainCharacter.anchor.y = .95;
    this.mainCharacter.animations.add('spritesheet');
    this.mainCharacter.animations.play('spritesheet', 30, true);

    this.enemy = this.addEnemy(100, 100);
  }

  initializeShadowObject() {
    if (this.game.renderType !== Phaser.CANVAS) {
      this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
      this.lightSprite = this.game.add.image(0, 0, this.shadowTexture);
      this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    }
  }

  updateShadowObject() {
    if (this.game.renderType !== Phaser.CANVAS) {
      this.shadowTexture.context.fillStyle = 'rgb(100, 100, 100)';
      this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);
      this.shadowTexture.context.beginPath();
      this.shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
      this.shadowTexture.context.arc(150, 150,
          100, 0, Math.PI * 2);
      this.shadowTexture.context.arc(250, 250,
          100, 0, Math.PI * 2);
      this.shadowTexture.context.fill();
      this.shadowTexture.dirty = true;
    }
  }

  initializeGroundTiles() {
    var gridX = 0;
    var gridY = 0;
    var gridHeight = 10;
    var gridWidth = 10;
    var groundTiles = [19, 19 + 7, 19 + 7 * 2, 19 + 7 * 3];
    while (gridX < gridWidth || gridY < gridHeight) {
      var tile = this.game.add.sprite(gridX * 40, gridY * 40,
          'tiles', this.game.rnd.pick(groundTiles));
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
  }

  addEnemyAtMouse() {
    this.addEnemy(this.game.math.snapTo(this.game.input.activePointer.x - 20, 40),
        this.game.math.snapTo(this.game.input.activePointer.y - 20, 40));
  }

  addEnemy(x, y) {
    var newEnemy = this.obstacleLayer.create(x, y, 'test-avatar-enemy', 0);
    newEnemy.anchor.x = .5;
    newEnemy.anchor.y = .95;
    newEnemy.animations.add('spritesheet');
    newEnemy.animations.play('spritesheet', 30, true);
    return newEnemy;
  }
}

export default DemoPhaserState;
