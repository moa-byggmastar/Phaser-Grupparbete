import Phaser, { Scene } from 'phaser'
import Enemy from '../entities/enemy';
import GameScene from '../scenes/gamescene';

export default class WaveManager {
    private scene: GameScene;

    private spawnInterval: number = 3000
    public waveInterval: number = 5000
    public waveNumber: number = 29
    public isWaveActive: boolean = false
    public enemyAmount: number = 0
    public enemiesLeftInWave: number = 0
    private waveManagerEvent!: Phaser.Time.TimerEvent

    constructor(scene: Scene) {
        //@ts-ignore
        this.scene = scene;
    }

    public update() {
        if (!this.isWaveActive) {
            this.waveManagerEvent.paused = false
        } else {
            this.waveManagerEvent.paused = true
        }
    }

    public startWaveManager() {
        this.waveManagerEvent = this.scene.time.addEvent({
            delay: this.waveInterval,
            callback: this.startWave,
            callbackScope: this,
            loop: true,
            paused: false
        })
    }

    private startWave() {
        this.isWaveActive = true
        this.waveNumber++
        this.enemyAmount = 3 + this.waveNumber - 1
        this.enemiesLeftInWave = 3 + this.waveNumber - 1
        this.scene.time.addEvent({
            delay: Math.max(500, this.spawnInterval * Math.pow(0.941, this.waveNumber)), // Decreases spawn interval each wave, down to a minimum of 500ms at wave 30
            callback: this.spawnEnemy,
            callbackScope: this,
            repeat: this.enemyAmount - 1
        });
    }

    private spawnEnemy() {
        const spawnPoints = [
            { x: -10, y: Phaser.Math.Between(20, 430) },  // Left side
            { x: Phaser.Math.Between(0, 800), y: 460 },   // Bottom
            { x: 810, y: Phaser.Math.Between(20, 430) }   // Right side
        ]
    
        const spawnPoint = Phaser.Utils.Array.GetRandom(spawnPoints); // Pick a random spawn location
    
        const enemy = new Enemy(this.scene, spawnPoint.x, spawnPoint.y, 'enemy1');
        this.scene.enemies.push(enemy)
    }
}