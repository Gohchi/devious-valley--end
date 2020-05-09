import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })

    this.platformSpeed = 150;
  }

  preload () {
    this.load.image('base-button', 'assets/base-button.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }
  
  create () {
    this.debugInfo = this.add.text(700, 100, "");
    this.debugInfo2 = this.add.text(700, 120, "");
    this.cursors = this.input.keyboard.createCursorKeys();

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'base-button').setScale(6, 2).refreshBody();

    this.movingPlatform = this.physics.add.image(400, 400, 'base-button')
      .setScale(2, 1)
      .setImmovable(true)
      .setVelocityX(this.platformSpeed);

    this.movingPlatform.body.allowGravity = false;

    this.createPlayer();
    this.createAnimations();
  }
  
  update() {
    this.checkPlayerMovement();
    this.checkPlatformMovement();
  }

  //#region privates
  createPlayer(){
    let player = this.player = this.physics.add.sprite(600, 400, 'dude');
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, this.platforms, this.stopAngleChange);
    this.physics.add.collider(player, this.movingPlatform, this.stopAngleChange);
    player.roundCounter = this.roundCounter(player);

    // this.physics.add.overlap(player, this.platforms, this.collectStar, null, this);
  }
  stopAngleChange( player, platforms )
  {
    player.setAngularVelocity(0);
    player.angle = 0;
    // star.disableBody(true, true);
  }
  createAnimations(){
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 15,
      repeat: -1
    });
  }
  checkPlayerMovement(){
    let cursors = this.cursors, player = this.player;
    //#region buttons
    if (cursors.left.isDown)
    {
      player.setVelocityX(-160);

      player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
      player.setVelocityX(160);

      player.anims.play('right', true);
    }
    else
    {
      player.setVelocityX(0);

      player.anims.play('turn');
    }

    if (cursors.space.isDown && player.body.touching.down)
    {
      player.setVelocityY(-330);
      player.setAngularVelocity(600);
      // player.angle = 1;
    }
    //#endregion
    this.player.roundCounter.checkRound();
    this.debugInfo2.setText(player.roundCounter.getTimes())
    if(player.roundCounter.getTimes() > 0){
      this.stopAngleChange( player );
      player.roundCounter.reset();
    }
    // if(player.rotation < 0 && player.rotation > -.1){
    //   this.stopAngleChange(player);
    // }
    this.debugInfo.setText(player.angle);
  }
  roundCounter(player) {
    let times = 0, checked = true;
    return {
      checkRound: () => {
        if(!checked && player.angle > 0){
          times++;
          checked = true;
        }
        if(player.angle < 0){
          checked = false;
        }
      },
      reset: () => {
        times = 0;
      },
      getTimes: () => times
    };
  }
  checkPlatformMovement(){
    if (this.movingPlatform.x >= 500)
    {
        this.movingPlatform.setVelocityX(-this.platformSpeed);
    }
    else if (this.movingPlatform.x <= 300)
    {
        this.movingPlatform.setVelocityX(this.platformSpeed);
    }
  }
  //#endregion
}
