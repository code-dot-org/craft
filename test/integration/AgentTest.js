const test = require("tape");
const attempt = require("../helpers/RunLevel.js");

test('Agent 1: Spawn Agent', t => {
  attempt('agent01', api => new Promise(resolve => {
    // Queue commands to move the player inside the house.
    for (let i = 0; i < 2; i++) {
      api.turnRight(null, 'Player');
      for (let j = 0; j < 5; j++) {
        api.moveForward(null, 'Player');
      }
    }

    // Run the level. When finished, check that the Agent has spawned.
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 3]);
      t.deepEqual(levelModel.agent.position, [3, 2]);
      t.assert(success);
      t.end();

      resolve();
    });
  }), 1);
});
