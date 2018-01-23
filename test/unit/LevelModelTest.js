const test = require('tape');

const LevelModel = require('../../src/js/game/LevelMVC/LevelModel');
const LevelEntity = require('../../src/js/game/LevelMVC/LevelEntity');
const Position = require('../../src/js/game/LevelMVC/Position');


const makePlane = (n, type) => new Array(n).fill(type);
const makeLevelDefinition = (width, height) => {
  let size = width * height;
  return {
    playerStartPosition: new Position(0, 2),
    playerStartDirection: 1,
    agentStartPosition: new Position(0, 1),
    agentStartDirection: 1,
    playerName: 'Alex',
    groundPlane: makePlane(size, 'grass'),
    groundDecorationPlane: makePlane(size, ''),
    actionPlane: makePlane(size, ''),
    fluffPlane: makePlane(size, ''),
    gridDimensions: [width, height],
  };
};

const mockGameController = {
  levelEntity: new LevelEntity({}),
  getIsDirectPlayerControl: () => false,
  levelData: {},
};

test('sanity', t => {
  const levelDefinition = makeLevelDefinition(5, 5);
  const model = new LevelModel(levelDefinition, mockGameController);

  model.placeBlock("grass");
  t.true(model.actionPlane.getBlockAt([0,2]).blockType === "grass");
  model.placeBlock("gravel");
  t.true(model.actionPlane.getBlockAt([0,2]).blockType === "gravel");
  model.placeBlock("ice");
  t.false(model.actionPlane.getBlockAt([0,2]).blockType === "grass");

  t.equal(model.planeArea(), 25);

  t.assert(model.inBounds(new Position(2, 4)));
  t.false(model.inBounds(new Position(-1, 1)));
  t.false(model.inBounds(new Position(5, 3)));
  t.false(model.inBounds(new Position(3, 5)));

  t.equal(model.yToIndex(2), 10);

  t.assert(model.isPlayerAt(new Position(0, 2)));

  t.end();
});

test('place block: entity conflict', t => {
  const levelDefinition = makeLevelDefinition(5, 5);
  const model = new LevelModel(levelDefinition, mockGameController);

  // player at 0,2 should cause conflict
  t.true(model.checkEntityConflict(new Position(0, 2)));
  t.false(model.checkEntityConflict(new Position(0, 3)));

  t.end();
});

test('place block: block conflict', t => {
  const levelDefinition = makeLevelDefinition(5, 5);
  const model = new LevelModel(levelDefinition, mockGameController);

  model.placeBlock("grass");
  model.player.position = new Position(0, 0);

  // player at 0,0 so only the grass block is left to cause conflict
  t.true(model.checkEntityConflict(new Position(0, 2)));
  t.false(model.checkEntityConflict(new Position(0, 3)));

  t.end();
});
