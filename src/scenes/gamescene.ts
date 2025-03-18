import Phaser from "phaser";
import Text from "../graphics/text";
import Player from "../entities/player";
import Enemy from "../entities/enemy";
import Bullet from "../entities/bullet";
import WaveManager from "../systems/wavemanager";

export default class GameScene extends Phaser.Scene {
    player!: Player;
    enemies: Enemy[] = [];
    bullets: Bullet[] = [];
    waveManager!: WaveManager;
    waveText!: Text;
    waveTimer!: Text;
    timeRemaining: number = 0;

    constructor() {
        super('gamescene');
    };

    preload() {
        this.load.image('player', 'src/assets/pyre-maid.png')
        this.load.image('enemy1', 'src/assets/weakenemy.png')
    };

    create() {
        this.player = new Player(this, Number(this.game.config.width) / 2, Number(this.game.config.height) / 2)

        this.waveManager = new WaveManager(this)
        this.waveManager.startWaveManager()

        this.waveText = new Text(this, Number(this.game.config.width) / 2, 50, 'Wave: ' + this.waveManager.waveNumber, 30)

        this.timeRemaining = this.waveManager.waveInterval / 1000;
        this.waveTimer = new Text(this, Number(this.game.config.width) / 2, 75, 'Next Wave in:' + this.timeRemaining.toFixed(1) + 's', 15)

        // @ts-ignore
        this.physics.add.collider(this.bullets, this.enemies, this.handleBulletEnemyCollision, null, this)

        // @ts-ignore
        this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)

    };

    update(time: number, delta: number): void {
        time; delta;

        this.enemies.forEach((enemy) => enemy.update());
        this.player.update()

        this.waveText.text = 'Wave: ' + this.waveManager.waveNumber

        if (this.timeRemaining >= 0) {
            this.timeRemaining -= delta / 1000;
        } else if (this.timeRemaining <= 0 /* && this.enemies.length === 0 */) {
            this.timeRemaining = this.waveManager.waveInterval / 1000;
        }

        this.waveTimer.text = 'Next Wave in: ' + this.timeRemaining.toFixed(1) + 's';
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