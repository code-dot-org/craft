const test = require("tape");
const attempt = require("../helpers/RunLevel.js");

test('Agent 1: Spawn Agent', t => {
  attempt('agent01', (api, levelModel) => new Promise(resolve => {
    // Agent should not be present at level start.
    t.assert(!levelModel.useAgent);

    // Queue commands to move the player inside the house.
    for (let i = 0; i < 2; i++) {
      api.turnRight(null, 'Player');
      for (let j = 0; j < 5; j++) {
        api.moveForward(null, 'Player');
      }
    }

    // Run the level. When finished, check that the Agent has spawned.
    api.startAttempt((success, levelModel) => {
      // Verify the Agent has spawned.
      t.assert(levelModel.usingAgent);
      t.deepEqual(levelModel.agent.position, [3, 4]);

      t.deepEqual(levelModel.player.position, [3, 3]);
      t.assert(success);
      t.end();

      resolve();
    });
  }), 1);
});

test('Agent 6: Build Bridge', t => {
  attempt('agent06', api => new Promise(resolve => {
    // Have the Agent build a bridge.
    for (let i = 0; i < 3; i++) {
      api.moveForward(null, 'PlayerAgent');
      api.placeBlock(null, 'planksOak', 'PlayerAgent');
    }

    // Once the bridge is built, move the player to the finish square.
    setTimeout(() => {
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      api.arrowDown(0);
    }, 1000);

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.agent.position, [3, 3]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});
