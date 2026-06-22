import { Physics, Input, Scenes, Scene } from 'phaser';
import { Math as PhaserMath } from 'phaser';
import { Projectile } from './Projectile';

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

// type Pair<T, U> = [T, U]
type Pair = [x: number, y: number];


export class Tank extends Physics.Arcade.Sprite {
	private controls: TankControls
    private keyboard: any
	private mainScene: Scene
	private projectile: Projectile | null = null
	private sparkShot?: Phaser.GameObjects.Sprite

	static preload(scene: Scene) {
		scene.load.image('tank', 'sprites/tank_blue.png')
		scene.load.image('spark', 'sprites/shotOrange.png')
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
		this.mainScene = scene

		this.controls = this.keyboard?.addKeys({
			left: Input.Keyboard.KeyCodes.LEFT,
			right: Input.Keyboard.KeyCodes.RIGHT,
			up: Input.Keyboard.KeyCodes.UP,
			down: Input.Keyboard.KeyCodes.DOWN,
			A: Input.Keyboard.KeyCodes.A,
			D: Input.Keyboard.KeyCodes.D,
			W: Input.Keyboard.KeyCodes.W,
			S: Input.Keyboard.KeyCodes.S,
			J: Input.Keyboard.KeyCodes.J
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
		if (this.controls.J.isDown) {
			this.fire()
		}


		if (this.sparkShot) {
			const tips = this.getTipTank(36)
			this.sparkShot.setPosition(
				tips[0],
				tips[1]
			);
		}
	}

	getTipTank(distance: number) : Pair {
		const tipX = this.x - Math.cos(PhaserMath.DegToRad(this.angle - 90)) * distance
		const tipY = this.y - Math.sin(PhaserMath.DegToRad(this.angle - 90)) * distance

		const tips: Pair = [tipX, tipY]

		return (tips)
	}

	setSparkShot() {
		this.sparkShot?.destroy()
		const tips = this.getTipTank(36)
		this.sparkShot = this.scene.add.sprite(tips[0], tips[1], 'spark')
		this.sparkShot.angle = this.angle
		this.sparkShot.depth = 31
	}

	fire() {
		if (this.projectile)
			return;

		const tip = this.getTipTank(25) 

		this.setSparkShot()

		this.scene.time.delayedCall(100, () => {
			this.sparkShot?.destroy()
			this.sparkShot = undefined
		})

		this.projectile = new Projectile(this.mainScene, tip[0], tip[1], this.angle)
		this.projectile.depth = 5
		
		this.mainScene.events.emit('projectileFired', this.projectile)

		this.projectile.once('destroy', () => {
			this.projectile = null
		})
	}
}
