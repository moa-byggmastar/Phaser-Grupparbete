import Phaser from 'phaser'

export default class Bullet extends Phaser.GameObjects.Rectangle {
    private speed = 400;
    public damage = 1;
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number, offset: number = 20) {
        super(scene, x, y, 10, 10, 0xffa545);

        // Offsets bullet position from player
        const angle = Phaser.Math.Angle.Between(scene.input.mousePointer.x, scene.input.mousePointer.y, x, y);
        this.x += Math.cos(angle) * -offset;
        this.y += Math.sin(angle) * -offset;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
    }

    fire(targetX: number, targetY: number) {
        // Angle to target
        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        this.body.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);

        this.scene.time.delayedCall(6000, () => {
            this.destroy();
        });
    }
}