const test = require("tape");
const attempt = require("../helpers/RunLevel.js");
const Position = require("../../src/js/game/LevelMVC/Position");

test.skip('Aquatic 2: Move to boat (pass)', t => {
  attempt('aquatic02', api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.turnRight(null, 'Player');
    for (let i = 0; i < 5; i++) {
      api.moveForward(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.assert(success);
      t.deepEqual(levelModel.player.position, new Position(7, 3));
      t.end();

      resolve();
    });
  }), 1);
});
