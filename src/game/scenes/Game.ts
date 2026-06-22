import { Scene } from 'phaser';
import { Tank } from '../objects/Tank';
import { Projectile } from '../objects/Projectile';

export class Game extends Scene
{
	tank: Tank

    constructor ()
    {
        super('Game');
    }

    preload ()
    {
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
		Tank.preload(this)
		Projectile.preload(this)


		this.load.image('explosion_1', 'sprites/explosion1.png')
		this.load.image('explosion_2', 'sprites/explosion2.png')
		this.load.image('explosion_3', 'sprites/explosion3.png')
		this.load.image('explosion_4', 'sprites/explosion4.png')
		this.load.image('explosion_5', 'sprites/explosion5.png')



    }

    create ()
    {
		const map = this.make.tilemap({ key: 'level' })

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
		
		this.anims.create({
		key: 'explosion',
		frames: [
			{ key: 'explosion_1' },
			{ key: 'explosion_2' },
			{ key: 'explosion_3' },
			{ key: 'explosion_4' },
			{ key: 'explosion_5' },
		],
		frameRate: 10,
		repeat: 1
		});


		const sprite = this.add.sprite(400, 300, 'explosion_1');

		sprite.depth = 100;

		sprite.play("explosion")


		if (!terrainTileset || !cornerTileset || !blocksTileset) {
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
		backgroundLayer.depth = 0
		blocksLayer.depth = 10

		this.tank = new Tank(this)

		this.tank.depth = 30
		blocksLayer.setCollisionByExclusion([-1]);

		this.physics.add.collider(this.tank, blocksLayer);

		this.events.on('projectileFired', (projectile: Projectile) => {
			this.physics.add.collider(projectile, blocksLayer, () => {
				projectile.destroy()
			})
		})
    }

	update() {
	    
	}
}
