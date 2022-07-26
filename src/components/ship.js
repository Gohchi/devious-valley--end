import Phaser from 'phaser'

export default class Ship {
  constructor( scene ){
    this.cursors = null;
    this.image = null;
    this.values = {
      lerp: 0.05,
      originalForce: 0.01,
      force: 0.01,
      force_acc: 0.01,
      lock: false
    };
    this.events = {};
  }
  static prepare( scene ){
    scene.load.atlas('space', 'assets/tests/space/space.png', 'assets/tests/space/space.json');
    scene.load.json('space-shapes', 'assets/tests/space/space-shapes.json');
  }
  create( scene ){
    this.keys = {
      space: scene.input.keyboard.addKey('space')
    };

    const particles = this.createParticles( scene, image );

    let shapes = scene.cache.json.get('space-shapes');
    const image = scene.matter.add.image(400, 300, 'space', 'moon6', { shape: shapes['moon'] });
    //     this.matter.add.image(pointer.x, pointer.y, 'sheet', fruit, { shape: shapes[fruit] });
    this.image = image;

    image.setFixedRotation();
    image.setAngle(270);
    image.setFrictionAir(0.05);
    image.setMass(30);

    particles.startFollow( image );

    const { lerp } = this.values;
    scene.cameras.main.startFollow( image, false, lerp, lerp );

    // this.matter.world.setBounds(0, 0, 800, 600);

    this.cursors = scene.input.keyboard.createCursorKeys();
  }
  update( scene, time, delta ){
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
  
  addThrustByCursors( force ) {
    const image = this.image;
    force = force || this.getValue('force');
    const { left, up, right, down } = this.cursors;

    if ( left.isDown )
      image.thrustLeft( force );
    else if ( right.isDown )
      image.thrustRight( force );
    
    if ( up.isDown )
      image.thrust( force );
    else if ( down.isDown )
      image.thrustBack( force );

    return left.isDown || up.isDown || right.isDown || down.isDown;
  }
  createParticles( scene, image ) {
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
      scale: { start: 1.0, end: 0 },
      blendMode: 'ADD'
    });

    return emitter;
  }
}