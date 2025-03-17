import { Input, Physics, Scene } from 'phaser'
import Bullet from "../entities/bullet"

export default class Player extends Physics.Arcade.Sprite {
    private speed = 125
    private sprintSpeed = 200
    private fireRate = 500
    private lastFired = 0
    public health = 100
    private keys!: { [key: string]: Input.Keyboard.Key }; // Stores WASD keys
    declare body: Phaser.Physics.Arcade.Body

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setCollideWorldBounds(true)
        this.setDepth(1)
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
            sprint: Input.Keyboard.KeyCodes.SHIFT,
            shoot: Input.Keyboard.KeyCodes.SPACE
        }) as { [key: string]: Input.Keyboard.Key };
    }

    public update() {
        this.handleMovement()
        this.handleShoot()
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
    
        // Makes it so the player doesn't go faster when moving diagonally
        const length = Math.hypot(velocityX, velocityY);
        if (length > 0) {
            velocityX = (velocityX / length) * currentSpeed;
            velocityY = (velocityY / length) * currentSpeed;
        }
    
        this.setVelocity(velocityX, velocityY);
    }

    private handleShoot() {
        const time = this.scene.time.now;
    
        if (time > this.lastFired + this.fireRate && this.keys.shoot.isDown) {
            const bullet = new Bullet(this.scene, this.x, this.y);
            this.scene.add.existing(bullet);
                
            // @ts-ignore
            this.scene.bullets.push(bullet);
            
            const targetX = this.scene.input.mousePointer.x;
            const targetY = this.scene.input.mousePointer.y;
    
            bullet.fire(targetX, targetY);
    
            this.lastFired = time;
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