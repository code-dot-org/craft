const test = require("tape");
const sinon = require("sinon");
const GameController = require("../../src/js/game/GameController");

sinon.stub(Math, "random").returns(0.5);

const defaults = {
  assetPacks: {
    beforeLoad: ['allAssetsMinusPlayer', 'playerAlex'],
    afterLoad: [],
  },
  gridDimensions: [10, 10],
  fluffPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
  playerName: 'Alex',
  verificationFunction: verificationAPI => {},
};

const levels = [{
  groundPlane: ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
  groundDecorationPlane: ["","","","","","","","","","","","","","","","","","","flowerRose","","","tallGrass","","","","","","","","tallGrass","","","tallGrass","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","tallGrass","flowerRose","","","","","","","",""],
  actionPlane: ["grass","grass","","","","","","","grass","grass","grass","grass","","","","","","","","grass","grass","","","treeOak","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","treeBirch","","",""],
  entities: [['sheep', 6, 4, 1]],
  playerStartPosition: [3, 4],
  playerStartDirection: 1,
  verificationFunction: verificationAPI =>
    verificationAPI.isPlayerNextTo("sheep"),
}, {
  groundPlane: ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
  groundDecorationPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","tallGrass","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","tallGrass","","","","","","","","",""],
  actionPlane: ["","","","","","","grass","grass","grass","grass","grass","grass","","","","","","","","","grass","grass","","","","","","","","","grass","grass","","","","","","","","","grass","grass","","","treeSpruce","","","","","","grass","","","","","","","","","","grass","","","","","","","","","","","","","","","","","","","grass","","","","","","","","","grass","grass","grass","grass","","","","","","","grass","grass"],
  playerStartPosition: [4, 7],
  playerStartDirection: 0,
  verificationFunction: verificationAPI =>
    verificationAPI.countOfTypeOnMap("treeSpruce") === 0,
}, {
  groundPlane: ["grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","dirt","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","dirt","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt"],
  groundDecorationPlane: ["","","","","","","","","","","","flowerRose","","","tallGrass","","","","","","","","","tallGrass","","","","","tallGrass","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","flowerDandelion","","","","","","","","","tallGrass","","","","tallGrass","","tallGrass","flowerRose","","","","","tallGrass",""],
  actionPlane: ["grass","grass","grass","grass","","","","","","","","","grass","grass","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","grass","","","","","","","","","","grass","","treeOak","","","","","","","","grass","","","","","","","","",""],
  entities: [["sheep", 5, 3, 3], ["sheep", 4, 5, 3]],
  playerStartPosition: [2, 3],
  playerStartDirection: 1,
  verificationFunction: verificationAPI =>
    verificationAPI.getInventoryAmount("wool") >= 2,
}, {
  groundPlane: ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
  groundDecorationPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","tallGrass","","","","","","","","","","","flowerOxeeye","","","","","","","","","flowerDandelion","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","tallGrass","","","","","","","","flowerRose","","tallGrass","tallGrass","","","","","","tallGrass","","flowerOxeeye"],
  actionPlane: ["","grass","grass","grass","grass","grass","grass","grass","grass","grass","","","","","grass","grass","grass","grass","grass","grass","","","","","","","","","","","","","","","","","treeSpruce","","","","","","treeOak","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","treeBirch","","","","","","","","","","","","","","","","","","","","","",""],
  playerStartPosition: [3, 7],
  playerStartDirection: 1,
  verificationFunction: verificationAPI =>
    verificationAPI.getInventoryAmount("planksBirch") === 1 &&
    verificationAPI.getInventoryAmount("planksSpruce") === 1 &&
    verificationAPI.getInventoryAmount("planksOak") === 1,
}, {
  groundPlane: ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirtCoarse","dirtCoarse","dirtCoarse","dirtCoarse","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
  groundDecorationPlane: ["","","","","","","flowerOxeeye","tallGrass","","","","","","","","","tallGrass","tallGrass","flowerDandelion","","","","","","","","","flowerDandelion","tallGrass","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","tallGrass","flowerDandelion","","tallGrass","","","","","","","","","tallGrass","","","","","","tallGrass","","",""],
  actionPlane: ["grass","grass","","","","","","","grass","grass","","","","","","","","","","grass","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
  playerStartPosition: [6, 6],
  playerStartDirection: 3,
  verificationFunction: verificationAPI =>
    verificationAPI.solutionMapMatchesResultMap([
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "any", "any", "any", "any", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
    ]),
}, {
  groundPlane: ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass","grass","grass","grass","grass","grass","dirtCoarse", "grass","grass","dirtCoarse", "grass","grass","grass","grass","grass","grass","dirtCoarse", "grass","grass","dirtCoarse", "grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
  groundDecorationPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","tallGrass","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","tallGrass","","","","","","","","",""],
  actionPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","planksBirch","planksBirch","planksBirch","planksBirch","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
  playerStartPosition: [3, 6],
  playerStartDirection: 0,
  verificationFunction: verificationAPI =>
    verificationAPI.solutionMapMatchesResultMap([
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "any", "any", "any", "any", "", "", "",
      "", "", "", "any", "", "", "any", "", "", "",
      "", "", "", "any", "", "", "any", "", "", "",
      "", "", "", "any", "any", "any", "any", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
    ]),
}, {
  groundPlane: ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","farmlandWet","water","farmlandWet","grass","grass","dirt","grass","grass","grass","grass","farmlandWet","water","farmlandWet","grass","dirt","grass","grass","grass","grass","grass","farmlandWet","water","farmlandWet","grass","grass","dirt","grass","grass","grass","grass","farmlandWet","water","farmlandWet","grass","grass","grass","grass","grass","grass","grass","farmlandWet","water","farmlandWet","grass","grass","grass","grass","grass","grass","grass","farmlandWet","water","farmlandWet","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
  groundDecorationPlane: ["flowerOxeeye","tallGrass","","","","tallGrass","","","flowerDandelion","tallGrass","tallGrass","tallGrass","flowerDandelion","","","","","","","flowerDandelion","","flowerDandelion","","","","","","","","","","","","","","","","","","tallGrass","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","tallGrass","flowerDandelion","","","","","","tallGrass","","","","","","","","","tallGrass","flowerDandelion","tallGrass","","","","","","","","tallGrass","tallGrass"],
  actionPlane: ["","","grass","grass","","","","","","","","","","grass","","","","","","","","","","","","","","","","","planksBirch","","","","","","","","","","planksBirch","","","","","","","","","","planksBirch","","","","","","","","","","planksBirch","","","","","","","","","","","","","","","","","","","","","","grass","","","","","","","","","","grass","grass","","","","","",""],
  entities: [["sheep", 8, 2, 3], ["sheep", 2, 6, 3]],
  playerStartPosition: [4, 7],
  playerStartDirection: 0,
  verificationFunction: verificationAPI =>
    verificationAPI.solutionMapMatchesResultMap([
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "cropWheat", "", "cropWheat", "", "", "",
      "", "", "", "", "cropWheat", "", "cropWheat", "", "", "",
      "", "", "", "", "cropWheat", "", "cropWheat", "", "", "",
      "", "", "", "", "cropWheat", "", "cropWheat", "", "", "",
      "", "", "", "", "cropWheat", "", "cropWheat", "", "", "",
      "", "", "", "", "cropWheat", "", "cropWheat", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", ""
    ]),
}, {
  isDaytime: false,
  groundPlane: ["grass","grass","grass","planksBirch","grass","grass","planksBirch","grass","grass","grass","grass","grass","grass","planksBirch","planksBirch","planksBirch","planksBirch","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
  groundDecorationPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","tallGrass","flowerDandelion","","tallGrass","","","","","","","","","tallGrass","","","","","tallGrass","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","tallGrass","","","","","","","","",""],
  actionPlane: ["","","","planksBirch","","","planksBirch","","","","","","torch","planksBirch","","planksBirch","planksBirch","","","","","","","","","","","","","","","","","","","torch","","","","","","","","","","","","","","","grass","","","","","","","","","","grass","","","","","","","","","","grass","","","","","","","","","","grass","","","","","","","","","grass","","","","","","","","grass","grass","grass"],
  entities: [["creeper", 2, 2, 2], ["creeper", 4, 3, 2], ["creeper", 3, 4, 2], ["creeper", 5, 5, 2], ["creeper", 7, 3, 2], [ "creeper", 7, 5, 2 ], [ "creeper", 6, 7, 2 ], ["creeper", 9, 4, 2]],
  playerStartPosition: [2, 6],
  playerStartDirection: 1,
  verificationFunction: verificationAPI =>
    verificationAPI.isPlayerAt([4, 1]) ||
    verificationAPI.isPlayerAt([4, 2]) ||
    verificationAPI.isPlayerAt([4, 0]) ||
    verificationAPI.isPlayerAt([5, 0]),
}, {
  isDaytime: false,
  groundPlane: ["stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone"],
  groundDecorationPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
  actionPlane: ["stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","","","oreCoal","oreCoal","oreCoal","stone","oreCoal","stone","stone","stone","","","","","","","stone","stone","stone","stone","","","","","","","oreCoal","stone","stone","stone","","stone","","","","","oreCoal","stone","stone","stone","stone","stone","oreCoal","oreCoal","","","stone","","","stone","stone","stone","stone","stone","","","stone","stone","stone","stone","stone","stone","stone","stone","","stone","stone","stone","stone","stone","stone","stone","stone","stone","","stone","stone","stone","stone"],
  playerStartPosition: [5, 6],
  playerStartDirection: 0,
  verificationFunction: verificationAPI =>
    verificationAPI.getInventoryAmount("oreCoal") >= 2 &&
    verificationAPI.countOfTypeOnMap("torch") >= 2,
}, {
  isDaytime: false,
  groundPlane: ["stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","lava","stone","stone","stone","stone","stone","lava","stone","stone","lava","lava","lava","lava","lava","lava","lava","lava","lava","lava","stone","stone","stone","stone","stone","stone","stone","lava","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone"],
  groundDecorationPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","lavaPop","","","torch","","","","","","","","","","lavaPop","","","","lavaPop","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
  actionPlane: ["stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","oreIron","oreIron","oreIron","stone","stone","stone","stone","stone","stone","stone","oreIron","oreIron","oreIron","stone","stone","stone","stone","stone","","","","","","","","","stone","","","","","","","","","","","stone","stone","stone","","","","","","stone","stone","","","","","","stone","stone","","stone","stone","stone","","","","","","","","stone","stone","stone","stone","","","","","","","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone"],
  playerStartPosition: [3, 6],
  playerStartDirection: 0,
  verificationFunction: verificationAPI =>
    verificationAPI.getInventoryAmount("oreIron") >= 2,
}, {
  isDaytime: false,
  groundPlane: ["stone","stone","stone","stone","stone","stone","stone","lava","stone","stone","stone","stone","stone","stone","stone","stone","lava","lava","stone","stone","stone","stone","stone","stone","stone","stone","lava","lava","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","lava","stone","lava","lava","stone","stone","lava","stone","stone","lava","stone","lava","stone","stone","lava","lava","stone","lava","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone"],
  groundDecorationPlane: ["","","","","","","","","","","","","","","","","","lavaPop","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","lavaPop","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
  actionPlane: ["stone","stone","stone","stone","stone","stone","stone","","stone","stone","stone","stone","","","","","","","stone","stone","stone","","","","","","","","stone","stone","stone","","","","","","","","stone","stone","stone","","stone","stone","oreCoal","oreCoal","stone","oreIron","oreIron","stone","stone","","","","","","","","","","stone","","","","","","stone","","stone","stone","stone","stone","","","stone","","","","stone","stone","stone","stone","","","stone","stone","","","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone"],
  playerStartPosition: [1, 4],
  playerStartDirection: 1,
  verificationFunction: verificationAPI =>
    verificationAPI.countOfTypeOnMap("oreIron") === 0 &&
    verificationAPI.countOfTypeOnMap("oreCoal") === 0,
}, {
  isDaytime: false,
  groundPlane: ["stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","lava","stone","lava","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","lava","stone","stone","stone","stone","lava","lava","lava","lava","stone","stone","stone","stone","stone","stone","lava","lava","lava","lava","stone","lava","stone","stone","stone","stone","lava","stone","stone","stone","lava","stone","stone","stone","stone","lava","lava","stone","stone","stone","stone","lava","stone","stone","lava","lava","stone","stone","stone","stone","stone","stone","stone","stone","lava","lava","stone","stone","stone","stone","stone","stone","stone","stone","lava","lava","stone","stone","stone","stone","stone","stone","stone","stone"],
  groundDecorationPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","lavaPop","","","","","","","","","","","","","","","","","","","","","","","","","","","lavaPop","","","","","","","","lavaPop","","","","","","","","","","","","","","","","","","","","","lavaPop","","","","","","","",""],
  actionPlane: ["stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","","stone","oreRedstone","oreDiamond","stone","oreRedstone","stone","stone","stone","","","oreRedstone","","","oreRedstone","oreRedstone","stone","stone","stone","","","","","","","oreDiamond","stone","stone","","","","","","","","stone","stone","stone","","","","","","","oreRedstone","stone","stone","stone","","","","stone","stone","stone","oreRedstone","stone","stone","stone","","","","","","","","","stone","stone","","","","","","","","","stone","stone","","","stone","stone","stone","stone","stone","stone","stone","stone"],
  playerStartPosition: [3, 5],
  playerStartDirection: 1,
  verificationFunction: verificationAPI =>
    verificationAPI.getInventoryAmount("oreRedstone") >= 3,
}, {
  specialLevelType: "minecart",
  groundPlane: ["grass","grass","planksBirch","grass","grass","planksBirch","grass","grass","grass","grass","grass","grass","planksBirch","planksBirch","planksBirch","planksBirch","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","water","dirt","water","water","grass","grass","grass","grass","grass","grass","water","dirt","water","water","water","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","dirt","dirt","dirt","dirt","dirt","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
  groundDecorationPlane: ["tallGrass","tallGrass","","","","","","tallGrass","","","","flowerOxeeye","","","","","tallGrass","","","","","","","","","","","","tallGrass","flowerDandelion","","tallGrass","","","","","","","","","tallGrass","","","","","","tallGrass","","","","","","","","","","","","","","","","tallGrass","","","tallGrass","","","","","","","","","","","","","","","","","","","","","tallGrass","","","tallGrass","","","","","","","","","tallGrass","flowerRose"],
  actionPlane: ["","","planksBirch","","","planksBirch","","","","","","","planksBirch","","planksBirch","planksBirch","","","","","","","railsRedstoneTorch","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","treeOak","","","","","","","","","","","","","","","","","","","","","","treeBirch","","","","","","","","","","","","","","","","","","",""],
  playerStartPosition: [9, 7],
  playerStartDirection: 2,
  verificationFunction: verificationAPI =>
    verificationAPI.solutionMapMatchesResultMap([
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "any", "", "", "", "", "", "",
      "", "", "", "any", "", "", "", "", "", "",
      "", "", "", "any", "", "", "", "", "", "",
      "", "", "", "any", "", "", "", "", "", "",
      "", "", "", "any", "", "", "", "", "", "",
      "", "", "", "any", "any", "any", "any", "any", "any", "any",
      "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", ""
    ]),
}, {
  specialLevelType: "freeplay",
  gridDimensions: [20, 20],
  groundPlane: ["grass","grass","grass","grass","dirt","dirt","grass","grass","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water","water","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water","grass","water","water","water","water","grass","grass","water","water","water","water","water","grass","grass","grass","grass","grass","grass","water","water","grass","grass","grass","grass","water","water","water","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","water","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","dirt","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","dirt","dirt","dirt","grass","grass","grass","grass","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","dirt","dirt","dirt","grass","dirt","grass","grass","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","dirt","dirt","dirt","grass","grass","grass","grass","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","dirt","dirt","dirt","grass","dirt","dirt","grass","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water","water","water","water","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","dirt","grass","dirt","grass","water","grass","grass","grass","water","water","water","water","water","water","water","stone","lava","lava","lava","grass","grass","grass","grass","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","lava","grass","grass","grass","grass","grass","dirt","grass","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","lava","grass","grass","grass","dirt","grass","grass","grass","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","lava","grass","grass","grass","grass","grass","grass","grass","grass","water","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","lava","grass","grass","grass"],
  groundDecorationPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
  actionPlane: ["oreLapis","oreLapis","stone","stone","stone","stone","stone","oreIron","oreIron","","oreRedstone","oreRedstone","oreRedstone","stone","","stone","stone","oreIron","oreGold","oreGold","oreLapis","oreCoal","","stone","oreIron","oreIron","","stone","","","stone","oreRedstone","stone","stone","","","","stone","stone","oreGold","oreCoal","stone","","","","","","","","","","stone","","stone","","","","","","","stone","","","","","","treeOak","","","","","","","","","","treeOak","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","treeBirch","","","","","","","","","","treeBirch","","","","","","","","","","","","","","","","treeSpruce","","","","","","","","","","treeSpruce","","","","","","","","","oreIron","","","","","","","","","","","","","","treeOak","","","","","","stone","oreIron","","","","","","","","","","","","","","","treeSpruce","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","treeOak","","","","","","treeBirch","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","treeBirch","","","","","","","","oreDiamond","","","","","","","","treeSpruce","","","","","","","","","","","oreDiamond","oreDiamond","","","","","","","","","","","","","","","","","","","oreEmerald","oreLapis"],
  fluffPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
  entities: [["sheep", 0, 18, 1], ["sheep", 1, 14, 1], ["sheep", 2, 17, 1], ["sheep", 3, 15, 1], ["sheep", 4, 18, 1]],
  playerStartPosition: [10, 10],
  playerStartDirection: 0,
  verificationFunction: verificationAPI => true,
}];

const attempt = (level, commands) => {
  const gameController = new GameController({
    Phaser: window.Phaser,
    assetRoot: '/base/src/assets/',
    audioPlayer: {
      register: () => {},
      play: () => {},
    },
    debug: false,
    customSlowMotion: 0.01,
    afterAssetsLoaded: () => {
      const api = gameController.codeOrgAPI;
      api.resetAttempt();
      commands(api).then(() => {
        // Clean up.
        gameController.game.destroy();
      });
    },
  });

  gameController.loadLevel(Object.assign({}, defaults, levels[level - 1]));
};

test('Adventurer 1: Move to Sheep (fail)', t => {
  attempt(1, api => new Promise(resolve => {
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 4]);
      t.assert(!success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 1: Move to Sheep (pass)', t => {
  attempt(1, api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [5, 4]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 2: Chop Tree', t => {
  attempt(2, api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.destroyBlock(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [4, 5]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 3: Shear Sheep', t => {
  attempt(3, api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.use(null, 'Player');
    api.turnRight(null, 'Player');
    api.moveForward(null, 'Player');
    api.use(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [4, 4]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 4: Chop Trees', t => {
  attempt(4, api => new Promise(resolve => {
    for (let i = 0; i < 3; i++) {
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.destroyBlock(null, 'Player');
      api.turnLeft(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 4]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 5: Place Wall', t => {
  attempt(5, api => new Promise(resolve => {
    for (let i = 0; i < 4; i++) {
      api.placeBlock(null, 'planksBirch', 'Player');
      api.moveForward(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [2, 6]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 6: House Frame Chosen', t => {
  attempt(6, api => new Promise(resolve => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        api.placeBlock(null, 'planksBirch', 'Player');
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [6, 6]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 7: Plant Crops (fail)', t => {
  attempt(7, api => new Promise(resolve => {
    api.turnRight(null, 'Player');
    api.moveForward(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [5, 7]);
      t.assert(levelModel.isPlayerStandingInWater());
      t.assert(!success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 7: Plant Crops (pass)', t => {
  attempt(7, api => new Promise(resolve => {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 6; j++) {
        api.placeBlock(null, 'cropWheat', 'Player');
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [4, 7]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});
test('Adventurer 8: Avoid Monsters', t => {
  attempt(8, api => new Promise(resolve => {
    for (let i = 0; i < 4; i++) {
      api.moveForward(null, 'Player');
    }
    api.turnLeft(null, 'Player');
    for (let i = 0; i < 4; i++) {
      api.moveForward(null, 'Player');
    }
    api.turnLeft(null, 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [4, 2]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 9: Mining Coal', t => {
  attempt(9, api => new Promise(resolve => {
    api.turnLeft(null, 'Player');
    for (let i = 0; i < 2; i++) {
      api.placeBlock(null, 'torch', 'Player');
      api.destroyBlock(null, 'Player');
      api.moveForward(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 6]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 10: Iron (fail)', t => {
  attempt(10, api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 4]);
      t.assert(levelModel.isPlayerStandingInLava());
      t.assert(!success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 10: Iron (pass)', t => {
  attempt(10, api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.placeInFront(null, 'cobblestone', 'Player');
    for (let i = 0; i < 3; i++) {
      api.moveForward(null, 'Player');
      api.destroyBlock(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 2]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 11: Avoiding Lava', t => {
  attempt(11, api => new Promise(resolve => {
    for (let i = 0; i < 7; i++) {
      api.destroyBlock(null, 'Player');
      api.ifBlockAhead(null, 'lava', 'Player', () => {
        api.placeInFront(null, 'cobblestone', 'Player');
      });
      api.moveForward(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [8, 4]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 12: If Statements', t => {
  attempt(12, api => new Promise(resolve => {
    for (let i = 0; i < 3; i++) {
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.destroyBlock(null, 'Player');
      api.ifBlockAhead(null, 'lava', 'Player', () => {
        api.placeInFront(null, 'cobblestone', 'Player');
      });
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 2]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 13: Powered Minecart', t => {
  attempt(13, api => new Promise(resolve => {
    for (let i = 0; i < 2; i++) {
      api.turnRight(null, 'Player');
      for (let j = 0; j < 6; j++) {
        api.placeBlock(null, 'rail', 'Player');
        api.moveForward(null, 'Player');
      }
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 1]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 14: Free Play 20x20', t => {
  attempt(14, api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.turnLeft(null, 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.placeBlock(null, 'tnt', 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [7, 9]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});
