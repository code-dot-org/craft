import Phaser from 'Phaser';
import PhaserAppState from './PhaserAppState';

class PlaybackState extends PhaserAppState {
  create() {
    var logo = this.game.add.sprite(
        this.game.world.centerX,
        this.game.world.centerY,
        'logo');
    logo.anchor.setTo(0.5, 0.5);
  }
}

export default PlaybackState;
