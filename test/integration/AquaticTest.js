const test = require("tape");
const attempt = require("../helpers/RunLevel.js");
const Position = require("../../src/js/game/LevelMVC/Position");

test('Aquatic 2: Move to boat (pass)', t => {
  attempt('aquatic02', (api, levelModel) => {
    function moveForward() {
      return new Promise((resolve) => {
        api.moveForward(null, 'Player', resolve);
      });
    }

    function turnRight() {
      return new Promise((resolve) => {
        api.turnRight(null, 'Player', resolve);
      });
    }

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
  }, 1);
});
