import { Physics, Scene } from 'phaser'

export default class Enemy extends Physics.Arcade.Sprite {
    private speed = 25
    private health = 100
    private targetX: number
    private targetY: number
    declare body: Phaser.Physics.Arcade.Body

    constructor(scene: Scene, x: number, y: number, sprite: string) {
        super(scene, x, y, sprite)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        // Change to fire's position when possible
        this.targetX = scene.scale.width / 2
        this.targetY = scene.scale.height / 2

        this.body!.setAllowGravity(false)
    }

    public update() {
        // Calculate angle towards the target
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetX, this.targetY)
        
        // Set velocity in that direction
        this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed)

        // Flips sprite to match direction
        this.flipX = Math.cos(angle) < 0;
    }

    public takeDamage(amount: number) {
        this.health -= amount
        if (this.health <= 0) {
            this.kill()
        }
    }

    private kill() {
        console.log('Enemy killed')

        // @ts-ignore
        const index = this.scene.enemies.indexOf(this);
        if (index > -1) {
            // @ts-ignore
            this.scene.enemies.splice(index, 1);  // Remove the enemy from the enemies list
        }

        this.destroy()
    }
}