export default class SimpleMenu {
  private list: Array<Phaser.GameObjects.Text> = [];
  private actions: Array<any> = [];
  private selected: number = 0;
  private x;
  private y;
  private style;
  private scene;
  private hidden;
  private events: any = {};
  private customKeys: Array<any> = [];
  
  private sounds;

  constructor(scene, x, y, style, sounds: { change: Phaser.Sound.BaseSound, selector: Phaser.Sound.BaseSound, cancel: Phaser.Sound.BaseSound }, hidden = false){
    this.x = x;
    this.y = y;
    this.style = style;
    this.scene = scene;
    this.hidden = hidden;
    
    this.sounds = sounds;
  }
  onKey( keyCode, action ){
    this.customKeys.push({ keyCode, action });
    return this;
  }
  addOnKeys(){
    for( let { keyCode, action} of this.customKeys ){
      switch ( keyCode ){
        case 'ESC':
          this.events.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
            .on('down', () => {
              this.sounds.cancel.play();
              action();
            });
          break;
      }
    }
    return this;
  }
  addIf( check, text, action ) {
    if( check )
      this.add( text, action );

    return this;
  }
  add( text, action ){
    // calculate line
    const lineHeight = this.style && this.style.fontSize ? parseInt(this.style.fontSize) * 1.1 : 24;

    // text object creation
    let textRef = this.scene.add.text( this.x, this.y + lineHeight * this.list.length, text, this.style).setOrigin(0.5, 0.5);

    // if( this.style.shadow ) {
    //   textRef.setShadow(5, 5, 'rgba(0,0,0,0.5)', 15);
    // }
    
    // added to the list
    this.list.push( textRef );
    this.actions.push( action );

    if( this.hidden ){
      textRef.setAlpha(0);
    }
    
    return this;
  }
  hide(){
    this.scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    this.scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    
    for(let item of this.list){
      item.setAlpha(0);
    }
  }
  show(now = false){
    if( now ){
      for(let item of this.list){
        item.setAlpha(1);
      }
      this.enableKeys();
      return;
    }
    
    this.scene.addAnimation(this.list, {
        alpha: {
          ease: 'Power0',
          from: 0,
          start: 0,
          to: 0.5,
        }
      }, 500)
      .setCallback('onComplete', o => this.enableKeys(), [])
    ;
  }
  selectItem(){
    this.actions[this.selected]();
  }
  updateView(){
    for(let i in this.list){
      let item = this.list[i];
      item.setAlpha( +i == this.selected ? 1 : 0.5 );
    }
  }
  enableKeys(){
    this.events.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
      .on('down', e => {
        if( this.selected > 0 ){
          this.selected--;
          this.sounds.change.play();
        }
        this.updateView();
      });
    this.events.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
      .on('down', e => {
        if( this.selected < this.list.length-1 ){
          this.selected++;
          this.sounds.change.play();
        }
        this.updateView();
      });
      
    this.events.enter = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      .on('down', e => {
        this.sounds.selector.play();
        this.selectItem();
      });
      
    this.addOnKeys();
    this.updateView();
  }
}