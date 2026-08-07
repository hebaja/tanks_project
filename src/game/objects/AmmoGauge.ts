import { Display, GameObjects, Scene, Scenes } from "phaser";

export class AmmoGauge extends GameObjects.Container {

	gaugeWidth: number = 90
	mainScene: Scene
	fill: Phaser.GameObjects.NineSlice
	bg: Phaser.GameObjects.Rectangle
	alarmOn: boolean = false

	static preload(scene: Scene) {
		scene.load.image(
			'panel',
			'bars/panel.png'
		)
		scene.load.image(
			'fill',
			'bars/blue_fill.png'
		)
	}

	constructor(scene: Scene, x: number, y: number, HORIZONTAL_MARGIN: number) {
		super(scene, x, y)

		this.mainScene = scene
		
		this.bg = scene.add.rectangle(HORIZONTAL_MARGIN, y, 90, 24, 0x000000).setDepth(0)


		this.fill = scene.add.nineslice(HORIZONTAL_MARGIN - 45, y, 'fill', undefined, this.gaugeWidth, 24, 3, 3, 4, 8).setDepth(50) 
		const frame = scene.add.nineslice(HORIZONTAL_MARGIN, y, 'panel', undefined, 100, 30, 6, 6, 6, 6).setDepth(100)
		this.fill.setOrigin(0, 0.5)
		this.add(this.bg)
		this.add(this.fill)
		this.add(frame)
		this.setDepth(100)

		scene.add.existing(this)
		scene.events.on(Scenes.Events.UPDATE, this.update, this)
	}

	consumeGauge() {
		this.gaugeWidth -= 18
		console.log(this.gaugeWidth)
		this.mainScene.tweens.add({
			targets: this.fill,
			width: this.gaugeWidth,
			duration: 200,
			ease: 'Sine.easeOut'
		})
	}

	update() {
		if (this.gaugeWidth <= 18 && !this.alarmOn) {
			const from = Display.Color.ValueToColor(0x000000)
			const to = Display.Color.ValueToColor(0xFF0000)
			this.alarmOn = true
			this.mainScene.tweens.addCounter({
				from: 0,
				to: 1,
				duration: 500,
				yoyo: true,
				repeat: -1,
				onUpdate: (counter) => {
					const c = Display.Color.Interpolate.ColorWithColor(from, to, 1, counter.getValue()!)
					this.bg.setFillStyle(c.color)
				}
			})
		}
	}
}
