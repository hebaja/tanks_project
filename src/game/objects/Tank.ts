import { Physics, Input, Scenes, Scene } from 'phaser';

type TankControls = {
  left: Input.Keyboard.Key;
  right: Input.Keyboard.Key;
  up: Input.Keyboard.Key;
  down: Input.Keyboard.Key;
  A: Input.Keyboard.Key;
  D: Input.Keyboard.Key;
  W: Input.Keyboard.Key;
  S: Input.Keyboard.Key;
  J: Input.Keyboard.Key;
}

export class Tank extends Physics.Arcade.Sprite {
	private controls: TankControls
    private keyboard: any

	static preload(scene: Scene) {
		scene.load.image('tank', 'sprites/tank_blue.png')
	}

	constructor(scene: Scene) {
		super(scene, 25, 25, 'tank')
		this.keyboard = scene.input.keyboard
		if (!this.keyboard) {
			throw new Error('Keyboard plugin not available')
		}
		scene.physics.add.existing(this)
		scene.add.existing(this)
		scene.events.on(Scenes.Events.UPDATE, this.update, this);
		this.setCollideWorldBounds(true)

		this.controls = this.keyboard?.addKeys({
			left: Input.Keyboard.KeyCodes.LEFT,
			right: Input.Keyboard.KeyCodes.RIGHT,
			up: Input.Keyboard.KeyCodes.UP,
			down: Input.Keyboard.KeyCodes.DOWN,
			A: Input.Keyboard.KeyCodes.A,
			D: Input.Keyboard.KeyCodes.D,
			W: Input.Keyboard.KeyCodes.W,
			S: Input.Keyboard.KeyCodes.S
		})
		this.angle = 0
	}

	destroy(fromScene?: boolean): void {
		this.scene?.events.off(Scenes.Events.UPDATE, this.update, this)
	    super.destroy(fromScene)
	}

	update() {
		this.setVelocity(0, 0)
		if (this.controls.left.isDown || this.controls.A.isDown) {
			this.angle -= 2
		}
		if (this.controls.right.isDown || this.controls.D.isDown) {
			this.angle += 2
		}
		if (this.controls.down.isDown || this.controls.S.isDown) {
			const velocity = this.scene.physics.velocityFromAngle(this.angle - 90, 150)
			this.setVelocity(velocity.x, velocity.y)
		}
		if (this.controls.up.isDown || this.controls.W.isDown) {
			const velocity = this.scene.physics.velocityFromAngle(this.angle - 90 + 180, 150)
	        this.setVelocity(velocity.x, velocity.y)
		}
	}

	fire() {

	}
}
