import { Physics, Scene } from 'phaser'

export default class Fire extends Physics.Arcade.Sprite {
    declare body: Phaser.Physics.Arcade.Body
    
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setCollideWorldBounds(true)

        this.body!.setAllowGravity(false)
    }

    update() {
    }
}