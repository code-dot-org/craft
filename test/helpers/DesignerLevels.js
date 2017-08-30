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
  designer06: {
    isEventLevel: true,
    groundPlane: ["dirt", "dirt", "dirtCoarse", "dirt", "gravel", "dirtCoarse", "water", "water", "dirt", "dirt", "dirt", "dirtCoarse", "dirtCoarse", "dirt", "dirt", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirt", "dirtCoarse", "dirtCoarse", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirtCoarse", "dirt", "dirtCoarse", "dirtCoarse", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirt", "dirt", "dirt", "dirt", "dirtCoarse", "dirtCoarse", "dirt", "dirt", "dirt", "dirtCoarse", "dirtCoarse", "dirt", "dirt", "dirt", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirt", "water", "water", "dirt", "dirt", "dirt", "dirtCoarse", "grass", "grass", "grass", "dirtCoarse", "water", "water", "dirt", "dirt", "dirtCoarse", "grass", "grass", "grass", "grass", "grass", "dirt", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass", "grass", "grass"],
    groundDecorationPlane: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    actionPlane: ["stone", "stone", "", "stone", "stone", "", "", "", "stone", "stone", "stone", "", "", "", "", "", "", "", "", "stone", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", "stone", "", "", "", "stone", "", "", "", "", "", "stone", "stone", "", "", "", "", "stone", "", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", "", "", "", "", "", "stone", "", "", "", "stone", "", "", "", "", "grass", "stone", "", "", "stone", "stone", "", "", "", "grass", "grass"],
    entities: [["cow", 6, 1, 1], ["cow", 1, 2, 1]],
    usePlayer: true,
    playerStartPosition: [5, 6],
    playerStartDirection: 2,
    levelVerificationTimeout: 60000,
    timeoutResult: () => false,
    verificationFunction: verificationAPI => {
      const grassPositions = [[6, 6], [7, 6], [8, 6], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7], [6, 8], [7, 8], [8, 8], [9, 8], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9]];
      let cowOnGrassCount = 0;
      for (let i = 0; i < grassPositions.length; i++) {
        if (verificationAPI.isEntityAt("cow", grassPositions[i])) {
          cowOnGrassCount++;
        }
      }
      return cowOnGrassCount >= 2;
    },
  },
};
