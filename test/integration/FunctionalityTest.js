const test = require("tape");
const attempt = require("../helpers/RunLevel.js");

test('Pistons: Entity Obstruction 1', t => {
  attempt('functionality01', api => new Promise(resolve => {
    // Power the piston
    api.placeInFront(null, 'railsRedstoneTorch', 'Player');
    api.turnLeft(null, 'Player');
    api.moveForward(null, 'Player');

    // Check the solutions. No piston arm should exist because Agent conflicts with the index
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.actionPlane._data[21].blockType, "");

      t.deepEqual(levelModel.player.position, [4, 3]);
      t.deepEqual(levelModel.agent.position, [1, 2]);
      t.assert(success);
      t.end();

      resolve();
    });
  }), 1);
});

test('Pistons: Entity Obstruction 2', t => {
  attempt('functionality01', api => new Promise(resolve => {
    // Power the piston
    api.placeInFront(null, 'railsRedstoneTorch', 'Player');
    api.turnLeft(null, 'Player');
    api.moveForward(null, 'Player');

    // Move the agent out of the way, so that the arm extends
    setTimeout(() => {
      api.moveForward(null, 'PlayerAgent');
    }, 1000);

    // Move player to the solution index
    setTimeout(() => {
      api.moveForward(null, 'Player');
    }, 2000);

    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.actionPlane._data[21].blockType, "pistonArmLeft");

      t.deepEqual(levelModel.player.position, [4, 3]);
      t.deepEqual(levelModel.agent.position, [1, 3]);
      t.assert(success);
      t.end();

      resolve();
    });
  }), 1);
});

test('Rails: Moving On to Ride', t => {
  attempt('functionality02', api => new Promise(resolve => {

    // Have the player walk onto the rails and ride them to the end of the track.
    api.moveDirection(null, 'Player', 1);

        // Move the agent out of the way, so that the arm extends
    setTimeout(() => {
      for (let i = 0; i < 8; ++i) {
        api.moveDirection(null, 'Player', 1);
      }
    }, 10000);


    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [9, 9]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test.only('Pressure Plate: Moving On to Rail', t => {
  attempt('functionality03', api => new Promise(resolve => {

    // Have the player walk onto the rails and ride them to the end of the track.
    api.moveDirection(null, 'Player', 2);
    api.moveDirection(null, 'Player', 1);


    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [6, 2]);
      t.notOk(levelModel.actionPlane._data[0].isPowered);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

