import { Input, Physics, Scene } from 'phaser'

export default class Player extends Physics.Arcade.Sprite {
    private speed = 125
    private sprintSpeed = 200
    private fireRate = 500
    private lastFired = 0
    private health = 100
    private keys!: { [key: string]: Input.Keyboard.Key }; // Stores WASD keys
    declare body: Phaser.Physics.Arcade.Body

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setCollideWorldBounds(true)
        this.setDepth(1)

        this.scene.input.keyboard?.on('keydown-SPACE', this.shoot, this)

        this.body!.setAllowGravity(false)

        // Setup WASD keys
        this.keys = scene.input.keyboard!.addKeys({
            up: Input.Keyboard.KeyCodes.W,
            down: Input.Keyboard.KeyCodes.S,
            left: Input.Keyboard.KeyCodes.A,
            right: Input.Keyboard.KeyCodes.D,
            upArrow: Input.Keyboard.KeyCodes.UP,
            downArrow: Input.Keyboard.KeyCodes.DOWN,
            leftArrow: Input.Keyboard.KeyCodes.LEFT,
            rightArrow: Input.Keyboard.KeyCodes.RIGHT,
            sprint: Input.Keyboard.KeyCodes.SHIFT
        }) as { [key: string]: Input.Keyboard.Key };
    }

    public update(time: number) {
        this.handleMovement()
        this.lastFired = time
    }

    private handleMovement() {
    
        let velocityX = 0;
        let velocityY = 0;
    
        // Determines which speed variable to use (for walking or sprinting)
        const isSprinting = this.keys.sprint.isDown;
        const currentSpeed = isSprinting ? this.sprintSpeed : this.speed;
    
        if (this.keys.left.isDown || this.keys.leftArrow.isDown) {
            velocityX = -1;
            this.flipX = true;
        } else if (this.keys.right.isDown || this.keys.rightArrow.isDown) {
            velocityX = 1;
            this.flipX = false;
        }

        if (this.keys.up.isDown || this.keys.upArrow.isDown) {
            velocityY = -1;
        } else if (this.keys.down.isDown || this.keys.downArrow.isDown) {
            velocityY = 1;
        }
    
        // Normalize diagonal movement (Makes it so the player doesn't go faster when moving diagonally)
        const length = Math.hypot(velocityX, velocityY);
        if (length > 0) {
            velocityX = (velocityX / length) * currentSpeed;
            velocityY = (velocityY / length) * currentSpeed;
        }
    
        this.setVelocity(velocityX, velocityY);
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