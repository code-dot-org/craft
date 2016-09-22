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

    // not used
    /*
    isEntityMove: function (event, entityIdentifier) {
      if (event.eventType === 'entityMoved') {
        return event.entityIdentifier === entityIdentifier;
      }
      return false;
    },*/
    // helper functions for event
    isEventTriggered: function (event, eventType) {
      return (event.eventType === eventType);
    },
    // command list
    moveForward: function (highlightCallback, targetEntity) {
      controller.addCommand(new MoveForwardCommand(controller, highlightCallback, targetEntity), targetEntity);
    },

    moveDirection: function (highlightCallback, direction, targetEntity) {
      const myQueueItem = new CallbackCommand(controller, highlightCallback, targetEntity, () => {
        controller.moveDirection(myQueueItem, direction);
      });
      controller.queue.addCommand(myQueueItem);
    },

    moveAway: function (highlightCallback, targetEntity, moveAwayFrom) {
      const myQueueItem = new CallbackCommand(controller, highlightCallback, targetEntity, () => {
        controller.moveAway(myQueueItem, moveAwayFrom);
      });
      controller.queue.addCommand(myQueueItem);
    },

    moveToward: function (highlightCallback, targetEntity, moveAwayFrom) {
      const myQueueItem = new CallbackCommand(controller, highlightCallback, targetEntity, () => {
        controller.moveToward(myQueueItem, moveAwayFrom);
      });
      controller.queue.addCommand(myQueueItem);
    },

    flashEntity: function (highlightCallback, targetEntity) {
      const myQueueItem = new CallbackCommand(controller, highlightCallback, targetEntity, () => {
        controller.flashEntity(myQueueItem);
      });
      controller.queue.addCommand(myQueueItem);
    },

    turn: function (highlightCallback, direction, targetEntity) {
      controller.queue.addCommand(new TurnCommand(controller, highlightCallback, direction === 'right' ? 1 : -1, targetEntity));
    },

    turnRight: function (highlightCallback, targetEntity) {
      controller.queue.addCommand(new TurnCommand(controller, highlightCallback, 1, targetEntity));
    },

    turnLeft: function (highlightCallback, targetEntity) {
      controller.queue.addCommand(new TurnCommand(controller, highlightCallback, -1, targetEntity));
    },

    destroyBlock: function (highlightCallback, targetEntity) {
      controller.queue.addCommand(new DestroyBlockCommand(controller, highlightCallback, targetEntity));
    },

    placeBlock: function (highlightCallback, blockType) {
      controller.queue.addCommand(new PlaceBlockCommand(controller, highlightCallback, blockType));
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
    },

    spawnEntity: function (highlightCallback, identifier, type, spawnDirection, facing) {
      var callbackCommand = new CallbackCommand(controller, highlightCallback, undefined, () => {
        controller.spawnEntity(callbackCommand, identifier, type, spawnDirection, facing);
      });
      controller.queue.addCommand(callbackCommand);
    },

    destroyEntity: function (highlightCallback, type) {
      var callbackCommand = new CallbackCommand(controller, highlightCallback, undefined, () => {
        controller.destroyEntity(callbackCommand, type);
      });
      controller.queue.addCommand(callbackCommand);
    }
  };
}
