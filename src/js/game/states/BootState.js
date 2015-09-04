var Boot = {};

Boot.create = function () {
  this.game.state.start('Preloader');
};

module.exports = Boot;
