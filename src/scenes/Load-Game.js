import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'LoadGameScene' })
  }

  preload () {
  }

  create () {
    this.bggraphics = this.add.graphics({ lineStyle: { color: 0x00aaaa, alpha: .2 }, fillStyle: { color: 0x00aaaa } });
    
    let ellipse = new Phaser.Geom.Ellipse(this.sys.game.config.width - 80, this.sys.game.config.height - 70, 7, 7);
    let ellipseCenter = Phaser.Geom.Ellipse.Clone(ellipse).setSize(60);

    this.bgellipses = [];

    for(let i = 0; i < 10; i++)
    {
      ellipse = Phaser.Geom.Ellipse.Clone(ellipse);

      Phaser.Geom.Ellipse.CircumferencePoint(ellipseCenter, i / 10 * Phaser.Math.PI2, ellipse);

      this.bgellipses.push(ellipse);
    }
    this.pointSelected = 0;

    setTimeout( ()=>{
      this.scene.start('Game2Scene')
    }, 2000)
  }
  
  update() {
    let graphics = this.bggraphics, ellipses = this.bgellipses;
    graphics.clear();

    this.pointSelected++;
    if( this.pointSelected >= 10 ){
      this.pointSelected = 0;
    }
    for(let i in ellipses) {
      if(this.pointSelected == i){
        graphics.fillEllipseShape(ellipses[i]);
      } else {
        graphics.strokeEllipseShape(ellipses[i]);
      }

    }
  }
}
