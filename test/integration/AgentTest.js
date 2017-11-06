const test = require("tape");
const attempt = require("../helpers/RunLevel.js");

test('Agent 1: Leave House', t => {
  attempt('agent01', api => new Promise(resolve => {
    // Have the Agent move forward once onto a pressure plate.
    api.moveForward(null, 'PlayerAgent');

    // Once the door is open, move the player to the diamond and then the finish
    setTimeout(() => {
      for (let i = 0; i < 4; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 5; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 4; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 2; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        api.moveForward(null, 'Player');
      }
      //Player collects the diamond
      api.turnLeft(null, 'Player');
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 2; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      for (let i = 0; i < 5; ++i) {
        api.moveForward(null, 'Player');
      }
    }, 1000);

    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.agent.position, [3, 8]);

      t.deepEqual(levelModel.player.position, [8, 8]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Agent 2: Open Doors', t => {
  attempt('agent02', api => new Promise(resolve => {

    // Have the Agent move to the diamond path pressure plate.
    for (let i = 0; i < 4; ++i) {
      api.moveForward(null, 'PlayerAgent');
    }
    api.turnLeft(null, 'PlayerAgent');
    for (let i = 0; i < 4; ++i) {
      api.moveForward(null, 'PlayerAgent');
    }

    // Once the door is open, move the player to the diamond, then to the finish
    setTimeout(() => {
      for (let i = 0; i < 9; ++i) {
        api.moveForward(null, 'Player');
      }
      //Player collects the diamond
      api.turnLeft(null, 'Player');
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 4; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 2; ++i) {
        api.moveForward(null, 'Player');
      }
    }, 1000);

    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.assert(levelModel.usingAgent);
      t.deepEqual(levelModel.agent.position, [2, 5]);

      t.deepEqual(levelModel.player.position, [6, 1]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Agent 3: Open Doors 2.0', t => {
  attempt('agent03', api => new Promise(resolve => {

    // Have the Agent move to the diamond path pressure plate.
    for (let i = 0; i < 4; ++i) {
      api.moveForward(null, 'PlayerAgent');
    }
    api.turnLeft(null, 'PlayerAgent');
    for (let i = 0; i < 4; ++i) {
      api.moveForward(null, 'PlayerAgent');
    }

    // Once the door is open, move the player to the diamond, then to the finish
    setTimeout(() => {
      api.turnLeft(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnRight(null, 'Player');
      for (let i = 0; i < 9; ++i) {
        api.moveForward(null, 'Player');
      }
      //Player collects the diamond
      api.turnRight(null, 'Player');
      api.turnRight(null, 'Player');
      for (let i = 0; i < 4; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 2; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      for (let i = 0; i < 2; ++i) {
        api.moveForward(null, 'Player');
      }
    }, 1000);

    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.agent.position, [0, 5]);

      t.deepEqual(levelModel.player.position, [9, 2]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Agent 4: Walk on Water', t => {
  attempt('agent04', api => new Promise(resolve => {

    // Have the Agent move to the diamond path pressure plate.
    for (let i = 0; i < 6; ++i) {
      api.moveForward(null, 'PlayerAgent');
    }
    api.turnLeft(null, 'PlayerAgent');
    for (let i = 0; i < 2; ++i) {
      api.moveForward(null, 'PlayerAgent');
    }

    // Once the door is open, move the player to the diamond, then to the finish
    // (This is so ugly...)
    setTimeout(() => {
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      //Player collects the diamond
      api.turnRight(null, 'Player');
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 5; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 7; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
    }, 1000);

    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.agent.position, [3, 1]);

      t.deepEqual(levelModel.player.position, [9, 1]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Agent 5: Open Doors 2.0', t => {
  attempt('agent05', api => new Promise(resolve => {

    // Have the Agent move to the diamond path pressure plate.
    for (let i = 0; i < 5; ++i) {
      api.moveForward(null, 'PlayerAgent');
    }
    api.turnRight(null, 'PlayerAgent');
    for (let i = 0; i < 4; ++i) {
      api.moveForward(null, 'PlayerAgent');
    }
    api.turnRight(null, 'PlayerAgent');
    api.moveForward(null, 'PlayerAgent');

    // Once the door is open, move the player to the diamond, then to the finish
    setTimeout(() => {
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      for (let i = 0; i < 2; ++i) {
        api.turnRight(null, 'Player');
        for (let i = 0; i < 5; ++i) {
          api.moveForward(null, 'Player');
        }
      }
      //Player collects the diamond
      api.turnLeft(null, 'Player');
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 7; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      api.moveForward(null, 'Player');
    }, 1500);

    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.agent.position, [8, 3]);

      t.deepEqual(levelModel.player.position, [9, 1]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Agent 6: Build Bridge with one turn', t => {
  attempt('agent06', api => new Promise(resolve => {
    // Have the Agent build a bridge.
    for (let i = 0; i < 3; i++) {
      api.moveForward(null, 'PlayerAgent');
      api.placeBlock(null, 'planksOak', 'PlayerAgent');
    }
    api.turnRight(null, 'PlayerAgent');
    for (let i = 0; i < 2; i++) {
      api.moveForward(null, 'PlayerAgent');
      api.placeBlock(null, 'planksOak', 'PlayerAgent');
    }

    // Once the bridge is built, move the player to the finish square.
    setTimeout(() => {
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 4; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      for (let i = 0; i < 5; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      api.moveForward(null, 'Player');
      //Player collects the diamond
      api.turnLeft(null, 'Player');
      api.turnLeft(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnRight(null, 'Player');
      for (let i = 0; i < 5; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
    }, 1000);

    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.agent.position, [5, 3]);

      t.deepEqual(levelModel.player.position, [3, 1]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Agent 7: Build Bridge with multiple turns', t => {
  attempt('agent07', api => new Promise(resolve => {
    // Have the Agent build a bridge.
    for (let i = 0; i < 3; i++) {
      api.moveForward(null, 'PlayerAgent');
      api.placeBlock(null, 'planksOak', 'PlayerAgent');
    }
    api.turnRight(null, 'PlayerAgent');
    api.moveForward(null, 'PlayerAgent');
    api.placeBlock(null, 'planksOak', 'PlayerAgent');
    api.turnLeft(null, 'PlayerAgent');
    for (let i = 0; i < 2; i++) {
      api.moveForward(null, 'PlayerAgent');
      api.placeBlock(null, 'planksOak', 'PlayerAgent');
    }

    // Once the bridge is built, move the player to the finish square.
    setTimeout(() => {
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 5; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        api.moveForward(null, 'Player');
      }
      //Player collects the diamond
      api.turnLeft(null, 'Player');
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 2; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      api.moveForward(null, 'Player');
    }, 1000);

    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.agent.position, [6, 2]);

      t.deepEqual(levelModel.player.position, [5, 1]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Agent 8: Build Bridge with Functions', t => {
  attempt('agent08', api => new Promise(resolve => {

    const func = () => {
      for (let i = 0; i < 2; ++i) {
        api.moveForward(null, 'PlayerAgent');
        api.placeBlock(null, 'planksOak', 'PlayerAgent');
      }
      api.moveForward(null, 'PlayerAgent');
      api.moveForward(null, 'PlayerAgent');
      api.turnRight(null, 'PlayerAgent');
    };

    // Have the Agent build a bridge.
    for (let i = 0; i < 3; ++i) {
      func();
    }

    // Once the bridge is built, move the player to the finish square.
    setTimeout(() => {
      api.moveForward(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        for (let i = 0; i < 4; i++) {
          api.moveForward(null, 'Player');
        }
        api.turnRight(null, 'Player');
      }
      //Player collects the diamond
      api.turnRight(null, 'Player');
      for (let i = 0; i < 5; i++) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
    }, 10000);

    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.agent.position, [7, 7]);

      t.deepEqual(levelModel.player.position, [9, 2]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

test('Agent 9: Clear Path', t => {
  attempt('agent09', api => new Promise(resolve => {

    const func = () => {
      api.destroyBlock(null, 'PlayerAgent');
      api.moveForward(null, 'PlayerAgent');
      api.placeBlock(null, 'gravel', 'PlayerAgent');
    };

    // Have the Agent clear the path.
    func();
    api.moveForward(null, 'PlayerAgent');
    api.moveForward(null, 'PlayerAgent');
    func();
    api.moveForward(null, 'PlayerAgent');
    func();
    api.turnRight(null, 'PlayerAgent');
    func();
    api.moveForward(null, 'PlayerAgent');
    api.moveForward(null, 'PlayerAgent');
    func();

    // Once the path is clear, move the player to the finish square.
    setTimeout(() => {
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 6; i++) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      for (let i = 0; i < 4; i++) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      //Player collects the diamond
      api.turnRight(null, 'Player');
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 4; i++) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
    }, 2000);

    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.agent.position, [8, 3]);

      t.deepEqual(levelModel.player.position, [4, 1]);
      t.assert(success);
      t.end();

      resolve();
    });
  }));
});

/*test.only('Agent 10: Ride Rails', t => {
  attempt('agent10', api => new Promise(resolve => {

    const funcLong = () => {
      for (let i = 0; i < 3; ++i) {
        api.destroyBlock(null, 'PlayerAgent');
        api.moveForward(null, 'PlayerAgent');
        api.placeBlock(null, 'rails', 'PlayerAgent');
      }
    };

    const funcShort = () => {
      for (let i = 0; i < 2; ++i) {
        api.destroyBlock(null, 'PlayerAgent');
        api.moveForward(null, 'PlayerAgent');
        api.placeBlock(null, 'rails', 'PlayerAgent');
      }
    };

    // Have the Agent clear the path.
    api.turnRight(null, 'PlayerAgent');
    for (let i = 0; i < 3; i++) {
      api.moveForward(null, 'PlayerAgent');
    }
    funcShort();
    api.turnLeft(null, 'PlayerAgent');
    funcLong();
    api.turnLeft(null, 'PlayerAgent');
    api.moveForward(null, 'PlayerAgent');
    api.moveForward(null, 'PlayerAgent');
    api.turnRight(null, 'PlayerAgent');
    funcShort();
    api.turnRight(null, 'PlayerAgent');
    api.moveForward(null, 'PlayerAgent');
    api.moveForward(null, 'PlayerAgent');
    api.turnLeft(null, 'PlayerAgent');
    api.moveForward(null, 'PlayerAgent');
    api.moveForward(null, 'PlayerAgent');


    setTimeout(() => {
    // Once the path is clear, move the player to the finish square.
      api.turnRight(null, 'Player');
      api.arrowDown(1);
    }, 22000);
    setTimeout(() => {
    // Once the path is clear, move the player to the finish square.
      api.arrowUp(1);
    }, 23000);
    setTimeout(() => {
    // Once the path is clear, move the player to the finish square.
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      for (let i = 0; i < 2; ++i) {
        api.turnLeft(null, 'Player');
        api.moveForward(null, 'Player');
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnRight(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        api.moveForward(null, 'Player');
      }
    }, 28000);

    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.agent.position, [9, 2]);

      t.deepEqual(levelModel.player.position, [4, 3]);
      t.end();

      resolve();
    });
  }), 1);
});*/

test('Agent 11: The Nether', t => {
  attempt('agent11', api => new Promise(resolve => {

    const funcLong = () => {
      for (let i = 0; i < 5; ++i) {
        api.moveForward(null, 'PlayerAgent');
        api.placeBlock(null, 'netherrack', 'PlayerAgent');
      }
    };

    const funcShort = () => {
      for (let i = 0; i < 2; ++i) {
        api.moveForward(null, 'PlayerAgent');
        api.placeBlock(null, 'netherrack', 'PlayerAgent');
      }
    };

    // Have the Agent build a bridge.
    funcShort();
    api.turnRight(null, 'PlayerAgent');
    funcLong();
    api.turnLeft(null, 'PlayerAgent');
    funcLong();
    api.turnLeft(null, 'PlayerAgent');
    funcShort();


    setTimeout(() => {
    // Once the bridge is built, move the player to the finish square.
      api.turnLeft(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnRight(null, 'Player');
      for (let i = 0; i < 5; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 5; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 2; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      for (let i = 0; i < 2; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      //Player collects the diamond
      api.turnRight(null, 'Player');
      api.turnRight(null, 'Player');
      api.moveForward(null, 'Player');
      api.turnLeft(null, 'Player');
      for (let i = 0; i < 2; ++i) {
        api.moveForward(null, 'Player');
      }
      api.turnRight(null, 'Player');
      for (let i = 0; i < 3; ++i) {
        api.moveForward(null, 'Player');
      }
    }, 3000);

    // Check the solutions
    api.startAttempt((success, levelModel) => {
      t.deepEqual(levelModel.agent.position, [7, 2]);

      t.deepEqual(levelModel.player.position, [4, 2]);
      t.end();

      resolve();
    });
  }));
});

