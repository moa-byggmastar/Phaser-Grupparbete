import { Input, Physics, Scene } from 'phaser'
import Bullet from "../entities/bullet"
import Enemy from './enemy'

export default class Player extends Physics.Arcade.Sprite {
    public health = 4
    public dead = false
    private speed = 125
    private sprintSpeed = 200
    private effectX = 0
    private effectY = 0
    private knockbackStrength = 750
    private fireRate = 500
    private lastFired = 0
    private invincibleTime = 50
    private lastDamage = 0
    
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

    public update(delta: number) {
        this.handleMovement()
        this.handleShoot()
        const damping = (1-delta/1000*10)
        this.effectX *= damping
        this.effectY *= damping
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

        this.setVelocity(velocityX+this.effectX, velocityY+this.effectY);
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

    public takeDamage(amount: number, enemy: Enemy) {
        const time = this.scene.time.now;

        if (time > this.lastDamage + this.invincibleTime) {
            let dX = this.x - enemy.x
            let dY = this.y - enemy.y
            const hypot = Math.sqrt(dX*dX+dY*dY)
            dX/=hypot
            dY/=hypot
            this.effectX = dX * this.knockbackStrength
            this.effectY = dY * this.knockbackStrength

            this.health -= amount
            this.lastDamage = time;

            console.log(`Player health: ${this.health}`)
        }
        
        if (this.health <= 0) {
            this.dead = true
        }
    }

    public kill() {
        this.setActive(false);
        this.body.setVelocity(0, 0);
        this.body.setEnable(false);
}

}