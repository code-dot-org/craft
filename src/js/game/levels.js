var moveForwardBlock = "moveForward();\n";
var turnLeftBlock = "turnLeft();\n";
var turnRightBlock = "turnRight();\n";
var destroyBlock = "destroyBlock();\n";
var whileBlockAhead = function (type, blockCode) {
  return "whileAhead('" + type + "', do{\n" + blockCode + "});\n"
};
var ifBlockAhead = function (type, blockCode) {
  return "ifBlockAhead('" + type + "', do{\n" + blockCode + "});\n"
};
var ifLavaAhead = function (blockCode) {
  return "ifLavaAhead(do{\n" + blockCode + "});\n"
};
var placeBlock = function (type) {
  return "placeBlock('" + type + "');\n"
};
var placeInFront = function (type) {
  return "placeInFront('" + type + "');\n"
};

window.demoLevels = {
  1: {
    instructions: "Move to the sheep [temporarily a stump]!",

    playerStartPosition: [3, 4],

    // up: 0, right: 1, down: 2, left: 3
    playerStartDirection: 1,

    playerName: "Alex",

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "lava", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "lava", "grass",
      "grass", "grass", "grass", "grass", "water", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"
    ],

    groundDecorationPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "flowerRose", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "flowerDandelion", "", "", "", "", "", "", "lavaPop", "",
      "", "", "", "", "", "", "", "", "lavaPop", "",
      "", "", "", "", "", "", "", "", "", "flowerOxeeye",
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
      return verificationAPI.isPlayerNextTo("sheep");
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
      "grass", "grass", "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass",
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
      "", "", "", "", "", "", "treeOak", "", "", "",
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
      "", "", "", "", "", "", "", "", "", "",
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
      "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass", "grass", "grass",
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
      "", "", "", "", "", "", "sheep", "", "", "",
      "", "", "", "", "sheep", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "treeOak", "",
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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
    ],

    solutionCode: turnRightBlock +
    moveForwardBlock +
    moveForwardBlock +
    destroyBlock +
    turnLeftBlock +
    moveForwardBlock +
    destroyBlock
    ,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.getInventoryAmount("wool") >= 2;
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
      "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
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
      "", "", "", "", "", "", "treeOak", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "treeOak", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "treeOak", "", "", "", "",
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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
    ],

    solutionCode: moveForwardBlock +
    moveForwardBlock +
    moveForwardBlock +
    destroyBlock +
    turnRightBlock +
    moveForwardBlock +
    moveForwardBlock +
    moveForwardBlock +
    destroyBlock +
    turnRightBlock +
    moveForwardBlock +
    moveForwardBlock +
    moveForwardBlock +
    destroyBlock
    ,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.countOfTypeOnMap("treeOak") === 0;
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
      "grass", "grass", "grass", "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass", "grass",
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
      "", "", "", "", "", "", "", "treeOak", "", "",
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
          [
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "any", "any", "any", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", ""
          ]);
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

    playerStartDirection: 1,

    specialLevelType: 'houseBuild',

    houseBottomRight: [5, 5],

    groundPlane: [
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass",
      "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "dirtCoarse", "grass", "grass", "grass",
      "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "dirtCoarse", "grass", "grass", "grass",
      "grass", "grass", "grass", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass",
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
      "", "treeOak", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "logOak", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
    ],

    solutionCode: moveForwardBlock,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.solutionMapMatchesResultMap(
          [
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "any", "any", "any", "any", "", "", "",
            "", "", "", "any", "", "", "any", "", "", "",
            "", "", "", "any", "", "", "any", "", "", "",
            "", "", "", "", "", "", "any", "", "", "",
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

    isDaytime: false,

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass",
      "grass", "grass", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass",
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
      "", "grass", "", "logOak", "door", "logOak", "", "", "", "grass",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "creeper", "", "creeper", "", "", "", "", "",
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
      "grass", "grass", "grass", "grass", "farmlandWet", "farmlandWet", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "farmlandWet", "farmlandWet", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "farmlandWet", "farmlandWet", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "farmlandWet", "farmlandWet", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "farmlandWet", "farmlandWet", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "farmlandWet", "farmlandWet", "grass", "grass", "grass", "grass",
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
    placeBlock("cropWheat") +
    moveForwardBlock +
    "}" +
    turnRightBlock +
    moveForwardBlock +
    turnRightBlock +
    "for (var i = 0; i < 6; i++) {" +
    moveForwardBlock +
    placeBlock("cropWheat") +
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
  9: {
    instructions: "Underground test!",

    playerStartPosition: [1, 5],

    playerStartDirection: 1,

    groundPlane: [
      "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "lava", "obsidian", "lava", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone"
    ],

    groundDecorationPlane: [
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", ""],

    actionPlane: [
      "stone", "", "", "", "", "", "", "stone", "stone", "stone",
      "", "", "", "", "", "", "", "", "", "stone",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "stone", "oreIron", "oreDiamond", "oreGold", "oreEmerald", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "stone", "", "", "", "", "", "", "", "", "",
      "oreCoal", "stone", "", "", "", "", "", "", "", "",
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
      "", "", "", "", "", "", "", "", "", "",
    ],

    solutionCode: "for (var i = 0; i < 6; i++) {" +
        destroyBlock + ifLavaAhead(placeInFront("stone")) + moveForwardBlock +
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
  10: {
    instructions: "Free play level. Explore!",

    playerStartPosition: [15, 15],

    playerStartDirection: 1,

    gridDimensions: [20, 39],

    groundPlane: [
      "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "lava", "obsidian", "lava", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "lava", "obsidian", "lava", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone",
      "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "lava", "obsidian", "lava", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "lava", "obsidian", "lava", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "obsidian", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "obsidian", "stone"
    ],

    groundDecorationPlane: [
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    ],

    actionPlane: [
      "stone", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "", "", "", "", "", "", "stone", "stone", "stone",
      "", "", "", "", "", "", "", "", "", "stone", "", "", "", "", "", "", "", "", "", "stone",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "stone", "planksOak", "planksOak", "planksOak", "planksOak", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "stone", "logOak", "logOak", "logOak", "logOak", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "stone", "", "", "", "", "", "", "", "", "", "stone", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "stone", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "", "", "", "", "", "", "stone", "stone", "stone",
      "", "", "", "", "", "", "", "", "", "stone", "", "", "", "", "", "", "", "", "", "stone",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "stone", "planksOak", "planksOak", "planksOak", "planksOak", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "stone", "logOak", "logOak", "logOak", "logOak", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "stone", "", "", "", "", "", "", "", "", "", "stone", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "oreCoal", "stone", "", "stone", "", "oreDiamond", "", "", "", "", "oreCoal", "stone", "", "stone", "", "oreDiamond", "", "", "", "",
    ],

    fluffPlane: [
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    ],

    solutionCode: moveForwardBlock + turnRightBlock
    + moveForwardBlock
    + moveForwardBlock
    + moveForwardBlock
    + moveForwardBlock
    + moveForwardBlock
    + moveForwardBlock

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
