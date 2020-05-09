import Phaser from 'phaser'
import Player from '../components/player'
import Background from '../components/background'
import Debug from '../components/debug'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'Game2Scene' })
  }
  preload ()
  {
    // //  Load sprite sheet generated with TexturePacker
    this.load.atlas('sheet', 'assets/physics/fruit-sprites.png', 'assets/physics/fruit-sprites.json');
    
    // //  Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('shapes', 'assets/physics/fruit-shapes.json');
    this.load.image('blocks01-flooring', 'assets/material/blocks01-flooring.png');

    Background.prepare( this );
    Player.prepare( this );
  }

  create ()
  {
    this.bg = new Background( this );

    this.createGround();
    
    // create player
    this.player = new Player( this );
    
    let shapes = this.cache.json.get('shapes');

    this.input.on('pointerdown', function (pointer)
    {
        var fruit = Phaser.Utils.Array.GetRandom([ 'crate', 'banana', 'orange', 'cherries' ]);
        this.matter.add.image(pointer.x, pointer.y, 'sheet', fruit, { shape: shapes[fruit] });
    }, this);

      // .setBody(shapes.banana)
    ;
    
    if(this.sys.game.config.physics.matter.debug){
      this.debugInfo = new Debug( this, 500, 200 );
      this.debugInfo
        .add(() => "Angle: " + Math.round(this.player.sprite.angle))
        .add(() => "On ground: " + this.player.playerOnGround)
        .add(() => "Vel X: " + Math.round(this.player.gameObject.body.velocity.x));
    }
    
    this.delayCall;
    this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
      // console.log('collisionstarts');
      let go = bodyA.gameObject;
      if(go.name){
        let tint = Math.random() * 0xffffff;
        go.setTint(tint);
        if(go.name == 'ground2'){
          go.setScale(Math.floor(Math.random() * 5) + 1, 1);
          // go.setAngle(go.angle+1);
          // go.setAngle(Math.floor(Math.random() * 360));

        }
      }
      clearTimeout(this.delayCall);
      this.delayCall = setTimeout(() => {
        // console.log('onGround');
        this.player.playerOnGround = true;
      }, 100);
    });
    
    this.gravityChanged = false;
  }

  update(){
    this.bg.update();

    //#region ground movement
    let fix = 450;
    let v = Math.floor( this.bg.tweens.getValue() * fix );
    this.ground2.y = v - fix*0.7 ;
    //#endregion

    if(this.sys.game.config.physics.matter.debug) this.debugInfo.update();
    
    this.player.update();
  }

  createGround(){
    const baseGround = 500;
    this.matter.add
      .image(this.sys.game.config.width / 2, baseGround + 120, 'blocks01-flooring', null, { isStatic: true, density: .5 }) //density: .5
      .setScale(8, 1)
      // .tint = Math.random() * 0xffffff;
      // .setAngle(10)
      .name = 'ground0'
    ;
    this.matter.add
      .image(150, baseGround-200, 'blocks01-flooring', null, { isStatic: true })
      .setScale(4, 1)
      .setAngle(45)
      .name = 'ground1'
    ;
    this.ground2 = this.matter.add
      .image(1200, baseGround, 'blocks01-flooring', null, { isStatic: true })
      .setScale(4, 1);
    this.ground2
      .name = 'ground2';
      // .setAngle(-20)
    ;
  }
}