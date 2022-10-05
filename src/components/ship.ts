import Phaser from 'phaser'

import spacePng from '../assets/tests/space/space.png';
import spaceJson from '../assets/tests/space/space.json';
import spaceShapeJson from '../assets/tests/space/space-shapes.json';

import impulseLoadMp3 from '../assets/audio/impulse-load.mp3';
import impulseReleaseMp3 from '../assets/audio/impulse-release.mp3';
import { getPointer } from '../utils/tools';

export class Ship {
  private cursors: any;
  public image: Phaser.Physics.Matter.Image | any;
  private values: any;
  private events: any;
  private keys: any;
  private sounds: any = {};
  // private onScreenButtons: any = {};
  
  constructor(){
    this.cursors = null;
    this.values = {
      lerp: 0.05,
      originalForce: 0.01,
      force: 0.01,
      force_acc: 0.01,
      lock: false
    };
    this.events = {
      tween: null
    };
  }

  static prepare( scene: Phaser.Scene ){
    scene.load.atlas('space', spacePng, spaceJson);
    scene.load.json('space-shapes', spaceShapeJson);

    scene.load.audio('impulse-load', impulseLoadMp3, { instances: 1 });
    scene.load.audio('impulse-release', impulseReleaseMp3, { instances: 1 });
  }

  create( scene: Phaser.Scene ){
    this.keys = {
      space: scene.input.keyboard.addKey('space')
    };

    // CAMERA
    {
      const camera = scene.cameras.main;
      const handlerDown = () => {
        camera.zoomTo(2, 4000, 'Power2', true);
        camera.shake(1000000, 0.0006, true); // infinite shake
      };
      const handlerUp = () => {
        camera.shake(1, 0, true);
        camera.zoomTo(1, 2000, 'Power2', true);
      };
      this.keys.space.on('down', handlerDown);
      this.keys.space.on('up', handlerUp);

      scene.input.on('pointerdown', handlerDown);
      scene.input.on('pointerup', handlerUp);
    }
    
    // SOUNDS
    {
      this.sounds['impulse-load'] = scene.sound.add('impulse-load', {volume: 0.5}) as Phaser.Sound.BaseSound;
      this.sounds['impulse-release'] = scene.sound.add('impulse-release', {volume: 0.5}) as Phaser.Sound.BaseSound;
    }

    // const particles = [{x: -15, y:-24 }].map( o => Object.assign( o, { p: this.createParticles( scene )}) );
    const particles = this.createParticles( scene );

    // let shapes = scene.cache.json.get('space-shapes');
    const image: Phaser.Physics.Matter.Image | any = scene.matter.add.image(1600, 300, 'space', 'moon6');
    // const image = scene.matter.add.image(400, 300, 'space', 'moon6', { shape: shapes['moon'] });
    this.image = image;
    {
      const matter = (Phaser.Physics.Matter as any).Matter;
      var Bodies = matter.Bodies;
      
      const image_body = Bodies.circle( 0, 0, 28 ),
      // // const scale = 1.5;
      // // image.setScale(scale, scale);

      LT = Bodies.circle( 24, -15, 6 ),
      LM = Bodies.circle( 0, -28, 6 ),
      LB = Bodies.circle( -24, -15, 6 ),
      RT = Bodies.circle( 24, 15, 6 ),
      RM = Bodies.circle( 0, 28, 6 ),
      RB = Bodies.circle(-24, 15, 6);

      const compoundBody = matter.Body.create({
        parts: [ image_body, LT, LM, LB, RT, RM, RB ]
      });

      image.setExistingBody( compoundBody );

      particles.startFollow( image );

      const circle_ref: MatterJS.Body | any = scene.matter.add.circle(100, 100, 10);
      circle_ref.mass = 1;
      image.setMass(30);
      image.body.gravityScale.y = 0.01;
      // image.setIgnoreGravity(true);
      // scene.matter.add.joint(circle_ref, image, 150, 0.001)
      // scene.matter.add.joint(image, LT, 150, 0.001)

      // // particles.forEach( o => {
      // //   o.p.startFollow( image, o.x, o.y );
      // // })
    }
    // image.setFixedRotation();
    image.setAngle(270);
    image.setFrictionAir(0.05);
    // image.setMass(30);

    {
      // scene.input.keyboard.on('keydown', _ => {
      //   const { tweenTimeout } = this.events;
      //   if( tweenTimeout ) {
      //     // console.log('keydown clear!');
      //     clearTimeout(tweenTimeout);
      //   }
      // });
      scene.input.keyboard.on('keyup', _ => {
        const { tween, tweenTimeout } = this.events;
        // if( tween ){
        //   tween.pause();
        // }
        if( tweenTimeout ) {
          // console.log('keyup clear!');
          // clearTimeout(tweenTimeout);
          return;
        }
        this.events.tweenTimeout = setTimeout(_ => {
          // console.log('keyup!');
          // console.log(image.angle);
          this.events.tween = scene.tweens.addCounter({
            from: image.angle,
            to: -90,
            duration: image.angle > 50 ? 5000 : 2000,
            // repeat: -1,
            ease: 'Expo.easeInOut',
            // delay: 1000,
            onUpdate: (tw: any) => {
              image.setAngle(tw.getValue());
            }
          });
          this.events.tweenTimeout = null;
        }, 1000);
      });
    }

    const { lerp } = this.values;
    scene.cameras.main.startFollow( image, false, lerp, lerp );

    // this.matter.world.setBounds(0, 0, 800, 600);

    this.cursors = scene.input.keyboard.createCursorKeys();

    // test buttons on screen
    // const gameWidth = +scene.sys.game.config.width;
    // const gameHeight = +scene.sys.game.config.height;
    // [
    //   { w: 100, h: gameHeight - 40, key: 'DOWN', color: 0xff0000 },
    //   { w: 50, h: gameHeight - 80, key: 'LEFT', color: 0x00ff00 },
    //   { w: 150, h: gameHeight - 80, key: 'RIGHT', color: 0x0000ff },
    //   { w: 100, h: gameHeight - 120, key: 'UP', color: 0xffff00 },
    //   { w: gameWidth - 70, h: gameHeight - 80, key: 'ACTION', color: 0xffffff, radius: 50 },
    // ].forEach(o => {
    //   // const text = scene.add.text( o.w, o.h, o.text, {
    //   //   fontSize: '22px'
    //   // }).setOrigin(.5, .5)
    //   this.onScreenButtons[o.key] = scene.add.circle(o.w, o.h, o.radius || 25, o.color)
    //     .setInteractive({ useHandCursor: true })
    //     .on('pointerdown', function() { console.log(o.key); })
    //     .setScrollFactor(0);
    // })
    // text.body.gameObject.startFollow( image )
  }

  update( scene: Phaser.Scene | any ) { //, time, delta ){
    let { originalForce, lock, launch, force_acc } = this.values;

    const pointer = getPointer( scene.game );

    if( !pointer.isDown && this.events.launchEvent && typeof this.events.launchEvent === 'function' ){
      this.events.launchEvent();
    }

    if( this.cursors.space.isDown || pointer.isDown ){
      const step_force = 0.06, max_force = 2;
      
      if(!this.sounds['impulse-load'].isPlaying){
        this.sounds['impulse-load'].play();
      }
      
      if(scene.currentSong.isPlaying && scene.currentSong.volume === 1){
        scene.currentSong.volume = 0.5;
      }

      if( force_acc <= max_force )
        this.setValue( 'force_acc', force_acc + step_force <= max_force ? force_acc + step_force : 2 );

      if( !this.events.launchEvent ){
        this.setValue( 'force', originalForce * 0.2 );

        if( pointer.isDown ){
          this.events.launchEvent = () => {
            this.sounds['impulse-load'].stop();
            
            if(scene.currentSong.isPlaying){
              scene.currentSong.volume = 1;
            }

            console.log( 'pointer up!' );

            if( pointer.getDistance() > 100 ) {
              const fa = this.getValue( 'force_acc' );
              this.addThrustByPointer( fa, pointer.getAngle());
    
              this.setValue( 'force_acc', 0.01 );
              
              this.sounds['impulse-release'].play();
    
              this.setValue( 'lock', true );
              setTimeout( _ => {
                this.setValue( 'lock', false );
                this.events.launchEvent = null;
                this.setValue( 'force', originalForce );
              }, 1000 );
            } else {
              this.setValue( 'force', originalForce );
            }

            this.events.launchEvent = null;
          };
        } else 
        if( this.cursors.space.isDown ) {
          this.events.launchEvent = this.keys.space.once('up', e => {
            this.sounds['impulse-load'].stop();
  
            if(scene.currentSong.isPlaying){
              scene.currentSong.volume = 1;
            }
  
            console.log( 'space up!' );
            // if force_acc is pressed for a while, it launchs
            const fa = this.getValue( 'force_acc' );
            const pressed = fa >= 1 ? this.addThrustByCursors( fa ) : 0;
  
            this.setValue( 'force_acc', 0.01 );
            
            if( !pressed ){
              this.events.launchEvent = null;
              this.setValue( 'force', originalForce );
              return;
            }
  
            this.sounds['impulse-release'].play();
  
            this.setValue( 'lock', true );
            setTimeout( _ => {
              this.setValue( 'lock', false );
              this.events.launchEvent = null;
              this.setValue( 'force', originalForce );
            }, 1000 );
          });
        }
      }
    }
    if ( !lock ){
      // if( launch ){
      //   this.ship.custom.lock = true;
      // }
      this.addThrustByCursors();
    }
  }
  setValues( obj ){
    this.values = Object.assign( this.values, obj );
  }
  setValue( key, value ){
    this.values[key] = value;
  }
  getValue( key ) {
    return this.values[key];
  }

  addThrustByPointer( force: number = 0, angle: number ) {
    const image = this.image;
    force = force || this.getValue('force');
    image.applyForceFrom(
      new Phaser.Math.Vector2(image.x, image.y),
      (new Phaser.Math.Vector2( force, 0).setAngle(angle))
    );
  }

  addThrustByCursors( force: number = 0 ) {
    const image = this.image;
    force = force || this.getValue('force');
    const { left, up, right, down } = this.cursors;

    const thrustTo = direction => {
      let obj;
      switch (direction) {
        case 'left': obj = { x: -force, y: 0 }; break;
        case 'right': obj = { x: force, y: 0 }; break;
        case 'up': obj = { x: 0, y: -force }; break;
        case 'down': obj = { x: 0, y: force }; break;
      }
      image.applyForceFrom(
        new Phaser.Math.Vector2(image.x, image.y),
        obj,
			);
    };

    if ( left.isDown )
      thrustTo('left'); // image.thrustLeft( force );
    else if ( right.isDown )
      thrustTo('right'); // image.thrustRight( force );
    
    if ( up.isDown )
      thrustTo('up'); // image.thrust( force );
    else if ( down.isDown )
      thrustTo('down'); // image.thrustBack( force );

    return left.isDown || up.isDown || right.isDown || down.isDown;
  }

  createParticles( scene ) {
    const getSpeed = () => {
      return this.image ? this.image.body.speed : 0;
    }
    const particles = scene.add.particles('space');

    const emitter = particles.createEmitter({
      frame: 'blue',
      speed: {
          onEmit: function (particle, key, t, value)
          {
              return getSpeed();
          }
      },
      lifespan: {
          onEmit: function (particle, key, t, value)
          {
              return Phaser.Math.Percent(getSpeed(), 0, 300) * 20000;
          }
      },
      alpha: {
          onEmit: function (particle, key, t, value)
          {
              return Phaser.Math.Percent(getSpeed(), 0, 300) * 1000;
          }
      },
      scale: { start: 0.6, end: 0 },
      blendMode: 'ADD'
    });

    return emitter;
  }
}