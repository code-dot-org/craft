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
      controller.queue.addCommand(new MoveForwardCommand(self, function() {
        console.log("highlight move forward command.");
      }));
    },

    turnRight: function(highlightCallback) {
      controller.queue.addCommand(new TurnCommand(self, function() {
        console.log("highlight turn right command.");
      }, 'right'));
    },

    turnLeft: function(highlightCallback) {
      controller.queue.addCommand(new TurnCommand(self, function() {
        console.log("highlight turn left command.");
      }, 'left'));
    },

    destroyBlock: function(highlightCallback) {
      controller.queue.addCommand(new DestroyBlockCommand(self, function() {
        console.log("highlight destroy block command.");
      }));
    },

    placeBlock: function(highlightCallback, blockType) {
      controller.queue.addCommand(new BaseCommand(self, function() {
        console.log("highlight placeBlock command.");
      }));
    },

    whilePathAhead: function(highlightCallback, blockType, callback) {
      controller.queue.addCommand(new BaseCommand(self, function() {
        console.log("highlight repeat while path ahead command.");
      }));
    }
  }
}
