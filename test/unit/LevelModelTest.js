const test = require('tap').test;

const LevelModel = require('../../src/js/game/LevelMVC/LevelModel');
const LevelEntity = require('../../src/js/game/LevelMVC/LevelEntity');

const makePlane = (n, type) => new Array(n).fill(type);
const makeLevelDefinition = (width, height) => {
  let size = width * height;
  return {
    playerStartPosition: [0, 2],
    playerStartDirection: 1,
    playerName: 'Alex',
    groundPlane: makePlane(size, 'grass'),
    groundDecorationPlane: makePlane(size, ''),
    actionPlane: makePlane(size, ''),
    fluffPlane: makePlane(size, ''),
    gridDimensions: [width, height],
    verificationFunction: function (verificationAPI) {
    }
  };
};

const mockGameController = {
  levelEntity: new LevelEntity({}),
  levelData: {},
};

test('sanity', t => {
  const levelDefinition = makeLevelDefinition(10, 10);
  const model = new LevelModel(levelDefinition, mockGameController);

  t.equal(model.planeArea(), 100);
  t.done();
});
