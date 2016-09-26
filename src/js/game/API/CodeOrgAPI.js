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
import RepeatCommand from "../CommandQueue/RepeatCommand.js";

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

    moveRandom: function (highlightCallback, targetEntity) {
      var getRandomInt = function (min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      var randomDirection = getRandomInt(0,3);
      const myQueueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.moveDirection(myQueueItem, randomDirection);
      }, targetEntity);
      controller.addCommand(myQueueItem);
    },

    moveDirection: function (highlightCallback, direction, targetEntity) {
      const myQueueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.moveDirection(myQueueItem, direction);
      }, targetEntity);
      controller.addCommand(myQueueItem);
    },

    moveAway: function (highlightCallback, targetEntity, moveAwayFrom) {
      const myQueueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.moveAway(myQueueItem, moveAwayFrom);
      }, targetEntity);
      controller.addCommand(myQueueItem);
    },

    moveToward: function (highlightCallback,targetEntity, moveTowardTo) {
      const myQueueItem = new CallbackCommand(controller, highlightCallback, targetEntity, () => {
        controller.moveToward(myQueueItem, moveTowardTo);
      }, targetEntity);
      controller.addCommand(myQueueItem);
    },

    flashEntity: function (highlightCallback, targetEntity) {
      const myQueueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.flashEntity(myQueueItem);
      }, targetEntity);
      controller.addCommand(myQueueItem);
    },

    playSound: function (highlightCallback, sound) {
      const myQueueItem = new CallbackCommand(controller, highlightCallback, () => {
        controller.playSound(myQueueItem, sound);
      });
      controller.addCommand(myQueueItem);
    },

    turn: function (highlightCallback, direction, targetEntity) {
      controller.addCommand(new TurnCommand(controller, highlightCallback, direction === 'right' ? 1 : -1, targetEntity));
    },

    turnRandom: function(highlightCallback, targetEntity) {
      if(Math.random()  > 0.5)
        controller.addCommand(new TurnCommand(controller, highlightCallback, 1, targetEntity));
      else
        controller.addCommand(new TurnCommand(controller, highlightCallback, -1, targetEntity));
    },

    turnRight: function (highlightCallback, targetEntity) {
      controller.addCommand(new TurnCommand(controller, highlightCallback, 1, targetEntity));
    },

    turnLeft: function (highlightCallback, targetEntity) {
      controller.addCommand(new TurnCommand(controller, highlightCallback, -1, targetEntity));
    },

    destroyBlock: function (highlightCallback, targetEntity) {
      controller.addCommand(new DestroyBlockCommand(controller, highlightCallback, targetEntity));
    },

    placeBlock: function (highlightCallback, blockType) {
      controller.addCommand(new PlaceBlockCommand(controller, highlightCallback, blockType));
    },

    placeInFront: function (highlightCallback, blockType) {
      controller.addCommand(new PlaceInFrontCommand(controller, highlightCallback, blockType));
    },

    tillSoil: function (highlightCallback) {
      controller.addCommand(new PlaceInFrontCommand(controller, highlightCallback, 'watering'));
    },

    whilePathAhead: function (highlightCallback, blockType, codeBlock) {
      controller.addCommand(new WhileCommand(controller, highlightCallback, blockType, codeBlock));
    },

    ifBlockAhead: function (highlightCallback, blockType, codeBlock) {
      controller.addCommand(new IfBlockAheadCommand(controller, highlightCallback, blockType, codeBlock));
    },
    // -1 for infinite repeat
    repeat: function(highlightCallback, codeBlock, targetEntity, iteration) {
      controller.addCommand(new RepeatCommand(controller, highlightCallback, codeBlock, targetEntity, iteration));
    },

    getScreenshot: function () {
      return controller.getScreenshot();
    },

    spawnEntity: function (highlightCallback, identifier, type, spawnDirection, facing) {
      var callbackCommand = new CallbackCommand(controller, highlightCallback, () => {
        controller.spawnEntity(callbackCommand, identifier, type, spawnDirection, facing);
      });
      controller.addCommand(callbackCommand);
    },

    destroyEntity: function (highlightCallback, identifier) {
      var callbackCommand = new CallbackCommand(controller, highlightCallback, () => {
        controller.destroyEntity(callbackCommand, identifier);
      });
      controller.addCommand(callbackCommand);
    },

    startDay: function (highlightCallback) {
      var callbackCommand = new CallbackCommand(controller, highlightCallback, () => {
        controller.startDay(callbackCommand);
      });
      controller.addCommand(callbackCommand);
    },

    startNight: function (highlightCallback) {
      var callbackCommand = new CallbackCommand(controller, highlightCallback, () => {
        controller.startNight(callbackCommand);
      });
      controller.addCommand(callbackCommand);
    },

    wait: function (highlightCallback, time) {
      var callbackCommand = new CallbackCommand(controller, highlightCallback, () => {
        setTimeout(() =>{ callbackCommand.succeeded() }, time*1000);
      });
      controller.addCommand(callbackCommand);
    }
  };
}
