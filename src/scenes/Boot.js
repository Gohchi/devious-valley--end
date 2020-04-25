import Phaser from 'phaser'
// import WebFont from 'webfontloader'
import { windowWidth, windowHeight } from '../config'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    let offset = (windowWidth / 2);
    
    //#region components
    let loadingText = this.make.text({
      x: windowWidth / 2,
      y: windowHeight / 2 - 60,
      text: 'Loading...',
      style: {
          font: '20px monospace',
          fill: '#ffffff'
      }
    }).setOrigin(0.5, 0.5);
    let assetText = this.make.text({
      x: windowWidth / 2,
      y: windowHeight / 2 + 30,
      text: '',
      style: {
          font: '18px monospace',
          fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(offset / 2,  windowHeight / 2 - 40, offset, 50);
    //#endregion

    //#region events
    this.load.on('progress', value => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(offset / 2, windowHeight / 2 - 30, offset * value, 30);
    });
    
    this.load.on('fileprogress', file => {
      assetText.setText('Loading asset: ' + file.key);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      assetText.destroy();
    });
    //#endregion
    
    // this.load.setBaseURL('http://localhost:8080');

    //#region resource load
    const symbolsSrc = 'assets/symbols/'
    this.loadImages(
      [
        ['bg', 'assets/frame.png'],
        ['prize', 'assets/prize_window.png'],
        ['spin', 'assets/btn_spin.png'],
        ['line1', 'assets/line_1.png'],
        ['line4', 'assets/line_4.png'],
        ['line5', 'assets/line_5.png'],
        
        ['a', symbolsSrc + 'sonic_sym_a.png'],
        ['b', symbolsSrc + 'sonic_sym_b.png'],
        ['c', symbolsSrc + 'sonic_sym_c.png'],
        ['d', symbolsSrc + 'sonic_sym_d.png'],
        ['e', symbolsSrc + 'sonic_sym_e.png'],
        
        ['bg-casino', 'assets/bg/casino.png']
      ]
    )

    const audioSrc = 'assets/audio/';
    this.loadAudios(
      [
        // ['ring', audioSrc + 'S3K_33.wav'],
        ['continue', audioSrc + 'S3K_AC.wav'],
        ['error', audioSrc + 'S3K_B2.wav'],
        ['ring-loss', audioSrc + 'sonic_losing_rings.mp3'],
        ['spin', audioSrc + 'S3K_53.wav'],
        
        // ['song-casino-night', audioSrc + 'songs/CasinoNightZone.mp3'],
      ]
    );
    //#endregion
  }
  
  update () {
    // if (this.fontsReady) {
      // this.scene.start('GameScene')
      this.scene.start('MainMenuScene')
    // }
  }

  loadImages( list ){
    let record;
    for ( let i in list ){
      record = list[i];
      this.load.image(record[0], record[1]);
    }
  }
  loadAudios( list ){
    let record;
    for ( let i in list ){
      record = list[i];
      this.load.audio(record[0], record[1], {
        instances: 1
      });
    }
  }
}
