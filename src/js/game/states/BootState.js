var Phaser = require('Phaser');
require('../../lib/inherits');

var BootState = module.exports = function (game) {
  Phaser.State.call(this, game);
};
BootState.inherits(Phaser.State);

BootState.prototype.init = function () {
  this.game.state.start('Preloader');
};
