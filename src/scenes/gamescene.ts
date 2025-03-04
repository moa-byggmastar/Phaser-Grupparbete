import Phaser from "phaser";
import Text from "../graphics/text";
import Player from "../entities/player";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('gamescene');
    };

    preload() {
        this.load.image('player', 'src/assets/pyre-maid.png')
    };

    create() {

         // Temporary, remove if needed
        new Text(this, Number(this.game.config.width) / 2, 100, 'Game scene', 60)
        let player = new Player(this, Number(this.game.config.width) / 2, Number(this.game.config.width) / 2)
        player.setTexture('player')
        // ---
        
    };

    update(time: number, delta: number): void {

    };

};