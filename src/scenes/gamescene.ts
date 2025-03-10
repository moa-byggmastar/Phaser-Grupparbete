import Phaser from "phaser";
import Text from "../graphics/text";
import Player from "../entities/player";
import Enemy from "../entities/enemy";

export default class GameScene extends Phaser.Scene {
    player!: Player;
    enemy!: Enemy;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    constructor() {
        super('gamescene');
    };

    preload() {
        this.load.image('player', 'src/assets/pyre-maid.png')
        this.load.image('enemy1', 'src/assets/weakenemy.png')
    };

    create() {

        // Temporary, remove if needed
        new Text(this, Number(this.game.config.width) / 2, 100, 'Game scene', 60)
        this.player = new Player(this, Number(this.game.config.width) / 2, Number(this.game.config.width) / 2)
        this.enemy = new Enemy(this, 800, 450)
        this.cursors = this.input.keyboard!.createCursorKeys()
        // ---

    };

    update(time: number, delta: number): void {
        this.enemy.update()
        this.player.update(time, this.cursors!)
    };

};