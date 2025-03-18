import Phaser, { Scene } from 'phaser'
import Enemy from '../entities/enemy';
import GameScene from '../scenes/gamescene';

export default class WaveManager {
    private scene: GameScene;

    private spawnInterval: number = 2000;

    public waveInterval: number = 20000
    public waveNumber: number = 0;

    constructor(scene: Scene) {
        //@ts-ignore
        this.scene = scene;
    }

    public startWaveManager() {
        this.scene.time.addEvent({
            delay: this.waveInterval,
            callback: this.startWave,
            callbackScope: this,
            loop: true
        });
    }

    private startWave() {
        this.scene.time.addEvent({
            delay: Math.max(500, this.spawnInterval * Math.pow(0.95, this.waveNumber)), // Decreases spawn interval by 5% each wave, down to a minimum of 500ms
            callback: this.spawnEnemy,
            callbackScope: this,
            repeat: 3 + this.waveNumber - 1
        });
        this.waveNumber++
    }

    private spawnEnemy() {
        const spawnPoints = [
            { x: -10, y: Phaser.Math.Between(20, 430) },  // Left side
            { x: Phaser.Math.Between(0, 800), y: 460 },   // Bottom
            { x: 810, y: Phaser.Math.Between(20, 430) }   // Right side
        ];
    
        const spawnPoint = Phaser.Utils.Array.GetRandom(spawnPoints); // Pick a random spawn location
    
        const enemy = new Enemy(this.scene, spawnPoint.x, spawnPoint.y, 'enemy1');
        this.scene.enemies.push(enemy);
    }
}