import CommandQueue from "../CommandQueue/CommandQueue.js";
import BaseCommand from "../CommandQueue/BaseCommand.js";
import DestroyBlockCommand from "../CommandQueue/DestroyBlockCommand.js";
import PlaceBlockCommand from "../CommandQueue/PlaceBlockCommand.js";
import MoveForwardCommand from "../CommandQueue/MoveForwardCommand.js";
import TurnCommand from "../CommandQueue/TurnCommand.js";
import WhileCommand from "../CommandQueue/WhileCommand.js";

export function get(controller) {
  return {
    /**
     * Called before a list of user commands will be issued.
     */
    startCommandCollection: function() {
      console.log("Collecting commands.");
    },

    /**
     * Called when an attempt should be started, and the entire set of
     * command-queue API calls have been issued.
     *
     * @param {Function} onAttemptComplete - callback with a single parameter,
     * "success", i.e., true if attempt was successful (level completed),
     * false if unsuccessful (level not completed).
     */
    startAttempt: function(onAttemptComplete) {
      controller.queue.begin();
    },

    resetAttempt: function() {
      controller.queue.reset();
    },

    moveForward: function(highlightCallback) {
        controller.queue.addCommand(new MoveForwardCommand(controller, highlightCallback));
    },

    turnRight: function(highlightCallback) {
        controller.queue.addCommand(new TurnCommand(controller, highlightCallback, 1));
    },

    turnLeft: function(highlightCallback) {
        controller.queue.addCommand(new TurnCommand(controller, highlightCallback, -1));
    },

    destroyBlock: function(highlightCallback) {
        controller.queue.addCommand(new DestroyBlockCommand(controller, highlightCallback));
    },

    placeBlock: function(highlightCallback, blockType) {
        controller.queue.addCommand(new PlaceBlockCommand(controller, highlightCallback, blockType));
    },

    whilePathAhead: function(highlightCallback, blockType, codeBlock) {
        controller.queue.addCommand(new WhileCommand(controller, highlightCallback, blockType, codeBlock));
    }
  }
}
