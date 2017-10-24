const test = require('tape');

const Position = require("../../src/js/game/LevelMVC/Position");

test('isAdjacent', t => {
  t.true(Position.isAdjacent([0, 0], [0, 1]));
  t.true(Position.isAdjacent([0, 0], [1, 0]));
  t.true(Position.isAdjacent([0, 0], [0, -1]));
  t.true(Position.isAdjacent([0, 0], [-1, 0]));

  t.false(Position.isAdjacent([0, 0], [-1, -1]));
  t.false(Position.isAdjacent([0, 0], [1, 1]));

  t.end();
});

test('getOrthogonalPositions', t => {
  t.deepEqual(Position.getOrthogonalPositions([0, 0]), [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
  ]);

  t.end();
});

