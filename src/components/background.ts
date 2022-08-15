import Phaser from 'phaser'

import stressedPng from '../assets/bg/stressed.png';
import blocks01Png from '../assets/bg/blocks01.png';

export class Background {
  // private scene: Phaser.Scene;
  private iter: number;
  private bg: Array<any> = [];
  private tweens: Phaser.Tweens.Tween;

  constructor( scene: Phaser.Scene ){
    // this.scene = scene;
    // this.tint = Math.random() * 0xffffff;
    const tint0 = 0x666666;
    const tint1 = 0x000000;
    const tint2 = 0xffffff;
    this.iter = 0;
    
    this.bg[0] = scene.add.tileSprite(0, 0, 
      +scene.sys.game.config.width,
      +scene.sys.game.config.height, 
      'bg00'
    ).setOrigin(0)
    .setTint(tint0, tint0, tint1, tint1);

    this.bg[1] = scene.add.tileSprite(0, 0, 
      +scene.sys.game.config.width,
      +scene.sys.game.config.height, 
      'bg01'
    ).setOrigin(0)
    .setTint(tint2, tint2, tint2, tint2);
    
    this.bg[1].alpha = 0.4;

    this.tweens = scene.tweens.addCounter({
      from: 1,
      to: 2,
      duration: 5000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }

  static prepare( scene: Phaser.Scene ){
    scene.load.image('bg00', stressedPng);
    scene.load.image('bg01', blocks01Png);
  }
  
  update(){
    let bg01 = this.bg[1], tween = this.tweens;
    bg01.tilePositionX = Math.cos(this.iter) * 100;
    bg01.tilePositionY = Math.sin(this.iter) * 100;

    bg01.tileScaleX = tween.getValue();
    bg01.tileScaleY = tween.getValue();
    bg01.flipX = !bg01.flipX;
    bg01.flipY = !bg01.flipY;

    this.iter += 0.01;
  }
}