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
    useAgent: true,
    
    playerStartPosition: [3, 4],
    agentStartPosition: [3, 6],

    // up: 0, right: 1, down: 2, left: 3
    playerStartDirection: 1,
    agentStartDirection: 1,

    playerName: "SteveEvents",
    isEventLevel: true,
    earlyLoadAssetPacks: ['allAssetsMinusPlayer'],
    earlyLoadNiceToHaveAssetPacks: ['playerSteveEvents', 'playerAgent'],

    assetPacks: {
      beforeLoad: ['allAssetsMinusPlayer', 'playerSteveEvents', 'playerAgent'],
      afterLoad: [],
    },

    levelVerificationTimeout : -1,
    timeoutResult : function(verificationAPI) {
      return false;
    },

    groundPlane: [
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
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
      "", "", "pressurePlateUp", "redstoneWire", "grass", "doorIron", "glass", "redstoneWire", "pressurePlateUp", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "pistonRight", "grass", "grass", "redstoneWire", "grass", "", "", "", "",
      "", "redstoneWire", "", "", "", "", "", "", "", "",
      "", "redstoneWire", "", "", "", "", "", "", "", "",
      "", "redstoneWire", "", "", "", "", "", "", "", "",
      "", "redstoneWire", "", "", "", "", "", "", "", "",
      "", "pressurePlateUp", "", "", "", "", "", "", "", "",
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
