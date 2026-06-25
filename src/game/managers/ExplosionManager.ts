import { Scene } from "phaser"

export class ExplosionManager {

	private scene: Scene
	
	static preload(scene: Scene) {
		scene.load.image('explosion_1', 'sprites/explosion1.png')
		scene.load.image('explosion_2', 'sprites/explosion2.png')
		scene.load.image('explosion_3', 'sprites/explosion3.png')
		scene.load.image('explosion_4', 'sprites/explosion4.png')
		scene.load.image('explosion_5', 'sprites/explosion5.png')
	}

	constructor(scene: Scene) {
		this.scene = scene
		this.createAnims()
		this.registerEvent()
	}

	private registerEvent(): void {
		this.scene.events.on(
			"explosion",
			this.handleExplosion,
			this
		)
	}
	
	createAnims() {
		this.scene.anims.create({
			key: 'explosion',
			frames: [
				{ key: 'explosion_1' },
				{ key: 'explosion_2' },
				{ key: 'explosion_3' },
				{ key: 'explosion_4' },
				{ key: 'explosion_5' },
			],
			frameRate: 10,
			repeat: 0
		});
	} 

	private handleExplosion(data: {
		x: number,
		y: number,
		type: string
		}): void {
			const sprite = this.scene.add.sprite(data.x, data.y, 'explosion_1');
			sprite.depth = 100;
			sprite.play("explosion")
			sprite.once('animationcomplete-explosion', () => {
				sprite.destroy()
		})
	}
} 
