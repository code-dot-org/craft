const AdventurerLevels = require("../../test/helpers/AdventurerLevels");
const AgentLevels = require("../../test/helpers/AgentLevels");
const DesignerLevels = require("../../test/helpers/DesignerLevels");

module.exports = Object.assign({
  default: {
    instructions: "Nighttime is boring with no zombies (sheep at this time). Get the Zombies spawning at night, and get them to chase you.",
    useAgent: true,
    
    playerStartPosition: [3, 4],
    agentStartPosition: [3, 6],

    // up: 0, right: 1, down: 2, left: 3
    playerStartDirection: 1,
    agentStartDirection: 1,

    playerName: "SteveEvents",
    isAgentLevel: true,
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
      "grass", "grass", "grass", "grass", "grass", "water", "water", "grass", "grass", "grass",
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
}, AdventurerLevels, AgentLevels, DesignerLevels);
