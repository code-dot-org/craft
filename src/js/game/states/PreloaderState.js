var Phaser = require('Phaser');
require('../../lib/inherits');

var PreloaderState = module.exports = function (game) {
  Phaser.State.call(this, game);
};
PreloaderState.inherits(Phaser.State);

PreloaderState.prototype.preload = function () {
  this.game.load.image('logo', 'assets/images/phaser.png');
};

PreloaderState.prototype.create = function () {
  this.game.state.start('Playback');
};
