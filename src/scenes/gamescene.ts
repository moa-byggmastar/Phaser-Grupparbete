import Phaser from "phaser";
import Text from "../graphics/text";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('gamescene');
    };

    preload() {

    };

    create() {
        new Text(this, Number(this.game.config.width) / 2, 100, 'Game scene', 60) // Temporary, remove if needed
    };

    update(time: number, delta: number): void {

    };

};