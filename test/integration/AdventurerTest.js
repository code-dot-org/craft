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
    customSlowMotion: 0.1,
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
      t.false(success);
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
