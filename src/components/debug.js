import Phaser from 'phaser'

export default class Debug {
  constructor( scene, x = 10, y = 10 ){
    this.text = scene.add.text(x, y, "");
    this.fns = [];
  }
  add( fn ){
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