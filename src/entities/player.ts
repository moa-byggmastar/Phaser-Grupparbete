import { Input, Physics, Scene } from 'phaser'
import Bullet from "../entities/bullet"
import Enemy from './enemy'

export default class Player extends Physics.Arcade.Sprite {
    public health = 4
    public dead = false
    private speed = 125
    private dodgeStrength = 850
    private dodgeRate = 750
    private lastDodged = 0
    private knockbackStrength = 750
    private effectX = 0
    private effectY = 0
    private fireRate = 500
    private lastFired = 0
    private invincibleTime = 50
    private lastDamage = 0
    
    private keys!: { [key: string]: Input.Keyboard.Key }; // Stores keys
    declare body: Phaser.Physics.Arcade.Body

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setCollideWorldBounds(true)
        this.body!.setAllowGravity(false)
        this.setBodySize(20, 42)

        // Setup keys
        this.keys = scene.input.keyboard!.addKeys({
            up: Input.Keyboard.KeyCodes.W,
            down: Input.Keyboard.KeyCodes.S,
            left: Input.Keyboard.KeyCodes.A,
            right: Input.Keyboard.KeyCodes.D,
            upArrow: Input.Keyboard.KeyCodes.UP,
            downArrow: Input.Keyboard.KeyCodes.DOWN,
            leftArrow: Input.Keyboard.KeyCodes.LEFT,
            rightArrow: Input.Keyboard.KeyCodes.RIGHT,
            dodge: Input.Keyboard.KeyCodes.SHIFT
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

        
        const length = Math.hypot(velocityX, velocityY);

        const time = this.scene.time.now;
        if (time > this.lastDodged + this.dodgeRate && this.keys.dodge.isDown && (velocityX !== 0 || velocityY !== 0)) {
            this.effectX += (velocityX / length) * this.dodgeStrength
            this.effectY += (velocityY / length) * this.dodgeStrength

            this.lastDodged = time
        }

        // Makes it so the player doesn't go faster when moving diagonally
        if (length > 0) {
            velocityX = (velocityX / length) * this.speed;
            velocityY = (velocityY / length) * this.speed;
        }

        this.setVelocity(velocityX+this.effectX, velocityY+this.effectY);
    }

    private handleShoot() {
        const time = this.scene.time.now;

        if (time > this.lastFired + this.fireRate && this.scene.input.activePointer.isDown) {
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
            this.effectX += dX * this.knockbackStrength
            this.effectY += dY * this.knockbackStrength

            this.health -= amount
            this.lastDamage = time;
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