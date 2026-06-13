import { Scene } from 'phaser';
import { Tank } from '../objects/Tank';

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
		Tank.preload(this)
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
		if (!terrainTileset || !cornerTileset) {
            throw new Error("Tileset not found");
        }
		const layer = map.createLayer(
			"background",
			[terrainTileset, cornerTileset]
		)
		this.tank = new Tank(this)
    }
}
