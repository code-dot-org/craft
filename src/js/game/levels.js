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
      "", "", "", "treeOak", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "sheep", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "treeOak", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "treeOak", "", "", ""
    ],

    fluffPlane: [
      "", "", "", "", "", "", "", "", "", "",
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
      return verificationAPI.isPlayerNextTo("logOak");
    },

    solutionCode: moveForwardBlock +
    moveForwardBlock

  },

  2: {
    instructions: "We're gonna need some wood. Move me to the tree and let’s chop it down.",

    playerStartPosition: [6, 7],

    playerStartDirection: 1,

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "coarseDirt", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "coarseDirt", "grass", "grass", "grass",
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

    solutionCode: turnLeftBlock +
    moveForwardBlock +
    moveForwardBlock +
    destroyBlock
    ,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.countOfTypeOnMap("logOak") === 0;
    }
  },

  3: {
    instructions: "Time to shear some sheep! Walk to both of the sheep and get their wool.",

    playerStartPosition: [4, 3],

    playerStartDirection: 1,

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "coarseDirt", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "coarseDirt", "grass", "grass", "grass", "grass", "grass",
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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "logOak", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "logOak", "",
      "", "", "", "", "", "", "", "", "", "",
    ],

    fluffPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "leavesOak", "",
      "", "", "", "", "", "", "", "", "", "",
    ],

    solutionCode: turnRightBlock +
    moveForwardBlock +
    moveForwardBlock +
    destroyBlock
    ,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.countOfTypeOnMap("logOak") === 0;
    }
  },

  4: {
    instructions: "Now I need to start chopping trees! Chop at least 3 Trees out of the 4. Nightfall is coming, so hurry up!",

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
      "", "logOak", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "logOak", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
    ],

    fluffPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "leavesOak", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "leavesOak", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "leavesOak", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
    ],

    solutionCode: moveForwardBlock +
    moveForwardBlock +
    moveForwardBlock +
    turnRightBlock +
    moveForwardBlock +
    moveForwardBlock +
    moveForwardBlock +
    turnRightBlock +
    moveForwardBlock +
    moveForwardBlock +
    moveForwardBlock
    ,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.countOfTypeOnMap("logOak") === 0;
    }
  },

  5: {
    instructions: "Make one wall of your house by placing three blocks.",

    playerStartPosition: [5, 6],

    playerStartDirection: 3,

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "coarseDirt", "coarseDirt", "coarseDirt", "grass", "grass", "grass", "grass",
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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", ""
    ],

    fluffPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "leavesOak", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "leavesOak", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", ""
    ],

    verificationFunction: function (verificationAPI) {
      return (verificationAPI.countOfTypeOnMap("logOak") == 3 );
    },

    solutionCode: placeBlock('logOak') +
    moveForwardBlock +
    placeBlock('logOak') +
    moveForwardBlock +
    placeBlock('logOak')
  },

  6: {
    instructions: "Let's make our own house! This spot looks good. Build a frame on the dirt blocks.",

    playerStartPosition: [3, 6],

    playerStartDirection: 0,

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
      "", "", "", "logOak", "logOak", "logOak", "", "", "", "",
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

    solutionCode: moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      turnRightBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      turnRightBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak") +
      moveForwardBlock +
      placeBlock("logOak"),

    verificationFunction: function (verificationAPI) {
      return verificationAPI.solutionMapMatchesResultMap(
          [
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "logOak", "logOak", "logOak", "logOak", "", "", "",
            "", "", "", "logOak", "", "", "logOak", "", "", "",
            "", "", "", "logOak", "", "", "logOak", "", "", "",
            "", "", "", "", "", "", "logOak", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", ""
          ]);
    }
  },

  7: {
    instructions: "During the night monsters appear! These monsters explode when you get near them. Avoid the monsters and reach your house in the least possible number of commands.",

    playerStartPosition: [2, 7],

    // up: 0, right: 1, down: 2, left: 3
    playerStartDirection: 1,

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "coarseDirt", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "coarseDirt", "coarseDirt", "coarseDirt", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "coarseDirt", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "coarseDirt", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "coarseDirt", "grass", "grass", "grass",
      "grass", "grass", "coarseDirt", "coarseDirt", "coarseDirt", "coarseDirt", "coarseDirt", "grass", "grass", "grass",
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
      "", "grass", "", "logOak", "logOak", "logOak", "", "", "", "grass",
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
      return verificationAPI.isPlayerNextTo("logOak");
    },

    solutionCode: "for (var i = 0; i < 4; i++) {" +
    moveForwardBlock +
    "}" +
    turnLeftBlock +
    "for (var i = 0; i < 4; i++) {" +
    moveForwardBlock +
    "}" +
    turnLeftBlock +
    moveForwardBlock +
    moveForwardBlock +
    turnRightBlock +
    moveForwardBlock
  },

  8: {
    instructions: "All this running around has made you hungry! Grow some food! Code is great for doing repetitive tasks quickly. Let’s plant some crops by making a 4x3 block field.",

    playerStartPosition: [4, 7],

    playerStartDirection: 0,

    groundPlane: [
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "coarseDirt", "coarseDirt", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "coarseDirt", "coarseDirt", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "coarseDirt", "coarseDirt", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "coarseDirt", "coarseDirt", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "coarseDirt", "coarseDirt", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "coarseDirt", "coarseDirt", "grass", "grass", "grass", "grass",
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
      "logOak", "", "", "", "", "", "", "", "", "",
      "logOak", "", "", "", "", "", "", "", "", "",
      "logOak", "", "", "", "", "", "", "", "", "",
      "logOak", "", "", "", "", "", "", "", "", "",
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

    solutionCode: "for (var i = 0; i < 6; i++) {" +
    moveForwardBlock +
    "}" +
    turnRightBlock +
    moveForwardBlock +
    turnRightBlock +
    "for (var i = 0; i < 6; i++) {" +
    moveForwardBlock +
    "}"

      ,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.solutionMapMatchesResultMap(
          [
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "logOak", "logOak", "logOak", "logOak", "", "", "",
            "", "", "", "logOak", "", "", "logOak", "", "", "",
            "", "", "", "logOak", "", "", "logOak", "", "", "",
            "", "", "", "", "", "", "logOak", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", ""
          ]);
    }
  },

};

export default demoLevels;
