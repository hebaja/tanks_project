import { Physics, Scene, Utils } from "phaser";

const BARREL_TEXTURES = [
	"barrel_black",
	"barrel_green",
	"barrel_red",
	"barrel_rust"
];

export class Barrel extends Physics.Arcade.Sprite {


	static preload(scene: Scene) {
		scene.load.image('barrel_black', 'barrels/barrel_black.png')
		scene.load.image('barrel_green', 'barrels/barrel_green.png')
		scene.load.image('barrel_red', 'barrels/barrel_red.png')
		scene.load.image('barrel_rust', 'barrels/barrel_rust.png')

		scene.load.image('oil', 'barrels/oil_spill.png')
	}

	constructor(scene: Scene, x: number, y: number) {
		super(scene, x, y, Utils.Array.GetRandom(BARREL_TEXTURES))

		scene.add.existing(this)
		scene.physics.add.existing(this)

		this.setScale(0.8)
	}


}
