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
    life1!: Phaser.GameObjects.Image;
    life2!: Phaser.GameObjects.Image;
    life3!: Phaser.GameObjects.Image;
    life4!: Phaser.GameObjects.Image;
    livesArray!: Phaser.GameObjects.Image[];

    constructor() {
        super('gamescene');
    };

    preload() {
        this.load.image('player', 'src/assets/pyre-maid.png')
        this.load.image('bullet', 'src/assets/bullet.png')
        this.load.image('enemy1', 'src/assets/weakenemy.png')
        this.load.image('life_full', 'src/assets/life_full.png')
        this.load.image('life_empty', 'src/assets/life_empty.png')
    };

    create() {
        this.player = new Player(this, Number(this.game.config.width) / 2, Number(this.game.config.height) / 2)
        this.life1 = this.add.image(50, 50, 'life_full')
        this.life2 = this.add.image(100, 50, 'life_full')
        this.life3 = this.add.image(150, 50, 'life_full')
        this.life4 = this.add.image(200, 50, 'life_full')
        this.livesArray = [this.life1, this.life2, this.life3, this.life4]

        this.waveManager = new WaveManager(this)
        this.waveManager.startWaveManager()

        this.waveText = new Text(this, Number(this.game.config.width) / 2, 50, 'Wave: ' + this.waveManager.waveNumber, 30)

        this.timeRemaining = this.waveManager.waveInterval / 1000;
        this.waveTimer = new Text(this, Number(this.game.config.width) / 2, 75, 'First Wave in:' + this.timeRemaining.toFixed(1) + 's', 15)

        // @ts-ignore
        this.physics.add.overlap(this.bullets, this.enemies, this.handleBulletEnemyCollision, null, this)

        // @ts-ignore
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)

        this.physics.add.collider(this.enemies, this.enemies)

    };

    //@ts-ignore
    update(time: number, delta: number): void {

        this.waveTextUpdate(delta)
        this.enemies.forEach((enemy) => enemy.update());
        this.player.update(delta)
        this.livesUpdate()
        this.waveManager.update()
    };

    private handleBulletEnemyCollision(bullet: Bullet, enemy: Enemy) {
        enemy.takeDamage(bullet.damage);
        bullet.destroy();
    }

    private handlePlayerEnemyCollision(player: Player, enemy: Enemy) {
        player.takeDamage(1, enemy)
        if (player.dead) {
            player.kill()

            new Text(this, Number(this.game.config.width) / 2, Number(this.game.config.height) / 2, 'Game Over', 60)
            
            this.scene.pause()
        }
    }

    private waveTextUpdate(delta: number) {
        this.waveText.text = 'Wave: ' + this.waveManager.waveNumber

        if (this.timeRemaining >= 0 && !this.waveManager.isWaveActive) {
            this.timeRemaining -= delta / 1000;
        } else if (!this.waveManager.isWaveActive) {
            this.timeRemaining = this.waveManager.waveInterval / 1000;
        }

        // Ensures timer doesn't get stuck on 0.1s
        if (this.waveManager.isWaveActive) {
            this.timeRemaining = 0
        }

        if (this.waveManager.waveNumber === 0) {
            this.waveTimer.text = 'First Wave in: ' + this.timeRemaining.toFixed(1) + 's';
        } else {
            this.waveTimer.text = 'Next Wave in: ' + this.timeRemaining.toFixed(1) + 's';
        }
    }

    private livesUpdate() {
        for (let i = 0; i < this.livesArray.length; i++) {
            if (i >= this.player.health) {
                this.livesArray[i].setTexture('life_empty');
            } else {
                this.livesArray[i].setTexture('life_full');
            }
        }
    }
};