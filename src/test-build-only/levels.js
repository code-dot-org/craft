var moveForwardBlock = "moveForward();\n";
var moveForwardFunction = function (type) { return "moveForward('" + type + "');\n" };
var turnLeftBlock = "turnLeft();\n";
var turnRightBlock = "turnRight();\n";
var destroyBlock = "destroyBlock();\n";
var registerEventCallback = function (functionImplementation) { return "registerEventCallback(function (event) {\n" + functionImplementation + "\n})\n" };
var checkTargetType = function (type) { return "if(event.targetType !== '"+ type +"')\n return false;\n" };
var ifEventTriggered = function(eventType, functionImplementation) { return "if(isEventTriggered(event,"+eventType+")){\n" + functionImplementation + "\n}" };
var repeat = function(iterationTime, functionImplementation) { return "repeat(function() {\n" + functionImplementation +"\n},"+iterationTime+", event.targetIdentifier);\n"  };
var repeatRandom = function(functionImplementation) {return "repeatRandom(function() {\n" + functionImplementation +"\n}, event.targetIdentifier);\n"  };
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
    instructions: "Nighttime is boring with no zombies (sheep at this time). Get the Zombies spawning at night, and get them to chase you.",

    playerStartPosition: [3, 4],

    // up: 0, right: 1, down: 2, left: 3
    playerStartDirection: 1,

    playerName: "Steve",
    isEventLevel: true,
    earlyLoadAssetPacks: ['allAssetsMinusPlayer'],
    earlyLoadNiceToHaveAssetPacks: ['playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: ['playerSteve', 'playerSteve', 'grass']
    },

    levelVerificationTimeout : -1,
    timeoutResult : function(verificationAPI) {
      return false;
    },

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "water", "lava", "water", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "water", "lava", "water", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "water", "lava", "water", "grass", "grass", "grass", "grass"
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

    actionPlane: ["", "", "", "", "railsRedstoneTorch", "", "", "", "grass", "grass",
      "", "grass", "", "", "redstoneWire", "", "", "", "", "grass",
      "", "", "", "", "redstoneWire", "", "", "", "", "",
      "", "", "", "", "redstoneWire", "", "", "", "", "",
      "", "", "", "", "", "redstoneWire", "", "", "", "",
      "dirt", "treeJungle", "", "", "", "", "", "", "", "",
      "", "", "grass", "door", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "treeAcacia", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", ""
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

    failureCheckFunction: function (verificationAPI) {
      return false;
    },

    verificationFunction: function (verificationAPI) {
      return false;
    },

    solutionCode:
    "\nregisterEventCallback(function (event) {\n// when target type is sheep\nif(event.targetType !=="+"'sheep'"+")\nreturn;\n// when used\nif(isEventTriggered(event,1)){\n// it drops wool\ndrop('wool', event.targetIdentifier);\n}\n})"
  },

  
  2: {
  instructions: "Time to shear some sheep! Walk to both of the sheep and get their wool.",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    entities: [['chicken', 3, 3, 0]],

    levelVerificationTimeout : -1,
    timeoutResult : function(verificationAPI) {
      return !verificationAPI.isEntityTypeRunning('chicken');
    },

    playerStartPosition: [4, 3],

    playerStartDirection: 1,

    groundPlane: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "lava", "grass", "water", "grass", "grass", "grass",
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
    isEventLevel: true,

    solutionCode:
       registerEventCallback(ifEventTriggered(8,repeat(-1, "drop('wool', event.targetIdentifier);")))
 
,

    verificationFunction: function (verificationAPI) {
      return false;
    }
  },

  3: {
    instructions: "Time to shear some sheep! Walk to both of the sheep and get their wool.",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    entities: [['chicken', 3, 3, 0]],

    levelVerificationTimeout : 1000,
    timeoutResult : () =>{return false;},
    usePlayer: false,

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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
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
    registerEventCallback(checkTargetType('chicken') + ifEventTriggered(2,repeat(-1,"moveForward(event.targetIdentifier);\nmoveForward(event.targetIdentifier);\nturnRight(event.targetIdentifier);\nmoveForward(event.targetIdentifier);" ) ))
    
,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.getInventoryAmount("wool") >= 2;
    }
  },

  4: {
      instructions: "Time to shear some sheep! Walk to both of the sheep and get their wool.",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    entities: [['chicken', 3, 3, 0],['sheep', 2, 3, 0],['ironGolem', 3, 2, 0]],

    levelVerificationTimeout : 1000000,
    timeoutResult : true,

    playerStartPosition: [6, 3],

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
      "", "", "", "", "", "", "", "", "", "",
    ],

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
      "", "", "", "", "", "", "", "", "", "",
    ],

    failureCheckFunction: function (verificationAPI) {
      return false;
    },

    verificationFunction: function (verificationAPI) {
      return false;
    },
  },
};
