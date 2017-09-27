const test = require("tape");
const attempt = require("../helpers/RunLevel.js");

test('Adventurer 1: Move to Sheep (fail)', t => {
  attempt('adventurer01', api => new Promise(resolve => {
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 4]);
      t.assert(!success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 1: Move to Sheep (pass)', t => {
  attempt('adventurer01', api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [5, 4]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 2: Chop Tree', t => {
  attempt('adventurer02', api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.destroyBlock(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [4, 5]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 3: Shear Sheep', t => {
  attempt('adventurer03', api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.use(null, 'Player');
    api.turnRight(null, 'Player');
    api.moveForward(null, 'Player');
    api.use(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [4, 4]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 4: Chop Trees', t => {
  attempt('adventurer04', api => new Promise(resolve => {
    for (let i = 0; i < 3; i++) {
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.destroyBlock(null, 'Player');
      api.turnLeft(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 4]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 5: Place Wall', t => {
  attempt('adventurer05', api => new Promise(resolve => {
    for (let i = 0; i < 4; i++) {
      api.placeBlock(null, 'planksBirch', 'Player');
      api.moveForward(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [2, 6]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 6: House Frame Chosen', t => {
  attempt('adventurer06', api => new Promise(resolve => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        api.placeBlock(null, 'planksBirch', 'Player');
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [6, 6]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 7: Plant Crops (fail)', t => {
  attempt('adventurer07', api => new Promise(resolve => {
    api.turnRight(null, 'Player');
    api.moveForward(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [5, 7]);
      t.assert(levelModel.isPlayerStandingInWater());
      t.assert(!success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 7: Plant Crops (pass)', t => {
  attempt('adventurer07', api => new Promise(resolve => {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 6; j++) {
        api.placeBlock(null, 'cropWheat', 'Player');
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [4, 7]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});
test('Adventurer 8: Avoid Monsters', t => {
  attempt('adventurer08', api => new Promise(resolve => {
    for (let i = 0; i < 4; i++) {
      api.moveForward(null, 'Player');
    }
    api.turnLeft(null, 'Player');
    for (let i = 0; i < 4; i++) {
      api.moveForward(null, 'Player');
    }
    api.turnLeft(null, 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [4, 2]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 9: Mining Coal', t => {
  attempt('adventurer09', api => new Promise(resolve => {
    api.turnLeft(null, 'Player');
    for (let i = 0; i < 2; i++) {
      api.placeBlock(null, 'torch', 'Player');
      api.destroyBlock(null, 'Player');
      api.moveForward(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 6]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 10: Iron (fail)', t => {
  attempt('adventurer10', api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 4]);
      t.assert(levelModel.isPlayerStandingInLava());
      t.assert(!success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 10: Iron (pass)', t => {
  attempt('adventurer10', api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.placeInFront(null, 'cobblestone', 'Player');
    for (let i = 0; i < 3; i++) {
      api.moveForward(null, 'Player');
      api.destroyBlock(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 2]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 11: Avoiding Lava', t => {
  attempt('adventurer11', api => new Promise(resolve => {
    for (let i = 0; i < 7; i++) {
      api.destroyBlock(null, 'Player');
      api.ifBlockAhead(null, 'lava', 'Player', () => {
        api.placeInFront(null, 'cobblestone', 'Player');
      });
      api.moveForward(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [8, 4]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 12: If Statements', t => {
  attempt('adventurer12', api => new Promise(resolve => {
    for (let i = 0; i < 3; i++) {
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.destroyBlock(null, 'Player');
      api.ifBlockAhead(null, 'lava', 'Player', () => {
        api.placeInFront(null, 'cobblestone', 'Player');
      });
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [3, 2]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 13: Powered Minecart', t => {
  attempt('adventurer13', api => new Promise(resolve => {
    for (let i = 0; i < 2; i++) {
      api.turnRight(null, 'Player');
      for (let j = 0; j < 6; j++) {
        api.placeBlock(null, 'rail', 'Player');
        api.moveForward(null, 'Player');
      }
    }

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [11, 7]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 14: Free Play 20x20', t => {
  attempt('adventurer14', api => new Promise(resolve => {
    api.moveForward(null, 'Player');
    api.turnLeft(null, 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.moveForward(null, 'Player');
    api.placeBlock(null, 'tnt', 'Player');

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.player.position, [7, 9]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Adventurer 15: Agent placeBlock', t => {
  attempt('adventurer15', api => new Promise(resolve => {
    for (let i = 0; i < 5; i++) {
      api.placeBlock(null, 'planksBirch', 'PlayerAgent');
      api.moveForward(null, 'PlayerAgent');
    }

    const expected = [
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "planksBirch", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "planksBirch", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "gravel", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "planksBirch", "grass", "grass", "grass", "grass",
      "grass", "grass", "grass", "grass", "grass", "planksBirch", "grass", "grass", "grass", "grass",
    ];

    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.actionPlane, expected);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});
