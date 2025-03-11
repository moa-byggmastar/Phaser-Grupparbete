import Phaser from "phaser";
import Text from "../graphics/text";
import Player from "../entities/player";
import Enemy from "../entities/enemy";

export default class GameScene extends Phaser.Scene {
    player!: Player;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    enemies: any;
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

        this.enemies = []
        this.enemies.push(new Enemy(this, 800, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 700, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 600, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 500, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 300, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 200, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 100, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 0, 450, 'enemy1'))

        this.cursors = this.input.keyboard!.createCursorKeys()

        this.physics.add.collider(this.player, this.enemies, this.handleCollision, null, this)
        // ---

    };

    update(time: number, delta: number): void {
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update()
        }
        this.player.update(time, this.cursors!)
    };

    private handleCollision(player: Player, enemy: Enemy) {
        this.scene.pause()
        alert('Game Over!')
    }
};