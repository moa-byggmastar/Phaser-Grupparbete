import Phaser, { Physics } from 'phaser'

export default class Bullet extends Physics.Arcade.Sprite {
    private speed = 400;
    public damage = 1;
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number, offset: number = 20) {
        super(scene, x, y, 'bullet');

        // Offsets bullet position from player
        const angle = Phaser.Math.Angle.Between(scene.input.mousePointer.x, scene.input.mousePointer.y, x, y);
        this.x += Math.cos(angle) * -offset;
        this.y += Math.sin(angle) * -offset;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.setBodySize(15, 15, true)
    }

    fire(targetX: number, targetY: number) {
        // Angle to target
        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        this.body.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);

        const angle2 = Phaser.Math.RadToDeg(angle)
        this.setRotation(Phaser.Math.DegToRad(angle2 + 180))

        this.scene.time.delayedCall(6000, () => {
            this.destroy();
        });
    }
}