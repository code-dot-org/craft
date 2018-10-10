const test = require("tape");
const attempt = require("../helpers/RunLevel.js");
const Position = require("../../src/js/game/LevelMVC/Position");

test('Aquatic 2: Move to boat (pass)', t => {
  attempt('aquatic02', async (api, levelModel) => {
    t.plan(1);
    const moveForward = () => new Promise(r => api.moveForward(null, 'Player', r));
    const turnRight = () => new Promise(r => api.turnRight(null, 'Player', r));

    await moveForward();
    await turnRight();
    await moveForward();
    await moveForward();
    await moveForward();
    await moveForward();
    await moveForward();

    t.deepEqual(levelModel.player.position, new Position(7, 3));
  });
});
