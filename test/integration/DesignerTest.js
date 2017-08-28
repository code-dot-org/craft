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
