const test = require('tape');

const AdjacencySet = require("../../src/js/game/LevelMVC/AdjacencySet");

test('AdjacencySets', t => {
  // Separate positions each end up in their own set
  t.deepEqual(new AdjacencySet([
    [0, 0], [1, 1]
  ]).sets, [
    [[0, 0]],
    [[1, 1]],
  ]);

  // Adjacent positions end up in a set all together
  t.deepEqual(new AdjacencySet([
    [0, 0], [1, 1], [1, 0]
  ]).sets, [
    [[0, 0], [1, 1], [1, 0]]
  ]);

  // Can handle combinations
  t.deepEqual(new AdjacencySet([
    [0, 0], [1, 1], [1, 0], [2, 2], [2, 3], [0, 2]
  ]).sets, [
    [[0, 0], [1, 1], [1, 0]],
    [[2, 2], [2, 3]],
    [[0, 2]]
  ]);

  t.end();
});

test('AdjacencySets - custom comparison function', t => {
  // can override the comparison function
  const sameColumn = (left, right) => {
    return left[0] === right[0];
  };

  t.deepEqual(new AdjacencySet([
    [0, 0], [0, 2]
  ], sameColumn).sets, [
    [[0, 0], [0, 2]],
  ]);

  t.deepEqual(new AdjacencySet([
    [0, 0], [1, 0]
  ], sameColumn).sets, [
    [[0, 0]],
    [[1, 0]],
  ]);

  t.end();
});

test('addAdjacency', t => {
  const set = new AdjacencySet();
  set.add([0, 0]);
  t.deepEqual(set.sets, [[[0, 0]]]);
  set.add([1, 1]);
  t.deepEqual(set.sets, [[[0, 0]], [[1, 1]]]);
  set.add([0, 1]);
  t.deepEqual(set.sets, [[[0, 0], [1, 1], [0, 1]]]);
  t.end();
});
