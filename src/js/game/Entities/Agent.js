const BaseEntity = require("./BaseEntity.js");
const CallbackCommand = require("../CommandQueue/CallbackCommand.js");

module.exports = class Agent extends BaseEntity {
  constructor(controller, type, x, y, name, isOnBlock, facing) {
    super(controller, type, 'PlayerAgent', x, y, facing);
    this.offset = [-5, -15];
    this.name = name;
    this.isOnBlock = isOnBlock;
    this.inventory = {};
    this.movementState = -1;

    if (controller.getIsDirectPlayerControl()) {
      this.moveDelayMin = 0;
      this.moveDelayMax = 0;
    } else {
      this.moveDelayMin = 30;
      this.moveDelayMax = 200;
    }
  }

  /**
   * check whether or not the given entity can place a block
   */
  canPlaceBlockOver(toPlaceBlockType, onTopOfBlockType) {
    let result = {canPlace: false, plane: ""};
    if (onTopOfBlockType === "water" || onTopOfBlockType === "lava") {
      if (!toPlaceBlockType.startsWith("redstoneWire") && !toPlaceBlockType.startsWith("piston") && !toPlaceBlockType.startsWith("rails")) {
        result.canPlace = true;
        result.plane = "groundPlane";
      }
    } else {
      if (toPlaceBlockType.startsWith("redstoneWire") || toPlaceBlockType.startsWith("rails")) {
        result.canPlace = true;
        result.plane = "actionPlane";
      }
    }
    return result;
  }

  // "Events" levels allow the player to move around with the arrow keys, and
  // perform actions with the space bar.
  updateMovement() {
    if (!this.controller.attemptRunning || !this.controller.getIsDirectPlayerControl()) {
      return;
    }
    const queueIsEmpty = this.queue.isFinished() || !this.queue.isStarted();
    const isMoving = this.movementState !== -1;
    const queueHasOne = this.queue.currentCommand && this.queue.getLength() === 0;
    const timeEllapsed = (+new Date() - this.lastMovement);
    const movementAlmostFinished = timeEllapsed > 300;

    if ((queueIsEmpty || (queueHasOne && movementAlmostFinished)) && isMoving) {
      // Arrow key
      if (this.movementState >= 0) {
        let direction = this.movementState;
        let callbackCommand = new CallbackCommand(this, () => { }, () => {
          this.lastMovement = +new Date();
          this.controller.moveDirection(callbackCommand, direction);
        }, this.identifier);
        this.addCommand(callbackCommand);
        // Spacebar
      } else {
        let callbackCommand = new CallbackCommand(this, () => { }, () => {
          this.lastMovement = +new Date();
          this.controller.use(callbackCommand);
        }, this.identifier);
        this.addCommand(callbackCommand);
      }
    }
  }

  doMoveForward(commandQueueItem) {
    var player = this,
      groundType,
      jumpOff,
      levelModel = this.controller.levelModel,
      levelView = this.controller.levelView;
    let wasOnBlock = player.isOnBlock;
    let prevPosition = this.position;
    // update position
    levelModel.moveForward(this);
    // TODO: check for Lava, Creeper, water => play approp animation & call commandQueueItem.failed()

    jumpOff = wasOnBlock && wasOnBlock !== player.isOnBlock;
    if (player.isOnBlock || jumpOff) {
      groundType = levelModel.actionPlane.getBlockAt(player.position).blockType;
    } else {
      groundType = levelModel.actionPlane.getBlockAt(player.position).blockType;
    }

    levelView.playMoveForwardAnimation(player, prevPosition, player.facing, jumpOff, player.isOnBlock, groundType, () => {
      levelView.playIdleAnimation(player.position, player.facing, player.isOnBlock, player);

      if (levelModel.isPlayerStandingInWater()) {
        levelView.playDrownFailureAnimation(player.position, player.facing, player.isOnBlock, () => {
          this.controller.handleEndState(false);
        });
      } else if (levelModel.isPlayerStandingInLava()) {
        levelView.playBurnInLavaAnimation(player.position, player.facing, player.isOnBlock, () => {
          this.controller.handleEndState(false);
        });
      } else {
        this.controller.delayPlayerMoveBy(this.moveDelayMin, this.moveDelayMax, () => {
          commandQueueItem.succeeded();
        });
      }
    });

    this.updateHidingTree();
    this.updateHidingBlock(prevPosition);
  }

  doMoveBackward(commandQueueItem) {
    var player = this,
      groundType,
      jumpOff,
      levelModel = this.controller.levelModel,
      levelView = this.controller.levelView;
    let wasOnBlock = player.isOnBlock;
    let prevPosition = this.position;
    // update position
    levelModel.moveBackward(this);
    // TODO: check for Lava, Creeper, water => play approp animation & call commandQueueItem.failed()

    jumpOff = wasOnBlock && wasOnBlock !== player.isOnBlock;
    if (player.isOnBlock || jumpOff) {
      groundType = levelModel.actionPlane.getBlockAt(player.position).blockType;
    } else {
      groundType = levelModel.actionPlane.getBlockAt(player.position).blockType;
    }

    levelView.playMoveBackwardAnimation(player, prevPosition, player.facing, jumpOff, player.isOnBlock, groundType, "walk", () => {
      levelView.playIdleAnimation(player.position, player.facing, player.isOnBlock, player);

      if (levelModel.isPlayerStandingInWater()) {
        levelView.playDrownFailureAnimation(player.position, player.facing, player.isOnBlock, () => {
          this.controller.handleEndState(false);
        });
      } else if (levelModel.isPlayerStandingInLava()) {
        levelView.playBurnInLavaAnimation(player.position, player.facing, player.isOnBlock, () => {
          this.controller.handleEndState(false);
        });
      } else {
        this.controller.delayPlayerMoveBy(this.moveDelayMin, this.moveDelayMax, () => {
          commandQueueItem.succeeded();
        });
      }
    });

    this.updateHidingTree();
    this.updateHidingBlock(prevPosition);
  }

  bump(commandQueueItem) {
    var levelView = this.controller.levelView,
      levelModel = this.controller.levelModel;
    levelView.playBumpAnimation(this.position, this.facing, false, this);
    let frontEntity = this.controller.levelEntity.getEntityAt(levelModel.getMoveForwardPosition(this));
    if (frontEntity !== null) {
      const isFriendlyEntity = this.controller.levelEntity.isFriendlyEntity(frontEntity.type);
      // push frienly entity 1 block
      if (isFriendlyEntity) {
        const pushDirection = this.facing;
        var moveAwayCommand = new CallbackCommand(this, () => { }, () => { frontEntity.pushBack(moveAwayCommand, pushDirection, 250); }, frontEntity.identifier);
        frontEntity.queue.startPushHighPriorityCommands();
        frontEntity.addCommand(moveAwayCommand);
        frontEntity.queue.endPushHighPriorityCommands();
      }
    }
    this.controller.delayPlayerMoveBy(200, 400, () => {
      commandQueueItem.succeeded();
    });
  }

  takeDamage(callbackCommand) {
    let facingName = this.controller.levelView.getDirectionName(this.facing);
    this.healthPoint--;
    // still alive
    if (this.healthPoint > 0) {
      this.controller.levelView.playScaledSpeed(this.sprite.animations, "hurt" + facingName);
      callbackCommand.succeeded();
      // report failure since player died
    } else {
      this.sprite.animations.stop(null, true);
      this.controller.levelView.playFailureAnimation(this.position, this.facing, this.isOnBlock, () => {
        callbackCommand.failed();
        this.controller.handleEndState(false);
      });
    }
  }

  hasPermissionToWalk(actionBlock, frontEntity) {
        return (actionBlock.isWalkable || ((frontEntity !== undefined && frontEntity.isOnBlock)
        // action plane is empty
        && !actionBlock.isEmpty))
        // there is no entity
        && (frontEntity === undefined);
  }
};
