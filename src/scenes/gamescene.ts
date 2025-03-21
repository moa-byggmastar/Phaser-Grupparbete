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
    waveRemaining!: Text;
    timeRemaining: number = 0;
    life1!: Phaser.GameObjects.Image;
    life2!: Phaser.GameObjects.Image;
    life3!: Phaser.GameObjects.Image;
    life4!: Phaser.GameObjects.Image;
    livesArray!: Phaser.GameObjects.Image[];
    tutText1!: Text;
    tutText2!: Text;
    tutText3!: Text;
    tutText4!: Text;
    beginCheck: boolean = false;

    constructor() {
        super('gamescene');
    };

    preload() {
        this.load.image('player', 'src/assets/pyre-maid.png')
        this.load.image('bullet', 'src/assets/bullet.png')
        this.load.image('enemy1', 'src/assets/weakenemy.png')
        this.load.image('life_full', 'src/assets/life_full.png')
        this.load.image('life_empty', 'src/assets/life_empty.png')
        this.load.image('pointer', 'src/assets/pointer.png')
    };

    create() {
        this.input.setDefaultCursor('none');
        const customCursor = this.add.image(0, 0, 'pointer').setDepth(2).setScale(2);

        // Make the custom cursor follow the mouse
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            customCursor.setPosition(pointer.x, pointer.y);
        });

        this.player = new Player(this, Number(this.game.config.width) / 2, Number(this.game.config.height) / 2)
        this.life1 = this.add.image(55, 50, 'life_full').setDepth(1)
        this.life2 = this.add.image(105, 50, 'life_full').setDepth(1)
        this.life3 = this.add.image(155, 50, 'life_full').setDepth(1)
        this.life4 = this.add.image(205, 50, 'life_full').setDepth(1)
        this.livesArray = [this.life1, this.life2, this.life3, this.life4]

        this.waveManager = new WaveManager(this)

        this.waveText = new Text(this, Number(this.game.config.width) / 2, 30, 'Wave: ' + this.waveManager.waveNumber, 30).setDepth(1)

        this.timeRemaining = this.waveManager.waveInterval / 1000;
        this.waveTimer = new Text(this, Number(this.game.config.width) / 2, 55, 'First Wave in: ' + this.timeRemaining.toFixed(1) + 's', 15).setDepth(1)
        this.waveRemaining = new Text(this, Number(this.game.config.width) / 2, 75, 'Enemies remaining: ' + this.waveManager.enemiesLeftInWave, 15).setDepth(1)

        // @ts-ignore
        this.physics.add.overlap(this.bullets, this.enemies, this.handleBulletEnemyCollision, null, this)

        // @ts-ignore
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)

        this.physics.add.collider(this.enemies, this.enemies)

        this.input.keyboard?.on('keydown', () => {
            this.tutText1.destroy()
            this.tutText2.destroy()
            this.tutText3.destroy()
            this.tutText4.destroy()

            if (!this.beginCheck) {
                this.waveManager.startWaveManager()
            }
            this.beginCheck = true
        });
        this.tutText1 = new Text(this, Number(this.game.config.width) / 2, 150, 'WASD or Arrow keys to move', 25).setDepth(1)
        this.tutText2 = new Text(this, Number(this.game.config.width) / 2, 200, 'Shift to dodge', 25).setDepth(1)
        this.tutText3 = new Text(this, Number(this.game.config.width) / 2, 250, 'Click to shoot', 25).setDepth(1)
        this.tutText4 = new Text(this, Number(this.game.config.width) / 2, 310, 'Press any key to begin', 35).setDepth(1)

    };

    //@ts-ignore
    update(time: number, delta: number): void {
        if (!this.beginCheck) {
            return
        }

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
        this.waveRemaining.text = 'Enemies remaining: ' + this.waveManager.enemiesLeftInWave

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