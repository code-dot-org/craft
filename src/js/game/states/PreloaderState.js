var Preloader = {};

Preloader.preload = function () {
  this.game.load.image('logo', 'assets/images/phaser.png');
};

Preloader.create = function () {
  this.game.state.start('Game');
};

module.exports = Preloader;
