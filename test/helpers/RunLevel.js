const sinon = require("sinon");
const GameController = require("../../src/js/game/GameController");
const AdventurerLevels = require("./AdventurerLevels");
const DesignerLevels = require("./DesignerLevels");

sinon.stub(Math, "random").returns(0.5);

const levels = Object.assign({}, AdventurerLevels, DesignerLevels);

const defaults = {
  assetPacks: {
    beforeLoad: ['allAssetsMinusPlayer', 'playerAlex'],
    afterLoad: [],
  },
  gridDimensions: [10, 10],
  fluffPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
  playerName: 'Alex',
  playerStartPosition: [],
};

module.exports = (level, commands, step = 0.1) => {
  const gameController = new GameController({
    forceSetTimeOut: true,
    Phaser: window.Phaser,
    assetRoot: '/base/src/assets/',
    audioPlayer: {
      register: () => {},
      play: () => {},
    },
    debug: false,
    customSlowMotion: step,
    afterAssetsLoaded: () => {
      const api = gameController.codeOrgAPI;
      api.resetAttempt();
      commands(api).then(() => {
        // Clean up.
        gameController.game.destroy();
        gameController.game.time = {};
      });
    },
  });

  gameController.loadLevel(Object.assign({}, defaults, levels[level]));
};
