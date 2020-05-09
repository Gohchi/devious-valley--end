import Phaser from 'phaser'

export default class Background {
  constructor( scene ){
    this.scene = scene;
    // this.tint = Math.random() * 0xffffff;
    this.tint0 = 0x666666;
    this.tint1 = 0x000000;
    this.tint2 = 0xffffff;
    this.iter = 0;
    
    
    this.bg00 = scene.add.tileSprite(0, 0, 
      scene.sys.game.config.width,
      scene.sys.game.config.height, 
      'bg00'
    ).setOrigin(0)
    .setTint(this.tint0, this.tint0, this.tint1, this.tint1);

    this.bg01 = scene.add.tileSprite(0, 0, 
      scene.sys.game.config.width,
      scene.sys.game.config.height, 
      'bg01'
    ).setOrigin(0)
    .setTint(this.tint2, this.tint2, this.tint2, this.tint2);
    
    this.bg01.alpha = 0.4;

    this.tweens = scene.tweens.addCounter({
      from: 1,
      to: 2,
      duration: 5000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }
  static prepare( scene ){
    scene.load.image('bg00', 'assets/bg/stressed.png');
    scene.load.image('bg01', 'assets/bg/blocks01.png');
  }
  update(){
    let bg01 = this.bg01, tween = this.tweens;
    bg01.tilePositionX = Math.cos(this.iter) * 100;
    bg01.tilePositionY = Math.sin(this.iter) * 100;

    bg01.tileScaleX = tween.getValue();
    bg01.tileScaleY = tween.getValue();
    bg01.flipX = !bg01.flipX;
    bg01.flipY = !bg01.flipY;

    this.iter += 0.01;
  }
}