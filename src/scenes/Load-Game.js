import Phaser from 'phaser'

import { text, font, style } from '../lib/common'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'LoadGameScene' })
  }

  preload () {
    this.loadingText = this.add.text( this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'LOADING', {
      fontFamily: font.Title,
      fontSize: '22px'
    }).setOrigin(0.5, 0.5);
    // this.load.image('base-button', 'assets/base-button.png'),

    // this.load.audio('wind-chimes', 'assets/audio/wind_chimes.mp3', { instances: 1 });
    // this.load.audio('main-menu', 'assets/audio/songs/main-menu.mp3', { instances: 1 });

    // this.load.audio('menu-change', 'assets/audio/menu-change.mp3', { instances: 1 });
    // this.load.audio('menu-selector', 'assets/audio/menu-selector.mp3', { instances: 1 });
    // this.load.audio('menu-cancel', 'assets/audio/menu-cancel.mp3', { instances: 1 });

  }

  create () {
  }
  
  update() {
  }
}
