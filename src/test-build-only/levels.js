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
      return verificationAPI.isEntityOnBlocktype('sheep','grass',2);
    },

    entities: [['sheep', 7, 8, 1]],

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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "torch", "",
      "", "", "", "", "", "", "", "", "", "",
      "dirt", "treeJungle", "", "", "", "", "", "", "", "",
      "", "", "grass", "grass", "", "", "", "", "", "",
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



    verificationFunction: function (verificationAPI) {
      return verificationAPI.getCommandExecutedCount("moveForward","sheep") >= 1 && verificationAPI.getCommandExecutedCount("turnRandom","sheep") >= 1;
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
      return verificationAPI.isEntityTypeRunning('sheep');
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
       registerEventCallback(checkTargetType('chicken') + ifEventTriggered(2,"moveForward(event.targetIdentifier);\nmoveForward(event.targetIdentifier);\nturnRight(event.targetIdentifier);\nmoveForward(event.targetIdentifier);" ))
 
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

    levelVerificationTimeout : 1000000,
    timeoutResult : true,

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

    entities: [['chicken', 3, 3, 0]],

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
      "", "", "", "dirt", "dirt", "", "", "", "", "",
      "", "", "dirt", "", "", "dirt", "", "", "", "",
      "", "", "", "dirt", "", "", "", "", "", "",
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
    registerEventCallback(checkTargetType('chicken') + ifEventTriggered(2,repeat(-1,repeatRandom("moveForward(event.targetIdentifier);\n" ) + "turnRandom(event.targetIdentifier);\n")))
    
,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.getInventoryAmount("wool") >= 2;
    }
  },

  5: {
       instructions: "Time to shear some sheep! Walk to both of the sheep and get their wool.",

    earlyLoadAssetPacks: ['allAssetsMinusPlayer', 'playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: []
    },

    entities: [['sheep', 3, 3, 0],['sheep', 4, 2, 0]],

    levelVerificationTimeout : 1000000,
    timeoutResult : true,
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
      "", "", "", "", "", "", "", "", "treeJungle", "",
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
    registerEventCallback(checkTargetType('sheep') + 
    ifEventTriggered(2,repeat(-1,repeatRandom("moveForward(event.targetIdentifier);\n" ) + "turnRandom(event.targetIdentifier);\n")) +
    ifEventTriggered(0,repeat(-1, "moveToward(event.targetIdentifier,'Player');\n")) +
    ifEventTriggered(1,"drop('wool',event.targetIdentifier);\n")
    )
    
,

    verificationFunction: function (verificationAPI) {
      return verificationAPI.getInventoryAmount("wool") >= 2;
    }
  },

  6: {
       instructions: "Nighttime is boring with no zombies (sheep at this time). Get the Zombies spawning at night, and get them to chase you.",

    playerStartPosition: [3, 4],

    // up: 0, right: 1, down: 2, left: 3
    playerStartDirection: 1,

    playerName: "Steve",
    isEventLevel: true,
    levelVerificationTimeout : 1000000,
    timeoutResult : true,

    earlyLoadAssetPacks: ['allAssetsMinusPlayer'],
    earlyLoadNiceToHaveAssetPacks: ['playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: ['playerSteve', 'playerSteve', 'grass']
    },

    entities: [],

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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
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

    solutionCode:
    "wait(5);\nstartNight();\nregisterEventCallback(function (event) \n{\n  // when night time\n  if(isEventTriggered(event,4))\n  {\n    for(var i = 2 ; i < 7 ; i++)\n     spawnEntity("+"'zombie'"+",'middle');\n  }\n  // when target type is sheep\n  if(event.targetType === 'zombie')\n  {\n    // when spawned\n    if(isEventTriggered(event,2))\n    {\n	  // repeat forever\n      repeat(function() {\n	                     // move spawned entity towards to the player\n                       moveToward(event.targetIdentifier ,'Player');\n                       } ,-1, event.targetIdentifier);\n    }\n  }\n})"
  },

  7: {
    instructions: "Nighttime is boring with no zombies (sheep at this time). Get the Zombies spawning at night, and get them to chase you.",

    playerStartPosition: [3, 4],

    // up: 0, right: 1, down: 2, left: 3
    playerStartDirection: 1,

    playerName: "Steve",
    isEventLevel: true,
    levelVerificationTimeout : 1000000,
    timeoutResult : true,

    earlyLoadAssetPacks: ['allAssetsMinusPlayer'],
    earlyLoadNiceToHaveAssetPacks: ['playerSteve'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: ['playerSteve', 'playerSteve', 'grass']
    },

    entities: [],

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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
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

    solutionCode:
    "setDayNightCycle(5,'night');\nregisterEventCallback(function (event) \n{\n  // when night time\n  if(isEventTriggered(event,4))\n  {\n    for(var i = 2 ; i < 7 ; i++)\n     spawnEntity("+"'zombie'"+",'middle');\n  }\n  // when target type is sheep\n  if(event.targetType === 'zombie')\n  {\n    // when spawned\n    if(isEventTriggered(event,2))\n    {\n	  // repeat forever\n      repeat(function() {\n	                     // move spawned entity towards to the player\n                       moveToward(event.targetIdentifier ,'Player');\n                       } ,-1, event.targetIdentifier);\n    }\n  }\n})"
  
  },

  8: {
       instructions: "Nighttime is boring with no zombies (sheep at this time). Get the Zombies spawning at night, and get them to chase you.",

    playerStartPosition: [3, 4],

    // up: 0, right: 1, down: 2, left: 3
    playerStartDirection: 1,

    playerName: "Steve",
    isEventLevel: true,

    earlyLoadAssetPacks: ['allAssetsMinusPlayer'],
    earlyLoadNiceToHaveAssetPacks: ['playerSteve'],
    levelVerificationTimeout : 1000000,

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteve'],
      afterLoad: ['playerSteve', 'playerSteve', 'grass']
    },

    entities: [['zombie', 8, 8, 0],['cow', 3, 3, 0]],

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
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
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

    solutionCode:
    registerEventCallback(checkTargetType('zombie') + 
    ifEventTriggered(2,repeat(-1,"moveToward(event.targetIdentifier, 'cow');\nattack(event.targetIdentifier);\n"))) +
    registerEventCallback(checkTargetType('cow') + 
    ifEventTriggered(0,"moveToward(event.targetIdentifier, 'Player');\n") + 
    ifEventTriggered(1,"drop('milk',event.targetIdentifier);\n") + 
    ifEventTriggered(3,"moveAway(event.targetIdentifier, 'zombie');\nmoveAway(event.targetIdentifier, 'zombie');\nmoveAway(event.targetIdentifier, 'zombie');\n"))
  
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
    isEventLevel: true,
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
};
