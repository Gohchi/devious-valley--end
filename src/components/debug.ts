import Phaser from 'phaser'

export default class Debug {
  private text: Phaser.GameObjects.Text;
  private fns: Array<any> = [];

  constructor( scene: Phaser.Scene, x = 10, y = 10 ){
    this.text = scene.add.text(x, y, "");
  }

  add( fn: any ){
    this.fns.push( fn );
    return this;
  }
  
  update(){
    let values = [];
    for( let fn of this.fns){
      values.push(fn());
    }
    this.text.setText( values.join('\r\n') );
  }
}