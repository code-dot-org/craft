import Phaser from 'Phaser';
import States from './States';

export default class PhaserGameState extends Phaser.State {
  /**
   * @param {PhaserApp} phaserGameInstance
   */
  constructor(phaserGameInstance) {
    super();
    console.log("Setting phaser game to ");
    console.log(phaserGameInstance);
    this.phaserApp = phaserGameInstance;
  }
}
