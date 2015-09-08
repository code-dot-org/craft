var Phaser = require('Phaser');
require('../../lib/inherits');

/**
 * @constructor
 */
var PlaybackState = module.exports = function (game) {
  Phaser.State.call(this, game);
};
PlaybackState.inherits(Phaser.State);

PlaybackState.prototype.create = function () {
  var logo = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'logo');
  logo.anchor.setTo(0.5, 0.5);
};
