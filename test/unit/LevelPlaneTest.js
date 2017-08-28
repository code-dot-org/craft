const test = require('tape');

const LevelPlane = require('../../src/js/game/LevelMVC/LevelPlane');
const LevelBlock = require('../../src/js/game/LevelMVC/LevelBlock');

test('get blocks', t => {
  const data = [
    'grass', 'dirt', 'stone', 'sand',
    'water', 'lava', 'water', 'lava',
    'grass', 'dirt', 'stone', 'sand',
  ];
  const plane = new LevelPlane(data, 4, 3, true);

  t.equal(plane.getBlockAt([0, 0]).blockType, 'grass');
  t.equal(plane.getBlockAt([1, 1], 1).blockType, 'water');
  t.equal(plane.getBlockAt([2, 5], 0, -3).blockType, 'stone');
  t.equal(plane.getBlockAt([-1, -1], 2, 1).blockType, 'dirt');
  t.equal(plane.getBlockAt([-1, -1], undefined));
  t.equal(plane.getBlockAt([4, 1]), undefined);
  t.equal(plane.getBlockAt([2, 3]), undefined);

  t.deepEqual(plane.getOrthogonalBlocks([1, 1]), {
    north: {block: new LevelBlock('dirt'), relative: 2},
    south: {block: new LevelBlock('dirt'), relative: 1},
    east: {block: new LevelBlock('water'), relative: 8},
    west: {block: new LevelBlock('water'), relative: 4},
  });

  t.deepEqual(plane.getOrthogonalBlocks([2, 0]), {
    north: {block: undefined, relative: 2},
    south: {block: new LevelBlock('water'), relative: 1},
    east: {block: new LevelBlock('sand'), relative: 8},
    west: {block: new LevelBlock('dirt'), relative: 4},
  });

  t.deepEqual(plane.getOrthogonalBlocks([2, 3]), {
    north: {block: new LevelBlock('stone'), relative: 2},
    south: {block: undefined, relative: 1},
    east: {block: undefined, relative: 8},
    west: {block: undefined, relative: 4},
  });

  t.end();
});

test('rail connections', t => {
  const data = [
    'railsVertical', '', 'railsVertical', '', '', 'railsVertical', '',
    '', 'railsVertical', '', '', '', '', 'railsVertical',
    '', '', '', '', '', 'railsVertical', '',
    '', 'railsVertical', '', '', '', 'railsVertical', '',
    'railsVertical', '', 'railsVertical', '', 'railsVertical', '', '',
    '', '', '', '', '', 'railsVertical', '',
  ];
  const plane = new LevelPlane(data, 7, 6, true);

  t.deepEqual(plane.setBlockAt([1, 0], new LevelBlock('railsHorizontal')).blockType, 'railsTopLeft');
  t.deepEqual(plane.setBlockAt([5, 1], new LevelBlock('railsHorizontal')).blockType, 'railsTopLeft');
  t.deepEqual(plane.setBlockAt([1, 4], new LevelBlock('railsHorizontal')).blockType, 'railsBottomLeft');
  t.deepEqual(plane.setBlockAt([5, 4], new LevelBlock('railsHorizontal')).blockType, 'railsTopRight');

  const expected = data.slice();
  expected[1] = 'railsTopLeft';
  expected[2] = 'railsHorizontal';
  expected[12] = 'railsTopLeft';
  expected[13] = 'railsHorizontal';
  expected[29] = 'railsBottomLeft';
  expected[30] = 'railsHorizontal';
  expected[32] = 'railsHorizontal';
  expected[33] = 'railsTopRight';
  t.deepEqual(plane, new LevelPlane(expected, 7, 6, true));

  t.end();
});
