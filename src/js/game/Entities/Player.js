import BaseEntity from "./BaseEntity.js"

export default class Player extends BaseEntity {
  constructor(controller, type, x, y, name, isOnBlock, facing) {
    super(controller, type, 'player', x, y, facing);
    this.name = name;
    this.isOnBlock = isOnBlock;
    this.inventory = {};
  }

  moveForward(commandQueueItem) {
    super.moveForward(commandQueueItem);
  }

  doMoveForward(commandQueueItem) {
    var player = this,
      allFoundCreepers,
      groundType,
      jumpOff,
      levelModel = this.controller.levelModel,
      levelView = this.controller.levelView;
    let wasOnBlock = player.isOnBlock;
    levelModel.moveForward();
    // TODO: check for Lava, Creeper, water => play approp animation & call commandQueueItem.failed()

    jumpOff = wasOnBlock && wasOnBlock !== player.isOnBlock;
    if (player.isOnBlock || jumpOff) {
      groundType = levelModel.actionPlane[levelModel.yToIndex(player.position[1]) + player.position[0]].blockType;
    } else {
      groundType = levelModel.groundPlane[levelModel.yToIndex(player.position[1]) + player.position[0]].blockType;
    }

    levelView.playMoveForwardAnimation(player.position, player.facing, jumpOff, player.isOnBlock, groundType, () => {
      levelView.playIdleAnimation(player.position, player.facing, player.isOnBlock);

      // First arg is if we found a creeper
      allFoundCreepers = levelModel.isPlayerStandingNearCreeper();

      if (levelModel.isPlayerStandingInWater()) {
        levelView.playDrownFailureAnimation(player.position, player.facing, player.isOnBlock, () => {
          commandQueueItem.failed();
        });
      } else if (levelModel.isPlayerStandingInLava()) {
        levelView.playBurnInLavaAnimation(player.position, player.facing, player.isOnBlock, () => {
          commandQueueItem.failed();
        });
      } else {
        this.controller.delayPlayerMoveBy(30, 200, () => {
          commandQueueItem.succeeded();
        });
      }
    });
  }

  bump(commandQueueItem) {

    var levelView = this.controller.levelView,
      levelModel = this.controller.levelModel;
    if (levelModel.isForwardBlockOfType("creeper")) {
      levelView.playCreeperExplodeAnimation(player.position, player.facing, levelModel.getMoveForwardPosition(), player.isOnBlock, () => {
        commandQueueItem.failed();
      });
    }
    else {
      levelView.playBumpAnimation(this.position, this.facing, false);
      this.controller.delayPlayerMoveBy(400, 800, () => {
        commandQueueItem.succeeded();
      });
    }
  }

  turn(commandQueueItem, direction) {
    super.turn(commandQueueItem, direction);
  }

  updateDirection(direction) {
    this.controller.levelView.updatePlayerDirection(this.position, this.facing);
  }
}

