var moveForwardBlock = "moveForward();\n";
var turnLeftBlock = "turnLeft();\n";
var turnRightBlock = "turnRight();\n";
var destroyBlock = "destroyBlock();\n";
var whileBlockAhead = function (type, blockCode) {
  return "whileAhead('" + type + "', do{\n" + blockCode + "});\n"
};
var placeBlock = function (type) {
  return "placeBlock('" + type + "');\n"
};

window.demoLevels = {
  1: {
    instructions: "Move to the sheep [temporarily a stump]!",

    playerStartPosition: [3, 4],

    // up: 0, right: 1, down: 2, left: 3
    playerStartDirection: 1,

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "coarseDirt", "coarseDirt", "coarseDirt", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"
    ],

    groundDecorationPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "tallGrass", "", "", "", "", "", "", "", "", ""],

    actionPlane: ["grass", "grass", "", "", "", "", "", "", "grass", "grass",
      "", "grass", "", "", "", "", "", "", "", "grass",
      "", "", "", "logOak", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "logOak", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "logOak", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "logOak", "", "", ""
    ],

    fluffPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "leavesOak", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "leavesOak", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "leavesOak", "", "", ""
    ],

    verificationFunction: function (verificationAPI) {
      return verificationAPI.isPlayerNextTo("logOak");
    },

    solutionCode: moveForwardBlock +
    moveForwardBlock +
    moveForwardBlock +
    moveForwardBlock

  },

  2: {
    instructions: "We're gonna need some wood. Move me to the tree and let’s chop it down.",

    playerStartPosition: [2, 4],

    playerStartDirection: 1,

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "coarseDirt", "coarseDirt", "coarseDirt", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"
    ],

    groundDecorationPlane: [
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "tallGrass", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "tallGrass", "", "", "", "", "", "", "", "", ""],

    actionPlane: [
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "logOak", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
    ],

    fluffPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "leavesOak", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
    ],

    solutionCode: moveForwardBlock +
    moveForwardBlock +
    moveForwardBlock +
    destroyBlock
    ,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.countOfTypeOnMap("logOak") === 0;
    }
  },

  3: {
    instructions: "We're gonna need more wood. Look, more trees! Chop down at least 3 more trees.",

    playerStartPosition: [2, 4],

    playerStartDirection: 1,

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "coarseDirt", "coarseDirt", "coarseDirt", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"
    ],

    groundDecorationPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "tallGrass", "", "", "", "", "", "", "", "", ""],

    actionPlane: ["grass", "grass", "", "", "", "", "", "", "grass", "grass",
      "", "grass", "", "", "", "", "", "", "", "grass",
      "", "", "", "logOak", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "logOak", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "logOak", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "logOak", "", "", ""
    ],

    fluffPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "leavesOak", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "leavesOak", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "leavesOak", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "leavesOak", "", "", ""
    ],

    verificationFunction: function (verificationAPI) {
      return (verificationAPI.countOfTypeOnMap("logOak") <= 1 );
    },

    solutionCode: whileBlockAhead("", moveForwardBlock) +
    destroyBlock +
    turnRightBlock +
    whileBlockAhead("", moveForwardBlock) +
    destroyBlock +
    turnRightBlock +
    whileBlockAhead("", moveForwardBlock) +
    destroyBlock +
    turnRightBlock
  },
  4: {
    instructions: "Make one wall of your house by placing three blocks.",

    playerStartPosition: [3, 5],

    playerStartDirection: 1,

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "coarseDirt", "coarseDirt", "coarseDirt", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"
    ],

    groundDecorationPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "tallGrass", "", "", "", "", "", "", "", "", ""],

    actionPlane: ["grass", "grass", "", "", "", "", "", "", "grass", "grass",
      "", "grass", "", "", "", "", "", "", "", "grass",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", ""
    ],

    fluffPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", ""
    ],

    verificationFunction: function (verificationAPI) {
      return verificationAPI.solutionMapMatchesResultMap(
          ["", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "logOak", "logOak", "logOak", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", ""]
      );
    },

    solutionCode: placeBlock("logOak") + moveForwardBlock + placeBlock("logOak") + moveForwardBlock + placeBlock("logOak")
  },
  5: {
    instructions: "Let's make our own house! This spot looks good. Build a frame on the dirt blocks.",

    playerStartPosition: [3, 6],

    playerStartDirection: 1,

    groundPlane: [
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "coarseDirt", "coarseDirt", "coarseDirt", "coarseDirt", "grass", "grass", "grass",
      "grass", "grass", "grass", "coarseDirt", "grass", "grass", "coarseDirt", "grass", "grass", "grass",
      "grass", "grass", "grass", "coarseDirt", "grass", "grass", "coarseDirt", "grass", "grass", "grass",
      "grass", "grass", "grass", "coarseDirt", "coarseDirt", "coarseDirt", "coarseDirt", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"
    ],

    groundDecorationPlane: [
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "tallGrass", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "tallGrass", "", "", "", "", "", "", "", "", ""],

    actionPlane: [
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "logOak", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
    ],

    fluffPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "leavesOak", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
    ],

    solutionCode: placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      turnLeftBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      turnLeftBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      turnLeftBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.solutionMapMatchesResultMap(
          [
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "logOak", "logOak", "logOak", "logOak", "", "", "",
            "", "", "", "logOak", "", "", "logOak", "", "", "",
            "", "", "", "logOak", "", "", "logOak", "", "", "",
            "", "", "", "logOak", "logOak", "logOak", "logOak", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", ""
          ]);
    }
  }

};

export default demoLevels;
