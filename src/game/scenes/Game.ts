import { Scene } from 'phaser';
import { Tank, Color } from '../objects/Tank';
import { Projectile } from '../objects/Projectile';
import { ExplosionManager } from '../managers/ExplosionManager';
import { Barrel } from '../objects/Barrel';
import { Oil } from '../objects/Oil';

export class Game extends Scene {
	tanks: Tank[] = []
	oils: Oil[] = []
	barrelGroup: Phaser.Physics.Arcade.Group

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
		Oil.preload(this)
	}

	create() {
		const map = this.make.tilemap({ key: 'level' })

		if (!map)
			throw new Error('Map could not be initialized')

		this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

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

		const tankGroup = this.physics.add.group()
		this.tanks.push(new Tank(this, 25, 25, Color.blue, 0))
		this.tanks.push(new Tank(this, 925, 925, Color.red, 1))

		blocksLayer.setCollisionByExclusion([-1]);
		blocksHardLayer.setCollisionByExclusion([-1]);

		this.tanks.forEach(tank => {
			tank.depth = 30
			tankGroup.add(tank)
			tank.setCollideWorldBounds(true)
			this.physics.add.collider(tank, blocksLayer)
			this.physics.add.collider(tank, blocksHardLayer)
		})
		this.physics.add.collider(tankGroup, tankGroup)
		const randomPos = Barrel.generateRandomPositions(map.width, map.height, 10, blocksLayer, blocksHardLayer)
		const barrels = Barrel.generateRandomBarrels(this, randomPos, map)

		this.barrelGroup = this.physics.add.group()

		for (let i = 0; i < barrels.length; i++) {
			this.barrelGroup.add(barrels[i])
		}

		this.barrelGroup.children.forEach((child) => {
			(child as Barrel).setImmovable(true)
			this.tanks.forEach(tank => this.physics.add.collider(child, tank))
		})

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
			this.physics.add.collider(
				projectile,
				this.barrelGroup,
				(p, b) => {
					const proj = p as Projectile
					const barrel = b as Barrel
					const barrelX = barrel.x
					const barrelY = barrel.y

					this.events.emit("explosion", {
						x: barrelX,
						y: barrelY,
						type: "explosion"
					})
					proj.destroy()
					barrel.destroy()
					this.time.delayedCall(400, () => {
						this.oils.push(new Oil(this, barrelX, barrelY))
					})
				})
		})
	}

	update() {
		let onOil = false

		for (let i = 0; i < this.oils.length; i++) {
			this.tanks.forEach(tank => {
				this.physics.world.overlap(tank, this.oils[i], () => onOil = true )
			})
		}
		this.tanks.forEach(tank => tank.slowDown(onOil))
	}
}
