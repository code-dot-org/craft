const GameController = require("../../src/js/game/GameController");
const AdventurerLevels = require("./AdventurerLevels");

const levels = Object.assign({}, AdventurerLevels);

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

module.exports = (level, commands) => {
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

  gameController.loadLevel(Object.assign({}, defaults, levels[level]));
};
