const test = require("tape");
const attempt = require("../helpers/RunLevel.js");
const Position = require("../../src/js/game/LevelMVC/Position");

test('Aquatic 2: Move to boat (pass)', t => {
  attempt('aquatic02', (api, levelModel) => {
    const moveForward = () => new Promise(r => api.moveForward(null, 'Player', r));
    const turnRight = () => new Promise(r => api.turnRight(null, 'Player', r));
    return moveForward()
      .then(turnRight)
      .then(moveForward)
      .then(moveForward)
      .then(moveForward)
      .then(moveForward)
      .then(moveForward)
      .then(() => {
        t.deepEqual(levelModel.player.position, new Position(7, 3));
        t.end();
      });
  });
});
