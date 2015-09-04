var Phaser = require('Phaser');
var _ = require('lodash');

var states = {
  Boot: require('./states/BootState.js'),
  Preloader: require('./states/PreloaderState.js'),
  Game: require('./states/GameState.js')
};

/** @type {Phaser.Game} */
var game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-game');

// Register states.
_.each(states, function (state, key) {
  game.state.add(key, state);
});

game.state.start('Boot');
