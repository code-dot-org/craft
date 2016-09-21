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
var onBlockTouched = function (type, blockCode) {
  return "onBlockTouched('" + type + "', do{\n" + blockCode + "});\n"
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

    earlyLoadAssetPacks: ['levelOneAssets'],
    earlyLoadNiceToHaveAssetPacks: ['playerAlex'],

    assetPacks: {
      beforeLoad: ['levelOneAssets', 'playerAlex'],
      afterLoad: ['playerSteve', 'playerAlex', 'grass']
    },

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"
    ],

    groundDecorationPlane: ["", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "flowerRose", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "flowerDandelion", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "flowerOxeeye",
      "", "", "", "", "", "", "", "", "", "",
      "tallGrass", "", "", "", "", "", "", "", "", ""],

    actionPlane: ["grass", "grass", "", "", "", "", "", "", "grass", "grass",
      "", "grass", "", "", "", "", "", "", "", "grass",
      "", "", "", "treeOak", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "sheep", "", "", "",
      "", "", "", "logOak", "logOak", "logOak", "", "", "", "",
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

    earlyLoadAssetPacks: ['levelTwoAssets', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['levelTwoAssets', 'playerSteve'],
      afterLoad: ['levelThreeAssets']
    },

    playerStartPosition: [6, 7],

    playerStartDirection: 2,

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
      "", "", "", "", "", "", "treeSpruce", "", "", "",
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

    solutionCode: turnLeftBlock + turnLeftBlock + moveForwardBlock + moveForwardBlock + destroyBlock,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.countOfTypeOnMap("logOak") === 0;
    }
  },

  3: {
    instructions: "Time to shear some sheep! Walk to both of the sheep and get their wool.",

    earlyLoadAssetPacks: ['levelThreeAssets', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['levelThreeAssets', 'playerSteve'],
      afterLoad: []
    },

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
      "", "", "", "", "", "dirt", "", "", "", "",
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

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

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

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

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

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

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
      "grass", "grass", "grass", "dirtCoarse", "wool_orange", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass",
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
      "", "treeOak", "cropWheat", "", "", "", "", "", "", "",
      "", "", "", "logOak", "logOak", "logOak", "logOak", "", "", "",
      "", "", "", "logOak", "", "", "logOak", "", "", "",
      "", "", "", "logOak", "", "", "logOak", "", "", "",
      "", "", "", "logOak", "logOak", "logOak", "logOak", "", "", "",
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

    solutionCode: 'turnLeft(); moveForward(); moveForward();moveForward();moveForward(); ' +
    'turnRight();moveForward();moveForward();moveForward();moveForward();turnRight();moveForward();' +
    'moveForward();moveForward();turnRight();placeBlock("logOak"); moveForward();moveForward();moveForward();' +
    ' placeBlock("logOak"); moveForward();moveForward();moveForward(); turnRight();' ,

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

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    playerStartPosition: [2, 7],

    // up: 0, right: 1, down: 2, left: 3
    playerStartDirection: 1,

    isDaytime: false,

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "dirtCoarse", "bricks", "dirtCoarse", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "cobblestone", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "stone", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "farmlandWet", "grass", "grass", "grass",
      "grass", "grass", "dirtCoarse", "oreIron", "oreDiamond", "gravel", "logOak", "grass", "grass", "grass",
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

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

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

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    playerStartPosition: [1, 5],

    playerStartDirection: 1,

    groundPlane: [
      "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "lava", "cobblestone", "lava", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone"
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
    "}",

    verificationFunction: function (verificationAPI) {
      return true;
    }
  },
  10: {
    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },
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
    groundPlane: ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "lava", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "lava", "lava", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "lava", "lava", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "lava", "stone", "lava", "lava", "stone", "stone", "lava", "stone", "stone", "lava", "stone", "lava", "stone", "stone", "lava", "lava", "stone", "lava", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"],
    groundDecorationPlane: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "lavaPop", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "lavaPop", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    actionPlane: ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "", "stone", "stone", "stone", "stone", "", "", "", "", "", "", "stone", "stone", "stone", "", "", "", "", "", "", "", "stone", "stone", "stone", "", "", "", "", "", "", "", "stone", "stone", "stone", "", "stone", "stone", "oreCoal", "oreCoal", "stone", "oreIron", "oreIron", "stone", "stone", "", "", "", "", "", "", "", "", "", "stone", "", "", "", "", "", "stone", "", "stone", "stone", "stone", "stone", "", "", "stone", "", "", "", "stone", "stone", "stone", "stone", "", "", "stone", "stone", "", "", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"],
    playerStartPosition: [1, 4],
    playerStartDirection: 1,
    isDaytime: false,
    verificationFunction: function (verificationAPI) {
      return true;
    }
  },
  11: {
    instructions: "Free play level. Explore!",

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    playerStartPosition: [15, 15],

    playerStartDirection: 1,

    gridDimensions: [20, 39],

    specialLevelType: 'freeplay',

    groundPlane: [
      "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "lava", "cobblestone", "lava", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "lava", "cobblestone", "lava", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone",
      "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "lava", "cobblestone", "lava", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "lava", "cobblestone", "lava", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "cobblestone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "cobblestone", "stone"
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
      "", "", "", "", "", "", "", "", "", "", "", "", "", "tnt", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "stone", "planksOak", "planksOak", "planksOak", "planksOak", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "tnt", "", "",
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
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "cropWheat", "sheep", "grass",
      "stone", "", "", "", "", "", "", "stone", "tnt", "stone", "stone", "", "", "", "", "", "torch", "stone", "tnt", "torch",
      "", "", "", "", "", "", "", "", "", "stone", "", "", "", "", "", "", "", "", "", "stone",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "stone", "tnt", "planksOak", "tnt", "planksOak", "", "",
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

    solutionCode:
    "for (var i = 0; i < 2; i++) {"
    + "for (var j = 0; j < 10; j++) {"
    + moveForwardBlock
    + "}"
    + turnRightBlock
    + "}"

      ,

    verificationFunction: function (verificationAPI) {
      return true;
    }
  },
  12: {
    instructions: "My cool event level!",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    playerStartPosition: [1, 5],

    playerStartDirection: 1,

    isEventLevel: true,

    groundPlane: [
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "lava", "stone", "lava", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"
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

    solutionCode: `
registerEventCallback(function (event) {
  if (event.eventType !== 'blockTouched') {
    return;
  }
  if (event.blockType !== 'stone') {
    return;
  }

  playSound("fizz");
  destroyEntity(event.blockReference);
})
`,

    verificationFunction: function (verificationAPI) {
      return true;
    }
  },
  13: {
    instructions: "My cool event level Part Deux!",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    playerStartPosition: [1, 5],

    playerStartDirection: 1,

    isEventLevel: true,

    groundPlane: [
      "lava", "lava", "lava", "lava", "stone", "stone", "lava", "lava", "lava", "lava",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "water", "water", "water", "water", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"
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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "stone", "", "oreDiamond", "oreGold", "oreEmerald", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "sheep", "", "", "", "", "",
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

    solutionCode: `
registerEventCallback(function (event) {
  if (event.eventType !== 'blockTouched') {
    return;
  }

  moveEntityAwayFromPlayer(event.blockReference);
})
`,

    verificationFunction: function (verificationAPI) {
      return true;
    }
  },
  14: {
    instructions: "Uh oh, they're coming for Steve.",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    playerStartPosition: [1, 5],

    playerStartDirection: 1,

    isEventLevel: true,

    groundPlane: [
      "lava", "lava", "lava", "lava", "stone", "stone", "lava", "lava", "lava", "lava",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "water", "water", "water", "water", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"
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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "stone", "", "oreDiamond", "oreGold", "oreEmerald", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "sheep", "", "", "", "", "",
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

    solutionCode: `
registerEventCallback(function (event) {
  if (event.eventType !== 'playerMoved') {
    return;
  }
  moveEntityTowardPlayer(event.blockReference);
})
`,

    verificationFunction: function (verificationAPI) {
      return true;
    }
  },
  15: {
    instructions: "Set those blocks!.",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    playerStartPosition: [1, 5],

    playerStartDirection: 1,

    isEventLevel: true,

    groundPlane: [
      "lava", "lava", "lava", "lava", "stone", "stone", "lava", "lava", "lava", "lava",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "water", "water", "water", "water", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"
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
      "", "", "", "", "", "", "", "", "", "",
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

    solutionCode: `
for(var i = 0; i < 5; i++) {
  for (var j = 0; j < 5; j++) {
    setBlockAt(i, j, 'logOak');
  }
}
for(var i = 5; i < 10; i++) {
  for (var j = 5; j < 10; j++) {
    setBlockAt(i, j, 'oreDiamond');
  }
}
registerEventCallback(function (event) {
  if (event.eventType !== 'blockTouched') {
    return;
  }
  if (event.blockType !== 'logOak') {
    return;
  }

  playSound("explode");
  destroyEntity(event.blockReference);
});

registerEventCallback(function (event) {
  if (event.eventType !== 'playerMoved') {
    return;
  }
  if (event.blockType !== 'oreDiamond') {
    return;
  }

  moveEntityTowardPlayer(event.blockReference);
});

`,

    verificationFunction: function (verificationAPI) {
      return true;
    }
  },
  16: {
    instructions: "Set those blocks relatively..",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    playerStartPosition: [1, 5],

    playerStartDirection: 1,

    isEventLevel: true,

    groundPlane: [
      "lava", "lava", "lava", "lava", "stone", "stone", "lava", "lava", "lava", "lava",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "water", "water", "water", "water", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"
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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "logOak", "", "", "", "", "", "", "",
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

    solutionCode: `

registerEventCallback(function (event) {
  if (event.eventType !== 'blockTouched') {
    return;
  }
  if (event.blockType !== 'logOak') {
    return;
  }

  moveEntityAwayFromPlayer(event.blockReference);
  setEntityNorth(event.blockReference, 'logOak')
  setEntitySouth(event.blockReference, 'logOak')
  setEntityEast(event.blockReference, 'logOak')
  setEntityWest(event.blockReference, 'logOak')
});

registerEventCallback(function (event) {
  if (event.eventType !== 'playerMoved') {
    return;
  }
  if (event.blockType !== 'oreDiamond') {
    return;
  }

  moveEntityTowardPlayer(event.blockReference);
});

`,

    verificationFunction: function (verificationAPI) {
      return true;
    }
  },
  17: {
    instructions: "Set those blocks relatively..",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    playerStartPosition: [1, 5],

    playerStartDirection: 1,

    isEventLevel: true,

    groundPlane: [
      "lava", "lava", "lava", "lava", "stone", "stone", "lava", "lava", "lava", "lava",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "water", "water", "water", "water", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"
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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "logOak", "", "", "", "", "", "", "",
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

    solutionCode: `
setBlockAt(1, 4, 'oreDiamond');
registerEventCallback(function (event) {
  if (event.eventType !== 'blockTouched') {
    return;
  }
  if (event.blockType !== 'logOak') {
    return;
  }

  moveEntityAwayFromPlayer(event.blockReference);
  setEntityAhead(event.blockReference, 'oreIron')
  setEntityBehind(event.blockReference, 'oreDiamond')
});

registerEventCallback(function (event) {
  if (event.eventType !== 'blockTouched') {
    return;
  }
  if (event.blockType !== 'oreDiamond') {
    return;
  }

  moveEntityAwayFromPlayer(event.blockReference);
  setEntityNorth(event.blockReference, 'oreIron')
  setEntityWest(event.blockReference, 'treeOak')
});

registerEventCallback(function (event) {
  if (event.eventType !== 'playerMoved') {
    return;
  }
  //moveEntityTowardPlayer(event.blockReference);
});

`,

    verificationFunction: function (verificationAPI) {
      return true;
    }
  },
  18: {
    instructions: "On block spawned...",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    playerStartPosition: [1, 5],

    playerStartDirection: 1,

    isEventLevel: true,

    groundPlane: [
      "lava", "lava", "lava", "lava", "stone", "stone", "lava", "lava", "lava", "lava",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "water", "water", "water", "water", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"
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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "oreDiamond", "", "", "", "", "", "", "", "",
      "", "", "logOak", "", "", "", "", "", "", "",
      "", "sheep", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "logOak", "", "", "", "",
      "", "", "", "", "", "logOak", "", "", "", "",
      "", "", "", "", "", "logOak", "", "", "", "",
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

    solutionCode: `
//setBlockAt(1, 4, 'oreDiamond');
registerEventCallback(function (event) {
  if (event.eventType !== 'blockTouched') {
    return;
  }
  if (event.blockType !== 'logOak') {
    return;
  }
  turnEntityAwayPlayer(event.blockReference)
  setEntityAhead(event.blockReference, 'logOak')
  destroyEntity(event.blockReference);
});

registerEventCallback(function (event) {
  if (event.eventType !== 'entitySpawned') {
    return;
  }
  if (event.blockType !== 'logOak') {
    return;
  }

  //explodeEntity(event.blockReference);
  turnEntityAwayPlayer(event.blockReference)
  setEntityAhead(event.blockReference, 'logOak')
  destroyEntity(event.blockReference);
  //waitFor(200);
});

registerEventCallback(function (event) {
  if (event.eventType !== 'blockTouched') {
    return;
  }
  if (event.blockType !== 'sheep') {
    return;
  }

  turnEntityAwayPlayer(event.blockReference)
});

registerEventCallback(function (event) {
  if (event.eventType !== 'blockTouched') {
    return;
  }
  if (event.blockType !== 'oreDiamond') {
    return;
  }
  destroyEntityBehind(event.blockReference);
  waitFor(200);
  setEntityBehind(event.blockReference, 'oreDiamond')
});

registerEventCallback(function (event) {
  if (event.eventType !== 'entitySpawned') {
    return;
  }
  if (event.blockType !== 'oreDiamond') {
    return;
  }

  destroyEntityBehind(event.blockReference);
  waitFor(200);
  explodeEntity(event.blockReference);
  setEntityBehind(event.blockReference, 'oreDiamond')
});

`,

    verificationFunction: function (verificationAPI) {
      return true;
    }
  },
  19: {
    instructions: "Let's make a snake...",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    playerStartPosition: [1, 5],

    playerStartDirection: 1,

    isEventLevel: true,

    groundPlane: [
      "lava", "lava", "lava", "lava", "stone", "stone", "lava", "lava", "lava", "lava",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "water", "water", "water", "water", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"
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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "logOak", "", "", "", "", "", "", "",
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

    solutionCode: `
//setBlockAt(1, 4, 'oreDiamond');
registerEventCallback(function (event) {
  if (event.eventType !== 'everySecond') {
    return;
  }
  if (event.blockType !== 'logOak') {
    return;
  }
  moveEntityAwayFromPlayer(event.blockReference);
  setEntityBehind(event.blockReference, 'oreDiamond')
  //waitFor(250);
});
`,

    verificationFunction: function (verificationAPI) {
      return true;
    }
  },
  20: {
    instructions: "Let's repeat forever",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    playerStartPosition: [1, 5],

    playerStartDirection: 1,

    isEventLevel: true,

    groundPlane: [
      "lava", "lava", "lava", "lava", "stone", "stone", "lava", "lava", "lava", "lava",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "water", "water", "water", "water", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone",
      "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"
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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "logOak", "", "", "", "", "", "", "",
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

    solutionCode: `

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

forever(function() {
  setBlockAt(getRandomInt(0,10), getRandomInt(0,10), 'logOak');
  waitFor(250);
});
`,

    verificationFunction: function (verificationAPI) {
      return true;
    }
  }
};
