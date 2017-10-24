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

test('adjacencySets', t => {
  // Separate positions each end up in their own set
  t.deepEqual(Position.adjacencySets([
    [0, 0], [1, 1]
  ]), [
    [[0, 0]],
    [[1, 1]],
  ]);

  // Adjacent positions end up in a set all together
  t.deepEqual(Position.adjacencySets([
    [0, 0], [1, 1], [1, 0]
  ]), [
    [[0, 0], [1, 1], [1, 0]]
  ]);

  // Can handle combinations
  t.deepEqual(Position.adjacencySets([
    [0, 0], [1, 1], [1, 0], [2, 2], [2, 3], [0, 2]
  ]), [
    [[0, 0], [1, 1], [1, 0]],
    [[2, 2], [2, 3]],
    [[0, 2]]
  ]);

  t.end();
});

test('adjacencySets - custom comparison function', t => {
  // can override the comparison function

  const sameColumn = (left, right) => {
    return left[0] === right[0];
  };

  t.deepEqual(Position.adjacencySets([
    [0, 0], [0, 2]
  ], sameColumn), [
    [[0, 0], [0, 2]],
  ]);

  t.deepEqual(Position.adjacencySets([
    [0, 0], [1, 0]
  ], sameColumn), [
    [[0, 0]],
    [[1, 0]],
  ]);

  t.end();
});
