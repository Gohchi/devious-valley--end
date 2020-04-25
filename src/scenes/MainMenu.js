import Phaser from 'phaser'

import { windowHeight, windowWidth } from '../config'
import { text, font, style } from '../lib/common'

class SimpleMenu {
  constructor(scene, x, y, style, hidden = false){
    this.list = [];
    this.actions = [];
    this.selected = 0;
    this.x = x;
    this.y = y;
    this.style = style;
    this.scene = scene;
    this.hidden = hidden;
    this.events = {};
  }
  onKey( keyCode, action ){
    switch (keyCode){
      case 'ESC':
        this.events.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
          .on('down', action);
        break;
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
    .setCallback('onComplete', o => this.enableKeys(), []);
  }
  selectItem(){
    this.actions[this.selected]();
  }
  updateView(){
    for(let i in this.list){
      let item = this.list[i];
      item.setAlpha( i == this.selected ? 1 : 0.5 );
    }
  }
  enableKeys(){
    this.events.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
      .on('down', e => {
        if( this.selected > 0 ){
          this.selected--;
        }
        this.updateView();
      });
    this.events.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
      .on('down', e => {
        if( this.selected < this.list.length-1 ){
          this.selected++;
        }
        this.updateView();
      });
      
    this.events.enter = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      .on('down', e => {
        this.selectItem();
      });
      
    this.updateView();
  }
}
export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'MainMenuScene' })
  }

  preload () {
    this.load.image('base-button', 'assets/base-button.png'),

    this.load.audio('wind-chimes', 'assets/audio/wind_chimes.mp3', { instances: 1 });
    this.load.audio('main-menu', 'assets/audio/songs/main-menu.mp3', { instances: 1 });
  }

  create () {
    //#region music
    this.song = this.sound.add('main-menu', {volume: 0.2});
    this.song.play();
    //#endregion

    //#region sounds
    this.soundWindChime = this.sound.add('wind-chimes', {volume: 0.5});
    //#endregion

    //#region background
    // this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#dddddd");
    this.bggraphics = this.add.graphics({ lineStyle: { color: 0x00aaaa } });

    let ellipse = new Phaser.Geom.Ellipse(windowWidth / 2, windowHeight / 2, 0, 0);

    this.bgellipses = [ellipse];

    for(let i = 0; i < 100; i++)
    {
        ellipse = Phaser.Geom.Ellipse.Clone(ellipse);
        ellipse.width += 1.5;
        ellipse.height += 0.7;

        Phaser.Geom.Ellipse.CircumferencePoint(ellipse, i / 20 * Phaser.Math.PI2, ellipse);

        this.bgellipses.push(ellipse);
    }
    //#endregion
    
    this.titleText = this.add.text( windowWidth / 2, windowHeight / 3, text.Title, style.Title )
      .setOrigin(0.5, 0.5);
    this.versionText = this.add.text( this.titleText.x + this.titleText.width*.34, this.titleText.y - this.titleText.height*.08, text.Version, style.Version )

    // this.add.image( windowWidth / 2, windowHeight / 1.5, 'base-button')
    //   .setOrigin(0.5, 0.5)
    //   .setScale(2, 1)
    //   // .setAlpha()
    //   .setInteractive()
    //     .on('pointerup', () => {
    //       console.log('asd');
    //     });

    //#region menu
    this.pressAnyButtonText = this.add.text( windowWidth / 2, windowHeight / 1.5, 'PRESS ANY BUTTON', {
      fontFamily: font.Title,
      fontSize: '22px'
    }).setOrigin(0.5, 0.5);
    
    let optionsMenu = new SimpleMenu(this, windowWidth / 2, windowHeight / 1.8, {
      fontFamily: font.Title,
      fontSize: '28px'
    }, true).onKey('ESC', () => { optionsMenu.hide(); mainMenu.show(true) })
      .add('Audio', () => console.log('Audio selected'))
      .add('Video', () => console.log('Video selected'));
      
    this.saveExists = true;
    let mainMenu = new SimpleMenu(this, windowWidth / 2, windowHeight / 1.8, {
      fontFamily: font.Title,
      fontSize: '28px'
    }, true)
      .add('New game', () => console.log('new game selected'))
      .addIf(this.saveExists, 'Continue', () => console.log('continue selected'))
      .add('Options', () => { mainMenu.hide(); optionsMenu.show(true) })
      .add('Quit', () => this.game.destroy(true))
    //#endregion

    // this.copyrightText = this.add.text( windowWidth / 2, windowHeight / 1.1, 'Devious Valley™ --end / ©2020 , Inc.', {
    //   fontFamily: font.Title,
    //   fontSize: '18px'
    // }).setOrigin(0.5, 0.5);

    const MASK_MIN_SCALE = .9;
    const MASK_MAX_SCALE = 1;

    const propertyConfig = {
        ease: 'Power0',
        from: MASK_MAX_SCALE,
        start: MASK_MAX_SCALE,
        to: MASK_MIN_SCALE,
    };
    
    this.input.keyboard.on('keydown', e => { 
      e.stopPropagation();
      this.input.keyboard.removeListener('keydown');
      
      this.soundWindChime.play();
      
      this.addAnimation(this.pressAnyButtonText, {
        scaleX: propertyConfig,
        scaleY: propertyConfig,
        alpha: {
          ease: 'Power0',
          from: 1,
          start: 1,
          to: 0,
        }
      })
        .setCallback('onComplete', o => {
          mainMenu.show();
        }, []);
    });
  }
  
  update() {
    //#region background
    let graphics = this.bggraphics, ellipses = this.bgellipses;
    graphics.clear();

    for(var i = 0; i < ellipses.length; i++)
    {
        ellipses[i].width += 1.5;
        ellipses[i].height += 0.7;

        if(ellipses[i].width > 1000)
        {
            ellipses[i].width = 0;
            ellipses[i].height = 0;
        }

        graphics.strokeEllipseShape(ellipses[i]);
    }
    //#endregion
  }

  addAnimation( target, config, duration = 1000 ){
    return this.tweens.add(Object.assign({}, config, { targets: target, duration }));
  }
}
