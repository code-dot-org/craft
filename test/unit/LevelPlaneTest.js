const test = require('tape');

const LevelPlane = require('../../src/js/game/LevelMVC/LevelPlane');
const LevelBlock = require('../../src/js/game/LevelMVC/LevelBlock');
const FacingDirection = require('../../src/js/game/LevelMVC/FacingDirection');

test('get blocks', t => {
  const data = [
    'grass', 'dirt', 'stone', 'sand',
    'water', 'lava', 'water', 'lava',
    'grass', 'dirt', 'stone', 'sand',
  ];
  const plane = new LevelPlane(data, 4, 3, true, null, "actionPlane");

  t.equal(plane.getBlockAt([0, 0]).blockType, 'grass');
  t.equal(plane.getBlockAt([1, 1], 1).blockType, 'water');
  t.equal(plane.getBlockAt([2, 5], 0, -3).blockType, 'stone');
  t.equal(plane.getBlockAt([-1, -1], 2, 1).blockType, 'dirt');
  t.equal(plane.getBlockAt([-1, -1], undefined));
  t.equal(plane.getBlockAt([4, 1]), undefined);
  t.equal(plane.getBlockAt([2, 3]), undefined);

  t.deepEqual(plane.getOrthogonalBlocks([1, 1]), {
    north: {block: new LevelBlock('dirt'), relative: FacingDirection.South},
    south: {block: new LevelBlock('dirt'), relative: FacingDirection.North},
    east: {block: new LevelBlock('water'), relative: FacingDirection.West},
    west: {block: new LevelBlock('water'), relative: FacingDirection.East},
  });

  t.deepEqual(plane.getOrthogonalBlocks([2, 0]), {
    north: {block: undefined, relative: FacingDirection.South},
    south: {block: new LevelBlock('water'), relative: FacingDirection.North},
    east: {block: new LevelBlock('sand'), relative: FacingDirection.West},
    west: {block: new LevelBlock('dirt'), relative: FacingDirection.East},
  });

  t.deepEqual(plane.getOrthogonalBlocks([2, 3]), {
    north: {block: new LevelBlock('stone'), relative: FacingDirection.South},
    south: {block: undefined, relative: FacingDirection.North},
    east: {block: undefined, relative: FacingDirection.West},
    west: {block: undefined, relative: FacingDirection.East},
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
  const plane = new LevelPlane(data, 6, 4, true, null, "actionPlane");

  // Place the test pattern.
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

  let expected = [
    '',          null,        'DownRight', 'Horizontal','DownLeft',  null,
    null,        'DownRight', 'TLeft',     null,        'Vertical',  null,
    'Horizontal','Cross',     'TUp',       'Horizontal',null,        'Vertical',
    null,        'Vertical',  null,        null,        'Horizontal','UpLeft',
  ].map(wire => wire === null ? '' : `redstoneWire${wire}`);

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  // Destroy a few wires.
  plane.setBlockAt([2, 1], new LevelBlock(''));
  plane.setBlockAt([3, 0], new LevelBlock(''));
  plane.setBlockAt([0, 2], new LevelBlock(''));
  plane.setBlockAt([5, 3], new LevelBlock(''));

  expected = [
    '',          null,        '',          null,        'Vertical',   null,
    null,        'Vertical',  null,        null,        'Vertical',   null,
    null,        'TRight',    'Horizontal','Horizontal',null,         '',
    null,        'Vertical',  null,        null,        '',           null,
  ].map(wire => wire === null ? '' : `redstoneWire${wire}`);

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

// Before:              After:
// ║   ║     ║          ║ ╔══     ║
//   ║         ║          ║       ╔══
//           ║                    ║
//   ║       ║            ║       ║
// ║   ║   ║            ║ ╚══   ══╗
//           ║                    ║
//
test('rail connections: T-junctions', t => {
  const data = [
    'rails',  '',       'rails',  '',       '',       'rails',  '',
    '',       'rails',  '',       '',       '',       '',       'rails',
    '',       '',       '',       '',       '',       'rails',  '',
    '',       'rails',  '',       '',       '',       'rails',  '',
    'rails',  '',       'rails',  '',       'rails',  '',       '',
    '',       '',       '',       '',       '',       'rails',  '',
  ];
  const plane = new LevelPlane(data, 7, 6, true, null, "actionPlane");

  t.equal(plane.setBlockAt([1, 0], new LevelBlock('rails')).blockType, 'railsSouthEast');
  t.equal(plane.setBlockAt([5, 1], new LevelBlock('rails')).blockType, 'railsSouthEast');
  t.equal(plane.setBlockAt([1, 4], new LevelBlock('rails')).blockType, 'railsNorthEast');
  t.equal(plane.setBlockAt([5, 4], new LevelBlock('rails')).blockType, 'railsSouthWest');

  const expected = [
    'rails',  'railsSE','railsW', '',       '',       'rails',  '',
    '',       'railsN', '',       '',       '',       'railsSE','railsW',
    '',       '',       '',       '',       '',       'railsNS','',
    '',       'railsS', '',       '',       '',       'railsN', '',
    'rails',  'railsNE','railsW', '',       'railsE', 'railsSW','',
    '',       '',       '',       '',       '',       'railsN', '',
  ].map(rail => {
    return rail.replace('N', 'North').replace('S', 'South').replace('E', 'East').replace('W', 'West');
  });

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

// Before:              After:
// ║   ║     ║          ═════     ║
//   ║         ║          ║       ═══
//           ║                    ║
//   ║       ║            ║       ║
// ║   ║   ║            ═════   ═══
//           ║                    ║
//
test('rail connections: unpowered T-junctions', t => {
  const data = [
    'rails',  '',       'rails',  '',       '',       'rails',  '',
    '',       'rails',  '',       '',       '',       '',       'rails',
    '',       '',       '',       '',       '',       'rails',  '',
    '',       'rails',  '',       '',       '',       'rails',  '',
    'rails',  '',       'rails',  '',       'rails',  '',       '',
    '',       '',       '',       '',       '',       'rails',  '',
  ];
  const plane = new LevelPlane(data, 7, 6, true, null, "actionPlane");

  t.equal(plane.setBlockAt([1, 0], new LevelBlock('railsUnpowered')).blockType, 'railsUnpoweredEastWest');
  t.equal(plane.setBlockAt([5, 1], new LevelBlock('railsUnpowered')).blockType, 'railsUnpoweredEastWest');
  t.equal(plane.setBlockAt([1, 4], new LevelBlock('railsUnpowered')).blockType, 'railsUnpoweredEastWest');
  t.equal(plane.setBlockAt([5, 4], new LevelBlock('railsUnpowered')).blockType, 'railsUnpoweredEastWest');

  const expected = [
    'railsE',  'railsUEW','railsW',  '',        '',        'rails',   '',
    '',        'rails',   '',        '',        '',        'railsUEW','railsW',
    '',        '',        '',        '',        '',        'railsS',  '',
    '',        'rails',   '',        '',        '',        'railsN',  '',
    'railsE',  'railsUEW','railsW',  '',        'railsE',  'railsUEW','',
    '',        '',        '',        '',        '',        'rails',   '',
  ].map(rail => {
    return rail.replace('U', 'Unpowered').replace('N', 'North').replace('S', 'South').replace('E', 'East').replace('W', 'West');
  });

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

// Place four tracks in a circle.
// 1:      2:     3:     4:
//   ║     ═══    ╔══    ╔═╗
//                ║      ╚═╝
//
test('rail connections: 2x2 loop', t => {
  const data = new Array(4).fill('');
  const plane = new LevelPlane(data, 2, 2, true, null, "actionPlane");

  t.equal(plane.setBlockAt([1, 0], new LevelBlock('rails')).blockType, 'rails');
  t.equal(plane.setBlockAt([0, 0], new LevelBlock('rails')).blockType, 'railsEast');
  t.equal(plane.setBlockAt([0, 1], new LevelBlock('rails')).blockType, 'railsNorth');
  t.equal(plane.setBlockAt([1, 1], new LevelBlock('rails')).blockType, 'railsNorthWest');

  const expected = [
    'railsSouthEast', 'railsSouthWest',
    'railsNorthEast', 'railsNorthWest',
  ];

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

// Place a longer minecart track.
// Order:       Track:
//  1 3         ══╗
//    2 A B       ║ ╔══
//    4 9 8       ║ ╚═╗
//    5 6 7       ╚═══╝
test('rail connections: longer track', t => {
  const data = new Array(16).fill('');
  const plane = new LevelPlane(data, 4, 4, true, null, "actionPlane");

  plane.setBlockAt([0, 0], new LevelBlock('rails'));
  plane.setBlockAt([1, 1], new LevelBlock('rails'));
  plane.setBlockAt([1, 0], new LevelBlock('rails'));
  plane.setBlockAt([1, 2], new LevelBlock('rails'));
  plane.setBlockAt([1, 3], new LevelBlock('rails'));
  plane.setBlockAt([2, 3], new LevelBlock('rails'));
  plane.setBlockAt([3, 3], new LevelBlock('rails'));
  plane.setBlockAt([3, 2], new LevelBlock('rails'));
  plane.setBlockAt([2, 2], new LevelBlock('rails'));
  plane.setBlockAt([2, 1], new LevelBlock('rails'));
  plane.setBlockAt([3, 1], new LevelBlock('rails'));

  const expected = [
    'railsEast',      'railsSouthWest', '',               '',
    '',               'railsNorthSouth','railsSouthEast', 'railsWest',
    '',               'railsNorthSouth','railsNorthEast', 'railsSouthWest',
    '',               'railsNorthEast', 'railsEastWest',  'railsNorthWest',
  ];

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

// Destroying part of a track should leave T-junctions intact. Don't heal the
// curved track into a straight segment.
//
// Before:   After:
//    ║         ║
// X══╗        ═╗
//    ║         ║
test('rail connections: destroy block', t => {
  const data = [
    '',               'railsNorthSouth','',
    'railsEastWest',  'railsSouthWest', '',
    '',               'railsNorthSouth','',
  ];
  const plane = new LevelPlane(data, 3, 3, true, null, "actionPlane");

  // Destroy track block.
  plane.setBlockAt([0, 1], new LevelBlock(''));

  const expected = [
    '',               'railsNorthSouth','',
    '',               'railsSouthWest', '',
    '',               'railsNorthSouth','',
  ];

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

//Placing/destroying redstoneWire should update charge propagation throughout
//a line of wire connected to a redstone torch
// Before:   After:
//    T        T║
//              ║
//           X  ║
test('redstone charge: place block', t => {
  const data = [
    '','railsRedstoneTorch',      '',
    '','',                        '',
    '','',                        '',
  ];
  const plane = new LevelPlane(data, 3, 3, true, null, "actionPlane");

  plane.setBlockAt([2, 0], new LevelBlock('redstoneWire'));
  plane.setBlockAt([2, 1], new LevelBlock('redstoneWire'));
  plane.setBlockAt([2, 2], new LevelBlock('redstoneWire'));
  plane.setBlockAt([0, 2], new LevelBlock('redstoneWire'));

  const expected = [
    '',         'railsRedstoneTorch','redstoneWireDownLeftOn',
    '',                  '',         'redstoneWireVerticalOn',
    'redstoneWire',      '',         'redstoneWireVerticalOn',
  ];

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

//Placing/destroying redstoneWire should update charge propagation throughout
//a line of wire connected to a redstone torch
// Before:   After:
//    T║       T
//     ║        ║
//  X  ║     X  ║
test('redstone charge: destroy block', t => {
  const data = [
    '',         'railsRedstoneTorch','redstoneWireDownLeftOn',
    '',                  '',         'redstoneWireVerticalOn',
    'redstoneWire',      '',         'redstoneWireVerticalOn',
  ];
  const plane = new LevelPlane(data, 3, 3, true, null, "actionPlane");

  plane.setBlockAt([2, 0], new LevelBlock(''));

  const expected = [
    '',         'railsRedstoneTorch',            '',
    '',                  '',         'redstoneWireVertical',
    'redstoneWire',      '',         'redstoneWireVertical',
  ];

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

//Placing/destroying redstoneWire should update charge propagation throughout
//a line of wire connected to a redstone torch
// Before:   After:
//    T║        ║
//     ║        ║
//  X  ║     X  ║
test('torch charge: destroy block', t => {
  const data = [
    '',         'railsRedstoneTorch','redstoneWireDownLeftOn',
    '',                  '',         'redstoneWireVerticalOn',
    'redstoneWire',      '',         'redstoneWireVerticalOn',
  ];
  const plane = new LevelPlane(data, 3, 3, true, null, "actionPlane");

  plane.setBlockAt([1, 0], new LevelBlock(''));

  const expected = [
    '',                  '',         'redstoneWireVertical',
    '',                  '',         'redstoneWireVertical',
    'redstoneWire',      '',         'redstoneWireVertical',
  ];

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

//Placing/destroying redstoneWire should update charge propagation throughout
//a line of wire connected to a redstone torch
// Before:   After:
// X   ║     X  T║
//     ║         ║
//     ║         ║
test('torch charge: place block', t => {
  const data = [
    'redstoneWire','',      'redstoneWireVertical',
    '',            '',      'redstoneWireVertical',
    '',            '',      'redstoneWireVertical',
  ];
  const plane = new LevelPlane(data, 3, 3, true, null, "actionPlane");

  plane.setBlockAt([1, 2], new LevelBlock('railsRedstoneTorch'));

  const expected = [
    'redstoneWire',         '',         'redstoneWireVerticalOn',
    '',                     '',         'redstoneWireVerticalOn',
    '',            'railsRedstoneTorch','redstoneWireUpLeftOn',
  ];

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

test('iron door open: place block', t => {
  const data = [
    'redstoneWireVertical','',      '',
    'redstoneWireVertical','',      '',
    'doorIron',            '',      'doorIron',
  ];
  const plane = new LevelPlane(data, 3, 3, true, null, "actionPlane");

  plane.setBlockAt([1, 0], new LevelBlock('railsRedstoneTorch'));

  t.false(plane.getBlockAt([2, 2]).isOpen);
  t.true(plane.getBlockAt([0, 2]).isOpen);

  t.end();
});

test('iron door close: destroy block', t => {
  const data = [
    'railsRedstoneTorch',    '','',
    'redstoneWireVerticalOn','','',
    'doorIron',              '','doorIron',
  ];
  const plane = new LevelPlane(data, 3, 3, true, null, "actionPlane");

  plane.setBlockAt([0, 0], new LevelBlock(''));

  t.false(plane.getBlockAt([2, 2]).isOpen);
  t.false(plane.getBlockAt([1, 2]).isOpen);

  t.end();
});

test('piston activate: place block', t => {
  const data = [
    '','','grass','pistonLeft','','pistonRight','grass','',
    '','','','redstoneWireVertical','','redstoneWireVertical','','',
    '','','grass','redstoneWireVertical','','redstoneWireVertical','','',
    '','','pistonUp','redstoneWireUpLeft','','redstoneWireUpRight','pistonDown','',
    '','','','','','','grass','',
    '','','','','','','','',
  ];
  const plane = new LevelPlane(data, 8, 6, true, null, "actionPlane");

  plane.setBlockAt([4, 2], new LevelBlock('railsRedstoneTorch'));

  const expected = [
    '','grass','pistonArmLeft','pistonLeftOn','','pistonRightOn','pistonArmRight','grass',
    '','','grass','redstoneWireVerticalOn','','redstoneWireVerticalOn','','',
    '','','pistonArmUp','redstoneWireTRightOn','railsRedstoneTorch','redstoneWireTLeftOn','','',
    '','','pistonUpOn','redstoneWireUpLeftOn','','redstoneWireUpRightOn','pistonDownOn','',
    '','','','','','','pistonArmDown','',
    '','','','','','','grass','',
  ];

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

test('piston deactivate: destroy block', t => {
  const data = [
    '','grass','pistonArmLeft','pistonLeftOn','','pistonRightOn','pistonArmRight','grass',
    '','','grass','redstoneWireVerticalOn','','redstoneWireVerticalOn','','',
    '','','pistonArmUp','redstoneWireTRightOn','railsRedstoneTorch','redstoneWireTLeftOn','','',
    '','','pistonUpOn','redstoneWireUpLeftOn','','redstoneWireUpRightOn','pistonDownOn','',
    '','','','','','','pistonArmDown','',
    '','','','','','','grass','',
  ];
  const plane = new LevelPlane(data, 8, 6, true, null, "actionPlane");

  plane.setBlockAt([4, 2], new LevelBlock(''));

  const expected = [
    '','grass','','pistonLeft','','pistonRight','','grass',
    '','','grass','redstoneWireVertical','','redstoneWireVertical','','',
    '','','','redstoneWireVertical','','redstoneWireVertical','','',
    '','','pistonUp','redstoneWireUpLeft','','redstoneWireUpRight','pistonDown','',
    '','','','','','','','',
    '','','','','','','grass','',
  ];

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

test('sticky piston activate: place block', t => {
  const data = [
    '','','grass','pistonLeftSticky','','pistonRightSticky','grass','',
    '','','','redstoneWireVertical','','redstoneWireVertical','','',
    '','','grass','redstoneWireVertical','','redstoneWireVertical','','',
    '','','pistonUpSticky','redstoneWireUpLeft','','redstoneWireUpRight','pistonDownSticky','',
    '','','','','','','grass','',
    '','','','','','','','',
  ];
  const plane = new LevelPlane(data, 8, 6, true, null, "actionPlane");

  plane.setBlockAt([4, 2], new LevelBlock('railsRedstoneTorch'));

  const expected = [
    '','grass','pistonArmLeft','pistonLeftOnSticky','','pistonRightOnSticky','pistonArmRight','grass',
    '','','grass','redstoneWireVerticalOn','','redstoneWireVerticalOn','','',
    '','','pistonArmUp','redstoneWireTRightOn','railsRedstoneTorch','redstoneWireTLeftOn','','',
    '','','pistonUpOnSticky','redstoneWireUpLeftOn','','redstoneWireUpRightOn','pistonDownOnSticky','',
    '','','','','','','pistonArmDown','',
    '','','','','','','grass','',
  ];

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});

test('sticky piston deactivate: destroy block', t => {
  const data = [
    '','grass','pistonArmLeft','pistonLeftOnSticky','','pistonRightOnSticky','pistonArmRight','grass',
    '','','grass','redstoneWireVerticalOn','','redstoneWireVerticalOn','','',
    '','','pistonArmUp','redstoneWireTRightOn','railsRedstoneTorch','redstoneWireTLeftOn','','',
    '','','pistonUpOnSticky','redstoneWireUpLeftOn','','redstoneWireUpRightOn','pistonDownOnSticky','',
    '','','','','','','pistonArmDownSticky','',
    '','','','','','','grass','',
  ];
  const plane = new LevelPlane(data, 8, 6, true, null, "actionPlane");

  plane.setBlockAt([4, 2], new LevelBlock(''));

  const expected = [
    '','','grass','pistonLeftSticky','','pistonRightSticky','grass','',
    '','','','redstoneWireVertical','','redstoneWireVertical','','',
    '','','grass','redstoneWireVertical','','redstoneWireVertical','','',
    '','','pistonUpSticky','redstoneWireUpLeft','','redstoneWireUpRight','pistonDownSticky','',
    '','','','','','','grass','',
    '','','','','','','','',
  ];

  t.deepEqual(plane._data.map(block => block.blockType), expected);

  t.end();
});
