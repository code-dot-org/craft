var Phaser = require('Phaser');
var _ = require('lodash');

var PhaserApp = module.exports = function (phaserAppConfig) {
  this.gameStates = {
    Boot: require('./states/BootState.js'),
    Preloader: require('./states/PreloaderState.js'),
    Playback: require('./states/PlaybackState.js')
  };

  /** @type {Phaser.Game} */
  this.phaserGame = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-game');

  // Register states.
  _.each(this.gameStates, function (state, key) {
    this.phaserGame.state.add(key, state);
  }.bind(this));

  this.phaserGame.state.start('Boot');
};

window.PhaserApp = PhaserApp;
