import Phaser from 'phaser'

export default class Player {
  constructor( scene ){
    this.scene = scene;
    this.playerOnGround = false;
    this.addKeyEvents( scene );
    this.createPlayerAnimations( scene );
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.group = scene.matter.world.nextGroup();
    this.sprite = scene.add.sprite(800, 400, 'dude', 4);
    this.shapes = scene.cache.json.get('dude-shapes');
    this.gameObject = scene.matter.add
      .gameObject(this.sprite, { shape: this.shapes.dude4, restitution: .9 })
      .setFrictionAir(0.001)
      .setBounce(0.5)
      .setCollisionGroup(this.group);
    scene.matter.add.mouseSpring({
      length: 1, 
      stiffness: 0.9, 
      collisionFilter: { group: this.group }
    });
  }
  static prepare( scene ){
    scene.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    scene.load.json('dude-shapes', 'assets/dude-pe.json');
  }
  update(){
    if(this.playerOnGround)
      this.onDash = false;
    if(this.onDash) return;
    const cursors = this.cursors, player = this.gameObject;
    if (cursors.left.isDown) {
      player.setVelocityX(-5);
      player.body.allowGravity = false;
      player.anims.play('left', true);
      this.recoverAnimation();
    // } else if (cursors.up.isDown && !this.gravityChanged) {
    //   this.gravityChanged = true;
    //   player.setMass(10);//setDensity
    } else if (cursors.right.isDown) {
      player.setVelocityX(5);

      player.anims.play('right', true);
      this.recoverAnimation();
    } else {
      player.setVelocityX(0);

      player.anims.play('turn');
    }
  }
  recoverAnimation(){
    if (!this.onanim){
      this.onanim = true;
      this.scene.tweens.add({
        targets: this.sprite,
        angle: {
          ease: 'Power0',
          from: this.sprite.angle,
          start: this.sprite.angle,
          to: 0,
        },
        duration: 200
      })
      .setCallback('onComplete', () => this.onanim = false, []);
    }
  }
  setVelocityX(v){
    this.onDash = true, this.playerOnGround = false;
    this.gameObject.setVelocityX(v);
    this.gameObject.setVelocityY(-5);
    // setTimeout(() => this.onDash = false, 1500);
  }
  addKeyEvents( scene ) {
    this.onDash = false;
    scene.input.keyboard.addKey('D')
      .on('down', e => {
        if(this.onDash) return;
        let cv = Math.round(this.gameObject.body.velocity.x), v = 15; 
        if(cv > 0){
          this.setVelocityX(v);
        } else if (cv < 0) { 
          this.setVelocityX(-v);
        }
      });
    //#endregion
    scene.input.keyboard.addKey('SPACE')
      .on('down', e => {
        if ( this.playerOnGround ) {
          // if(this.plyr.sprite.angle > -3 && this.plyr.sprite.angle < 3){
            clearTimeout(this.delayCall);
            this.gameObject.setVelocityY(-10);
            this.playerOnGround = false;
            // console.log('jump');
          // } else {
            if (!this.onanim){
              this.onanim = true;
              scene.tweens.add({
                targets: this.sprite,
                angle: {
                  ease: 'Power0',
                  from: this.sprite.angle,
                  start: this.sprite.angle,
                  to: 0,
                },
                duration: 100
              })
              .setCallback('onComplete', () => this.onanim = false, []);
            }
          // }
        }
      });
  }
  createPlayerAnimations( scene ){
    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 15,
      repeat: -1
    });

    scene.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 15,
      repeat: -1
    });
  }
}