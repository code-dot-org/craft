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
    north: new LevelBlock('dirt'),
    south: new LevelBlock('dirt'),
    east: new LevelBlock('water'),
    west: new LevelBlock('water'),
  });

  t.deepEqual(plane.getOrthogonalBlocks([2, 0]), {
    north: undefined,
    south: new LevelBlock('water'),
    east: new LevelBlock('sand'),
    west: new LevelBlock('dirt'),
  });

  t.deepEqual(plane.getOrthogonalBlocks([2, 3]), {
    north: new LevelBlock('stone'),
    south: undefined,
    east: undefined,
    west: undefined,
  });

  t.end();
});

//   0 1 2 3 4 5
// 0 *   ┌───┐
// 1   ┌─┤   │
// 2 ──┼─┴──   │
// 3   │     ──┘
test('redstone wires', t => {
  const data = new Array(24).fill('');
  const plane = new LevelPlane(data, 6, 4, null, true);

  plane.setBlockAt([0, 0], new LevelBlock('redstoneWire'));
  plane.setBlockAt([2, 0], new LevelBlock('redstoneWire'));
  plane.setBlockAt([3, 0], new LevelBlock('redstoneWire'));
  plane.setBlockAt([4, 0], new LevelBlock('redstoneWire'));
  plane.setBlockAt([1, 1], new LevelBlock('redstoneWire'));
  plane.setBlockAt([2, 1], new LevelBlock('redstoneWire'));
  plane.setBlockAt([4, 1], new LevelBlock('redstoneWire'));
  plane.setBlockAt([0, 2], new LevelBlock('redstoneWire'));
  plane.setBlockAt([1, 2], new LevelBlock('redstoneWire'));
  plane.setBlockAt([2, 2], new LevelBlock('redstoneWire'));
  plane.setBlockAt([3, 2], new LevelBlock('redstoneWire'));
  plane.setBlockAt([5, 2], new LevelBlock('redstoneWire'));
  plane.setBlockAt([1, 3], new LevelBlock('redstoneWire'));
  plane.setBlockAt([4, 3], new LevelBlock('redstoneWire'));
  plane.setBlockAt([5, 3], new LevelBlock('redstoneWire'));

  const expected = [
    '',          null,        'DownRight','Horizontal','DownLeft',  null,
    null,        'DownRight', 'TLeft',    null,        'Vertical',  null,
    'Horizontal','Cross',     'TUp',      'Horizontal',null,        'Vertical',
    null,        'Vertical',  null,       null,        'Horizontal','UpLeft',
  ].map(wire => wire === null ? '' : `redstoneWire${wire}`);
  expected.width = undefined;
  expected.height = undefined;
  expected.levelModel = null;

  t.deepEqual(plane.map(block => block.blockType), expected);

  t.end();
});

test('rail connections', t => {
  const data = [
    'railsVertical', '', 'railsVertical', '', '', 'railsVertical', '',
    '', 'railsVertical', '', '', '', '', 'railsVertical',
    '', '', '', '', '', 'railsVertical', '',
    '', 'railsVertical', '', '', 'railsVertical', '', '',
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
  expected[12] = 'railsTopLeft';
  expected[29] = 'railsBottomLeft';
  expected[33] = 'railsTopRight';
  t.deepEqual(plane, new LevelPlane(expected, 7, 6, true));

  t.end();
});
