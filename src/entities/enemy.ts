import { Physics, Scene } from 'phaser'

export default class Enemy extends Physics.Arcade.Sprite {
    private speed = 170
    private health = 2
    private targetX!: number
    private targetY!: number
    declare body: Phaser.Physics.Arcade.Body

    constructor(scene: Scene, x: number, y: number, sprite: string) {
        super(scene, x, y, sprite)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body!.setAllowGravity(false)
        this.setBodySize(27, 30)
    }

    public update() {
        //@ts-ignore
        this.targetX = this.scene.player.x
        //@ts-ignore
        this.targetY = this.scene.player.y

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
        // @ts-ignore
        const index = this.scene.enemies.indexOf(this);
        if (index > -1) {
            // @ts-ignore
            this.scene.enemies.splice(index, 1);
        }

        // Starts countdown for next wave if there are no enemies left in the wave
        // @ts-ignore
        this.scene.waveManager.enemiesLeftInWave--
        // @ts-ignore
        if (this.scene.enemies.length === 0 && this.scene.waveManager.enemiesLeftInWave === 0) {
            // @ts-ignore
            this.scene.waveManager.isWaveActive = false
        }

        this.destroy()
    }
}