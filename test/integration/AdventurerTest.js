const test = require("tape");
const GameController = require("../../src/js/game/GameController");

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
  groundPlane: ["stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone"],
  groundDecorationPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
  actionPlane: ["stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","stone","","","oreCoal","oreCoal","oreCoal","stone","oreCoal","stone","stone","stone","","","","","","","stone","stone","stone","stone","","","","","","","oreCoal","stone","stone","stone","","stone","","","","","oreCoal","stone","stone","stone","stone","stone","oreCoal","oreCoal","","","stone","","","stone","stone","stone","stone","stone","","","stone","stone","stone","stone","stone","stone","stone","stone","","stone","stone","stone","stone","stone","stone","stone","stone","stone","","stone","stone","stone","stone"],
  playerStartPosition: [5, 6],
  playerStartDirection: 0,
  verificationFunction: verificationAPI =>
    verificationAPI.getInventoryAmount("oreCoal") >= 2 &&
    verificationAPI.countOfTypeOnMap("torch") >= 2,
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
