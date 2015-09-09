import GameState from "../GameState";
import AppStates from "./AppStates";

/**
 * Resets game board to match original levelConfig.
 */
export default class ResettingState extends GameState {
  constructor(...passThrough) {
    super(...passThrough);

    /**
     * List of sprites created, persists across state transitions.
     * @type {Array}
     */
    this.allGroundTileSprites = [];
    this.allObjectTileSprites = [];
  }

  render() {
    this.game.debug.text(`Configured ${this.allGroundTileSprites.length} tiles.`,
        2, 28, "#00ff00");
  }

  onEnter() {
    this.timeEnter();
    if (!this.phaserApp.levelConfig) {
      return; // Still waiting on configuration
    }

    this.initializeGroundTiles();
    this.initializeObjects();
    this.stateManager.enterState(AppStates.WAITING);
  }

  onExit() {
    this.timeExit();
  }

  initializeGroundTiles() {
    this.allGroundTileSprites.forEach((tile) => {
      tile.destroy();
    });
    this.allGroundTileSprites.length = 0;

    var groundMap = this.phaserApp.levelConfig.groundMap;
    for (var row = 0; row < groundMap.length; row++) {
      var columns = groundMap[row];
      for (var column = 0; column < columns.length; column++) {
        var tileType = columns[column];
        var tileTypeToSpriteFrame = {
          "sand": 19,
          "dirt": 26,
          "grass": 33
        };
        var tile = this.game.add.sprite(column * 40, row * 40,
            'tiles', tileTypeToSpriteFrame[tileType]);
        tile.width = 40;
        tile.height = 40;
        this.allGroundTileSprites.push(tile);
      }
    }
  }

  initializeObjects() {
    this.allObjectTileSprites.forEach((tile) => {
      tile.destroy();
    });
    this.allObjectTileSprites.length = 0;

    var objectsMap = this.phaserApp.levelConfig;
    for (var row = 0; row < objectsMap.length; row++) {
      var columns = objectsMap[row];
      for (var column = 0; column < columns.length; column++) {
        var tileType = columns[column];
        var tileTypeToSpriteFrame = {
          "treeA": 19,
          "treeB": 26,
          "treeC": 33
        };
        var tile = this.game.add.sprite(column * 40, row * 40,
            'tiles', tileTypeToSpriteFrame[tileType]);
        tile.width = 40;
        tile.height = 40;
        this.allObjectTileSprites.push(tile);
      }
    }
  }
}
