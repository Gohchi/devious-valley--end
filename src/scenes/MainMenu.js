import Phaser from 'phaser'

import { text, font, style } from '../lib/common'

class SimpleMenu {
  constructor(scene, x, y, style, sounds = { change: null, selector: null, cancel: null }, hidden = false){
    this.list = [];
    this.actions = [];
    this.selected = 0;
    this.x = x;
    this.y = y;
    this.style = style;
    this.scene = scene;
    this.hidden = hidden;
    this.events = {};
    this.customKeys = [];
    
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
      item.setAlpha( i == this.selected ? 1 : 0.5 );
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
export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'MainMenuScene' })
  }

  preload () {
    this.load.image('base-button', 'assets/base-button.png'),

    this.load.audio('wind-chimes', 'assets/audio/wind_chimes.mp3', { instances: 1 });
    this.load.audio('main-menu', 'assets/audio/songs/main-menu.mp3', { instances: 1 });

    this.load.audio('menu-change', 'assets/audio/menu-change.mp3', { instances: 1 });
    this.load.audio('menu-selector', 'assets/audio/menu-selector.mp3', { instances: 1 });
    this.load.audio('menu-cancel', 'assets/audio/menu-cancel.mp3', { instances: 1 });

  }

  create () {
    this.saves = [1,2];
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

    let ellipse = new Phaser.Geom.Ellipse(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 0, 0);

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
    
    //#region mask
    // const maskBaseValue = 200;
    // const maskX = this.sys.game.config.width / 2 - maskBaseValue, maskY = this.sys.game.config.height/ 2 - maskBaseValue;
    // const maskShape = new Phaser.Geom.Rectangle( maskX, maskY, maskBaseValue*2, maskBaseValue*2 );
    // const maskGfx = this.make.graphics()
    //     .setDefaultStyles({
    //         fillStyle: {
    //             // color: 0x000000,
    //             // color: 0xffffff,
    //             alpha: .1
    //         }
    //     })
    //     .fillRectShape(maskShape)
    //     .generateTexture('mask')
    // ;
    // this.mask = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'mask')
    //     // .setPosition( 0, 0)
    //     // .setOrigin(0.5)
    // ;
    // this.cameras.main.setMask(
    //   new Phaser.Display.Masks.BitmapMask(this, this.mask)
    // );
    //#endregion
    
    //#region title
    this.titleText = this.add.text( this.sys.game.config.width / 2, this.sys.game.config.height / 3, text.Title, style.Title )
      .setOrigin(0.5, 0.5);
    this.versionText = this.add.text( this.titleText.x + this.titleText.width*.34, this.titleText.y - this.titleText.height*.08, text.Version, style.Version )
    //#endregion

    // this.add.image( this.sys.game.config.width / 2, this.sys.game.config.height / 1.5, 'base-button')
    //   .setOrigin(0.5, 0.5)
    //   .setScale(2, 1)
    //   // .setAlpha()
    //   .setInteractive()
    //     .on('pointerup', () => {
    //       console.log('asd');
    //     });

    //#region menu
    this.pressAnyButtonText = this.add.text( this.sys.game.config.width / 2, this.sys.game.config.height / 1.5, 'PRESS ANY BUTTON', {
      fontFamily: font.Title,
      fontSize: '22px'
    }).setOrigin(0.5, 0.5);
    
    let sounds = {
      change: this.sound.add('menu-change', {volume: 0.5}),
      selector: this.sound.add('menu-selector', {volume: 0.5}),
      cancel: this.sound.add('menu-cancel', {volume: 0.5})
    };
    let optionsMenu = new SimpleMenu(this, this.sys.game.config.width / 2, this.sys.game.config.height / 1.8, {
      fontFamily: font.Title,
      fontSize: '28px'
    }, sounds, true).onKey('ESC', () => { optionsMenu.hide(); mainMenu.show(true); })
      .add('Audio', () => console.log('Audio selected'))
      .add('Video', () => console.log('Video selected'));
      
    this.saveExists = true;
    let mainMenu = new SimpleMenu(this, this.sys.game.config.width / 2, this.sys.game.config.height / 1.8, {
      fontFamily: font.Title,
      fontSize: '28px'
    }, sounds, true)
      .add('New game', () => {
          mainMenu.hide();
          this.addAnimation(this.cameras.main, {
              alpha: {
                ease: 'Power0',
                from: 1,
                start: 1,
                to: 0,
              }
            })
            .setCallback('onComplete', o => {
              this.scene.start('LoadGameScene')
            }, [])
          ;
        }
      )
      .addIf(this.saveExists, 'Continue', () => {
        mainMenu.hide();
        this.selectContinue( () => mainMenu.show(true) );
      } )
      .add('Options', () => { mainMenu.hide(); optionsMenu.show(true) })
      .add('Quit', () => { this.game.destroy(true); window.close() })
    //#endregion

    // this.copyrightText = this.add.text( this.sys.game.config.width / 2, this.sys.game.config.height / 1.1, 'Devious Valley™ --end / ©2020 , Inc.', {
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
        }, [])
      ;
    });

    // this.textJoypadInfo = this.add.text(10, 30, '', { font: '16px Courier', fill: '#ffffff' });
    // this.joypadAdded = false;
  }
  
  update() {
    // this.checkJoypad()
    // //#region joypad
    // this.joypadTest();
    // //#endregion

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
  
  selectContinue(callback){
    //#region menu continue
    let selected = 0;
    const x = 0; // this.sys.game.config.width / 2;
    const w = this.sys.game.config.width;
    const h = this.sys.game.config.height;
 
    const config = { lineStyle: { color: 0x00aaaa }, fillStyle: { color: 0x222222, alpha: .5 } };
    const menuContinueGraphics = this.add.graphics( config );
    // title
    const shapeTitle = new Phaser.Geom.Rectangle( x, 0, w, 80 );
    menuContinueGraphics.fillRectShape( shapeTitle );

    const menuContinueTitleText = this.add.text( x + w / 8, shapeTitle.height/2, 'LOAD GAME', {
      // fill: '#f22d',
      fontFamily: font.Title,
      fontSize: '28px',
      fontStyle: 'bold'
    });//.setOrigin(0.5, 0.5);
    
    // frame
    const shapeFrame = new Phaser.Geom.Rectangle( x + w/8, shapeTitle.height + 10, w - w/8*2, h - (shapeTitle.height*2) );
    menuContinueGraphics.fillStyle(0x111111, .9)
    menuContinueGraphics.fillRectShape( shapeFrame );

    // saves
    let saveTextList = [];
    const menuContinueSaveGraphics = this.add.graphics( config );
    this.drawSaveList( menuContinueSaveGraphics, shapeFrame, saveTextList, selected, x + w );
    
    let camSaves = this.cameras.add(shapeFrame.x, shapeFrame.y, shapeFrame.width, shapeFrame.height).setScroll(shapeFrame.x + x + w, shapeFrame.y);
    
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
      .on('down', () => {
        if( selected < this.saves.length-1 ){
          selected++;
          // camSaves.setScroll(camSaves.scrollX, camSaves.scrollY + 140);
          menuContinueSaveGraphics.clear();
          this.destroyList( saveTextList );
          this.drawSaveList( menuContinueSaveGraphics, shapeFrame, saveTextList, selected, x + w );
        }
      });
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
      .on('down', () => {
        if( selected > 0 ){
          selected--;
          // camSaves.setScroll(camSaves.scrollX, camSaves.scrollY - 140);
          menuContinueSaveGraphics.clear();
          this.destroyList( saveTextList );
          this.drawSaveList( menuContinueSaveGraphics, shapeFrame, saveTextList, selected, x + w );
        }
      });
      
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
      .on('down', () => {
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.UP)
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        menuContinueGraphics.destroy();
        menuContinueSaveGraphics.destroy();
        menuContinueTitleText.destroy();
        this.destroyList( saveTextList );
        callback();
      });
    //#endregion
  }
  destroyList( list ){
    for( let texts of list ){
      texts.name.destroy();
      texts.journey.destroy();
      texts.location.destroy();
      texts.time.destroy();
    }
  }
  drawSaveList( menuContinueSaveGraphics, shapeFrame, saveTextList, selected, fix ){
    const lrpadding = 80, saveHeight = 120;

    for( let i = 0; i < this.saves.length; i++ ){ 
      const shapeSave = new Phaser.Geom.Rectangle( fix + shapeFrame.x + lrpadding, shapeFrame.y + 10 + (saveHeight+20)*i , shapeFrame.width - lrpadding*2, saveHeight);
      menuContinueSaveGraphics.fillStyle(selected == i ? 0x555555 : 0x333333, 1)
      menuContinueSaveGraphics.fillRectShape( shapeSave );
      
      // photo
      menuContinueSaveGraphics.fillStyle(0x222222, 1)
      menuContinueSaveGraphics.fillRect( shapeSave.x + 40, shapeSave.y + 10, shapeSave.height - 20, shapeSave.height - 20 );

      let texts = {};
      texts.name = this.add.text( shapeSave.x + 40 + shapeSave.height, shapeSave.y + 20, i == 0 ? 'Gravelord Eru' : 'John Titor', {
        fontFamily: font.Title,
        fontSize: '20px'
      });
      
      texts.journey = this.add.text( shapeSave.x + 40 + shapeSave.height, shapeSave.y + 80, i == 0 ? 'Journey: 2' : '', {
        fontFamily: font.Title,
        fontSize: '20px'
      });
      
      texts.location = this.add.text( shapeSave.x + shapeSave.width - 20, shapeSave.y + 20, i == 0 ? 'Forbidden Stadium' : 'Arduma - Main Hall', {
        fontFamily: font.Title,
        fontSize: '20px',
        rtl: true
      });

      texts.time = this.add.text( shapeSave.x + shapeSave.width - 20, shapeSave.y + 80, i == 0 ? '56:39:23' : '1:23:30', {
        fontFamily: font.Title,
        fontSize: '20px',
        rtl: true
      });
      saveTextList.push(texts);
    }
  }

  //#region joypad
  checkJoypad(){
    
    if (this.joypadAdded || this.input.gamepad.total === 0)
    {
      return;
    }
    this.input.gamepad.pad1.on('down', (pad, button, value) => {
      console.log(pad, button, value);
    });
    console.log('joypad added');
    this.joypadAdded = true;
  }
  joypadTest(){

    if (this.input.gamepad.total === 0)
    {
      return;
    }

    var debug = [];
    var pads = this.input.gamepad.gamepads;
    // var pads = this.input.gamepad.getAll();
    // var pads = navigator.getGamepads();

    for (var i = 0; i < pads.length; i++)
    {
        var pad = pads[i];

        if (!pad)
        {
            continue;
        }

        //  Timestamp, index. ID
        debug.push(pad.id);
        debug.push('Index: ' + pad.index + ' Timestamp: ' + pad.timestamp);

        //  Buttons

        var buttons = '';

        for (var b = 0; b < pad.buttons.length; b++)
        {
            var button = pad.buttons[b];

            buttons = buttons.concat('B' + button.index + ': ' + button.value + '  ');
            // buttons = buttons.concat('B' + b + ': ' + button.value + '  ');

            if (b === 8)
            {
                debug.push(buttons);
                buttons = '';
            }
        }
        
        debug.push(buttons);

        //  Axis

        var axes = '';

        for (var a = 0; a < pad.axes.length; a++)
        {
            var axis = pad.axes[a];

            axes = axes.concat('A' + axis.index + ': ' + axis.getValue() + '  ');
            // axes = axes.concat('A' + a + ': ' + axis + '  ');

            if (a === 1)
            {
                debug.push(axes);
                axes = '';
            }
        }
        
        debug.push(axes);
        debug.push('');
    }
    
    this.textJoypadInfo.setText(debug);
  }
  //#endregion
}
