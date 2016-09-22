var moveForwardBlock = "moveForward();\n";
var moveForwardFunction = function (type) { return "moveForward('" + type + "');\n"};
var createEntityBlock = function ( type, identifier, x, y, direction) { return "createEntity('" + type + "','" + identifier + "'," + x +"," + y + "," + direction + ");\n"};
var turnLeftBlock = "turnLeft();\n";
var turnRightBlock = "turnRight();\n";
var destroyBlock = "destroyBlock();\n";
var registerEventCallback = function(functionImplementation) { return "registerEventCallback(function (event) {\n" + functionImplementation + "\n})\n" };
var isEntityTouch = function(entity1, entity2) { return "isEntityTouch(event,'"+entity1+"','"+entity2 +"')"};
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
    isEventLevel: true,

    earlyLoadAssetPacks: ['levelOneAssets'],
    earlyLoadNiceToHaveAssetPacks: ['playerAlex'],

    assetPacks: {
      beforeLoad: ['levelOneAssets', 'playerAlex'],
      afterLoad: ['playerSteve', 'playerAlex', 'grass']
    },

    entities: [['sheep',3,3,1]],

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

    solutionCode: createEntityBlock("sheep",5,4,0) + 
    moveForwardBlock + moveForwardBlock

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
    isEventLevel: true,

    solutionCode: 
    "createEntity('sheep','a',2,2,1);\ncreateEntity('sheep','b',4,2,1);\ncreateEntity('sheep','c',6,2,1);\nregisterEventCallback(function (event) {\nif(isEventTriggered(event,0)){\nmoveAway(event.targetIdentifier, event.eventSenderIdentifier);\n}\n})"
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
  }
};
