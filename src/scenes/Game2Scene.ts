import Phaser from 'phaser';
// import Player from '../components/player';
import { Background } from '../components/background';
import { Ship } from '../components/ship';
import Debug from '../components/debug';

import fruitSpritesPng from '../assets/physics/fruit-sprites.png';
import fruitSpritesJson from '../assets/physics/fruit-sprites.json';
import fruitShapesJson from '../assets/physics/fruit-shapes.json';
import blocks01FlooringPng from '../assets/material/blocks01-flooring.png';
import tileset01Png from '../assets/tilesets/tileset01.png';
import map01Json from '../assets/tilesets/map01.json';

export class Game2Scene extends Phaser.Scene {
  private debug: boolean | Phaser.Types.Physics.Matter.MatterDebugConfig | undefined;
  private ship: Ship;
  // private player: Player;
  private debugData: any;
  private debugInfo: any;
  // private delayCall: any;
  private ground2: any;
  private cameraControls: Phaser.Cameras.Controls.SmoothedKeyControl | any;

  constructor () {
    super({ key: 'Game2Scene' })
    
    this.ship = new Ship();
    this.debugData = {
      force: 0
    }
  }
  preload ()
  {
    // //  Load sprite sheet generated with TexturePacker
    this.load.atlas('sheet', fruitSpritesPng, fruitSpritesJson);
    
    // //  Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('shapes', fruitShapesJson);
    this.load.image('blocks01-flooring', blocks01FlooringPng);
    
    this.load.image('tileset01', tileset01Png);
    this.load.tilemapTiledJSON('map', map01Json);


    Background.prepare( this );
    // Player.prepare( this );
    Ship.prepare( this );
  }

  create ()
  {
    this.debug = !!this.sys.game.config.physics.matter && this.sys.game.config.physics.matter.debug;
    {
      this.cameras.main.zoom = 1;
      // let cursors = this.input.keyboard.createCursorKeys();

      let controlConfig = {
          camera: this.cameras.main,
          // left: cursors.left,
          // right: cursors.right,
          // up: cursors.up,
          // down: cursors.down,
          zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
          zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
          acceleration: 0.06,
          drag: 0.0005,
          maxSpeed: 1.0
      };
  
      this.cameraControls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    }

    // test spaceship
    {
      this.ship.create( this );
      this.debugData.force = 0.01;
    }

    // GAME
    {
        
      const map = this.make.tilemap({ key: 'map' });
      const tileset = map.addTilesetImage('Tileset', 'tileset01', 64, 64, 0, 0);
      // const layer = map.createLayer('TileLayer01', tileset, 0, 0);

      // this.bg = new Background( this );

      this.createGround();
      
      // create player
      // this.player = new Player( this );
      
      // let shapes = this.cache.json.get('shapes');

      // this.input.on('pointerdown', function (pointer)
      // {
      //     let fruit = Phaser.Utils.Array.GetRandom([ 'crate', 'banana', 'orange', 'cherries' ]);
      //     this.matter.add.image(pointer.x, pointer.y, 'sheet', fruit, { shape: shapes[fruit] });
      // }, this);

        // .setBody(shapes.banana)
      ;
      
      if(this.debug){
        this.debugInfo = new Debug( this, 500, 200 );
        this.debugInfo
          .add(() => "Force: " + this.ship.getValue( 'force' ))
          .add(() => "Lock: " + this.ship.getValue( 'lock' ))
          .add(() => "Acc: " + Math.round((this.ship.getValue( 'force_acc') + Number.EPSILON ) * 10000) / 10000)
          // .add(() => "Angle: " + Math.round(this.player.sprite.angle))
          // .add(() => "On ground: " + this.player.playerOnGround)
          // .add(() => "Vel X: " + Math.round(this.player.gameObject.body.velocity.x));
      }
      
      this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
        // console.log('collisionstarts');
        let go = bodyA.gameObject;

        if( !go ) return;

        if(go.name){
          let tint = Math.random() * 0xffffff;
          go.setTint(tint);
          if(go.name == 'ground2'){
            go.setScale(Math.floor(Math.random() * 5) + 1, 1);
            // go.setAngle(go.angle+1);
            // go.setAngle(Math.floor(Math.random() * 360));

          }
        }
        // clearTimeout(this.delayCall);
        // this.delayCall = setTimeout(() => {
        //   // console.log('onGround');
        //   this.player.playerOnGround = true;
        // }, 100);
      });
    }

  }

  update(time, delta){
    this.cameraControls.update(delta);
    // test spaceship
    this.ship.update(); // this, time, delta );
    
    // GAME
    // this.bg.update();

    //#region ground movement
    let fix = 450;
    // let v = Math.floor( this.bg.tweens.getValue() * fix );
    // this.ground2.y = v - fix*0.7 ;
    //#endregion

    if(this.debug) this.debugInfo.update();
    
    // this.player.update();
  }

  createGround(){
    const globalWidth: number = +this.sys.game.config.width;
    const baseGround = 500;
    this.matter.add
      .image(globalWidth / 2, baseGround + 120, 'blocks01-flooring', undefined, { isStatic: true, density: .5 }) //density: .5
      .setScale(8, 1)
      // .tint = Math.random() * 0xffffff;
      // .setAngle(10)
      .name = 'ground0'
    ;
    this.matter.add
      .image(150, baseGround-200, 'blocks01-flooring', undefined, { isStatic: true })
      .setScale(4, 1)
      .setAngle(45)
      .name = 'ground1'
    ;
    this.ground2 = this.matter.add
      .image(1200, baseGround, 'blocks01-flooring', undefined, { isStatic: true })
      .setScale(4, 1);
    this.ground2
      .name = 'ground2';
      // .setAngle(-20)
    ;
  }
}