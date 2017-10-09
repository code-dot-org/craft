module.exports = {
  agent01: {
    specialLevelType: 'agentSpawn',
    isAgentLevel: true,
    groundPlane: ["grass", "grass", "grass", "oreDiamond", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirt", "dirt", "dirt", "grass", "grass", "dirt", "grass", "grass", "dirt", "dirt", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "grass", "wool", "dirt", "wool_orange", "dirt", "dirt", "grass", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "bricks", "dirt", "dirt", "wool", "dirt", "dirt", "bricks", "bricks", "grass", "bricks", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirtCoarse", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "dirtCoarse", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"],
    groundDecorationPlane: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "tallGrass", "", "", "", "", "", "", "tallGrass", "", "tallGrass", "", "", "", "", "", "", "", "", "", "tallGrass", "tallGrass", "", "", "", "", "", "", "", "", "tallGrass", "", "", "", "", "", "", "", "", "", "", "tallGrass", "flowerRose", "flowerDandelion", "", "flowerDandelion", "flowerDandelion", "tallGrass", "", "", "tallGrass", "", "", "", "", "", "", "", "", "", "", "tallGrass", "", "", "", "", "", "", "", "", "", "tallGrass", "tallGrass", "", "", "", "", "", "tallGrass", "", "tallGrass"],
    actionPlane: ["", "", "", "diamondMiniblock", "", "", "", "", "", "", "", "planksSpruce", "planksSpruce", "glass", "planksSpruce", "planksSpruce", "", "", "treeSpruce", "", "", "planksSpruce", "", "", "", "planksSpruce", "", "", "", "", "", "glass", "", "torch", "", "glass", "", "", "", "", "", "planksSpruce", "", "pressurePlateUp", "", "planksSpruce", "", "", "", "", "bricks", "planksSpruce", "planksSpruce", "doorIron", "planksSpruce", "planksSpruce", "bricks", "bricks", "", "bricks", "", "", "", "pressurePlateUp", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    usingAgent: false,
    playerStartPosition: [8, 8],
    agentStartPosition: [1, 1],
    playerStartDirection: 2,
    agentStartDirection: 0,
    verificationFunction: verificationAPI => verificationAPI.isPlayerAt([3, 3]),
  },
};
