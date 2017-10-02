const test = require("tape");
const attempt = require("../helpers/RunLevel.js");

test('Designer 1: Chicken Move (fail)', t => {
  attempt('designer01', api => new Promise(resolve => {
    api.startAttempt(success => {
      t.assert(!success);
      t.end();

      resolve();
    });
  }));
});

test('Designer 1: Chicken Move (pass)', t => {
  attempt('designer01', api => new Promise(resolve => {
    api.onEventTriggered(null, 'chicken', 2, event => {
      api.moveForward(null, event.targetIdentifier);
      api.turnLeft(null, event.targetIdentifier);
    });

    api.startAttempt(success => {
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Designer 2: Four Chicken Move', t => {
  attempt('designer02', api => new Promise(resolve => {
    api.onEventTriggered(null, 'chicken', 2, event => {
      api.repeat(null, () => {
        api.drop(null, 'diamond', event.targetIdentifier);
        api.moveForward(null, event.targetIdentifier);
        api.turnLeft(null, event.targetIdentifier);
      }, -1, event.targetIdentifier);
    });

    api.startAttempt(success => {
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Designer 3: Four Chicken Random Move', t => {
  attempt('designer03', api => new Promise(resolve => {
    api.onEventTriggered(null, 'chicken', 2, event => {
      api.repeat(null, () => {
        // Movement isn't actually random because we've stubbed `Math.random()`
        // for integration tests.
        api.wait(null, 'random', event.targetIdentifier);
        api.moveForward(null, event.targetIdentifier);
        api.turnRandom(null, event.targetIdentifier);
      }, -1, event.targetIdentifier);
    });

    api.startAttempt(success => {
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Designer 4: Move Player Inside House', t => {
  attempt('designer04', api => new Promise(resolve => {
    for (let i = 0; i < 5; i++) {
      api.moveForward(null, 'Player');
    }
    api.use(null, 'Player');
    api.moveForward(null, 'Player');

    api.startAttempt(success => {
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Designer 5: Add Shear Sheep Behavior (push back)', t => {
  attempt('designer05', api => new Promise(resolve => {
    // Move to the sheep and push it back 1 space.
    for (let i = 0; i < 4; i++) {
      api.moveForward(null, 'Player');
    }
    api.turnRight(null, 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [5, 3]);
      t.equal(levelModel.getEntityAt([6, 3]), undefined);
      t.equal(levelModel.getEntityAt([7, 3]).type, 'sheep');
      t.assert(!success);
      t.end();

      resolve();
    });
  }));
});

test('Designer 5: Add Shear Sheep Behavior (fail)', t => {
  attempt('designer05', api => new Promise(resolve => {
    // Move to the sheep without defining the sheep `use` behavior.
    for (let i = 0; i < 4; i++) {
      api.moveForward(null, 'Player');
    }
    api.turnRight(null, 'Player');
    api.moveForward(null, 'Player');
    api.use(null, 'Player');

    api.startAttempt(success => {
      t.assert(!success);
      t.end();

      resolve();
    });
  }));
});

test('Designer 5: Add Shear Sheep Behavior (pass)', t => {
  attempt('designer05', api => new Promise(resolve => {
    // Set up the sheep `use` behavior to drop wool.
    api.onEventTriggered(null, 'sheep', 1, event => {
      api.drop(null, 'wool', event.targetIdentifier);
    });

    // Move to the sheep then `use`.
    for (let i = 0; i < 4; i++) {
      api.moveForward(null, 'Player');
    }
    api.turnRight(null, 'Player');
    api.moveForward(null, 'Player');
    api.use(null, 'Player');

    api.startAttempt(success => {
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Designer 6: Lead Cows to Grass', t => {
  attempt('designer06', api => new Promise(resolve => {
    // Define cow follow behavior as user code.
    api.onEventTriggered(null, 'cow', 2, event => {
      api.repeat(null, () => {
        api.moveToward(null, event.targetIdentifier, 'Player');
      }, -1, event.targetIdentifier);
    });

    // Move player into grassy area.
    api.moveForward(null, 'Player');
    api.turnLeft(null, 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');

    api.startAttempt(success => {
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test.skip('Designer 7: Explode Stone Wall', t => {
  attempt('designer07', api => new Promise(resolve => {
    // Make the creeper move towards the sheep.
    api.onEventTriggered(null, 'creeper', 2, event => {
      api.turnLeft(null, event.targetIdentifier);
      api.moveForward(null, event.targetIdentifier);
      api.moveForward(null, event.targetIdentifier);
      api.moveForward(null, event.targetIdentifier);
      api.turnRight(null, event.targetIdentifier);
      api.moveForward(null, event.targetIdentifier);
      api.moveForward(null, event.targetIdentifier);
      api.moveForward(null, event.targetIdentifier);
    });

    // Define creeper explode behavior as user code.
    api.onEventTriggered(null, 'creeper', 0, event => {
      api.flashEntity(null, event.targetIdentifier);
      api.wait(null, '2', event.targetIdentifier);
      api.explodeEntity(null, event.targetIdentifier);
    });

    // Move player to touch the creeper, then away.
    api.wait(null, '7', 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.turnLeft(null, 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.turnRight(null, 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.turnRight(null, 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.wait(null, '7', 'Player');

    // Move player to the sheep.
    api.turnLeft(null, 'Player');
    api.turnLeft(null, 'Player');
    for (let i = 0; i < 6; i++) {
      api.moveForward(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [7, 4]);
      t.assert(success);
      t.end();

      resolve();
    });
  }), 0.5);
});

test('Designer 8: Trapped by Zombies', t => {
  attempt('designer08', api => new Promise(resolve => {
    // Define iron golem behavior as user code.
    api.onEventTriggered(null, 'ironGolem', 2, event => {
      api.repeat(null, () => {
        api.moveToward(null, event.targetIdentifier, 'zombie');
        api.attack(null, event.targetIdentifier);
      }, -1, event.targetIdentifier);
    });

    api.startAttempt(success => {
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Designer 9: Spawn Entity', t => {
  attempt('designer09', api => new Promise(resolve => {
    api.spawnEntity(null, 'sheep', 'middle');
    api.onEventTriggered(null, 'sheep', 2, event => {
      api.moveToward(null, event.targetIdentifier, 'Player');
    });

    api.startAttempt(success => {
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});
