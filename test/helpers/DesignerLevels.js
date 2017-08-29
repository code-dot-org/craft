const baseGroundPlane = ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "dirtCoarse", "dirt", "dirtCoarse", "dirt", "grass", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "grass", "grass", "grass", "dirtCoarse", "dirt", "dirtCoarse", "dirtCoarse", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "grass", "grass", "dirtCoarse", "dirtCoarse", "dirt", "dirtCoarse", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt"];
const baseDecorationPlane = ["", "", "tallGrass", "", "", "", "", "", "", "", "", "tallGrass", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "tallGrass", "", "", "", "", "", "", "", "", "", "", "tallGrass", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "flowerDandelion", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "tallGrass", "", "", "", "", "tallGrass", ""];
const baseActionPlane = ["grass", "grass", "", "", "", "", "", "", "grass", "grass", "grass", "", "", "", "", "", "", "grass", "grass", "grass", "", "", "", "", "", "", "", "", "", "grass", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass", "", "", "", "", "", "", "", "", "", "grass", "grass", "grass", "", "", "", "", "", "", "grass"];

const houseGroundPlane = ["grass", "grass", "grass", "planksOak", "planksOak", "planksOak", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "planksOak", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "grass", "grass", "grass", "grass", "grass"];
const houseDecorationPlane = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "tallGrass", "", "", "", "", "flowerOxeeye", "flowerOxeeye", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "flowerDandelion", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "flowerOxeeye", "flowerOxeeye"];
const houseActionPlane = ["grass", "grass", "bricks", "", "", "", "bricks", "grass", "grass", "grass", "grass", "", "bricks", "bricks", "door", "bricks", "bricks", "", "grass", "grass", "", "", "", "", "", "", "", "", "", "grass", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "treeSpruce", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass", "", "", "", "", "", "", "treeSpruce", "", "", "grass", "grass", "grass", "", "", "", "", "", "", ""];

const fourChickens = [["chicken", 3, 3, 1], ["chicken", 6, 3, 1], ["chicken", 3, 6, 1], ["chicken", 6, 6, 1]];

module.exports = {
  designer01: {
    isEventLevel: true,
    groundPlane: baseGroundPlane,
    groundDecorationPlane: baseDecorationPlane,
    actionPlane: baseActionPlane,
    entities: [["chicken", 4, 4, 1]],
    usePlayer: false,
    levelVerificationTimeout: 5000,
    timeoutResult: verificationAPI => (
      verificationAPI.getCommandExecutedCount("moveForward") >= 1 &&
      verificationAPI.getCommandExecutedCount("turn") >= 1
    ),
    verificationFunction: verificationAPI => (
      !verificationAPI.isEntityTypeRunning("chicken") &&
      verificationAPI.getCommandExecutedCount("moveForward") >= 1 &&
      verificationAPI.getCommandExecutedCount("turn") >= 1
    ),
  },
  designer02: {
    isEventLevel: true,
    groundPlane: baseGroundPlane,
    groundDecorationPlane: baseDecorationPlane,
    actionPlane: baseActionPlane,
    entities: fourChickens,
    usePlayer: false,
    levelVerificationTimeout: 5000,
    timeoutResult: verificationAPI => (
      verificationAPI.getRepeatCommandExecutedCount("moveForward") > 0
    ),
    verificationFunction: () => false,
  },
  designer03: {
    isEventLevel: true,
    groundPlane: baseGroundPlane,
    groundDecorationPlane: baseDecorationPlane,
    actionPlane: baseActionPlane,
    entities: fourChickens,
    usePlayer: false,
    levelVerificationTimeout: 7000,
    timeoutResult: verificationAPI => (
      verificationAPI.getCommandExecutedCount("turnRandom") >= 1 ||
      verificationAPI.getRepeatCommandExecutedCount("turnRandom") >= 1
    ),
    verificationFunction: () => false,
  },
  designer04: {
    isEventLevel: true,
    groundPlane: houseGroundPlane,
    groundDecorationPlane: houseDecorationPlane,
    actionPlane: houseActionPlane,
    usePlayer: true,
    playerStartPosition: [4, 7],
    playerStartDirection: 0,
    levelVerificationTimeout: 20000,
    timeoutResult: () => false,
    verificationFunction: verificationAPI => (
      verificationAPI.isEntityOnBlocktype("Player", "planksOak")
    ),
  },
  designer05: {
    isEventLevel: true,
    groundPlane: houseGroundPlane,
    groundDecorationPlane: houseDecorationPlane,
    actionPlane: houseActionPlane,
    entities: [["sheep", 6, 3, 1]],
    usePlayer: true,
    playerStartPosition: [4, 7],
    playerStartDirection: 0,
    levelVerificationTimeout: 20000,
    timeoutResult: () => false,
    verificationFunction: verificationAPI => (
      verificationAPI.getInventoryAmount("all") >= 1
    ),
  },
};
