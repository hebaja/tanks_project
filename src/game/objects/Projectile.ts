import { Physics, Scene } from "phaser";

export class Projectile extends Physics.Arcade.Sprite {

	static preload(scene: Scene) {
		scene.load.image('projectile', 'sprites/bulletBlue1_outline.png')
	}
	
	constructor(scene: Scene, x: number, y: number, angle: number) {
		super(scene, x, y, 'projectile')

		scene.add.existing(this)
		scene.physics.add.existing(this)

		this.setCollideWorldBounds(true, 0, 0, true)
		this.scene.physics.world.on('worldbounds', (body: Physics.Arcade.Body) => {
			if (body.gameObject === this)
				this.destroy()
		})

		this.angle = angle - 180;
		
		const velocity = this.scene.physics.velocityFromAngle(this.angle - 90, 400)
		this.setVelocity(velocity.x, velocity.y)
		
	}

	destroy(fromScene?: boolean): void {
		super.destroy(fromScene) 
	}

	update() {
	    
	}

}
