import Phaser from 'phaser'

import spacePng from '../assets/tests/space/space.png';
import spaceJson from '../assets/tests/space/space.json';
import spaceShapeJson from '../assets/tests/space/space-shapes.json';

export class Ship {
  private cursors: any;
  private image: any;
  private values: any;
  private events: any;
  private keys: any;

  constructor(){
    this.cursors = null;
    this.image = null;
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
  }
  create( scene: Phaser.Scene ){
    this.keys = {
      space: scene.input.keyboard.addKey('space')
    };

    // CAMERA
    {
      const camera = scene.cameras.main;
      this.keys.space.on('down', e => {
        camera.zoomTo(2, 4000, 'Power2', true);
        camera.shake(1000000, 0.0006, true); // infinite shake
      });
      this.keys.space.on('up', e => {
        camera.shake(1, 0, true);
        camera.zoomTo(1, 2000, 'Power2', true);
      });
    }
    

    // const particles = [{x: -15, y:-24 }].map( o => Object.assign( o, { p: this.createParticles( scene )}) );
    const particles = this.createParticles( scene );

    // let shapes = scene.cache.json.get('space-shapes');
    const image: Phaser.Physics.Matter.Image | any = scene.matter.add.image(1600, 300, 'space', 'moon6');
    // const image = scene.matter.add.image(400, 300, 'space', 'moon6', { shape: shapes['moon'] });
    this.image = image;
    {
      var Bodies = Phaser.Physics.Matter.Matter.Bodies;
      
      const image_body = Bodies.circle( 0, 0, 28 ),
      // // const scale = 1.5;
      // // image.setScale(scale, scale);

      LT = Bodies.circle( 24, -15, 6 ),
      LM = Bodies.circle( 0, -28, 6 ),
      LB = Bodies.circle( -24, -15, 6 ),
      RT = Bodies.circle( 24, 15, 6 ),
      RM = Bodies.circle( 0, 28, 6 ),
      RB = Bodies.circle(-24, 15, 6);

      const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
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
  }
  update(){ //scene, time, delta ){
    let { originalForce, lock, launch, force_acc } = this.values;

    if( this.cursors.space.isDown ){
      const step_force = 0.06, max_force = 2;

      if( force_acc <= max_force )
        this.setValue( 'force_acc', force_acc + step_force <= max_force ? force_acc + step_force : 2 );

      if( !this.events.launchEvent ){
        this.setValue( 'force', originalForce * 0.2 );
        this.events.launchEvent = this.keys.space.once('up', e => {
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

          this.setValue( 'lock', true );
          setTimeout( _ => {
            this.setValue( 'lock', false );
            this.events.launchEvent = null;
            this.setValue( 'force', originalForce );
          }, 1000 );
        });
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
  
  addThrustByCursors( force: Number = 0 ) {
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
        { x: image.x, y: image.y },
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