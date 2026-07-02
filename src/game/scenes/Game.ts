import { Scene } from 'phaser';
import { Tank } from '../objects/Tank';
import { Projectile } from '../objects/Projectile';
import { ExplosionManager } from '../managers/ExplosionManager';
import { Barrel } from '../objects/Barrel';

export class Game extends Scene {
	tank: Tank

	constructor() {
		super('Game');
	}

	preload() {
		this.load.setPath('assets');
		this.load.tilemapTiledJSON('level', 'map/tanks_map.json')
		this.load.image(
			'terrain_tileset',
			'map/terrainTiles_default.png'
		);
		this.load.image(
			'corner',
			'map/corner.png'
		);
		this.load.image(
			'stone',
			'map/stone.png'
		);
		this.load.image(
			'rock',
			'map/rock.png'
		);

		Tank.preload(this)
		Projectile.preload(this)
		ExplosionManager.preload(this)
		Barrel.preload(this)

	}

	create() {
		const map = this.make.tilemap({ key: 'level' })
		const em = new ExplosionManager(this)


		const terrainTileset = map.addTilesetImage(
			'terrain_tileset',
			'terrain_tileset'
		);
		const cornerTileset = map.addTilesetImage(
			'corner',
			'corner'
		);
		const blocksTileset = map.addTilesetImage(
			'stone',
			'stone'
		);
		const blocksHardTileset = map.addTilesetImage(
			'rock',
			'rock'
		);

		if (!terrainTileset || !cornerTileset || !blocksTileset || !blocksHardTileset) {
			throw new Error("Tileset not found");
		}
		const backgroundLayer = map.createLayer(
			"background",
			[terrainTileset, cornerTileset]
		);
		const blocksLayer = map.createLayer(
			"blocks",
			[blocksTileset]
		)
		const blocksHardLayer = map.createLayer(
			"blocks_hard",
			[blocksHardTileset]
		)

		backgroundLayer.depth = 0
		blocksLayer.depth = 10
		blocksHardLayer.depth = 10

		this.tank = new Tank(this)

		this.tank.depth = 30
		blocksLayer.setCollisionByExclusion([-1]);
		blocksHardLayer.setCollisionByExclusion([-1]);

		this.physics.add.collider(this.tank, blocksLayer);
		this.physics.add.collider(this.tank, blocksHardLayer);


		const barrel = new Barrel(this, 25, 25)

		this.events.on('projectileFired', (projectile: Projectile) => {
			this.physics.add.collider(
				projectile,
				blocksLayer,
				(p, b) => {
					const blockTile = b as Phaser.Tilemaps.Tile
					const proj = p as Projectile

					this.events.emit("explosion", {
						x: blockTile.getCenterX(),
						y: blockTile.getCenterY(),
						type: "explosion"
					})
					blocksLayer.removeTileAt(blockTile.x, blockTile.y)
					proj.destroy()
				})
			this.physics.add.collider(
				projectile,
				blocksHardLayer,
				(p) => {
					const proj = p as Projectile

					this.events.emit("explosion_smoke", {
						x: proj.x,
						y: proj.y,
						type: "explosion_smoke"
					})
					proj.destroy()
				})
		})
	}

	update() {

	}
}
