import { Physics, Scene } from "phaser";

export class Projectile extends Physics.Arcade.Sprite {

	static preload(scene: Scene) {
		scene.load.image('projectile', 'sprites/bulletBlue1_outline.png')
	}
	
	constructor(scene: Scene) {
		super(scene, 100, 25, 'projectile')

		// scene.add.existing(this)
	}

	destroy(fromScene?: boolean): void {
		super.destroy(fromScene) 
	}

}
