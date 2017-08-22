const test = require('tape');

const LevelPlane = require('../../src/js/game/LevelMVC/LevelPlane');

test('sanity', t => {
  const data = [
    'grass', 'dirt', 'stone', 'sand',
    'water', 'lava', 'water', 'lava',
    'grass', 'dirt', 'stone', 'sand',
  ];
  const plane = new LevelPlane(data, 4, 3);

  t.equal(plane.getBlockAt([0, 0]).blockType, 'grass');

  t.end();
});
