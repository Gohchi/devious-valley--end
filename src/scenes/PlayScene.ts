class TestScene extends Phaser.Scene {
	player: Phaser.GameObjects.Sprite;
	cursors: any;

	constructor() {
    super({
			key: 'TestScene'
		});
	}
	
	preload() {
		this.load.image('player', './assets/phaser.png');
	}

	create() {

		this.player = this.add.sprite(100, 100, 'player');
	}

	update(time: number, delta:number) {
	}
}

export default TestScene;