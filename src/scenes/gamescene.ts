import Phaser from "phaser";
import Text from "../graphics/text";
import Player from "../entities/player";
import Enemy from "../entities/enemy";
import Bullet from "../entities/bullet";

export default class GameScene extends Phaser.Scene {
    player!: Player;
    enemies: Enemy[] = [];
    bullets: Bullet[] = [];
    constructor() {
        super('gamescene');
    };

    preload() {
        this.load.image('player', 'src/assets/pyre-maid.png')
        this.load.image('enemy1', 'src/assets/weakenemy.png')
    };

    create() {

        this.player = new Player(this, Number(this.game.config.width) / 2, Number(this.game.config.width) / 2)

        this.enemies.push(new Enemy(this, 800, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 700, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 600, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 500, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 300, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 200, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 100, 450, 'enemy1'))
        this.enemies.push(new Enemy(this, 0, 450, 'enemy1'))

        // @ts-ignore
        this.physics.add.collider(this.bullets, this.enemies, this.handleBulletEnemyCollision, null, this);

        // @ts-ignore
        this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)
        // ---

    };

    update(time: number, delta: number): void {
        time; delta;
        this.enemies.forEach((enemy) => enemy.update());
        this.player.update()
    };

    private handleBulletEnemyCollision(bullet: Bullet, enemy: Enemy) {
        bullet.destroy();
        enemy.takeDamage(bullet.damage);
    }

    private handlePlayerEnemyCollision(player: Player, enemy: Enemy) {
        player; enemy;
        player.kill()
        this.scene.pause()

        const gameOverText = new Text(this, Number(this.game.config.width) / 2, Number(this.game.config.height) / 2, 'Game Over', 60)
        gameOverText.setOrigin(0.5)
    }
};