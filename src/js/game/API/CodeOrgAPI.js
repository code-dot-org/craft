import CommandQueue from "../CommandQueue/CommandQueue.js";
import BaseCommand from "../CommandQueue/BaseCommand.js";
import DestroyBlockCommand from "../CommandQueue/DestroyBlockCommand.js";
import PlaceBlockCommand from "../CommandQueue/PlaceBlockCommand.js";
import PlaceInFrontCommand from "../CommandQueue/PlaceInFrontCommand.js";
import MoveForwardCommand from "../CommandQueue/MoveForwardCommand.js";
import TurnCommand from "../CommandQueue/TurnCommand.js";
import WhileCommand from "../CommandQueue/WhileCommand.js";
import IfBlockAheadCommand from "../CommandQueue/IfBlockAheadCommand.js";
import CheckSolutionCommand from "../CommandQueue/CheckSolutionCommand.js";
import CallbackCommand from "../CommandQueue/CallbackCommand.js";

export function get(controller) {
  return {
    /**
     * Called before a list of user commands will be issued.
     */
    startCommandCollection: function () {
      if (controller.DEBUG) {
        console.log("Collecting commands.");
      }
    },

    /**
     * Called when an attempt should be started, and the entire set of
     * command-queue API calls have been issued.
     *
     * @param {Function} onAttemptComplete - callback with two parameters,
     * "success", i.e., true if attempt was successful (level completed),
     * false if unsuccessful (level not completed), and the current level model.
     */
    startAttempt: function (onAttemptComplete) {
      if (!controller.levelData.isEventLevel) {
        controller.OnCompleteCallback = onAttemptComplete;
        controller.queue.addCommand(new CheckSolutionCommand(controller));
      }

      controller.setPlayerActionDelayByQueueLength();
      controller.startAttempt();

      controller.queue.begin();
    },

    resetAttempt: function () {
      controller.reset();
      controller.queue.reset();
      controller.OnCompleteCallback = null;
    },

    /**
     * @param highlightCallback
     * @param codeBlockCallback - for example:
     *  (e) => {
     *    if (e.type !== 'blockDestroyed') {
     *      return;
     *    }
     *
     *    if (e.blockType !== '[dropdown value, e.g. logOak') {
     *      return;
     *    }
     *
     *    evalUserCode(e.block);
     *  }
     */

    registerEventCallback(highlightCallback, codeBlockCallback) {
      // TODO(bjordan): maybe need to also handle top-level event block highlighting
      controller.events.push(codeBlockCallback);

      // in controller:
      // this.events.forEach((e) => e({ type: EventType.BLOCK_DESTROYED, blockType: 'logOak' });
      // (and clear out on reset)
    },

    destroyEntity: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.destroyEntity(queueItem, entity);
      });
      controller.queue.addCommand(queueItem);
    },

    explodeEntity: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.explodeEntity(queueItem, entity);
      });
      controller.queue.addCommand(queueItem);
    },

    flashEntity: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.flashEntity(queueItem, entity);
      });
      controller.queue.addCommand(queueItem);
    },

    playSound: function (highlightCallback, sound) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.playSound(queueItem, sound);
      });
      controller.queue.addCommand(queueItem);
    },

    moveEntityNorth: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.moveEntityNorth(queueItem, entity);
      });
      controller.queue.addCommand(queueItem);
    },

    moveEntitySouth: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.moveEntitySouth(queueItem, entity);
      });
      controller.queue.addCommand(queueItem);
    },

    moveEntityEast: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.moveEntityEast(queueItem, entity);
      });
      controller.queue.addCommand(queueItem);
    },

    moveEntityWest: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.moveEntityWest(queueItem, entity);
      });
      controller.queue.addCommand(queueItem);
    },

    moveEntityForward: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.moveEntityForward(queueItem, entity);
      });
      controller.queue.addCommand(queueItem);
    },

    moveEntityTowardPlayer: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.moveEntityToPlayer(queueItem, entity, 1);
      });
      controller.queue.addCommand(queueItem);
    },

    moveEntityAwayFromPlayer: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.moveEntityToPlayer(queueItem, entity, 0);
      });
      controller.queue.addCommand(queueItem);
    },

    moveDirection: function (highlightCallback, direction) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.moveDirection(queueItem, direction);
      });
      controller.queue.addCommand(queueItem);
    },

    moveForward: function (highlightCallback) {
      controller.queue.addCommand(new MoveForwardCommand(controller, highlightCallback));
    },

    turn: function (highlightCallback, direction) {
      controller.queue.addCommand(new TurnCommand(controller, highlightCallback, direction === 'right' ? 1 : -1));
    },

    turnRight: function (highlightCallback) {
      controller.queue.addCommand(new TurnCommand(controller, highlightCallback, 1));
    },

    turnLeft: function (highlightCallback) {
      controller.queue.addCommand(new TurnCommand(controller, highlightCallback, -1));
    },

    turnEntity: function (highlightCallback, entity, direction) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.turnEntity(queueItem, entity, direction === 'right' ? 1 : -1);
      });
      controller.queue.addCommand(queueItem);
    },

    turnEntityRight: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.turnEntity(queueItem, entity, 1);
      });
      controller.queue.addCommand(queueItem);
    },

    turnEntityLeft: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.turnEntity(queueItem, entity, -1);
      });
      controller.queue.addCommand(queueItem);
    },

    turnEntityRandom: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        const rand = controller.getRandomBool();
        controller.turnEntity(queueItem, entity, rand ? 1 : -1);
      });
      controller.queue.addCommand(queueItem);
    },

    turnEntityToPlayer: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.turnEntityToPlayer(queueItem, entity);
      });
      controller.queue.addCommand(queueItem);
    },

    destroyEntityAhead: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.destroyEntityAhead(queueItem, entity);
      });
      controller.queue.addCommand(queueItem);
    },

    destroyEntityBehind: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.destroyEntityBehind(queueItem, entity);
      });
      controller.queue.addCommand(queueItem);
    },

    turnEntityAwayPlayer: function (highlightCallback, entity) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.turnEntityAwayPlayer(queueItem, entity);
      });
      controller.queue.addCommand(queueItem);
    },

    destroyBlock: function (highlightCallback) {
      controller.queue.addCommand(new DestroyBlockCommand(controller, highlightCallback));
    },

    placeBlock: function (highlightCallback, blockType) {
      controller.queue.addCommand(new PlaceBlockCommand(controller, highlightCallback, blockType));
    },

    setEntityNorth: function (highlightCallback, entity, blockType) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.setEntityNorth(queueItem, entity, blockType);
      });
      controller.queue.addCommand(queueItem);
    },

    waitFor: function (highlightCallback, ms) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.waitFor(queueItem, ms);
      });
      controller.queue.addCommand(queueItem);
    },

    setEntitySouth: function (highlightCallback, entity, blockType) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.setEntitySouth(queueItem, entity, blockType);
      });
      controller.queue.addCommand(queueItem);
    },

    setEntityEast: function (highlightCallback, entity, blockType) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.setEntityEast(queueItem, entity, blockType);
      });
      controller.queue.addCommand(queueItem);
    },

    setEntityWest: function (highlightCallback, entity, blockType) {
      const queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.setEntityWest(queueItem, entity, blockType);
      });
      controller.queue.addCommand(queueItem);
    },

    setBlockAt(highlightCallback, x, y, blockType) {
      var queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.setBlockAt(x, y, blockType);
        queueItem.succeeded();
      });
      controller.queue.addCommand(queueItem);
    },

    setEntityAhead(highlightCallback, x, y, blockType) {
      var queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.setEntityAhead(queueItem, x, y, blockType);
      });
      controller.queue.addCommand(queueItem);
    },

    setEntityBehind(highlightCallback, x, y, blockType) {
      var queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.setEntityBehind(queueItem, x, y, blockType);
      });
      controller.queue.addCommand(queueItem);
    },

    setEntityLeft(highlightCallback, x, y, blockType) {
      var queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.setEntityLeft(queueItem, x, y, blockType);
      });
      controller.queue.addCommand(queueItem);
    },

    setEntityRight(highlightCallback, x, y, blockType) {
      var queueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.setEntityRight(queueItem, x, y, blockType);
      });
      controller.queue.addCommand(queueItem);
    },

    placeInFront: function (highlightCallback, blockType) {
      controller.queue.addCommand(new PlaceInFrontCommand(controller, highlightCallback, blockType));
    },

    tillSoil: function (highlightCallback) {
      controller.queue.addCommand(new PlaceInFrontCommand(controller, highlightCallback, 'watering'));
    },

    whilePathAhead: function (highlightCallback, blockType, codeBlock) {
      controller.queue.addCommand(new WhileCommand(controller, highlightCallback, blockType, codeBlock));
    },

    ifBlockAhead: function (highlightCallback, blockType, codeBlock) {
      controller.queue.addCommand(new IfBlockAheadCommand(controller, highlightCallback, blockType, codeBlock));
    },

    getScreenshot: function () {
      return controller.getScreenshot();
    }
  };
}
