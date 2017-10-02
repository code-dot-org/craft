const test = require('tape');
const {JSDOM} = require('jsdom');
global.window = new JSDOM().window;
global.navigator = window.navigator;
global.document = window.document;
global.Element = window.Element;
global.Canvas = require('canvas');
global.Image = global.Canvas.Image;
window.CanvasRenderingContext2D = {};
window.focus = () => {};
window.scrollTo = () => {};
global.Phaser = {};
global.PIXI = require('../../node_modules/phaser/build/pixi');
global.p2 = require('../../node_modules/phaser/build/p2');
global.Phaser = require('phaser');
global.Phaser.AnimationManager.prototype.play = () => {};

const LevelView = require('../../src/js/game/LevelMVC/LevelView');
const LevelModel = require('../../src/js/game/LevelMVC/LevelModel');
const LevelEntity = require('../../src/js/game/LevelMVC/LevelEntity');

const mockGameController = {
  levelEntity: new LevelEntity({}),
  levelData: {},
  followingPlayer: () => false,
  originalFpsToScaled: () => 60,
  getIsDirectPlayerControl: () => true,
};

const levelData = {
  assetPacks: {
    beforeLoad: ['allAssetsMinusPlayer', 'playerAlex'],
    afterLoad: [],
  },
  gridDimensions: [10, 10],
  fluffPlane: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
  playerName: 'Alex',
  verificationFunction: () => {},
  groundPlane: ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","dirt","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
  groundDecorationPlane: ["","","","","","","","","","","","","","","","","","","flowerRose","","","tallGrass","","","","","","","","tallGrass","","","tallGrass","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","tallGrass","flowerRose","","","","","","","",""],
  actionPlane: ["grass","grass","","","","","","","grass","grass","grass","grass","","","","","","","","grass","grass","","","treeOak","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","treeBirch","","",""],
  entities: [['sheep', 6, 4, 1]],
  playerStartPosition: [3, 4],
  playerStartDirection: 1,
};

const levelModel = new LevelModel(levelData, mockGameController);

test('sanity', t => {
  const game = new global.Phaser.Game({
    width: 400,
    height: 400,
    renderer: global.Phaser.HEADLESS,
    state: 'earlyLoad',
  });
  game.state.add('levelRunner', {
    create: () => {
      mockGameController.game = game;
      mockGameController.levelModel = levelModel;
      const view = new LevelView(mockGameController);
      view.create(levelModel);

      t.equal(view.player.sprite.position.x, 102);
      t.equal(view.player.sprite.position.y, 128);

      setTimeout(() => game.destroy(), 0);
      t.end();
    }
  });

  game.state.start('levelRunner');
});
