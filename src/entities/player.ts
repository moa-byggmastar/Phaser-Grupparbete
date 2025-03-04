import { Physics, Scene } from 'phaser'

export default class Player extends Physics.Arcade.Sprite {
    private speed = 200
    private fireRate = 500
    private lastFired = 0
    private health = 100

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setCollideWorldBounds(true)
        this.setDepth(1)

        this.scene.input.keyboard?.on('keydown-SPACE', this.shoot, this)
    }

    public update(time: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.handleMovement(cursors)
        this.lastFired = time
    }

    private handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (!cursors) return

        let velocityX = 0
        let velocityY = 0

        if (cursors.left.isDown) {
            velocityX = -this.speed
        } else if (cursors.right.isDown) {
            velocityX = this.speed
        }

        if (cursors.up.isDown) {
            velocityY = -this.speed
        } else if (cursors.down.isDown) {
            velocityY = this.speed
        }

        this.setVelocity(velocityX, velocityY)
    }

    private shoot() {
        const time = this.scene.time.now
        if (time > this.lastFired + this.fireRate) {
            this.lastFired = time
            console.log('Shoot!') // Add bullets later
        }
    }

    public takeDamage(amount: number) {
        this.health -= amount
        console.log(`Player health: ${this.health}`) // Add health bar
        if (this.health <= 0) {
            this.kill()
        }
    }

    private kill() {
        console.log('Player has died!') // Add game over screen?
        this.setActive(false)
        this.setVisible(false)
    }

}